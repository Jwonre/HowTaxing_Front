// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { acquisitionTax, gainTax } from '../../data/chatData';
import { LogBox } from 'react-native';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import CloseIcon from '../../assets/icons/close_button.svg';
import XCircleIcon from '../../assets/icons/x_circle.svg';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setFixHouseList } from '../../redux/fixHouseListSlice';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import Config from 'react-native-config'

const Container = styled.View`
  flex: 1.0;
  background-color: #fff;
`;

const IntroSection = styled.View`
  flex: 0.85;
  width: 100%;
`;

const IntroSection2 = styled.View`
  width: 100%;
  padding: 20px 20px 0px 20px;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;

const InfoContentSection = styled.ScrollView.attrs(_props => ({
  showsVerticalScrollIndicator: false,
}))`
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
  margin-bottom: 20px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  justify-content: space-between;
`;

const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 24px;

`;

const HoustInfoText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  line-height: 20px;
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
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;


const Title = styled.Text`
  font-size: 19px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 25px;
  margin-bottom: 5px;
  letter-spacing: -0.5px;
`;


const SubTitle2 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
`;


const SubTitle3 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #FF7401;
  line-height: 15px;
  margin-top: 10px;
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
  padding: 0 20px;
  align-items: center;
  bottom: 10px;
  width: 100%;
`;
const Button = styled.TouchableOpacity.attrs(_props => ({
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

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const FixedHouseList = props => {
  LogBox.ignoreLogs(['to contain units']);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const currentUser = useSelector(state => state.currentUser.value);
  const chatDataList = useSelector(state => state.chatDataList.value);
  const dispatch = useDispatch();
  const fixHouseList = useSelector(state => state.fixHouseList.value);
  const [fixHouseFinish, setFixHouseFinish] = useState(false);
  const [fixHouseFinishAndWait, setFixHouseFinishAndWait] = useState(true);

  //const Pdata = props?.Pdata;
  //console.log('ori fixHouseList', fixHouseList);
  useEffect(() => {
    var cnt = 0;
    for (let i = 0; i < fixHouseList.length; i++) {
      if (fixHouseList[i].complete) {
        cnt++;
      }
    }
    if (fixHouseList.length === cnt) {
      setFixHouseFinish(true);
    }
  }, [fixHouseList])

  const handleBackPress = () => {
    dispatch(setFixHouseList([]));
    navigation.navigate('GainsTaxChat');
    const newChatDataList = chatDataList.slice(0, props.route?.params.chatListindex + 1);
    dispatch(setChatDataList(newChatDataList));
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



  const goFixedHouse = async (index) => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      navigation.push('FixedHouse', { index: index, chatListindex: props.route?.params.chatListindex });
    }
  };

  const registerDirectHouse = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      const accessToken = currentUser.accessToken;
      // 요청 헤더
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      };

      // 요청 바디
      console.log('last fixHouseList', fixHouseList);
      var loadHouseList = fixHouseList ? fixHouseList : [];
      const data = {
        calcType: '02',
        houseSaveRequestList: loadHouseList ? loadHouseList.map(({ index, complete, createAt, houseId, isCurOwn, isDestruction, kbMktPrice, moveInDate, moveOutDate, ownerCnt, sellDate, sellPrice, sourceType, updateAt, userId, userProportion, ...rest }) => rest) : [],
      }
      console.log('[hypenHouseAPI] data : ', data);
      try {
        const response = await axios.post(`${Config.APP_API_URL}house/saveAllHouse`, data, { headers: headers });
        if (response.data.errYn === 'Y') {
          // console.log('response.data', response.data);
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '보유주택 수정·등록 중 오류가 발생했습니다.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
          return false;
        } else {
          //console.log('returndata',response.data.data.list);
          const returndata = response.data.data.list;
          dispatch(setOwnHouseList([...returndata]));
          return true;
        }
      } catch (error) {
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            message: '보유주택 수정·등록 중 오류가 발생했습니다.',
            buttontext: '확인하기',
          },
        });
        console.error(error);
        return false;
      }
    }
  };

  const getEtcHouse = async () => {
    const url = `${Config.APP_API_URL}house/getEtcHouse`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    try {
      const response = await axios.get(url, { headers: headers });
      if (response.data.errYn === 'Y') {
        setFixHouseFinishAndWait(true);
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '기타 재산세 보유주택을 불러오는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            buttontext: '확인하기',
          },
        });
        return 'getEtcHouseFailed';
      } else {
        console.log('response.data.data2 : ', response.data.data);
        console.log('response.data.data2.length : ', response.data.data.length);
        if (response.data.data.length === 0) {
          setFixHouseFinishAndWait(true);
          return 'getEtcHouseNull';
        } else {
          setFixHouseFinishAndWait(false)
          // console.log('response.data.data : ', response.data.data);
          var list = response.data.data.map((item, index) => ({ ...item, index }));
          dispatch(setFixHouseList(list));
          return 'getEtcHouse';
        }
      }
    } catch (error) {
      setFixHouseFinishAndWait(true);
      //console.log(error);
      SheetManager.show('info', {
        payload: {
          message: '기타 재산세 보유주택을 불러오는데 문제가 발생했어요.',
          description: error.message ? error.message : '오류가 발생했습니다.',
          type: 'error',
          buttontext: '확인하기',
        }
      });
      return 'getEtcHouseFailed';
    }
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            dispatch(setFixHouseList([]));
            //console.log('currentPageIndex', currentPageIndex);
            navigation.navigate('GainsTaxChat');
            const newChatDataList = chatDataList.slice(0, props.route?.params.chatListindex + 1);
            dispatch(setChatDataList(newChatDataList));
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '보유 주택 현황',
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
    <Container style={{ width: width }}>
      <ProgressSection>
      </ProgressSection>
      <><IntroSection2 style={{ width: width, marginBottom: 20 }}>
        <Title>보유 주택의 정보를 가져오는 중{'\n'}일부 미비한 정보가 있어요.</Title>
        <Title>추가정보를 입력해주세요.</Title>
        <SubTitle3>만약 현재 보유하고 있지 않은 주택이 있다면, 삭제를 해주세요.</SubTitle3>
      </IntroSection2>

        <InfoContentSection keyboardShouldPersistTaps='always' overScrollMode="never" style={{ width: width, height: height - 370 }}>
          {fixHouseFinishAndWait && fixHouseList?.map((item, index) => (
            <HoustInfoSection
              style={{
                borderColor: item.complete ? '#CFD1D5' : '#FF7401',
              }}
              key={index}>
              <View
                style={{
                  width: item.complete ? '60%' : '55%',
                  marginRight: item.complete ? '10%' : '2%',
                }}>
                <HoustInfoTitle style={{ color: item.complete ? '#CFD1D5' : '#000000', }}>
                  {item.roadAddr !== null
                    ? item.roadAddr
                    : item.jibunAddr + ' ' + item.houseName}
                </HoustInfoTitle>
                {item.detailAdr !== null && (
                  <HoustInfoText style={{ color: item.complete ? '#CFD1D5' : '#000000', }}>
                    {item.detailAdr}
                  </HoustInfoText>
                )}
              </View>
              <HoustInfoBadge
                disabled={item.complete}
                onPress={() => goFixedHouse(item.index)}
                style={{
                  marginRight: item.complete ? 0 : '3%',
                  height: 30,
                  width: '30%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  flexDirection: 'row',
                  backgroundColor: item.complete ? '#CFD1D5' : '#FF7401',
                }}>
                <HoustInfoBadgeText style={{ fontSize: 13, lineHeight: 30 }}>
                  {item.complete ? '완료' : '추가 입력'}
                </HoustInfoBadgeText>
              </HoustInfoBadge>
              {(item.complete === false) && <TouchableOpacity activeOpacity={0.6}
                onPress={async () => {
                  console.log('fixHouseList', fixHouseList);
                  SheetManager.show('InfoFixHouseDelete', {
                    payload: {
                      index: index,
                    },
                  });

                }}><XCircleIcon /></TouchableOpacity>}
            </HoustInfoSection>
          ))}
        </InfoContentSection>


        <ButtonSection width={width} style={{
          height: 90, // height 값을 문자열로 변경
          backgroundColor: '#fff', // background-color를 camelCase로 변경
          alignItems: 'center', // align-items를 camelCase로 변경
          //   flexDirection: 'row', // flex-direction을 camelCase로 변경
          //   justifyContent: 'space-between', // justify-content를 camelCase로 변경
          padding: 20,
        }}>


          <DropShadow style={styles.dropshadow}>
            <Button active={fixHouseFinish}
              disabled={!(fixHouseFinish)}
              onPress={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {
                  if (fixHouseList.length === 0) {
                    const registerDirectHouseResult = await registerDirectHouse();
                    //console.log('registerDirectHouseResult : ', registerDirectHouseResult);
                    if (registerDirectHouseResult) {
                      const getEtcHouseReturn = await getEtcHouse();
                      if (getEtcHouseReturn === 'getEtcHouseNull') {
                        const chatItem = gainTax.find(el => el.id === 'allHouse1')
                        dispatch(setChatDataList([...chatDataList, chatItem]), setFixHouseList([]));
                        navigation.navigate('GainsTaxChat');
                      } else if (getEtcHouseReturn === 'getEtcHouse') {
                        navigation.navigate('AddHouseList', { chatListindex: props.route?.params.chatListindex });
                      }

                    }
                  } else {
                    const registerDirectHouseResult = await registerDirectHouse();
                    //console.log('registerDirectHouseResult : ', registerDirectHouseResult);
                    if (registerDirectHouseResult) {
                      const getEtcHouseReturn = await getEtcHouse();
                      if (getEtcHouseReturn === 'getEtcHouseNull') {
                        const chatItem = gainTax.find(el => el.id === 'allHouse1')
                        dispatch(setChatDataList([...chatDataList, chatItem]), setFixHouseList([]));
                        navigation.navigate('GainsTaxChat');
                      } else if (getEtcHouseReturn === 'getEtcHouse') {
                        navigation.navigate('AddHouseList', { chatListindex: props.route?.params.chatListindex });
                      }
                    }
                  }


                }
              }} style={{
                width: '100%',
                height: 50, // height 값을 숫자로 변경하고 단위 제거경하고 단위 제거
                alignItems: 'center', // align-items를 camelCase로 변경
                justifyContent: 'center', // justify-content를 camelCase로 변경
                borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                backgroundColor: fixHouseFinish ? '#2f87ff' : '#E8EAED',
                borderColor: fixHouseFinish ? '#2f87ff' : '#E8EAED',
              }}>
              <ButtonText active={fixHouseFinish} style={{
                color: '#717274',
                fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
                color: fixHouseFinish ? '#fff' : '#717274'
              }}
              >다음으로</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection></>
    </Container>

  )
};

const styles = StyleSheet.create({
  dropdownStyle: {
    width: '37%',
    height: 300,
    borderRadius: 10,
    marginTop: -20,
  },
  buttonStyle: {
    width: '100%',
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EAED',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#A3A5A8',
    letterSpacing: -0.3,
    lineHeight: 16,
    marginRight: 15,
  },
  rowStyle: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0,
    borderBottomColor: '#E8EAED',
  },
  rowTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1C1F',
    letterSpacing: -0.3,
    lineHeight: 16,
  },
  dropshadow: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});


export default FixedHouseList;
