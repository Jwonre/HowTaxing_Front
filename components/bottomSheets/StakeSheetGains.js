// 보유 주택 목록에서 공시가격 수정 선택시 뜨는 팝업

import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import numberToKorean from '../../utils/numToKorean';
import NetInfo from "@react-native-community/netinfo";
import InfoIcon from '../../assets/icons/info_tooltip_ico.svg';
import { setChatDataList } from '../../redux/chatDataListSlice';
import Slider from '@react-native-community/slider';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import dayjs from 'dayjs';
import { gainTax } from '../../data/chatData';
import axios from 'axios';
import Config from 'react-native-config'

dayjs.locale('ko');
import { LogBox } from 'react-native';

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
  margin-bottom: 20px;
`;

const MemberIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

const StyledInput = styled.TextInput.attrs({
  placeholderTextColor: '#C1C3C5',
})`
  flex: 1;
  height: 50px;
  padding: 0 10px;
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: right;
`;

const ModalSelectButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 24%;
  height: 40px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  border: 1px solid #e8eaed;
`;

const ModalSelectButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #1b1c1f;
  line-height: 20px;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
`;


const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
  border-top-width: 1px;
  border-top-color: #e8eaed;
`;

const ButtonShadow = styled(DropShadow)`
  width: 48%;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 10;
  }
  shadow-opacity: 0.25;
  shadow-radius: 4;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const Card = styled.View`
  width: 125px;
  height: 125px;
  border-radius: 5px;
  background-color: #fff;
  justify-content: space-between;
  border-width: 1px;
  border-color: #2F87FF;
  padding: 10px;
  align-items: center;
`;

const CardTitle = styled.Text.attrs({
  numberOfLines: 2,
})`
  width: 100%;
  font-size: 14px;
  color: #1b1c1f;
  font-family: Pretendard-Bold;
  line-height: 20px;
  text-align: center;
`;

const CardSubTitle = styled.Text`
  font-size: 20px;
  color: #000;
  font-family: Pretendard-Bold;
  line-height: 20px;
