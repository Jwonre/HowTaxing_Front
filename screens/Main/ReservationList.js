// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { LogBox } from 'react-native';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import CloseIcon from '../../assets/icons/close_button.svg';
import Config from 'react-native-config'
import { HOUSE_TYPE } from '../../constants/colors';

const Container = styled.View`
  flex: 1.0;
  
  background-color: #fff;
`;
const ContainerRoot = styled.View`
  flex: 1;
  width: 100%;
  background-color: #f5f7fa;
`;


const IntroSection2 = styled.View`
  width: 100%;
  padding: 20px 20px 0px 20px;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #F0F0F2;
`;

const InfoContentSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 0px 20px;
`;


const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  justify-content: space-between;
`;
const HoustInfo2Section = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  justify-content: space-between;
`;

const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 24px;
  margin-bottom: 5px;

`;

const HoustInfoText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  line-height: 20px;
  color: #000;
`;
const HoustInfoText2 = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Bold;
  line-height: 20px;
  color: #000;
`;

const HoustInfoConsultingBadge = styled.TouchableOpacity.attrs(_props => ({
  activeOpacity: 0.9,
}))`
  width: auto;
  height: 22px;
  padding: 0 10px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const HoustInfoBadge = styled.TouchableOpacity.attrs(_props => ({
  activeOpacity: 0.9,
}))`
  width: auto;
  margin-right: auto;
  height: 22px;
  padding: 0 10px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const HoustInfoBadgeText = styled.Text`
  font-size: 9px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;


const Title = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 19.2px;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;


const SubTitle2 = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 14px;
  margin-bottom: 10px;
  text-align: left;
`;

const InfoConsultingContainer = styled.View`
  flex: 1; /* 나머지 공간 차지 */
  justify-content: center;
`;
const InfoContainer = styled.View`
  flex: 1; /* 나머지 공간 차지 */
  justify-content: center;
`;

const RightContainer = styled.View`
  justify-content: center;
  align-items: flex-end; /* 오른쪽 정렬 */
`;
const FakeReservationData = [
  {
    consultingReservationId: 3272,
    consultantName: '이민정 세무사',
    reservationDate: '2024-05-07',
    reservationStartTime: '13:28',
    price: '9,900 원',
    consultingType: '취득세',
    consultingStatus: 'FINISH',
  },
  {
    consultingReservationId: 3273,
    consultantName: '이민정 세무사',
    reservationDate: '2024-05-08',
    reservationStartTime: '13:28',
    price: '9,900 원',
    consultingType: '취득세',
    consultingStatus: 'FINISH',
  },
];
// const ProfileAvatar2 = styled.Image`
//   width: 50px; /* 이미지 크기 */
//   height: 50px;
//   border-radius: 25px; /* 동그랗게 */
//   margin-right: 15px; /* 이미지 오른쪽 여백 */
// `;
const ProfileAvatar2 = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 40px;
  height: 40px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: left;
  margin-right: 12px;
