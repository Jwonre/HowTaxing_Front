// 양도 소득세 대화 페이지

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  Linking,
  Animated,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import { Modalize } from 'react-native-modalize';
import DropShadow from 'react-native-drop-shadow';
import getFontSize from '../../utils/getFontSize';
import { gainTax } from '../../data/chatData';
import { HOUSE_TYPE } from '../../constants/colors';
import { SheetManager } from 'react-native-actions-sheet';
import Toast from 'react-native-root-toast';
import CTACard from '../../components/CTACard';
import InfoIcon from '../../assets/icons/info_tooltip_ico.svg';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import HouseInfo from '../../components/HouseInfo';
import Clipboard from '@react-native-clipboard/clipboard';
import Config from 'react-native-config'

// Icons
import PencilIcon from '../../assets/icons/pencil.svg';
import CloseIcon from '../../assets/icons/close_button.svg';
import EditIcon from '../../assets/icons/edit.svg';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setChatDataList } from '../../redux/chatDataListSlice';
import TaxCard2 from '../../components/TaxCard2';
import TaxInfoCard2 from '../../components/TaxInfoCard2';
import CalculationWarningCard from '../../components/CalculationWarning';
import { setHouseInfo, clearHouseInfo } from '../../redux/houseInfoSlice';
import ownHouseListSlice, { setOwnHouseList } from '../../redux/ownHouseListSlice';
import dayjs from 'dayjs';

const Container = styled.View`
  flex: 1;
  background-color: #FFF;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #e8eaed;
`;

const ProgressBar = styled(Animated.View)`
  width: 33.3%;
  height: 5px;
  border-top-right-radius: 2.5px;
  border-bottom-right-radius: 2.5px;
`;

const ChatItem = styled(Animatable.View)`
  width: 100%;
  height: auto;
  padding: 10px 20px;
`;

const Avatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  background-color: '#F0F3F8';
`;

const ChatBubble = styled.View`
  width: 80%;
  height: auto;
  border-radius: 10px;
  background-color: #f0f3f8;
  align-items: flex-start;
  justify-content: center;
  padding: 15px 25px;
  margin-bottom: 10px;
  margin-top: 8px;
`;

const ChatBubbleText = styled.Text`
  font-size: 14px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 25px;
  letter-spacing: -0.5px;
`;

const SelectButtonGroup = styled.View`
  width: 100%;
  margin-top: 15px;
`;

const SelectButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const SelectButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 20px;
  margin-left: 8px;
`;

const MyChatItem = styled.View`
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 0 25px;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const MyChatBubble = styled.View`
  width: auto;
  height: auto;
  border-radius: 10px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
`;

const MyChatBubbleText = styled.Text`
  font-size: 14px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 24px;
  text-align: center;
`;

const EditButton = styled.Pressable.attrs(props => ({
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #f0f3f8;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: -10px;
`;

const Card = styled(Animatable.View).attrs(props => ({
  animation: 'fadeInUp',
}))`
  width: ${props => props.width - 40}px;
  height: auto;
  padding: 20px 25px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
`;

const ProfileAvatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: center;
  margin: 15px 0;
`;

const ProfileName = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
`;

const ProfileEmail = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
  margin-top: 5px;
  text-align: center;
`;

const KakaoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2F87FF;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const KakaoButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-bold;
  color: #fff;
  line-height: 20px;
`;

const SocialButtonIcons = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 22px;
  height: 20px;
  margin-right: 16px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  align-self: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
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


const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;



