// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import { SheetManager, useScrollHandlers } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'
import TaxCard from '../../components/TaxCard';
import TaxInfoCard from '../../components/TaxInfoCard';
import TaxCard2 from '../../components/TaxCard2';
import TaxInfoCard2 from '../../components/TaxInfoCard2';
import HouseInfo from '../../components/HouseInfo';
import Bottompolygon from '../../assets/icons/bottom_polygon.svg';
import EditButtom from '../../assets/icons/edit_Reservation.svg';

const Container = styled.View`
  flex: 1.0;
  background-color: #fff;
  padding: 0 20px;
`;



const IntroSection = styled.View`
  width: 100%;
  padding: 20px 0 20px 0;
`;


const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #F0F0F2;
`;


const ModalInputSection = styled.View`
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-top-width: 1px;
  border-top-color: #E8EAED;
`;


const ModalInputContainer = styled.View`
  margin-top: 10px;
  width: 100%;
`;

const ModalInput = styled.ScrollView.attrs(_props => ({
  showsVerticalScrollIndicator: false,
}))`
  width: 100%;
  height: 100px;
  padding: 10px 10px 10px 20px;
  background-color: #F5F7FA;
  color: #A3A5A8;
  overflow: hidden; 
  border-radius: 8px;
`;

const ModalInputText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-regular;
  color: #A3A5A8;
  line-height: 15px;
  text-align: left;
  text-align-vertical: top;
  overflow: hidden;
`;

const HoustInfoBadge = styled.View`
  width: auto;
  margin-right: auto;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: #1fc9a8;
  align-self: center;
`;

const HoustInfoBadgeText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;


const Title = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  letter-spacing: -0.5px;
  margin-right: 10px;
`;

const SubTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 25px;
  
`;

const SubTitle2 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 14px;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: left;
`;


const SubTitle4 = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ButtonSection = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;  
  width: 100%;
  margin-bottom: 20px;
  padding: 20px 0;
`;


const ButtonSection2 = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;  
  width: 100%;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 50px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  bottom: 0px;
`;

const Button2 = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 60px;
  height: 30px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: right;
`;


