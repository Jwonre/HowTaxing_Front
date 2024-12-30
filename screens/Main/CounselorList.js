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


const HoustInfoSection = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${props => (props.active ? '#2F87FF' : '#E8EAED')};
`;


const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 24px;
`;

const HoustInfoText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  line-height: 20px;
  color: #a3a5a8;
`;

const HoustInfoBadge = styled.TouchableOpacity.attrs(props => ({
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


const ButtonSection2 = styled.View`
  flex: 1;
  padding: 0 20px;
  align-items: center;
  justify-content: flex-end;  
  width: 100%;
  margin-Top: 80px;
`;


const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
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
  margin-bottom: 10px;
`;


const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const ProfileAvatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 50px;
  height: 50px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: left;
  margin-right: 12px;
`;


const CounselorList = props => {
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
  const [counselorList, setCounselorList] = useState([]);
  const currentPageIndexList = [0, 1, 2, 3, 4];
  const [text, setText] = useState('');
  const [selectedList, setSelectedList] = useState([]);
  //const Pdata = props?.Pdata;
  //console.log('ori fixHouseList', fixHouseList);

  useFocusEffect(
    useCallback(() => {
      getCounselorlist();
    }, [])
  );

  const handleBackPress = () => {
    SheetManager.show('InfoConsultingCancel', {
      payload: {
        type: 'info',
        message: '상담 예약을 다음에 하시겠어요?',
        onPress: { handlePress },
      },
    });
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

  const handlePress = buttonIndex => {
    if (buttonIndex === 'YES') {
      navigation.goBack();
    }
  };


  const getCounselorlist = async () => {
    const url = `${Config.APP_API_URL}consulting/consultantList`;
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
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상담자 정보 목록을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          const result = response === undefined ? [] : response.data.data;
          console.log('result', result.length);
          if (result.length > 0) {
            console.log('result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setCounselorList([...result]);

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
            SheetManager.show('InfoConsultingCancel', {
              payload: {
                type: 'info',
                message: '상담 예약을 다음에 하시겠어요?',
                onPress: { handlePress },
              },
            });
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '상담 예약하기',
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
          <Title>상담을 원하는 세무사님을 선택해주세요.</Title>
          <SubTitle2>"자세히 보기"를 누르면, 세무사님들의 활동을 볼 수 있어요.</SubTitle2>
        </IntroSection2>

          <FlatList
            stickyHeaderIndices={[0]}
            data={counselorList}
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
            ListFooterComponent={<View></View>}
            renderItem={({ item, index }) => {

              //  const consultingTypes = item.consultingType.split(',').map(type => consultingTypeMap[type]).join(', ');
              return (
                <InfoContentSection overScrollMode="never" style={{ width: width, marginBottom: 10 }}>

                  <HoustInfoSection
                    active={selectedList.indexOf(item) > -1 && item.consultantId === 1}
                    disabled={item.consultantId !== 1}
                    onPress={() => {
                      if (selectedList.indexOf(item) > -1) {
                        setSelectedList(
                          selectedList.filter(selectedItem => selectedItem !== item),
                        );
                      } else {
                        setSelectedList([item]);
                      }
                    }}
                    style={{
                      backgroundColor: item.consultantId !== 1 ? '#e0e0e0' : '#fff', // 비활성화 시 배경색 변경 
                      opacity: item.consultantId !== 1 ? 0.5 : 1,
                      // 비활성화 시 투명도 변경 
                    }}
                    key={index}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <ProfileAvatar
                          source={{ uri: item.thumbImageUrl }} />
                        <View
                          style={{
                            width: '40%',
                            marginRight: '7%',
                          }}>
                          <HoustInfoTitle>
                            {item.consultantName + ' ' + item.jobTitle}
                          </HoustInfoTitle>
                          <HoustInfoText style={{ color: '#717274' }}>
                            {item.company}
                          </HoustInfoText>
                          <HoustInfoText>
                            {item.location}
                          </HoustInfoText>
                        </View>
                        <HoustInfoBadge
                          onPress={async () => {
                            const state = await NetInfo.fetch();
                            const canProceed = await handleNetInfoChange(state);
                            if (canProceed) {
                              //console.log('자세히 보기 props', props.route?.params);
                              //console.log('자세히 보기 item', item);
                              //console.log('자세히 보기 Pdata', Pdata);
                              console.log('자세히보기 테스트 props.route?.params?.isGainsTax', props.route?.params?.isGainsTax)
                              if (props.route?.params?.state === 'calculatefinish') {
                                setSelectedList([]);
                                navigation.push('ConsultingReservation2', {
                                  CounselorData: item,
                                  Pdata: props.route?.params?.Pdata,
                                  isGainsTax: props.route?.params?.isGainsTax,
                                  houseInfo: props.route?.params?.houseInfo,
                                  currentPageIndex: 0
                                });
                              } else {
                                setSelectedList([]);
                                console.log('자세히보기 테스트 else')
                                navigation.push('ConsultingReservation', {
                                  CounselorData: item,
                                  currentPageIndex: 0
                                });
                              }

                            }
                          }}
                          disabled={item.consultantId !== 1} // 비활성화 여부 설정
                          style={{
                            height: 30,
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            borderColor: item.consultantId !== 1 ? '#CCCCCC' : '#E8EAED',
                            borderWidth: 1,
                            opacity: item.consultantId !== 1 ? 0.5 : 1, // 비활성화 시 투명도 변경
                          }}>
                          <HoustInfoBadgeText style={{ fontSize: 13, lineHeight: 30, color: '#717274' }}>
                            {'자세히 보기'}
                          </HoustInfoBadgeText>
                        </HoustInfoBadge>
                      </View>
                      <View>
                        <HoustInfoText style={{ fontSize: 10, lineHeight: 13 }}>
                          {item.consultantIntroduction}
                        </HoustInfoText>
                      </View>
                    </View>
                  </HoustInfoSection>

                </InfoContentSection>
              );
            }}
            keyExtractor={(item) => item.consultantId.toString()}
          /></>
        <ButtonSection2>
          <View>
            <ShadowContainer>
              <Button
                style={{
                  backgroundColor: selectedList.length === 0 ? '#E8EAED' : '#2F87FF',
                  color: selectedList.length === 0 ? '#1b1c1f' : '#FFFFFF',
                }}
                disabled={selectedList.length === 0}
                active={!(selectedList.length === 0)}
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    console.log('선택하기 props', props);
                    console.log('선택하기 selectedList', selectedList);
                    if (props.route?.params?.state === 'calculatefinish') {
                      navigation.push('ConsultingReservation2', {
                        CounselorData: selectedList[0],
                        Pdata: props.route?.params?.Pdata,
                        isGainsTax: props.route?.params?.isGainsTax,
                        houseInfo: props.route?.params?.houseInfo,
                        currentPageIndex: 1,
                        prevChoice: 'CounselorChoice'
                      });
                    } else {
                      navigation.push('ConsultingReservation', {
                        CounselorData: selectedList[0],
                        currentPageIndex: 1,
                        prevChoice: 'CounselorChoice'
                      });
                    }
                    setTimeout(() => {
                      setSelectedList([]);
                    }, 200);
                  }
                }}>
                <ButtonText>선택하기</ButtonText>
              </Button>
            </ShadowContainer>
          </View>
          <View
            style={{
              marginTop: 5,
              marginBottom: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              zIndex: 2,
            }}>
            {currentPageIndexList?.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.6}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                style={{
                  width: 0 === index ? 20 : 8, // Elongate the dot
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 0 === index ? '#2F87FF' : '#1b1c1f',
                  borderWidth: 1,
                  borderColor: 0 === index ? '#2F87FF' : '#1b1c1f',
                  marginRight: 4,
                }}
              />
            ))}
          </View>
        </ButtonSection2>
      </Container>
    </ScrollView >

  )
};


export default CounselorList;