const GainsTaxChat = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const modalizeRef = useRef(null);
  const flatlistRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const chatDataList = useSelector(state => state.chatDataList.value);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useSelector(state => state.currentUser.value);
  const [hasShownGoodbye, setHasShownGoodbye] = useState(false);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isConnected, setIsConnected] = useState(true);
  const [Pdata, setPData] = useState({});
  const [currentItem, setCurrentItem] = useState(null);
  const ownHouseList = useSelector(state => state.ownHouseList.value);

  useEffect(() => {
    console.log('ownHouseList', ownHouseList);
  }, [ownHouseList])

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
      //console.log('response.data', response.data);
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




  const processItem = async (chatList, item, item2) => {
    if (item2?.select) {
      for (const item3 of item2.select) {
        // console.log('item2.select', item2.select);
        if (item?.questionId === 'Q_0006') {
          if (item2?.answer) {
            //   console.log('q_0006, item2.answer', item2.answer);
            let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
            //console.log('tempadditionalAnswerList1.Q_0006', tempadditionalAnswerList.some(item => 'Q_0006' in item));
            let foundIndex = tempadditionalAnswerList.findIndex(item => 'Q_0006' in item);
            if (foundIndex !== -1) {
              // console.log('tempadditionalAnswerList[foundIndex][Q_0006]', tempadditionalAnswerList[foundIndex]['Q_0006']);
              //console.log('item2.answer', item2.answer);
              if (tempadditionalAnswerList[foundIndex]['Q_0006'] !== item2.answer) {
                // 불변성을 유지하면서 Q_0006 값을 변경
                tempadditionalAnswerList = [
                  ...tempadditionalAnswerList.slice(0, foundIndex),
                  { ...tempadditionalAnswerList[foundIndex], 'Q_0006': item2.answer },
                  ...tempadditionalAnswerList.slice(foundIndex + 1)
                ];
              }
              //console.log('tempadditionalAnswerList[foundIndex][Q_0006]', tempadditionalAnswerList[foundIndex]['Q_0006']);
              dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
            } else {
              dispatch(
                setHouseInfo({
                  ...houseInfo,
                  additionalAnswerList: [
                    ...(houseInfo.additionalAnswerList || []),
                    { "Q_0006": item2.answer }
                  ]
                })
              );
            }
          }
        }
        let el = gainTax.find(el => el.id === item3);
        if (el) chatList.push(el);

      }

    }
  }

  const processItem2 = async (chatList, index, item, item2) => {
    if (item) {
      if (item.questionId && item2.answer) {
        if (item.id === 'additionalQuestion' && item.questionId === 'Q_0008') {

          //console.log('q_0008, item2.answer', item2.answer);
          let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
          //console.log('tempadditionalAnswerList1.Q_0008', tempadditionalAnswerList.some(item => 'Q_0008' in item));
          let foundIndex = tempadditionalAnswerList.findIndex(item => 'Q_0008' in item);
          if (foundIndex !== -1) {
            // console.log('tempadditionalAnswerList[foundIndex][Q_0008]', tempadditionalAnswerList[foundIndex]['Q_0008']);
            //   console.log('item2.answer', item2.answer);
            if (tempadditionalAnswerList[foundIndex]['Q_0008'] !== item2.answer) {
              // 불변성을 유지하면서 Q_0006 값을 변경
              tempadditionalAnswerList = [
                ...tempadditionalAnswerList.slice(0, foundIndex),
                { ...tempadditionalAnswerList[foundIndex], 'Q_0008': item2.answer },
                ...tempadditionalAnswerList.slice(foundIndex + 1)
              ];
            }
            //console.log('tempadditionalAnswerList[foundIndex][Q_0001]', tempadditionalAnswerList[foundIndex]['Q_0001']);
            dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                additionalAnswerList: [
                  ...(houseInfo.additionalAnswerList || []),
                  { "Q_0008": item2.answer }
                ]
              })
            );
          }


          const additionalQuestion = await getadditionalQuestion('Q_0008', item2.answer, houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
          //   console.log('additionalQuestion', additionalQuestion);
          let chat7;
          let chat11;
          const chat9 = gainTax.find(el => el.id === 'ExpenseInquiry');
          const chat10 = gainTax.find(el => el.id === 'ExpenseAnswer');
          if (additionalQuestion.returndata) {
            if (additionalQuestion.detaildata?.hasNextQuestion) {
              if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0004') {
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
                //     console.log('additionalQuestion2', additionalQuestion2);
                if (additionalQuestion2.returndata) {
                  if (additionalQuestion2.detaildata?.hasNextQuestion) {
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
                  chatList.push(chat7, chat11);
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
                }
                //    console.log('chatDataList', chatDataList);

                /*setTimeout(() => {
                  dispatch(
                    setChatDataList([
                      ...chatDataList,
                      chat7,
                      chat11
                    ])
                  );
                }, 500);*/

              }

            } else {
              if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {
                chatList.push(chat9, chat10);
              }
              /*  dispatch(
                  setChatDataList([
                    ...chatDataList,
                    chat9,
                    chat10
                  ])
                );*/

            }
          }
        } else if (item.id === 'additionalQuestion' && item.questionId === 'Q_0001') {

          //  console.log('q_0001, item2.answer', item2.answer);
          let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
          //console.log('tempadditionalAnswerList1.Q_0001', tempadditionalAnswerList.some(item => 'Q_0001' in item));
          let foundIndex = tempadditionalAnswerList.findIndex(item => 'Q_0001' in item);
          if (foundIndex !== -1) {
            //console.log('tempadditionalAnswerList[foundIndex][Q_0001]', tempadditionalAnswerList[foundIndex]['Q_0001']);
            //console.log('item2.answer', item2.answer);
            if (tempadditionalAnswerList[foundIndex]['Q_0001'] !== item2.answer) {
              // 불변성을 유지하면서 Q_0006 값을 변경
              tempadditionalAnswerList = [
                ...tempadditionalAnswerList.slice(0, foundIndex),
                { ...tempadditionalAnswerList[foundIndex], 'Q_0001': item2.answer },
                ...tempadditionalAnswerList.slice(foundIndex + 1)
              ];
            }
            //console.log('tempadditionalAnswerList[foundIndex][Q_0001]', tempadditionalAnswerList[foundIndex]['Q_0001']);
            dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                additionalAnswerList: [
                  ...(houseInfo.additionalAnswerList || []),
                  { "Q_0001": item2.answer }
                ]
              })
            );
          }


          const additionalQuestion = await getadditionalQuestion('Q_0001', item2.answer, houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
          //console.log('additionalQuestion', additionalQuestion);
          let chat7;
          let chat11;
          const chat9 = gainTax.find(el => el.id === 'ExpenseInquiry');
          const chat10 = gainTax.find(el => el.id === 'ExpenseAnswer');
          if (additionalQuestion.returndata) {
            if (additionalQuestion.detaildata?.hasNextQuestion) {
              if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0008') {
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
                    }))
                  };

                }
                chatList.push(chat7);
                /*dispatch(
                  setChatDataList([
                    ...chatDataList,
                    chat7
                  ])
                );*/
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
                //     console.log('additionalQuestion2', additionalQuestion2);
                if (additionalQuestion2.returndata) {
                  if (additionalQuestion2.detaildata?.hasNextQuestion) {
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
                  chatList.push(chat7, chat11);
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
                }
                //    console.log('chatDataList', chatDataList);

                /*setTimeout(() => {
                  dispatch(
                    setChatDataList([
                      ...chatDataList,
                      chat7,
                      chat11
                    ])
                  );
                }, 500);*/

              }
            } else {
              if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {
                chatList.push(chat9, chat10);
              }
              /*   dispatch(
                   setChatDataList([
                     ...chatDataList,
                     chat9,
                     chat10
                   ])
                 );*/
            }
          } else {
            let tempadditionalAnswerList = houseInfo?.additionalAnswerList;
            if (tempadditionalAnswerList) {
              let foundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0008' in item);
              if (foundIndex !== -1) {
                // 불변성을 유지하면서 Q_0008 값을 삭제
                tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== foundIndex);
                dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
              }
            }

            let tempadditionalAnswerList2 = houseInfo?.additionalAnswerList;
            if (tempadditionalAnswerList2) {
              let foundIndex = tempadditionalAnswerList2?.findIndex(item => 'Q_0004' in item);
              if (foundIndex !== -1) {
                // 불변성을 유지하면서 Q_0004 값을 삭제
                tempadditionalAnswerList2 = tempadditionalAnswerList2.filter((_, index) => index !== foundIndex);
                dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList2 }));
              }
            }
          }
        }
      }


    }
  }

  const processItem0 = async (chatDataList, myChatItem) => {


    //console.log('test_houseInfo', houseInfo)
    const additionalQuestion = await getadditionalQuestion('', '', houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
    //console.log('additionalQuestion', additionalQuestion);
    //console.log('additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue', additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue);
    //console.log('additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent', additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent);

    let chat7;
    let chat11;
    const chat9 = gainTax.find(el => el.id === 'ExpenseInquiry');
    const chat10 = gainTax.find(el => el.id === 'ExpenseAnswer');
    if (additionalQuestion.returndata) {
      if (additionalQuestion.detaildata?.hasNextQuestion) {
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
              myChatItem,
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
            if (additionalQuestion2.detaildata?.hasNextQuestion) {
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
              myChatItem,
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
              myChatItem,
              chat7
            ])
          );

        }

      } else {
        if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {
          //console.log('test_houseInfo 1 ', houseInfo)
          //console.log('test_houseInfo 1_1', houseInfo.ownerCnt)

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
            myChatItem,
            chat9,
            chat10
          ])
        );

      }
    } else {
      //console.log('test_houseInfo 2', houseInfo)
      //console.log('test_houseInfo 2_1', houseInfo.ownerCnt)

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


  const getOwnlist = async () => {
    var gain = '02';
    const url = `${Config.APP_API_URL}house/list?calcType=${gain}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    await axios
      .get(url, { headers: headers })
      .then(response => {
        // ////console.log('[getOwnlist]response:', response.data);
        const result = response.data;
        const list = result.data.list === undefined ? null : result.data.list;
        if (result.isError) {
          Alert.alert('검색 결과가 없습니다.');
          return;
        }
        console.log('[getOwnlist]list:', list);
        dispatch(
          setOwnHouseList([
            ...list,
          ]),
        );
      })
      .catch(function (error) {
        ////console.log(error);
      });
  };

  const handleBackPress = () => {
    SheetManager.show('info', {
      payload: {
        type: 'backHome',
        message: '첫 화면으로 돌아가시겠어요?',
        navigation: navigation,
      },
    });
    return true;
  }

  useEffect(() => {
    if (currentItem?.id === 'cta2') {
      getTaxCard2Info();
    }
  }, [currentItem]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [handleBackPress])
  );

  const getTaxCard2Info = async () => {
    const data = {
      houseId: houseInfo.houseId === undefined ? '' : houseInfo.houseId,
      sellContractDate: dayjs(houseInfo.sellContractDate).format('YYYY-MM-DD') === undefined ? '' : dayjs(houseInfo.sellContractDate).format('YYYY-MM-DD'),
      sellDate: dayjs(houseInfo.sellDate).format('YYYY-MM-DD') === undefined ? '' : dayjs(houseInfo.sellDate).format('YYYY-MM-DD'),
      sellPrice: houseInfo.sellAmount === undefined ? '' : houseInfo.sellAmount,
      necExpensePrice: houseInfo.necessaryExpense === undefined ? '' : houseInfo.necessaryExpense,
      isWWLandLord: houseInfo.isLandlord === undefined ? '' : houseInfo.isLandlord,
      userProportion: houseInfo.userProportion === undefined ? '' : houseInfo.userProportion,
      ownerCnt: houseInfo.ownerCnt === undefined ? '' : houseInfo.ownerCnt,
      //stayPeriodYear : houseInfo.livePeriodYear === undefined ? '' : houseInfo.livePeriodYear,
      //stayPeriodMonth : houseInfo.livePeriodMonth === undefined ? '' : houseInfo.livePeriodMonth,
      //additionalAnswer : null,
      additionalAnswerList: houseInfo.additionalAnswerList === undefined ? [] : houseInfo.additionalAnswerList
      //planAnswer : houseInfo.planAnswer === undefined ? '' : houseInfo.planAnswer
    };

    //console.log('test_houseInfo', data);

    console.log('양도소득세 파라미터 data:', data);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    axios
      .post(`${Config.APP_API_URL}calculation/sellResult`, data, { headers: headers })
      .then(response => {

        console.log('양도소득세 계산 중:', response.data);
        // 성공적인 응답 처리

        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '양도소득세 계산 중 오류가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
              closeSheet: true,
              navigation: navigation,
              buttontext: '확인하기',
            },
          });
          //  ////console.log('양도소득세 결과', response.data);
        } else {
          const data = response.data.data;
          //  ////console.log('양도소득세 결과', data);
          setPData(data);
          // dispatch(setHouseInfo({ ...houseInfo, ...data.list[0] }));
        }


      })
      .catch(error => {
        // 오류 처리
        SheetManager.show('info', {
          payload: {
            type: 'error',
            message: '양도소득세 계산 중 오류가 발생했습니다.',
            description: '양도소득세 계산 중 오류가 발생했습니다. 원하시면 주택\n전문 세무사와 상담을 연결시켜드릴게요. 아래 상담하\n기 버튼을 눌러보세요.',
            id: 'calculation',
            closeSheet: true,
            navigation: navigation,
            buttontext: '확인하기',
          },
        });
        console.error(error);
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
            dispatch(clearHouseInfo());
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '양도소득세 계산하기',
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

  useEffect(() => {
    const helloChatItem = gainTax.find(el => el.id === 'hello');
    const typeChatItem = gainTax.find(el => el.id === 'type');

    dispatch(setChatDataList([helloChatItem, typeChatItem]));
  }, []);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        setIsEditing(false);
      }, 200);
      return;
    }

    if (chatDataList?.length > 0) {
      if (chatDataList[chatDataList.length - 1]?.type === 'system') {
        const progressValue = chatDataList[chatDataList.length - 1]?.progress;
        Animated.timing(progress, {
          toValue: progressValue,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
    if (chatDataList[chatDataList.length - 1]?.id !== 'cta2') {
      setTimeout(() => {
        flatlistRef.current?.scrollToEnd({
          animated: true,
          duration: 600,
        });
      }, 500);
    }
  }, [chatDataList]);

  const renderMyChatItem = ({ item, index }) => {
    //console.log('test  item', item);
    if (item?.openSheet) {
      SheetManager.show(item.openSheet, {
        payload: {
          navigation: navigation,
          isGainsTax: true,
          index,
        },
      });
    }

    return (
      <>
        <MyChatItem>
          <MyChatBubble>
            <MyChatBubbleText >
              {item?.message === '확인하기' ||
                item?.message === '보유 주택 확인하기'
                ? '확인 완료'
                : item?.message}
            </MyChatBubbleText>
            {(
              <EditButton
                onPress={() => {
                  setIsEditing(true);
                  const newChatDataList = chatDataList.slice(0, index);
                  dispatch(setChatDataList(newChatDataList));
                }}>
                <PencilIcon />
              </EditButton>
            )}
          </MyChatBubble>
        </MyChatItem>
        {item?.id === 'getInfoConfirmOK' && (
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
              disabled={index < chatDataList.length - 1}
              onPress={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {
                  if (houseInfo?.additionalAnswerList) {
                    if (houseInfo?.additionalAnswerList !== null) {
                      const newAdditionalAnswerList = houseInfo?.additionalAnswerList.map(item => {
                        let key = Object.keys(item)[0];
                        let value = item[key];
                        return { "questionId": key, "answerValue": value };
                      });
                      dispatch(
                        setHouseInfo({
                          ...houseInfo,
                          additionalAnswerList: newAdditionalAnswerList
                        })
                      );
                    }
                  }

                  const chat1 = {
                    id: 'calulating',
                    type: 'system',
                    message:
                      '계산하는 중이에요.\n서비스를 종료하지 마시고, 조금만 기다려주세요.',
                    progress: 10,
                  };
                  dispatch(setChatDataList([chat1]));
                  setTimeout(() => {
                    const chatItem = {
                      id: 'cta2',
                      type: 'system',
                      progress: 10,
                    };
                    dispatch(setChatDataList([chatItem]));
                  }, 3000);
                }
              }}
              style={{
                width: width - 40,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 40,
              }}>
              <ModalButtonText >계산하기</ModalButtonText>
            </ModalButton>
          </DropShadow>
        )}
        {item?.id === 'ownConfirmOK' && (
          <View
            style={{
              width: width - 40,
              height: 'auto',
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 20,
              borderWidth: 1,
              borderColor: '#2F87FF',
              borderRadius: 10,
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    width: 'auto',
                    height: 22,
                    overflow: 'hidden',
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === houseInfo?.houseType,
                    )?.color,
                    borderRadius: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 5,
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
                  <Text

                    style={{
                      fontSize: 11,
                      fontFamily: 'Pretendard-Medium',
                      color: '#fff',
                      lineHeight: 13,
                      letterSpacing: -0.5,
                    }}>
                    {
                      HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)
                        ?.name
                    }
                  </Text>
                  {houseInfo?.houseType !== '3' && houseInfo?.isMoveInRight &&
                    <Text style={{
                      fontSize: 9,
                      fontFamily: 'Pretendard-Medium',
                      color: '#fff',
                      lineHeight: 13,
                      letterSpacing: -0.5,
                    }}>
                      {'(입주권)'}
                    </Text>
                  }
                </View>
                {/*(houseInfo?.houseType !== '3' && houseInfo?.isMoveInRight) && <View
                  style={{
                    width: 'auto',
                    height: 22,
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === (houseInfo.isMoveInRight  ? 'isMoveInRight' : ''),
                    )?.color,
                    borderRadius: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 5,
                    paddingHorizontal: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Pretendard-Medium',
                      color: '#fff',
                      lineHeight: 13,
                      letterSpacing: -0.5,
                    }}>
                    {
                      HOUSE_TYPE.find(el => el.id === (houseInfo.isMoveInRight  ? 'isMoveInRight' : ''))
                        ?.name
                    }
                  </Text>
                </View>*/}
                <View
                  style={{
                    width: 'auto',
                    height: 22,
                    backgroundColor: '#2F87FF',
                    borderRadius: 11,
                    alignItems: 'center',
                    justifyContent: 'center',

                    paddingHorizontal: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Pretendard-Medium',
                      color: '#fff',
                      lineHeight: 13,
                      letterSpacing: -0.5,
                    }} >
                    양도예정
                  </Text>
                </View>
              </View>
              <View style={{ height: 'auto', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{
                  width: '60%',
                  flexDirection: 'column',
                  alignContent: 'left',
                  alignItems: 'left',
                  marginRight: '5%',
                }}>
                  <Text ellipsizeMode='tail' numberOfLines={1}
                    style={{
                      fontSize: 15,
                      fontFamily: 'Pretendard-Bold',
                      color: '#1B1C1F',
                      lineHeight: 20,
                      letterSpacing: -0.5,
                      marginTop: 10,
                      flex: 1, textAlign: 'left',
                    }} >
                    {houseInfo?.houseName}
                  </Text>
                  <Text ellipsizeMode='tail' numberOfLines={1}
                    style={{
                      fontSize: 13,
                      fontFamily: 'Pretendard-Regular',
                      marginTop: 4,
                      flex: 1, textAlign: 'left',
                    }}>
                    {houseInfo?.detailAdr}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      //  ////console.log('gain houseinfo', houseInfo);
                      navigation.push(
                        'HouseDetail',
                        {
                          prevSheet: 'GainsTaxChat',
                          item: houseInfo,
                        },
                        'HouseDetail',
                      );
                    }
                  }}
                  activeOpacity={0.8}
                  style={{
                    width: '35%',
                    height: 32,
                    borderRadius: 20,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#E8EAED',
                  }}>
                  <Text

                    style={{
                      fontSize: 13,
                      fontFamily: 'Pretendard-Regular',
                      color: '#717274',
                      lineHeight: 20,
                      letterSpacing: -0.5,
                    }}>
                    자세히 보기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  const renderSystemChatItem = ({ item, index }) => {
    if (item?.id === 'cta2') {
      setCurrentItem(item);
    }


    // ////console.log('renderSystemChatItem item', item.id);
    if (item?.id === 'goodbye' && !hasShownGoodbye) {
      setHasShownGoodbye(true);
      setTimeout(() => {
        SheetManager.show('review', {
          payload: {
            questionId: 'goodbye',
            navigation: navigation,
            prevSheet: 'GainsTaxChat',
          },
        });
      }, 1000);

    }



    if (item?.id === 'cta2') {

      return (
        <View
          style={{
            padding: 20,
          }}>
          <CTACard houseInfo={houseInfo} Pdata={Pdata ? Pdata : null} IsGainTax={true} />
          <HouseInfo reservationYn={'N'} item={houseInfo} navigation={navigation} ChatType='GainsTaxChat' />
          <TaxCard2 navigation={navigation} Pdata={Pdata} />
          <CalculationWarningCard />
          <TaxInfoCard2 Pdata={Pdata} />
          <ButtonSection>
            <DropShadow
              style={{
                shadowColor: '#fff',
              }}>
              <ModalButton
                disabled={index < chatDataList.length - 1}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    if (Pdata.calculationResultTextData !== null) {
                      Clipboard.setString(Pdata.calculationResultTextData);
                      let toast = Toast.show('복사하였습니다.', {
                        duration: Toast.durations.LONG,
                        position: 100,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                      });
                      setTimeout(function () {
                        Toast.hide(toast);
                      }, 3000);

                    }
                  }
                }}
                style={{
                  width: (width - 50) / 2,
                  alignSelf: 'center',
                  marginTop: 10,
                  marginRight: 10,
                  backgroundColor: '#fff',
                  borderColor: '#E8EAED',
                  borderWidth: 1, // borderWidth를 추가했습니다
                }}>
                <ModalButtonText style={{
                  color: '#717274',
                }} >복사하기</ModalButtonText>
              </ModalButton>
            </DropShadow>
            <DropShadow>
              <ModalButton
                disabled={index < chatDataList.length - 1}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    const googByeItem = gainTax.find(el => el.id === 'goodbye');
                    dispatch(setChatDataList([googByeItem]));
                    dispatch(clearHouseInfo());
                  }
                }}
                style={{
                  width: (width - 50) / 2,
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <ModalButtonText >확인하기</ModalButtonText>
              </ModalButton>
            </DropShadow>
          </ButtonSection>
        </View>
      );
    } else {
      return (
        <>
          <ChatItem
            animation="fadeInUp"
            isLast={chatDataList.length - 1 === index}>
            <Avatar
              source={
                require('../../assets/images/manAvatar.png')
              }
            />
            <ChatBubble style={{ width: '80%' }}>
              <View style={{
                width: '105%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <ChatBubbleText >{item?.message}</ChatBubbleText>
                {(item?.id === 'landlord1' || item?.id === 'landlord2') && <TouchableOpacity
                  activeOpacity={0.8}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                  <InfoIcon
                    onPress={() => {
                      SheetManager.show('infoExpense', {
                        payload: {
                          Title: "상생임대인제도",
                          Description: "임대차 가격 인상 자제 유도 및 양도세 실거주\n의무 충족을 위한 자가 이주 과정에서의 연\n쇄적 임차인 퇴거 방지를 위해 임대료를 일정\n기준 이하로 올리는 임대인에게 혜택을 제공\n하는 제도, 그 제도에 따른 임대인을 의미해요.\n\n아래 조건들에 해당할 때 해당 제도를 활용할\n수 있어요.",
                          Detail: "① 신규(갱신) 임대차계약의 임대보증금 또는 임대료\n 증가율이 직전 임대차계약 대비 5% 이하일 것\n② 신규(갱신) 임대차계약이\n2021.12.20~2024.12.31사이에 체결되었을 것\n③ 직전 임대차계약에 따른 임대기간이 1년 6개월\n이상일 것\n④ 신규(갱신) 임대차계약에 따른 임대기간이 2년\n이상일 것",
                          height: 580,
                        },
                      });
                    }}
                  />
                </TouchableOpacity>
                }
                {(item?.id === 'additionalQuestion' && item?.questionId === 'Q_0006') && <TouchableOpacity
                  activeOpacity={0.8}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                  <InfoIcon
                    onPress={() => {
                      SheetManager.show('infoExpense', {
                        payload: {
                          Title: "상생임대인제도",
                          Description: "임대차 가격 인상 자제 유도 및 양도세 실거주\n의무 충족을 위한 자가 이주 과정에서의 연\n쇄적 임차인 퇴거 방지를 위해 임대료를 일정\n기준 이하로 올리는 임대인에게 혜택을 제공\n하는 제도, 그 제도에 따른 임대인을 의미해요.\n\n아래 조건들에 해당할 때 해당 제도를 활용할\n수 있어요.",
                          Detail: "① 신규(갱신) 임대차계약의 임대보증금 또는 임대료\n 증가율이 직전 임대차계약 대비 5% 이하일 것\n② 신규(갱신) 임대차계약이\n2021.12.20~2024.12.31사이에 체결되었을 것\n③ 직전 임대차계약에 따른 임대기간이 1년 6개월\n이상일 것\n④ 신규(갱신) 임대차계약에 따른 임대기간이 2년\n이상일 것",
                          height: 580,
                        },
                      });
                    }}
                  />
                </TouchableOpacity>
                }

              </View>
              {item?.select && (
                <SelectButtonGroup>
                  {item?.select.map((item2, index2) => (
                    <SelectButton
                      disabled={index < chatDataList.length - 1}
                      key={index2}
                      onPress={async () => {
                        const state = await NetInfo.fetch();
                        const canProceed = await handleNetInfoChange(state);
                        if (canProceed) {
                          console.log('houseInfo', houseInfo);
                          const myChatItem = {
                            id: item?.id + item2.id,
                            type: 'my',
                            message: item2.name,
                          };

                          const chatList = [];
                          console.log('item', item);
                          console.log('item2', item2);
                          console.log('item2.select', item2.select);
                          //console.log('test_houseInfo item', item)
                          //console.log('test_houseInfo item2', item2)
                          //console.log('test_houseInfo item.select', item2.select)

                          await processItem(chatList, item, item2);
                          await processItem2(chatList, index, item, item2);

                          if (item.id === 'cert' && item2.id === 'no') {
                            const sellAmountSystemIndex = chatDataList.findIndex(
                              el => el.id === 'sellAmountSystem',
                            );
                            if (sellAmountSystemIndex > -1) {
                              const newChatDataList = chatDataList.slice(
                                0,
                                sellAmountSystemIndex + 1,
                              );

                              dispatch(setChatDataList(newChatDataList));
                            } else {
                              navigation.push('DirectRegister', {
                                prevChat: 'GainsTaxChat',
                                index: index,
                                certError: false,
                              });
                              //  navigation.replace('GainsTax');
                            }
                          }


                          if (
                            item.id === 'contractDateSystem' ||
                            item.id === 'sellDateSystem' ||
                            item.id === 'sellAmountSystem' ||
                            item.id === 'ExpenseAnswer'
                          ) {
                            //     ////console.log('contractDateSystem');
                          } else if ((item.id === 'residenceperiod' || item.id === 'residenceperiod2') && item2.id === 'directlivePeriod') {
                            //    ////console.log('directlivePeriod');
                          } else if ((item.id === 'jointGain')) {
                            dispatch(
                              setChatDataList([
                                ...chatDataList,
                                myChatItem,
                              ]),
                            );
                          } else {
                            //    ////console.log('chatList', chatList);
                            dispatch(
                              setChatDataList([
                                ...chatDataList,
                                myChatItem,
                                ...chatList,
                              ]),
                            );
                          }


                          //  ////console.log('item2.id : ', item2.id);
                          //  ////console.log('index2 : ', index2);
                          /* if (item2.id == 'landlordY') {
                             dispatch(
                               setHouseInfo({
                                 ...houseInfo,
                                 isLandlord: true,
                               }),
                             );
                           } else if (item2.id == 'landlordN') {
                             dispatch(
                               setHouseInfo({
                                 ...houseInfo,
                                 isLandlord: false,
                               }),
                             );
                           }*/
                          //         ////console.log('landlordhouseInfo',houseInfo)
                          if (item2.id == 'AcquiredhouseY') {
                            dispatch(
                              setHouseInfo({
                                ...houseInfo,
                                isAcquiredhouse: true,
                              }),
                            );
                          } else if (item2.id == 'AcquiredhouseN') {
                            dispatch(
                              setHouseInfo({
                                ...houseInfo,
                                isAcquiredhouse: false,
                              }),
                            );
                          }

                          if (item.id === 'certType' && item.type === 'system') {
                            if (item2.id === 'Nosubscriptionaccount') {
                              getOwnlist();
                            } else if (item2.id === 'KB') {
                              navigation.push('CertificationGains', { data: item2.id, index, isGainsTax: true, currentPageIndex: 0 });
                            } else if (item2.id === 'naver') {
                              navigation.push('CertificationGains', { data: item2.id, index, isGainsTax: true, currentPageIndex: 1 });
                            } else if (item2.id === 'toss') {
                              navigation.push('CertificationGains', { data: item2.id, index, isGainsTax: true, currentPageIndex: 2 });
                            } else if (item2.id === 'kakao') {
                              navigation.push('CertificationGains', { data: item2.id, index, isGainsTax: true, currentPageIndex: 3 });
                            };
                          }
                          //console.log('test_houseInfo item.3', item2.id)
                          //console.log('test_houseInfo item.4', item2.type)
                          //console.log('test_houseInfo item.5', houseInfo)

                          if (item2.id === 'only' && item2.type === 'my') {
                            console.log('only');

                            const updatedHouseInfo = {
                              ...houseInfo,
                              ownerCnt: 1,
                              userProportion: 100,
                            }
                            setTimeout(() => {
                              dispatch(setHouseInfo(updatedHouseInfo));
                            }, 300);

                            await processItem0(chatDataList, myChatItem);
                          };

                          console.log('item2?.openSheet : ', item2?.openSheet)
                          if (item2?.openSheet) {
                            if (item2?.id === 'ok' && item2?.chungYackYn) {
                              SheetManager.show(item2.openSheet, {
                                payload: {
                                  navigation: navigation,
                                  data: item2.id,
                                  isGainsTax: true,
                                  currentPageIndex: item2?.currentPageIndex,
                                  index,
                                  chungYackYn: item2?.chungYackYn,
                                },
                              });
                            } else {
                              SheetManager.show(item2.openSheet, {
                                payload: {
                                  navigation: navigation,
                                  data: item2.id,
                                  isGainsTax: true,
                                  currentPageIndex: item2?.currentPageIndex,
                                  index,
                                },
                              });
                            }
                          }
                        }
                      }
                      }>
                      {item2?.icon ? item2.icon : null}
                      <SelectButtonText >{item2?.name}</SelectButtonText>
                    </SelectButton>
                  ))}
                </SelectButtonGroup>
              )}
              {item?.id === 'getInfoConfirm' && (
                <SelectButton
                  disabled={index < chatDataList.length - 1}
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      console.log('last houseInfo : ', houseInfo);
                      SheetManager.show('confirm2', {
                        payload: {
                          questionId: item?.id,
                          navigation: navigation,
                          index,
                        },
                      });
                    }
                  }}
                  style={{
                    marginTop: 20,
                  }}>
                  <SelectButtonText >확인하기</SelectButtonText>
                </SelectButton>
              )}
            </ChatBubble>
          </ChatItem >
          {item?.id === 'cta' && (
            <>
              <Card
                style={{
                  width: width - 40,
                  alignSelf: 'center',
                }}>
                <ChatBubbleText
                  style={{
                    textAlign: 'center',
                  }} >
                  부동산 전문 세무사에게 상담 받아보세요!
                </ChatBubbleText>
                <ProfileAvatar
                  source={require('../../assets/images/Minjungum_Lee.png')}
                />
                <ProfileName >이민정음 세무사</ProfileName>
                <ProfileEmail >jsyoun@jstaxbiz.com</ProfileEmail>
                <KakaoButton
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      navigation.push('CounselorList', {isGainsTax: true});
                    }
                  }}>
                  <KakaoButtonText >상담 예약하기</KakaoButtonText>
                </KakaoButton>
              </Card>
              <DropShadow
                style={{
                  shadowColor: 'rgba(0,0,0,0.25)',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                }}>
                <Button
                  width={width}
                  style={{
                    marginBottom: 20,
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <ButtonText >돌아가기</ButtonText>
                </Button>
              </DropShadow>
            </>
          )
          }
          {
            item?.id === 'calulating' && (
              <View
                style={{
                  height: height - 320,

                  alignItems: 'center',
                }}>
                <ActivityIndicator
                  size={80}
                  color="#A2C62B"
                  animating
                  style={{
                    marginTop: '30%',
                  }}
                />
              </View>
            )
          }
          {/*item?.id === 'apartmentAddressInfoSystem' && (
            <DropShadow
              style={{
                shadowColor: 'rgba(0,0,0,0.25)',
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                width: '100%',
              }}>
              <HouseInfoCard width={width}>
                <HouseInfoCardTitle>주택 정보</HouseInfoCardTitle>

                <HouseInfoCardSubTitle>
                  {houseInfo?.houseName} {houseInfo?.houseDetailName}
                </HouseInfoCardSubTitle>

                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel>KB시세</HouseInfoListLabel>
                    <QuestionIcon />
                  </View>
                  <HouseInfoListValue>
                    {Number(houseInfo?.kbMktPrice).toLocaleString()}원
                  </HouseInfoListValue>
                </HouseInfoCardListItem>
                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel>공시가격</HouseInfoListLabel>
                    <QuestionIcon />
                  </View>
                  <HouseInfoListValue>
                    {numberToKorean(Number(houseInfo?.pubLandPrice).toString())}원
                  </HouseInfoListValue>
                </HouseInfoCardListItem>
                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel>전용면적</HouseInfoListLabel>
                    <QuestionIcon />
                  </View>
                  <HouseInfoListValue>
                    {houseInfo?.areaMeter}㎡ ({houseInfo?.areaPyung}평)
                  </HouseInfoListValue>
                </HouseInfoCardListItem>
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
                    disabled={index < chatDataList.length - 1}
                    onPress={async () => {
                      // ////console.log('next');
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        SheetManager.show('gain', {
                          payload: {
                            questionId: item?.id,
                            navigation,
                            index,
                          },
                        });
                      }
                    }}
                    style={{
                      width: width - 80,
                      alignSelf: 'center',
                      marginTop: 20,
                    }}>
                    <ModalButtonText>다음으로</ModalButtonText>
                  </ModalButton>
                </DropShadow>
              </HouseInfoCard>
            </DropShadow>
          )*/}
        </>
      );
    }
  };

  return (
    <Container>
      <ProgressSection>
        <ProgressBar
          style={{
            backgroundColor:
              chatDataList[chatDataList.length - 1]?.id === 'cta2' ||
                chatDataList[chatDataList.length - 1]?.id === 'calulating' ||
                chatDataList[chatDataList.length - 1]?.id === 'goodbye'
                ? '#A2C62B'
                : '#2F87FF',
            width: progress.interpolate({
              inputRange: [0, 10],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </ProgressSection>

      <FlatList
        ref={flatlistRef}
        data={chatDataList}
        keyExtractor={(item, index) => {
          return `chat-${index}`;
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>
          item?.type === 'my'
            ? renderMyChatItem({ item, index })
            : renderSystemChatItem({ item, index })
        }
      />
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        modalStyle={{
          width: width - 40,
          alignSelf: 'center',
        }}
        withReactModal
        withHandle={false}>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            modalizeRef.current?.close();
          }}
          style={{
            alignSelf: 'flex-end',
            marginTop: 17,
            marginRight: 17,
          }}>
          <CloseIcon width={12} height={12} />
        </TouchableOpacity>
      </Modalize>
    </Container>
  );
};

export default GainsTaxChat;