const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const ReservationDetail = props => {
  const _scrollViewRef = useRef(null);

  const actionSheetRef = useRef(null);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [reservationDetail, setReservationDetail] = useState({});
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser.value);
  const [isExpanded, setIsExpanded] = useState(false);
  const houseInfo = props?.route.params?.houseInfo;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleBackPress = () => {
    navigation.goBack();
    return true;
  }

  const handleHouseChange1 = async (Date, Time) => {
    setReservationDetail(prevDetail => ({
      ...prevDetail,
      reservationDate: Date,
      reservationStartTime: Time,
    }));
  };

  const handleHouseChange2 = async (Content, Type) => {
    setReservationDetail(prevDetail => ({
      ...prevDetail,
      consultingType: Type,
      consultingRequestContent: Content,
    }));
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])
  );

  useFocusEffect(
    useCallback(() => {
      console.log('consultingReservationId', props.route?.params?.consultingReservationId);
      getReservationDetail(props.route?.params?.consultingReservationId);
    }, [])
  );
  const [isConnected, setIsConnected] = useState(true);

  /*useEffect(() => {
    _scrollViewRef2.current?.scrollTo({
      x: (width) * currentPageIndex2,
      y: 0,
      animated: true,
    });
  }, [currentPageIndex2]);
*/


  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
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

  const getReservationDetail = async (consultingReservationId) => {
    const url = `${Config.APP_API_URL}consulting/reservationDetail?consultingReservationId=${consultingReservationId}`;
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
              message: response.data.errMsg ? response.data.errMsg : '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          console.log('response.data', response.data.data);
          const result = response === undefined ? [] : response.data.data;
          if (result) {
            console.log('result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setReservationDetail({ ...result });

          }
        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
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
            navigation.goBack();
          }} >
          <BackIcon />
        </TouchableOpacity >
      ),
      headerTitleAlign: 'center',
      title: '상담 예약 상세 정보',
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
    'FINISH': '상담완료'
  };

  const consultingStatusTypeColorMap = {
    'WAITING': '#A2C62B',
    'CANCEL': '#2F87FF',
    'PROGRESS': '#FF7401',
    'FINISH': '#A82BC6'
  };


  return (

    <><ProgressSection>
    </ProgressSection>
      <Container style={{ width: width }}>
        <><FlatList
          ref={_scrollViewRef}
          scrollEnabled={true}
          scrollEventThrottle={16}
          data={[]}
          renderItem={() => null} // 실제로 렌더링할 항목이 없으므로 null 반환
          showsVerticalScrollIndicator={false}
          overScrollMode="never" // 이 줄을 추가하세요
          ListHeaderComponent={<>
            <IntroSection style={{ width: '100%', height: 'auto' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Title>이민정음 세무사</Title>
                <HoustInfoBadge style={{ backgroundColor: consultingStatusTypeColorMap[reservationDetail.consultingStatus] }}>
                  <HoustInfoBadgeText>{consultingStatusTypeMap[reservationDetail.consultingStatus]}</HoustInfoBadgeText>
                </HoustInfoBadge>
              </View>

              <ModalInputSection style={{ width: '100%' }}>
                <ModalInputContainer>
                  <SubTitle>상담 예약일시</SubTitle>
                  <SubTitle2>확정된 상담 예약 날짜와 시간이에요.</SubTitle2>
                  <ModalInput
                    style={{ height: 50, textAlignVertical: 'top', paddingTop: reservationDetail.consultingStatus === 'WAITING' ? 10 : 20 }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ModalInputText style={{ textAlignVertical: 'center', width: '90%' }}>
                        {new Date(reservationDetail.reservationDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + reservationDetail.reservationStartTime}
                      </ModalInputText>
                      {reservationDetail.consultingStatus === 'WAITING' && (<TouchableOpacity
                        style={{ paddingTop: 5 }}
                        activeOpacity={0.6}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() => {
                          //  console.log('reservationDetail', reservationDetail);
                          SheetManager.show('updateConsultingDateAndTimeAlert', {
                            payload: {
                              navigation,
                              consultingReservationId: props.route?.params?.consultingReservationId,
                              handleHouseChange1,
                            },
                          });
                        }}>
                        <DropShadow style={{
                          width: '100%',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1,
                        }}>
                          <EditButtom />
                        </DropShadow>
                      </TouchableOpacity>)}

                    </View>
                  </ModalInput>
                </ModalInputContainer>
              </ModalInputSection>
              <ModalInputSection style={{ width: '100%' }}>
                <ModalInputContainer>
                  <SubTitle>상담 내용</SubTitle>
                  <SubTitle2>상담을 원하시는 세금 종류와 상담 내용이에요.</SubTitle2>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                    {reservationDetail.consultingType && reservationDetail.consultingType?.split(',').map(type => consultingTypeMap[type]).map((type) => (
                      <HoustInfoBadge key={type} style={{ backgroundColor: '#2F87FF', marginRight: 10 }}>
                        <HoustInfoBadgeText>{type}</HoustInfoBadgeText>
                      </HoustInfoBadge>
                    ))}
                  </View>
                  <ModalInput
                    style={{ height: reservationDetail.consultingInflowPath && reservationDetail.consultingInflowPath !== '00' ? 130 : 150, textAlignVertical: 'top', paddingTop: reservationDetail.consultingStatus === 'WAITING' ? 10 : 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ModalInputText style={{ width: '90%', paddingTop: 10 }}>{reservationDetail.consultingRequestContent}</ModalInputText>
                      {reservationDetail.consultingStatus === 'WAITING' && (<TouchableOpacity
                        style={{ paddingTop: 5 }}
                        activeOpacity={0.6}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() => {
                          SheetManager.show('updateConsultingContentAlert', {
                            payload: {
                              navigation,
                              consultingReservationId: props.route?.params?.consultingReservationId,
                              consultingRequestContent: reservationDetail.consultingRequestContent,
                              consultingType: reservationDetail.consultingType,
                              handleHouseChange2,
                            },
                          });
                        }}>
                        <DropShadow style={{
                          width: '100%',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1,
                        }}>
                          <EditButtom />
                        </DropShadow>
                      </TouchableOpacity>)}
                    </View>
                  </ModalInput>
                </ModalInputContainer>
              </ModalInputSection>
              {reservationDetail.consultingInflowPath && reservationDetail.consultingInflowPath !== '00' && <View style={{
                borderTopWidth: 1,
                borderTopColor: '#E8EAED',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                <SubTitle4 style={{ marginTop: 20, marginBottom: 20 }}>세금 계산 결과</SubTitle4>
                <ButtonSection2 style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%'
                }}>
                  <Button2 onPress={toggleExpand} style={{
                    borderWidth: 1, borderColor: '#E8EAED', backgroundColor: '#fff', width: 80, flexDirection: 'row',
                    alignItems: 'center',

                  }}>
                    <ButtonText style={{ color: '#717274', fontSize: 12, fontFamily: 'Pretendard-regular' }}> {isExpanded ? '접기' : '펼치기'}</ButtonText>
                    {!isExpanded ? <Bottompolygon style={{ marginLeft: 5, marginTop: 1 }} />
                      : <Bottompolygon style={{
                        marginLeft: 5,
                        marginTop: 1,
                        transform: [{ rotate: '180deg' }]
                      }} />}
                  </Button2>
                </ButtonSection2>
              </View>}

              {isExpanded && (<>
                {/*reservationDetail.consultingInflowPath !== '02' ? <HouseInfo item={houseInfo} navigation={navigation} ChatType='AcquisitionChat' /> : <HouseInfo item={houseInfo} navigation={navigation} ChatType='GainsTaxChat' />*/}
                {reservationDetail.consultingInflowPath !== '02' ? <TaxCard navigation={navigation} Pdata={reservationDetail.calculationBuyResultResponse !== null ? reservationDetail.calculationBuyResultResponse : null} /> : <TaxCard2 navigation={navigation} Pdata={reservationDetail.calculationSellResultResponse !== null ? reservationDetail.calculationSellResultResponse : null} />}
                {reservationDetail.consultingInflowPath !== '02' ? <TaxInfoCard Pdata={reservationDetail.calculationBuyResultResponse !== null ? reservationDetail.calculationBuyResultResponse : null} /> : <TaxInfoCard2 Pdata={reservationDetail.calculationSellResultResponse !== null ? reservationDetail.calculationSellResultResponse : null} />}
              </>)
              }
            </IntroSection>
          </>}
          ListFooterComponent={
            <>
              <ButtonSection style={{
                backgroundColor: '#fff', // background-color를 camelCase로 변경
                alignItems: 'center', // align-items를 camelCase로 변경
                flexDirection: 'row', // flex-direction을 camelCase로 변경
                justifyContent: 'space-between', // justify-content를 camelCase로 변경
              }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  {reservationDetail.consultingStatus && reservationDetail.consultingStatus === 'WAITING' && (<><DropShadow
                    style={{
                      width: '48%',
                      marginRight: '4%',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0,
                      shadowRadius: 1,
                    }}>
                    <Button
                      onPress={async () => {
                        const state = await NetInfo.fetch();
                        const canProceed = await handleNetInfoChange(state);
                        if (canProceed) {
                          // Your code here
                          SheetManager.show('InfoReservationCancel', {
                            payload: {
                              consultingReservationId: props.route?.params?.consultingReservationId,
                              navigation: navigation
                            },
                          });
                        }
                      }}
                      style={{
                        width: '100%',
                        borderRadius: 25,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#E8EAED',
                      }}>
                      <ButtonText
                        style={{
                          color: '#717274',
                          fontSize: 16,
                          fontFamily: 'Pretendard-Bold',
                          lineHeight: 20,
                        }}>
                        예약 취소하기
                      </ButtonText>
                    </Button>
                  </DropShadow>
                    <DropShadow style={{
                      width: '48%',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,
                    }}>
                      <Button
                        onPress={async () => {
                          const state = await NetInfo.fetch();
                          const canProceed = await handleNetInfoChange(state);
                          if (canProceed) {
                            navigation.goBack();
                          }
                        }} style={{
                          width: '100%',
                          borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
                          alignItems: 'center', // align-items를 camelCase로 변경
                          justifyContent: 'center', // justify-content를 camelCase로 변경
                          borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                          backgroundColor: '#2f87ff',
                          borderColor: '#2f87ff'
                        }}>
                        <ButtonText
                          style={{
                            color: '#717274',
                            fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                            fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                            lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
                            color: '#fff'
                          }}
                        >돌아가기</ButtonText>
                      </Button>
                    </DropShadow></>)}
                  {reservationDetail.consultingStatus && reservationDetail.consultingStatus !== 'WAITING' &&
                    (<><DropShadow style={{
                      width: '100%',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                    }}>
                      <Button
                        //active={buyprice}
                        //disabled={!(buyprice)}
                        onPress={async () => {
                          const state = await NetInfo.fetch();
                          const canProceed = await handleNetInfoChange(state);
                          if (canProceed) {
                            navigation.goBack();
                          }
                        }} style={{
                          width: '100%',
                          height: 50, // height 값을 숫자로 변경하고 단위 제거
                          borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
                          alignItems: 'center', // align-items를 camelCase로 변경
                          justifyContent: 'center', // justify-content를 camelCase로 변경
                          borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                          backgroundColor: '#2f87ff',
                          borderColor: '#2f87ff'
                        }}>
                        <ButtonText
                          style={{
                            color: '#717274',
                            fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                            fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                            lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
                            color: '#fff'
                          }}
                        >돌아가기</ButtonText>
                      </Button>
                    </DropShadow></>)}
                </View>
              </ButtonSection>
            </>
          }
        />
        </></Container>
    </>
  )
};


export default ReservationDetail;
