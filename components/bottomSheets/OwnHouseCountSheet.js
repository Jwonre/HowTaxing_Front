// 공동 소유자가 몇 명인가요? 질문에 대한 답변을 선택하는 bottom sheet

import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import NetInfo from "@react-native-community/netinfo";
import DropShadow from 'react-native-drop-shadow';
import MinusIcon from '../../assets/icons/minus.svg';
import PlusIcon from '../../assets/icons/plus.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { acquisitionTax } from '../../data/chatData';
import axios from 'axios';
import dayjs from 'dayjs';
import Config from 'react-native-config'

dayjs.locale('ko');
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
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
`;

const ModalSubTitle = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #FF7401;
  line-height: 15px;
  margin-top: 10px;
  text-align: center;
`;

const ModalButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 48%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
`;

const ModalButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 20px;
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
  padding: 20px;
`;

const OwnHouseCountSheet = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [HouseCount, setHouseCount] = useState(1);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const chatDataList = useSelector(state => state.chatDataList.value);
  const navigation = props.payload?.navigation;
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isConnected, setIsConnected] = useState(true);
  const currentUser = useSelector(state => state.currentUser.value);

  const getadditionalQuestion = async (questionId, answerValue, houseId, buyDate, buyPrice) => {
    /*
    [필수] calcType | String | 계산유형(01:취득세, 02:양도소득세)
    [선택] questionId | String | 질의ID
    [선택] answerValue | String | 응답값
    [선택] sellHouseId | Long | 양도주택ID (  양도소득세 계산 시 세팅)
    [선택] sellDate | LocalDate | 양도일자 (양도소득세 계산 시 세팅)
    [선택] sellPrice | Long | 양도가액 (양도소득세 계산 시 세팅)
    [선택] ownHouseCnt | Long | 보유주택수 (취득세 계산 시 세팅)
    [선택] buyDate | LocalDate | 취득일자 (취득세 계산 시 세팅)
    [선택] jibunAddr | String | 지번주소 (취득세 계산 시 세팅)
*/

    try {
      const url = `${Config.APP_API_URL}question/additionalQuestion`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`
      };

      const param = {
        calcType: '01',
        questionId: questionId,
        answerValue: answerValue ? answerValue : '',
        sellHouseId: houseId ? houseId : '',
        buyDate: buyDate ? dayjs(buyDate).format('YYYY-MM-DD') : null,
        buyPrice: buyPrice ? buyPrice : 0,
        ownHouseCnt: HouseCount ? HouseCount : 0,
        buyDate: houseInfo?.buyDate ? dayjs(houseInfo?.buyDate).format('YYYY-MM-DD') : null,
        jibunAddr: houseInfo?.jibunAddr ? houseInfo?.jibunAddr : '',
      };
      // console.log('[additionalQuestion] additionalQuestion param:', param);
      const response = await axios.post(url, param, { headers });
      const detaildata = response.data.data;
      //console.log('response.data', response.data);
      if (response.data.errYn == 'Y') {
        setTimeout(() => {
          SheetManager.show('info', {
            payload: {
              type: 'error',
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
        //  console.log('[additionalQuestion] additionalQuestion retrieved:', detaildata);
        //    console.log('[additionalQuestion] detaildata?.houseType:', detaildata?.houseType);
        //   console.log('[additionalQuestion] additionalQuestion houseInfo:', houseInfo);
        return {
          detaildata: detaildata,
          returndata: true
        }
      }
    } catch (error) {
      setTimeout(() => {
        ////console.log(error ? error : 'error');
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

  useEffect(() => {
    dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: [] }));
  }, []);

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {
              const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
              dispatch(setChatDataList(newChatDataList));

              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      closeOnPressBack={false}
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 340,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >취득하실 주택 외에{'\n'}보유 주택수를 입력해주세요.</ModalTitle>
          <ModalSubTitle>단, 기준시가 1억원 이하 주택은{'\n'}보유 주택수에서 제외해주세요.</ModalSubTitle>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: 206,
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (HouseCount > 0) {
                  setHouseCount(HouseCount - 1);
                } else if (HouseCount === 0) {
                  setHouseCount(0);
                }
                if (HouseCount < 0) {
                  setHouseCount(HouseCount + 1);
                }
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#E8EAED',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MinusIcon />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Pretendard-Bold',
                color: '#1B1C1F',
                lineHeight: 20,
                marginHorizontal: 10,
              }} >
              {HouseCount}채
            </Text>

            <TouchableOpacity
              onPress={() => {
                setHouseCount(HouseCount + 1);
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#E8EAED',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PlusIcon />
            </TouchableOpacity>
          </View>
        </ModalInputSection>
        <ButtonSection
          style={{
            justifyContent: 'center',
          }}>
          <DropShadow
            style={{
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              alignSelf: 'center',
            }}>
            <ModalButton
              onPress={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                const ownHouseCnt = HouseCount;
                if (canProceed) {


                  actionSheetRef.current?.hide();
                  const chat = {
                    id: 'OwnHouseCountSystem',
                    type: 'system',
                    message: '보유한 주택은 몇 채인가요?',
                    questionId: 'HouseCount',
                    progress: 5,
                  };
                  const chat1 = {
                    id: 'ownConfirmOK2',
                    type: 'my',
                    message: `${HouseCount}채`,
                    questionId: 'HouseCount',
                   };
                 /* const chat2 = {
                    id: 'palnSale',
                    type: 'system',
                    progress: 6,
                    questionId: 'Q_0007',
                    message:
                      '종전주택 양도 계획에 따라취득세가 다르게 산출될 수 있어요.\n종전주택 양도 계획이 있나요?',
                    select: [
                      {
                        id: 'planSaleYes',
                        name: '3년 이내 양도 계획',
                        select: ['getInfoDone', 'getInfoConfirm'],
                        answer: '01'
                      },
                      {
                        id: 'planSaleNo',
                        name: '양도 계획 없음',
                        select: ['getInfoDone', 'getInfoConfirm'],
                        answer: '02'
                      },
                    ],
                  };*/

                  const chat4 = acquisitionTax.find(el => el.id === 'getInfoDone');
                  const chat5 = acquisitionTax.find(el => el.id === 'getInfoConfirm');
                  const additionalQuestion = await getadditionalQuestion('', '', houseInfo?.houseId, houseInfo?.buyDate, houseInfo?.acAmount);
                  // console.log('additionalQuestion', additionalQuestion);
                  let chat3;
                  if (additionalQuestion.returndata) {
                    if (additionalQuestion.detaildata?.hasNextQuestion === true) {
                      if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0007') {
                        let chatIndex = acquisitionTax.findIndex(el => el.id === 'additionalQuestion');
                        if (chatIndex !== -1) {
                          chat3 = {
                            ...acquisitionTax[chatIndex],
                            message: additionalQuestion.detaildata?.nextQuestionContent,
                            questionId: additionalQuestion.detaildata?.nextQuestionId,
                            select: acquisitionTax[chatIndex].select.map(item => ({
                              ...item,
                              name: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0].answerContent : additionalQuestion?.detaildata?.answerSelectList[1].answerContent,
                              answer: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0].answerValue : additionalQuestion?.detaildata?.answerSelectList[1].answerValue,
                              //  select: ['getInfoDone', 'getInfoConfirm'],
                            }))
                          };
                          setTimeout(() => {
                            dispatch(setHouseInfo({ ...houseInfo, ownHouseCnt: ownHouseCnt, isOwnHouseCntRegist: true }));
                          }, 300);
                        }
                        dispatch(
                          setChatDataList([
                            ...chatDataList,
                            chat,
                            chat1,
                            chat3
                          ])
                        );
                      }

                    } else {
                      if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {
                        setTimeout(() => {
                          dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: [], ownHouseCnt: ownHouseCnt, isOwnHouseCntRegist: true }));
                        }, 300);
                      }
                      dispatch(
                        setChatDataList([
                          ...chatDataList,
                          chat,
                          chat1,
                          chat4,
                          chat5
                        ])
                      );

                    }

                  } else {
                    setTimeout(() => {
                      dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: [], ownHouseCnt: ownHouseCnt, isOwnHouseCntRegist: true }));
                    }, 300);
                    const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                    dispatch(setChatDataList(newChatDataList));
                  }




                } else {
                  const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                  dispatch(setChatDataList(newChatDataList));
                  actionSheetRef.current?.hide();
                }
              }}
              style={{
                width: width - 120,
                alignSelf: 'center',
                marginTop: 10,
                marginBottom: 50,
              }}>
              <ModalButtonText >다음으로</ModalButtonText>
            </ModalButton>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default OwnHouseCountSheet;