`;

const StakeSheetGains = props => {
  LogBox.ignoreLogs(['to contain units']);
  const { handleHouseChange, data, navigation, prevSheet } = props.payload;
  const chatDataList = useSelector(state => state.chatDataList.value);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const [value, setValue] = useState(50);
  // 공시가격
  const [buyPrice, setBuyPrice] = useState(
    data?.buyPrice ? data?.buyPrice : null,
  );
  const currentUser = useSelector(state => state.currentUser.value);

  const getadditionalQuestion = async (questionId, answerValue, houseId, sellDate, sellPrice) => {
    /*
    [필수] calcType | String | 계산유형(01:취득세, 02:양도소득세)
    [선택] questionId | String | 질의ID
    [선택] answerValue | String | 응답값
    [선택] sellHouseId | Long | 양도주택ID (  양도소득세 계산 시 세팅)
    [선택] sellDate | LocalDate | 양도일자 (양도소득세 계산 시 세팅)
    [선택] sellPrice | Long | 양도가액 (양도소득세 계산 시 세팅)
*/
    try {
      const url = `${Config.APP_API_URL}question/additionalQuestion`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`
      };

      const param = {
        calcType: '02',
        questionId: questionId,
        answerValue: answerValue ? answerValue : '',
        sellHouseId: houseId ? houseId : '',
        sellDate: sellDate ? dayjs(sellDate).format('YYYY-MM-DD') : null,
        sellPrice: sellPrice ? sellPrice : 0,
        ownHouseCnt: houseInfo?.ownHouseCnt ? houseInfo?.ownHouseCnt : 0
      };
      console.log('[additionalQuestion] additionalQuestion param:', param);
      const response = await axios.post(url, param, { headers });
      const detaildata = response.data.data;
      console.log('response.data', response.data);
      if (response.data.errYn == 'Y') {
        setTimeout(() => {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '추가질의를 가져오지 못했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        }, 500)
        return {
          returndata: false
        };
      } else {
        //  ////console.log('[additionalQuestion] additionalQuestion retrieved:', detaildata);
        // ////console.log('[additionalQuestion] detaildata?.houseType:', detaildata?.houseType);
        //  ////console.log('[additionalQuestion] additionalQuestion houseInfo:', houseInfo);
        return {
          detaildata: detaildata,
          returndata: true
        }
      }
    } catch (error) {
      setTimeout(() => {
        console.log(error ? error : 'error');
        SheetManager.show('info', {
          payload: {
            message: '추가질의를 가져오는데\n알수없는 오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          },
        });
      }, 500)
      return {
        returndata: false
      };
    }
  };



  // 공시가격 선택 리스트
  const AC_STAKE_LIST = [25, 33, 55, 75];
  const [isConnected, setIsConnected] = useState(true);

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


  // 키보드 이벤트
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log('chatDataList', chatDataList);
  }, []);
  const nextHandler = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {

      dispatch(setHouseInfo({ ...houseInfo, userProportion: value }),);
      const chat6 = {
        id: 'stake',
        type: 'my',
        message: value + '%',
        questionId: 'apartment',
      };
      console.log('chat6', chat6);
      const additionalQuestion = await getadditionalQuestion('', '', houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
      //console.log('additionalQuestion', additionalQuestion);
     //console.log('additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue', additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue);
      //console.log('additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent', additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent);

      let chat7;
      let chat11;
      const chat9 = gainTax.find(el => el.id === 'ExpenseInquiry');
      const chat10 = gainTax.find(el => el.id === 'ExpenseAnswer');

      if (additionalQuestion.returndata) {
        if (additionalQuestion.detaildata?.hasNextQuestion ) {
          if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0001') {
            let chatIndex = gainTax.findIndex(el => el.id === 'additionalQuestion');
            if (chatIndex !== -1) {
              chat7 = {
                ...gainTax[chatIndex],
                message: additionalQuestion.detaildata?.nextQuestionContent,
                questionId: additionalQuestion.detaildata?.nextQuestionId,
                select: gainTax[chatIndex].select.map(item => ({
                  ...item,
                  name: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent : additionalQuestion?.detaildata?.answerSelectList[1]?.answerContent,
                  answer: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue : additionalQuestion?.detaildata?.answerSelectList[1]?.answerValue,
                }))
              };

            }
            dispatch(
              setChatDataList([
                ...chatDataList,
                chat6,
                chat7
              ])
            );
          } else if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0004') {



            let chatIndex = gainTax.findIndex(el => el.id === 'additionalQuestion2');
            if (chatIndex !== -1) {
              chat7 = {
                ...gainTax[chatIndex],
                message: additionalQuestion.detaildata?.nextQuestionContent,
                questionId: additionalQuestion.detaildata?.nextQuestionId,
                answer: additionalQuestion.detaildata?.selectSelectList ? additionalQuestion.detaildata?.selectSelectList.answerValue : null,
              };
            }

            const additionalQuestion2 = await getadditionalQuestion(additionalQuestion.detaildata?.nextQuestionId, '' ? additionalQuestion.detaildata?.selectSelectList.answerValue : '02', houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
            //console.log('additionalQuestion2', additionalQuestion2);
            if (additionalQuestion2.returndata) {
              if (additionalQuestion2.detaildata?.hasNextQuestion ) {
                if (additionalQuestion2.detaildata?.nextQuestionId === 'Q_0005') {

                  let chatIndex = gainTax.findIndex(el => el.id === 'residenceperiod');
                  if (chatIndex !== -1) {
                    chat11 = {
                      ...gainTax[chatIndex],
                      message: additionalQuestion2.detaildata?.nextQuestionContent,
                      questionId: additionalQuestion2.detaildata?.nextQuestionId,
                    };

                  } else {
                    let chatIndex = gainTax.findIndex(el => el.id === 'residenceperiod2');
                    chat11 = {
                      ...gainTax[chatIndex],
                    }

                  }
                }
              }
            } else {
              let tempadditionalAnswerList = houseInfo?.additionalAnswerList;
              if (tempadditionalAnswerList) {
                let foundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0005' in item);
                if (foundIndex !== -1) {
                  // 불변성을 유지하면서 Q_0005 값을 삭제
                  tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== foundIndex);
                  dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
                }
              }
              const newChatDataList = chatDataList.filter(item => item.id !== 'additionalQuestion2');
              dispatch(setChatDataList(newChatDataList));
            }
            dispatch(
              setChatDataList([
                ...chatDataList,
                chat6,
                chat7,
                chat11
              ])
            );
          } else if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0008') {
            let chatIndex = gainTax.findIndex(el => el.id === 'additionalQuestion');
            //  let chatIndex2 = gainTax.findIndex(el => el.id === 'additionalQuestion2');
            if (chatIndex !== -1) {
              chat7 = {
                ...gainTax[chatIndex],
                message: additionalQuestion.detaildata?.nextQuestionContent,
                questionId: additionalQuestion.detaildata?.nextQuestionId,
                select: gainTax[chatIndex].select.map(item => ({
                  ...item,
                  name: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent : additionalQuestion?.detaildata?.answerSelectList[1]?.answerContent,
                  answer: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue : additionalQuestion?.detaildata?.answerSelectList[1]?.answerValue,
                  //select: ['additionalQuestion'],
                }))
              };

            }
            dispatch(
              setChatDataList([
                ...chatDataList,
                chat6,
                chat7
              ])
            );

          }

        } else {
          if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                additionalAnswerList: []
              })
            );
          }
          dispatch(
            setChatDataList([
              ...chatDataList,
              chat6,
              chat9,
              chat10
            ])
          );
        }

        setTimeout(() => actionSheetRef.current?.hide(), 300);
      } else {
        dispatch(
          setHouseInfo({
            ...houseInfo,
            additionalAnswerList: []
          })
        );
      }





      /*const chat2 = acquisitionTax.find(el => el.id === 'moreHouse');
      dispatch(
        setChatDataList([...chatDataList, chat1, chat2]),
      );*/

    }
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {
              actionSheetRef.current?.hide();
              const excludeIds = ['jointSystem', 'jointcount', 'stake', 'jointGaincavity'];
              const newChatDataList = chatDataList.filter(el => !excludeIds.includes(el.id));

              dispatch(setChatDataList(newChatDataList));
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 490,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >고객님의 지분을 알려주세요.</ModalTitle>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>

              <DropShadow
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}>
                <Card>
                  <CardTitle >본인 소유 지분율</CardTitle>
                  <View style={{ width: 50, height: 50, backgroundColor: '#d0d3d8', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                    <MemberIcon source={require('../../assets/images/member.png')} />
                  </View>
                  <CardSubTitle >{value}%</CardSubTitle>
                </Card>
              </DropShadow>

              <DropShadow
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}>
                <Card style={{ borderColor: '#FFF' }}>
                  <CardTitle >공동 소유자 지분율</CardTitle>
                  <View style={{ width: 50, height: 50, backgroundColor: '#d0d3d8', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                    <MemberIcon source={require('../../assets/images/member.png')} />
                  </View>
                  <CardSubTitle >{100 - value}%</CardSubTitle>
                </Card>
              </DropShadow>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: '#000', textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Pretendard-Bold', }}>{value}%</Text>
              <Slider
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#2f87ff"
                maximumTrackTintColor="#d0d3d8"
                step={1}
                value={value}
                onValueChange={(val) => setValue(val)}
                thumbImage={require('../../assets/images/slider.png')}
              />
              <View style={{ width: '100%' }}>
                <Text style={{ color: '#000', textAlign: 'right', fontSize: 16, fontFamily: 'Pretendard-Bold', }}>100%</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              {AC_STAKE_LIST.map((item, index) => (
                <ModalSelectButton
                  key={index}
                  onPress={() => {
                    setValue(item);
                  }}>
                  <ModalSelectButtonText >
                    {item + '%'}
                  </ModalSelectButtonText>
                </ModalSelectButton>
              ))}
            </View>
          </View>
        </ModalInputSection>
        <ButtonSection
          style={{
            borderTopWidth: 0,
          }}>
          <ButtonShadow
            style={{
              shadowColor: '#fff',
            }}>
            <Button
              onPress={() => {
                const excludeIds = ['jointSystem', 'jointcount', 'stake', 'jointGaincavity'];
                const newChatDataList = chatDataList.filter(el => !excludeIds.includes(el.id));
                dispatch(setChatDataList(newChatDataList));
                actionSheetRef.current?.hide();
              }}
              style={{
                backgroundColor: '#fff',
                borderColor: '#E8EAED',
              }}>
              <ButtonText

                style={{
                  color: '#717274',
                }}>
                이전으로
              </ButtonText>
            </Button>
          </ButtonShadow>
          <ButtonShadow>
            <Button
              onPress={() => {
                // 주택 정보 업데이트
                nextHandler();
              }}>
              <ButtonText >다음으로</ButtonText>
            </Button>
          </ButtonShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default StakeSheetGains;
