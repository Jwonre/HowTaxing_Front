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


const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 24px;
  margin-bottom: 5px;

`;

const HoustInfoText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  line-height: 20px;
  color: #a3a5a8;
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
  font-size: 19px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;


const SubTitle2 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 14px;
  margin-top: 10px;
  text-align: left;
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
  //const Pdata = props?.Pdata;
  //console.log('ori fixHouseList', fixHouseList);

  useFocusEffect(
    useCallback(() => {
      getReservationlist();
    }, [])
  );

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
        <ProgressSection>
        </ProgressSection>
        <><IntroSection2 style={{ width: width, marginBottom: 20 }}>
          <Title>나의 상담 예약</Title>
          <SubTitle2>예약하신 상담이나 이미 상담을 진행한 내역을 볼 수 있어요.</SubTitle2>
        </IntroSection2>

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
                'FINISH': '상담완료'
              };

              const consultingStatusTypeColorMap = {
                'WAITING': '#A2C62B',
                'CANCEL': '#2F87FF',
                'PROGRESS': '#FF7401',
                'FINISH': '#A82BC6'
              };


              const consultingTypes = item.consultingType.split(',').map(type => consultingTypeMap[type]).join(', ');
              return (
                <InfoContentSection overScrollMode="never" style={{ width: width, marginBottom: 10 }}>

                  <HoustInfoSection
                    style={{
                      borderColor: '#E8EAED',
                    }}
                    key={index}>
                    <View
                      style={{
                        width: '60%',
                        marginRight: '10%',
                      }}>
                      
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        {consultingTypes &&<HoustInfoBadge style={{ backgroundColor: '#2F87FF', marginRight: 10 }}>
                            <HoustInfoBadgeText>{consultingTypes}</HoustInfoBadgeText>
                          </HoustInfoBadge>}
                          <HoustInfoBadge style={{ backgroundColor: consultingStatusTypeColorMap[item.consultingStatus] }}>
                            <HoustInfoBadgeText>{consultingStatusTypeMap[item.consultingStatus]}</HoustInfoBadgeText>
                          </HoustInfoBadge>
                        </View>
                      <HoustInfoTitle>
                        {item.consultantName}
                      </HoustInfoTitle>
                      <HoustInfoText>
                        {new Date(item.reservationDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + item.reservationStartTime}
                      </HoustInfoText>
                    </View>
                    <HoustInfoBadge
                      onPress={async() => {
                        const state = await NetInfo.fetch();
                        const canProceed = await handleNetInfoChange(state);
                        if (canProceed) {
                          navigation.navigate('ReservationDetail', {
                            consultingReservationId: item.consultingReservationId
                          });
                        }
                      }}
                      style={{
                        height: 30,
                        width: '30%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        backgroundColor: '#fff',
                        borderColor: '#E8EAED',
                        borderWidth: 1,
                      }}>
                      <HoustInfoBadgeText style={{ fontSize: 12, lineHeight: 30, color: '#717274' }}>
                        {'자세히보기'}
                      </HoustInfoBadgeText>
                    </HoustInfoBadge>
                  </HoustInfoSection>
                </InfoContentSection>
              );
            }}
            keyExtractor={(item) => item.consultingReservationId.toString()}
          /></>
      </Container>
    </ScrollView >

  )
};


export default ReservationList;