`;
const ReservationList = () => {
  LogBox.ignoreLogs(['to contain units']);
  const _scrollViewRef = useRef(null);
  const scrollViewRef = useRef(null);
  const actionSheetRef = useRef(null);
  const scrollHandlers = useScrollHandlers('FlatList-1', actionSheetRef);
  const [isLastPage, setIsLastPage] = useState(false);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const currentUser = useSelector(state => state.currentUser.value);
  const [reservationList, setReservationList] = useState([]);
  const [reservationPaymentList, setReservationPaymentList] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0); // 탭 상태 관리
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  //const Pdata = props?.Pdata;
  //console.log('ori fixHouseList', fixHouseList);

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 0) {
        getReservationlist();

      } else if (selectedTab === 1) {
        getReservationPaymentlist();

      }
    }, [selectedTab])
  );

  // useEffect(() => 
  //   {
  //     if(selectedTab ===0){
  //       useCallback(() => {
  //         getReservationlist();
  //       }, [])
  //     }else{
  //       useCallback(() => {
  //         getReservationPaymentlist();
  //       }, [])
  //     }
  //   }
  // ,[selectedTab]);
  const handleBackPress = () => {
    navigation.navigate('Information');
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])
  );

  const [isConnected, setIsConnected] = useState(true);

  const handleNetInfoChange = (state) => {
    return new Promise((resolve, _reject) => {
      if (!state.isConnected && isConnected) {
        setIsConnected(false);
        navigation.push('NetworkAlert', navigation);
        resolve(false);
      } else if (state.isConnected && !isConnected) {
        setIsConnected(true);
        if (!hasNavigatedBackRef.current) {
          setHasNavigatedBack(true);
        }
        resolve(true);
      } else {
        resolve(true);
      }
    });
  };



  const getReservationlist = async (page, consultingStatus) => {
    const url = `${Config.APP_API_URL}consulting/reservationList?page=${page}&consultingStatus=${consultingStatus}`;
    //const url = `https://devapp.how-taxing.com/consulting/availableSchedule?consultantId=${consultantId}&searchType="${searchType}"`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    /*
    const params = {
      consultantId: consultantId,
      searchType: searchType,
    }*/
    console.log('url', url);
    // console.log('params', params);
    console.log('headers', headers);
    await axios
      .get(url,
        { headers: headers }
      )
      .then(response => {
        console.log('response.data', response.data);
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상담 예약 목록을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          console.log('response.data', response.data.data);
          console.log('response.data.list', response.data.data.list);
          const result = response === undefined ? [] : response.data.data.list;
          if (result.length > 0) {
            console.log('result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setReservationList([...result]);

          }

        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '상담 예약 목록을 불러오는데 문제가 발생했어요.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
      });
  };

  const getReservationPaymentlist = async (page, consultingStatus) => {
    const url = `${Config.APP_API_URL}payment/list`;
    // const url = `${Config.APP_API_URL}payment/list?page=${page}&consultingStatus=${consultingStatus}`;

    //const url = `https://devapp.how-taxing.com/consulting/availableSchedule?consultantId=${consultantId}&searchType="${searchType}"`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    /*
    const params = {
      consultantId: consultantId,
      searchType: searchType,
    }*/
    console.log('url', url);
    // console.log('params', params);
    console.log('headers', headers);
    await axios
      .get(url,
        { headers: headers }
      )
      .then(response => {
        console.log('response.data', response.data);
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상담 예약 목록을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          console.log('response.data', response.data.data);
          console.log('response.data.list', response.data.data);
          const result = response === undefined ? [] : response.data.data;
          if (result.length > 0) {
            console.log('result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setReservationPaymentList([...result]);

          }

        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '상담 예약 목록을 불러오는데 문제가 발생했어요.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.navigate('Information');

          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '마이 페이지',
      headerShadowVisible: false,
      contentStyle: {
        borderTopColor: '#F7F7F7',
        borderTopWidth: 1,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
      },
    });
  }, []);



  return (
    <ContainerRoot style={{ width: width }}>
      <ProgressSection>
      </ProgressSection>
      {/* 탭 버튼 영역 */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 0 && styles.activeTab]}
          onPress={() => {
            setReservationList([]);
            setSelectedTab(0); // 탭 상태 변경
          }}
        >
          <Text style={selectedTab === 0 ? styles.activeTabText : styles.tabText}>상담 예약 내역</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 1 && styles.activeTab]}
          onPress={() => {
            setReservationPaymentList([]);
            setSelectedTab(1); // 탭 상태 변경
            // getReservationPaymentlist(); // 예약 목록 가져오기 함수 호출
          }}
        >
          <Text style={selectedTab === 1 ? styles.activeTabText : styles.tabText}>결제 내역</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        overScrollMode="never"
        ref={_scrollViewRef}
        pagingEnabled
        style={{
          width: width,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        scrollEventThrottle={16}>
        <Container style={{ width: width }}>



          <><IntroSection2 style={{ width: width, marginBottom: 20 }}>
            <Title>{selectedTab === 0 ? '나의 상담 예약' : '결제 내역'}</Title>
            <SubTitle2>{selectedTab === 0 ? '예약하신 상담이나 이미 상담을 진행한 내역을 볼 수 있어요.' : '결제를 완료하신 내역을 볼 수 있어요.'}</SubTitle2>
          </IntroSection2>


            {selectedTab === 0 && (
              <FlatList
                stickyHeaderIndices={[0]}
                data={reservationList}
                ref={scrollViewRef}
                style={{
                  zIndex: 1,
                }}
                {...scrollHandlers}
                scrollEnabled
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 10,
                }}
                overScrollMode="never"
                ListHeaderComponent={<View></View>}
                ListFooterComponent={/*
              reservationList.length > 0 &&
              !isLastPage && (
                <ListFooterButton
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      // 여기에 로직을 추가하세요
                    }
                  }}>
                  <ListFooterButtonText>더 보기</ListFooterButtonText>
                </ListFooterButton>
              )*/<View></View>}
                renderItem={({ item, index }) => {
                  const consultingTypeMap = {
                    '01': '취득세',
                    '02': '양도소득세',
                    '03': '상속세',
                    '04': '증여세'
                  };
                  const consultingStatusTypeMap = {
                    'WAITING': '상담대기',
                    'CANCEL': '상담취소',
                    'PROGRESS': '상담중',
                    'FINISH': '상담완료',
                    'PAYMENT_COMPLETED':'결제완료'
                  };
               
                  const consultingStatusTypeColorMap = {
                    'WAITING': '#A2C62B',
                    'CANCEL': '#FF2C65',
                    'PROGRESS': '#FF7401',
                    'FINISH': '#A82BC6',
                     'PAYMENT_COMPLETED':'#A2C62B'
                  };


                  const date = new Date(item.reservationDate);
                  const dayOfWeek = dayNames[date.getDay()];

                  const [hours, minutes] = item.reservationStartTime.split(':').map(Number); // 시간과 분 분리
                  const isPM = hours >= 12; // 12 이상이면 오후
                  const formattedHours = isPM ? hours - 12 || 12 : hours || 12; // 12시간제로 변환
                  const period = isPM ? '오후' : '오전'; // 오전/오후 결정

                  const [year, month, day] = item.reservationDate.split('-');
                  const dateInfo = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
                  const timeInfo = `(${period} ${formattedHours}시)`;
                  const consultingTypeList = item.consultingType.split(',');

                  const consultingTypes = item.consultingType.split(',').map(type => consultingTypeMap[type]).join(', ');
                  return (

                    <InfoContentSection overScrollMode="never" style={{ width: width, marginBottom: 10 }}>
                      <HoustInfo2Section
                        style={{
                          borderColor: '#E8EAED',
                        }}
                        key={index}>
                        <View style={{ flexDirection: 'column', marginBottom: 10, marginEnd: 10, }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginEnd: 10, }}>
                            {/* 프로필 이미지 */}
                            <ProfileAvatar2 source={require('../../assets/images/Minjungum_Lee_consulting.png')} />
                            {/* 상담 정보 */}
                            <InfoContainer>
                              <Text style={styles.contentCounsulting}>
                                {'#' + `${item.consultingReservationId}`}
                              </Text>
                              <Text style={styles.namePayment}>{item.consultantName}</Text>
                            </InfoContainer>
                          </View>

                          <HoustInfoText styles={{ marginBottom: 3 }}>
                            {dateInfo}
                          </HoustInfoText>
                          <View style={{ flexDirection: 'row' }}>
                            <HoustInfoText style={{ marginRight: 2 }}>
                              {item.reservationStartTime}
                            </HoustInfoText>
                            <HoustInfoText2>
                              {timeInfo}
                            </HoustInfoText2>
                          </View>
                        </View>


                        {/* 가격 및 버튼 */}
                        <RightContainer>
                          {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
                            {Array(consultingTypeList.length)
                              .fill(0) // 5개의 `View`를 생성
                              .map((_, index) => (
                                <HoustInfoConsultingBadge key={index} >
                                  <HoustInfoBadgeText>{consultingTypeList[index]}</HoustInfoBadgeText>
                                </HoustInfoConsultingBadge>
                              ))}


                          </View> */}

                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems : 'center' }}>
                            {consultingTypeList.map((type, index) => (
                              <View
                                key={index}
                                style={{
                                  backgroundColor: '#2F87FF',
                                  paddingHorizontal: 5,
                                  borderRadius: 50,
                                  height : 22,
                                  alignItems : 'center',
                                  justifyContent : 'center',
                                  marginLeft: index == 0 ? 0 : 10,
                                  marginBottom: 5, // 버튼 간격
                                }}
                              >
                                <HoustInfoBadgeText>{consultingTypeMap[type]}</HoustInfoBadgeText>

                              </View>
                            ))}
                          </View>
                          <View style={{
                            borderRadius: 50, height: 22, marginBottom: 10, justifyContent: 'center',
                            alignItems: 'center', paddingHorizontal: 5, backgroundColor: consultingStatusTypeColorMap[item.consultingStatus]
                          }}>
                            <HoustInfoBadgeText>{consultingStatusTypeMap[item.consultingStatus]}</HoustInfoBadgeText>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems : 'center' }}>

                           <HoustInfoBadge
                            onPress={async () => {
                              const state = await NetInfo.fetch();
                              const canProceed = await handleNetInfoChange(state);
                              if (canProceed) {

                                console.log("log_id ", item.consultingReservationId);
                                navigation.navigate('ReservationDetail', {
                                  consultingReservationId: item.consultingReservationId,
                                });
                              }
                            }}
                            style={{
                              height: 30,
                              width: 80,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#fff',
                              borderColor: '#E8EAED',
                              borderWidth: 1,
                              borderRadius: 5,
                            }}
                          >
                            <Text style={{ fontSize: 12, color: '#717274' }}>자세히 보기</Text>
                          </HoustInfoBadge>
                          </View>
                          
                        </RightContainer>
                      </HoustInfo2Section>
                    </InfoContentSection>

                    
                  );
                }}
                keyExtractor={(item) => item.consultingReservationId.toString()}
              />
            )}

            {selectedTab === 1 && (
              <FlatList
                stickyHeaderIndices={[0]}
                data={reservationPaymentList}
                ref={scrollViewRef}
                style={{
                  zIndex: 1,
                }}
                {...scrollHandlers}
                scrollEnabled
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 10,
                }}
                overScrollMode="never"
                ListHeaderComponent={<View></View>}
                ListFooterComponent={/*
              reservationList.length > 0 &&
              !isLastPage && (
                <ListFooterButton
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      // 여기에 로직을 추가하세요
                    }
                  }}>
                  <ListFooterButtonText>더 보기</ListFooterButtonText>
                </ListFooterButton>
              )*/<View></View>}
                renderItem={({ item, index }) => {

                  return (
                    <InfoContentSection overScrollMode="never" style={{ width: width, marginBottom: 10 }}>
                      <HoustInfo2Section
                        style={{
                          borderColor: '#E8EAED',
                        }}
                        key={index}>
                        {/* 프로필 이미지 */}
                        <ProfileAvatar2 source={item.thumbImageUrl ?? require('../../assets/images/Minjungum_Lee_consulting.png')} />

                        {/* 상담 정보 */}
                        <InfoContainer>
                          <Text style={styles.regDatePayment}>
                            {item.approvedDatetime}
                          </Text>
                          <Text style={styles.contentPayment}>
                            {'#' + `${item.paymentHistoryId}`}
                          </Text>
                          <Text style={styles.namePayment}>{item.consultantName}</Text>
                        </InfoContainer>

                        {/* 가격 및 버튼 */}
                        <RightContainer>
                          <Text style={styles.pricePayment}>
                            {Number(item?.paymentAmount ?? '0')?.toLocaleString() + ' 원'}
                          </Text>
                          <HoustInfoBadge
                            onPress={async () => {
                              const state = await NetInfo.fetch();
                              const canProceed = await handleNetInfoChange(state);
                              if (canProceed) {

                                navigation.navigate('PaymentDetail', {
                                  paymentHistoryId: item.paymentHistoryId,
                                });
                              }
                            }}
                            style={{
                              height: 30,
                              width: 80,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#fff',
                              borderColor: '#E8EAED',
                              borderWidth: 1,
                              borderRadius: 5,
                            }}
                          >
                            <Text style={{ fontSize: 12, color: '#717274' }}>자세히 보기</Text>
                          </HoustInfoBadge>
                        </RightContainer>
                      </HoustInfo2Section>
                    </InfoContentSection>


                  );
                }}
                keyExtractor={(item) => item.paymentHistoryId.toString()}
              />
            )}
          </>
        </Container>
      </ScrollView >
    </ContainerRoot>


  )
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  headerText: { fontSize: 18, fontWeight: 'bold' },

  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E8EAED', color: '#fff', backgroundColor: '#fff' },
  tab: {
    width: 120, // 각 버튼의 고정된 너비
    alignItems: 'center', // 텍스트 가운데 정렬
    justifyContent: 'center',
    paddingVertical: 15,
  },
  activeTab: { borderBottomWidth: 2, borderColor: '#000' },
  tabText: { color: '#888' },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  listContainer: { padding: 10 },
  card: { padding: 15, borderRadius: 10, backgroundColor: '#f9f9f9', marginBottom: 10 },
  title: { fontWeight: 'bold', marginBottom: 5 },
  status: { marginTop: 5, color: '#007AFF' },
  price: { marginTop: 5, fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E8EAED',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 50, // 이미지 너비
    height: 50, // 이미지 높이
    borderRadius: 25, // 동그랗게 만들기
    marginRight: 15, // 오른쪽 여백
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F87FF',
    marginBottom: 10,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },

  infoContainer: {
    flex: 1, // 나머지 공간 차지
    justifyContent: 'center',
  },
  reservationDate: {
    fontSize: 14,
    color: '#555',
  },
  consultingId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  consultantName: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  contentCounsulting: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 13,
    color: '#1b1c1f',
    marginBottom: 3
  },
  regDatePayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 10,
    color: '#a3a5a8',
    marginBottom: 3
  },
  contentPayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 13,
    color: '#1b1c1f',
    marginBottom: 3
  },
  namePayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 10,
    color: '#717274',
  },
  pricePayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 13,
    color: '#2f87ff',
    marginBottom: 6
  },
});
export default ReservationList;
