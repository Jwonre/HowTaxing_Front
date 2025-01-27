// 취득세 대화 페이지

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
  BackHandler,
  Linking,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import { Modalize } from 'react-native-modalize';
import DropShadow from 'react-native-drop-shadow';
import { acquisitionTax } from '../../data/chatData';
import { HOUSE_TYPE } from '../../constants/colors';
import { SheetManager } from 'react-native-actions-sheet';
import axios from 'axios';
import numberToKorean from '../../utils/numToKorean';
import NetInfo from "@react-native-community/netinfo";
import dayjs from 'dayjs';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-root-toast';
import Config from 'react-native-config'

// Icons
import PencilIcon from '../../assets/icons/pencil.svg';
import CloseIcon from '../../assets/icons/close_button.svg';
import QuestionIcon from '../../assets/icons/question.svg';
import CTACard from '../../components/CTACard';
import TaxCard from '../../components/TaxCard';
import TaxInfoCard from '../../components/TaxInfoCard';
import HouseInfo from '../../components/HouseInfo';
import EditIcon from '../../assets/icons/edit.svg';
import CalculationWarningCard from '../../components/CalculationWarning';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setHouseInfo, clearHouseInfo } from '../../redux/houseInfoSlice';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import GainsTax from './GainsTax';


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
  line-height: 30px;
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
  background-color: #2f87ff;
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

const SocialButtonIcon = styled.Image.attrs(props => ({
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

const HouseInfoCard = styled.View`
  width: ${props => props.width - 40}px;
  height: auto;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  align-self: center;
  border-radius: 10px;
`;

const HouseInfoCardTitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
  text-align: center;
`;

const HouseInfoCardSubTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  margin-top: 10px;
  margin-bottom: 5px;
  text-align: center;
`;

const HouseInfoCardListItem = styled.View`
  width: 100%;
  height: 55px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 10px;
  border-width: 1px;
  border-color: #e8eaed;
  align-self: center;
  margin-top: 10px;
`;

const HouseInfoListLabel = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 20px;
  margin-right: 5px;
`;

const HouseInfoListValue = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #2f87ff;
  line-height: 20px;
  text-align: right;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

`;


const AcquisitionChat = () => {
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
  const [Pdata, setPData] = useState({});
  const [currentItem, setCurrentItem] = useState(null);

  const onQuestionMarkPress = (type) => {
    //.log('ques');
    SheetManager.show('questionMarkDefinition', {
      payload: {
        type: type,
      },
    });

    return;
  };
  const getOwnlist = async () => {
    var acquisition = '01';
    const url = `${Config.APP_API_URL}house/list?calcType=${acquisition}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
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
              message: response.data.errMsg ? response.data.errMsg : '보유주택을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          const result = response.data;
          const list = result.data.list === undefined ? null : result.data.list;
          // ////console.log('[getOwnlist]list:', list);
          dispatch(
            setOwnHouseList([
              ...list,
            ]),
          );
        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '보유주택을 불러오는데 문제가 발생했습니다.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
      });
  };

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

  const getTaxCardInfo = async () => {
    const params = {
      houseType: houseInfo.houseType === undefined ? '' : houseInfo.houseType,
      houseName: houseInfo.houseName === undefined ? '' : houseInfo.houseName,
      detailAdr: houseInfo.detailAdr === undefined ? '' : houseInfo.detailAdr,
      contractDate: houseInfo.contractDate === undefined ? '' : dayjs(houseInfo.contractDate).format('YYYY-MM-DD'),
      buyDate: houseInfo.buyDate === undefined ? '' : dayjs(houseInfo.buyDate).format('YYYY-MM-DD'),
      buyPrice: houseInfo.acAmount === undefined ? 0 : houseInfo.acAmount,
      pubLandPrice: houseInfo.pubLandPrice === undefined ? 0 : houseInfo.pubLandPrice,
      isPubLandPriceOver100Mil: houseInfo.isPubLandPriceOver100Mil === undefined ? '' : houseInfo.isPubLandPriceOver100Mil,
      roadAddr: houseInfo.roadAddr === undefined ? '' : houseInfo.roadAddr,
      area: houseInfo.area === undefined ? 0 : houseInfo.area,
      isAreaOver85: houseInfo.isAreaOver85 === undefined ? false : houseInfo.isAreaOver85,
      isDestruction: houseInfo.isDestruction === undefined ? false : houseInfo.isDestruction,
      ownerCnt: houseInfo.ownerCnt === undefined ? 0 : houseInfo.ownerCnt,
      userProportion: houseInfo.userProportion === undefined ? 0 : houseInfo.userProportion,
      isMoveInRight: houseInfo.isMoveInRight === undefined ? false : houseInfo.isMoveInRight,
      jibunAddr: houseInfo.jibunAddr === undefined ? '' : houseInfo.jibunAddr,
      //hasSellPlan: houseInfo.planSale === undefined ? '' : houseInfo.planSale,
      isOwnHouseCntRegist: houseInfo.isOwnHouseCntRegist === undefined ? false : houseInfo.isOwnHouseCntRegist,
      ownHouseCnt: houseInfo.ownHouseCnt === undefined ? 0 : houseInfo.ownHouseCnt,
      additionalAnswerList: houseInfo.additionalAnswerList === undefined ? [] : houseInfo.additionalAnswerList
    };
    console.log('taxCard params', params)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`,
    };

    try {
      const response = await axios.post(`${Config.APP_API_URL}calculation/buyResult`, params, { headers });
      console.log('taxCard params', params)
      console.log('response.data', response.data);
      for (let i = 0; i < response.data.data.list.length; i++) {
        console.log('response.data.list[i]', response.data.data.list[i]);
      }

      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '취득세 계산 중 오류가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            closeSheet: true,
            navigation: navigation,
            buttontext: '확인하기',
          },
        });
      } else {
        setPData(response.data.data);
        // dispatch(setHouseInfo({ ...houseInfo, ...response.data.data.list[0] }));
      }
    } catch (error) {
      SheetManager.show('info', {
        payload: {
          type: 'error',
          message: '취득세 계산 중 오류가 발생했습니다.',
          id: 'calculation',
          closeSheet: true,
          navigation: navigation,
          buttontext: '확인하기',
        },
      });
      //console.error(error.stack);
    }
  };

  const getadditionalQuestion = async (questionId, answerValue, houseId, sellDate, sellPrice) => {
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
        sellDate: sellDate ? dayjs(sellDate).format('YYYY-MM-DD') : null,
        sellPrice: sellPrice ? sellPrice : 0,
        ownHouseCnt: houseInfo?.ownHouseCnt ? houseInfo?.ownHouseCnt : 0,
        buyDate: houseInfo?.buyDate ? dayjs(houseInfo?.buyDate).format('YYYY-MM-DD') : null,
        jibunAddr: houseInfo?.jibunAddr ? houseInfo?.jibunAddr : '',
      };
      //console.log('[additionalQuestion] additionalQuestion param:', param);
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
    //console.log('item', item);
    //console.log('item2', item2);
    //console.log('item2?.select', item2?.select);
    if (item2?.select) {
      if (item?.id === 'additionalQuestion') {
        if (item?.questionId === 'Q_0007') {
          let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
          //console.log('tempadditionalAnswerList1.Q_0007', tempadditionalAnswerList.some(item => 'Q_0007' in item));
          let foundIndex = tempadditionalAnswerList.findIndex(item => 'Q_0007' in item);
          //console.log('tfoundIndex', foundIndex);
          if (foundIndex !== -1) {
            //console.log('tempadditionalAnswerList[foundIndex][Q_0007]', tempadditionalAnswerList[foundIndex]['Q_0007']);
            //console.log('item2.answer', item2.answer);
            if (tempadditionalAnswerList[foundIndex]['Q_0007'] !== item2.answer) {
              // 불변성을 유지하면서 Q_0006 값을 변경
              let deletefoundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0009' in item);
              tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== deletefoundIndex);
              let deletefoundIndex2 = tempadditionalAnswerList?.findIndex(item => 'Q_0012' in item);
              tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== deletefoundIndex2);
              let deletefoundIndex3 = tempadditionalAnswerList?.findIndex(item => 'Q_0013' in item);
              tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== deletefoundIndex3);
              tempadditionalAnswerList = [
                ...tempadditionalAnswerList.slice(0, foundIndex),
                { ...tempadditionalAnswerList[foundIndex], 'Q_0007': item2.answer },
                ...tempadditionalAnswerList.slice(foundIndex + 1)
              ];
            }
            //console.log('tempadditionalAnswerList[foundIndex][Q_0007]', tempadditionalAnswerList);
            setTimeout(() => {
              dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
            }, 300);
          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                additionalAnswerList: [
                  ...(houseInfo.additionalAnswerList || []),
                  { "Q_0007": item2.answer }
                ]
              })
            );
          }

        } else if (item?.questionId === 'Q_0009') {
          let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
          //console.log('tempadditionalAnswerList1.Q_0009', tempadditionalAnswerList.some(item => 'Q_0009' in item));
          let foundIndex = tempadditionalAnswerList.findIndex(item => 'Q_0009' in item);
          //console.log('foundIndex', foundIndex);
          if (foundIndex !== -1) {
            //console.log('tempadditionalAnswerList[foundIndex][Q_0009]', tempadditionalAnswerList[foundIndex]['Q_0009']);
            //console.log('item2.answer', item2.answer);
            if (tempadditionalAnswerList[foundIndex]['Q_0009'] !== item2.answer) {
              // 불변성을 유지하면서 Q_0006 값을 변경
              let deletefoundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0012' in item);
              tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== deletefoundIndex);
              tempadditionalAnswerList = [
                ...tempadditionalAnswerList.slice(0, foundIndex),
                { ...tempadditionalAnswerList[foundIndex], 'Q_0009': item2.answer },
                ...tempadditionalAnswerList.slice(foundIndex + 1)
              ];
            }

            //console.log('tempadditionalAnswerList[foundIndex][Q_0009]', tempadditionalAnswerList);
            setTimeout(() => {
              dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
            }, 300);

          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                additionalAnswerList: [
                  ...(houseInfo.additionalAnswerList || []),
                  { "Q_0009": item2.answer }
                ]
              })
            );
          }
        } else if (item?.questionId === 'Q_0012') {
          let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
          //console.log('tempadditionalAnswerList1.Q_0012', tempadditionalAnswerList.some(item => 'Q_0012' in item));
          let foundIndex = tempadditionalAnswerList.findIndex(item => 'Q_0012' in item);
          //console.log('tfoundIndex', foundIndex);
          if (foundIndex !== -1) {
            // console.log('tempadditionalAnswerList[foundIndex][Q_0012]', tempadditionalAnswerList[foundIndex]['Q_0012']);
            //console.log('item2.answer', item2.answer);
            if (tempadditionalAnswerList[foundIndex]['Q_0012'] !== item2.answer) {
              // 불변성을 유지하면서 Q_0006 값을 변경
              tempadditionalAnswerList = [
                ...tempadditionalAnswerList.slice(0, foundIndex),
                { ...tempadditionalAnswerList[foundIndex], 'Q_0012': item2.answer },
                ...tempadditionalAnswerList.slice(foundIndex + 1)
              ];
            }
            //console.log('tempadditionalAnswerList[foundIndex][Q_0012]', tempadditionalAnswerList[foundIndex]['Q_0012']);
            setTimeout(() => {
              dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
            }, 300)

          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                additionalAnswerList: [
                  ...(houseInfo.additionalAnswerList || []),
                  { "Q_0012": item2.answer }
                ]
              })
            );
          }
        } else if (item?.questionId === 'Q_0013') {
          let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
          // console.log('tempadditionalAnswerList1.Q_0013', tempadditionalAnswerList.some(item => 'Q_0013' in item));
          let foundIndex = tempadditionalAnswerList.findIndex(item => 'Q_0013' in item);
          //console.log('tfoundIndex', foundIndex);
          if (foundIndex !== -1) {
            //console.log('tempadditionalAnswerList[foundIndex][Q_0013]', tempadditionalAnswerList[foundIndex]['Q_0013']);
            // console.log('item2.answer', item2.answer);
            if (tempadditionalAnswerList[foundIndex]['Q_0013'] !== item2.answer) {
              // 불변성을 유지하면서 Q_0006 값을 변경
              tempadditionalAnswerList = [
                ...tempadditionalAnswerList.slice(0, foundIndex),
                { ...tempadditionalAnswerList[foundIndex], 'Q_0013': item2.answer },
                ...tempadditionalAnswerList.slice(foundIndex + 1)
              ];
            }
            // console.log('tempadditionalAnswerList[foundIndex][Q_0013]', tempadditionalAnswerList[foundIndex]['Q_0013']);
            setTimeout(() => {
              dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
            }, 300)

          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                additionalAnswerList: [
                  ...(houseInfo.additionalAnswerList || []),
                  { "Q_0013": item2.answer }
                ]
              })
            );
          }
        }
      }
      for (const item3 of item2.select) {
        const foundItem = acquisitionTax.find(el => el.id === item3);
        if (foundItem) {
          chatList.push(foundItem);
        }
      }
    }
  }


  const processItem2 = async (chatList, index, item, item2) => {

    if (item) {
      if (item.questionId && item2.answer) {
        if (item.id === 'additionalQuestion' && item.questionId === 'Q_0007') {
          const additionalQuestion = await getadditionalQuestion('Q_0007', item2.answer, houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
          //console.log('additionalQuestion', additionalQuestion);
          let chat7;
          const chat9 = acquisitionTax.find(el => el.id === 'getInfoDone');
          const chat10 = acquisitionTax.find(el => el.id === 'getInfoConfirm');
          if (additionalQuestion.returndata) {
            if (additionalQuestion.detaildata?.hasNextQuestion) {
              if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0009') {

                let chatIndex = acquisitionTax.findIndex(el => el.id === 'additionalQuestion');
                //  let chatIndex2 = gainTax.findIndex(el => el.id === 'additionalQuestion2');
                if (chatIndex !== -1) {
                  chat7 = {
                    ...acquisitionTax[chatIndex],
                    message: additionalQuestion.detaildata?.nextQuestionContent,
                    questionId: additionalQuestion.detaildata?.nextQuestionId,
                    select: acquisitionTax[chatIndex].select.map(item => ({
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
              } else if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0013') {
                let chatIndex = acquisitionTax.findIndex(el => el.id === 'additionalQuestion');
                //  let chatIndex2 = gainTax.findIndex(el => el.id === 'additionalQuestion2');
                if (chatIndex !== -1) {
                  chat7 = {
                    ...acquisitionTax[chatIndex],
                    message: additionalQuestion.detaildata?.nextQuestionContent,
                    questionId: additionalQuestion.detaildata?.nextQuestionId,
                    select: acquisitionTax[chatIndex].select.map(item => ({
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
        } else if (item.id === 'additionalQuestion' && item.questionId === 'Q_0009') {
          const additionalQuestion = await getadditionalQuestion('Q_0009', item2.answer, houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
          //   console.log('additionalQuestion', additionalQuestion);
          let chat7;
          const chat9 = acquisitionTax.find(el => el.id === 'getInfoDone');
          const chat10 = acquisitionTax.find(el => el.id === 'getInfoConfirm');
          if (additionalQuestion.returndata) {
            if (additionalQuestion.detaildata?.hasNextQuestion) {
              if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0012') {
                let chatIndex = acquisitionTax.findIndex(el => el.id === 'additionalQuestion');
                //  let chatIndex2 = gainTax.findIndex(el => el.id === 'additionalQuestion2');
                if (chatIndex !== -1) {
                  chat7 = {
                    ...acquisitionTax[chatIndex],
                    message: additionalQuestion.detaildata?.nextQuestionContent,
                    questionId: additionalQuestion.detaildata?.nextQuestionId,
                    select: acquisitionTax[chatIndex].select.map(item => ({
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
        } else if (item.id === 'additionalQuestion' && item.questionId === 'Q_0012') {
          const chat9 = acquisitionTax.find(el => el.id === 'getInfoDone');
          const chat10 = acquisitionTax.find(el => el.id === 'getInfoConfirm');
          chatList.push(chat9, chat10);

        } else if (item.id === 'additionalQuestion' && item.questionId === 'Q_0013') {
          const chat9 = acquisitionTax.find(el => el.id === 'getInfoDone');
          const chat10 = acquisitionTax.find(el => el.id === 'getInfoConfirm');
          chatList.push(chat9, chat10);

        }
      }
    }
  }


  const handleBackPress = () => {
    SheetManager.show('info', {
      payload: {
        errorType: 1,
        type: 'backHome',
        message: '첫 화면으로 돌아가시겠어요?',
        navigation: navigation,
      },
    });
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [handleBackPress])
  );

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
      title: 'AI 취득세 계산기',
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
    //////console.log('modalList', modalList);
    const helloChatItem = acquisitionTax.find(el => el.id === 'type');
    dispatch(setChatDataList([helloChatItem]));

  }, []);


  useEffect(() => {
    if (currentItem?.id === 'cta') {
      getTaxCardInfo();
    }
  }, [currentItem]);



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
    if (chatDataList[chatDataList.length - 1]?.id !== 'cta') {
      setTimeout(() => {
        flatlistRef.current?.scrollToEnd({
          animated: true,
          duration: 600,
        });
      }, 500);
    }
  }, [chatDataList]);

  // 나의 챗 버블 렌더링
  const renderMyChatItem = ({ item, index }) => {
    return (
      <>
        <MyChatItem >
          {item?.message !== '보유 주택 확인하기' && <MyChatBubble>
            <MyChatBubbleText >
              {item?.message === '확인하기'
                ? '확인 완료'
                : item?.message}
            </MyChatBubbleText>
            {!((item?.id === 'apartmentAddress' || item?.id === 'ownConfirmOK2') && item?.type === 'my') && (
              <EditButton
                onPress={() => {
                  setIsEditing(true);
                  //////console.log('item?.id', item?.id);
                  //////console.log('item?.type', item?.type);
                  if (item?.id === 'ownConfirmOK' && item?.type === 'my') {
                    var newChatDataList = chatDataList.slice(0, index - 1);
                  } else {
                    var newChatDataList = chatDataList.slice(0, index);
                  }
                  dispatch(setChatDataList(newChatDataList));
                  // console.log('chatDataList last', item?.id);
                  if (item?.id === ('typeapartment' || 'typevilla' || 'typehouse' || 'typeticket') && item?.type === 'my') {
                    dispatch(clearHouseInfo());
                  }


                }}>
                <PencilIcon />
              </EditButton>
            )}
          </MyChatBubble>
          }
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
                    id: 'calculating',
                    type: 'system',
                    progress: 10,
                    message:
                      '계산하는 중이에요.\n서비스를 종료하지 마시고, 조금만 기다려주세요.',
                  };
                  dispatch(setChatDataList([chat1]));
                  setTimeout(() => {
                    const chatItem = {
                      id: 'cta',
                      type: 'system',
                      progress: 10,
                    };
                    dispatch(setChatDataList([chatItem]));
                    flatlistRef.current?.scrollToOffset({
                      offset: 0,
                    });
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

        {(item?.id === 'ownConfirmOK' || item?.id === 'ownConfirmOK2') && (
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
                {/*(houseInfo.houseType !== '3' && houseInfo?.isMoveInRight) && <View
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
                    취득예정
                  </Text>
                </View>
              </View>
              <View style={{ height: 'auto', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{
                  width: '60%',
                  flexDirection: 'column',
                  alignContent: 'left',
                  alignItems: 'left',
                  marginRight: '5%'
                }}>
                  <Text ellipsizeMode='tail' numberOfLines={1}
                    style={{
                      fontSize: 15,
                      fontFamily: 'Pretendard-Bold',
                      color: '#1B1C1F',
                      lineHeight: 30,
                      letterSpacing: -0.5,
                      marginTop: 10,
                      flex: 1,
                      textAlign: 'left'
                    }}>
                    {houseInfo?.houseName}
                  </Text>
                  <Text ellipsizeMode='tail' numberOfLines={1}
                    style={{
                      fontSize: 13,
                      fontFamily: 'Pretendard-Regular',
                      marginTop: 4,
                      flex: 1,
                      textAlign: 'left'
                    }}>
                    {houseInfo?.detailAdr}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      navigation.push(
                        'HouseDetail',
                        {
                          prevSheet: 'AcquisitionChat',
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
                    }} >
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

  // 시스템 챗 버블 렌더링
  const renderSystemChatItem = ({ item, index }) => {
    if (item?.id === 'cta') {
      setCurrentItem(item);
    }

    // ////console.log('renderSystemChatItem item', item.id);
    if (item?.id === 'goodbye' && !hasShownGoodbye) {
      setHasShownGoodbye(true);
      // modalList에 'review'가 없는 경우에만 추가합니다.
      setTimeout(() => {
        SheetManager.show('review', {
          payload: {
            questionId: 'goodbye',
            navigation: navigation,
            prevSheet: 'AcquisitionChat'
          },
        });
      }, 600);

    }

    // CTA
    if (item?.id === 'cta') {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <CTACard houseInfo={houseInfo} navigation={navigation} Pdata={Pdata ? Pdata : null} IsGainTax={false} />
          <HouseInfo reservationYn={'N'} item={houseInfo} navigation={navigation} ChatType='AcquisitionChat' />
          <TaxCard navigation={navigation} Pdata={Pdata ? Pdata : null} />
          <CalculationWarningCard />
          <TaxInfoCard Pdata={Pdata ? Pdata : null} />
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
                    const googByeItem = acquisitionTax.find(
                      el => el.id === 'goodbye',
                    );
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
        </View >
      );
    } else {
      return (
        <>
          <ChatItem
            animation="fadeInUp"
            isLast={chatDataList.length - 1 === index}>
            <Avatar
              source={
                require('../../assets/images/womanAvatar.png')
              }
            />
            <ChatBubble>
              <ChatBubbleText >{item?.message}</ChatBubbleText>
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
                          const myChatItem = {
                            id: item?.id + item2.id,
                            type: 'my',
                            message: item2.name,
                          };

                          const chatList = [];
                          await processItem(chatList, item, item2);
                          await processItem2(chatList, index, item, item2);

                          if (
                            item.id === 'contractDateSystem' ||
                            item.id === 'acquisitionDateSystem' ||
                            item.id === 'aquiAmountSystem' ||
                            item.id === 'apartmentAddressSystem'
                          ) {
                            //////console.log(item.id);
                          } else {
                            // ////console.log(item.id);
                            dispatch(
                              setChatDataList([
                                ...chatDataList,
                                myChatItem,
                                ...chatList,
                              ]),
                            );
                          }
                          /*
                                                  if (item2.id === 'OwnHouseCountresult') {
                                                    const OwnHouseCountresultIndex = chatDataList.findIndex(
                                                      el => el.id === 'getInfoDone',
                                                    );
                                                    const newChatDataList = chatDataList.slice(
                                                      0,
                                                      OwnHouseCountresultIndex + 1,
                                                    );
                          
                                                    dispatch(setChatDataList(newChatDataList));
                                                  }
                          */
                          if (item.id === 'type') {
                            //////console.log('item2?.name', item2?.name);
                            if ((item2?.name === '아파트')) {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  houseType: '1'
                                }));
                            } else if ((item2?.name === '단독주택 · 다가구')) {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  houseType: '4'
                                }));
                            } else if ((item2?.name === '연립 · 다세대')) {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  houseType: '2'
                                }));
                            } else {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  houseType: '3'
                                }));
                            }
                            //  ////console.log('houseType', houseInfo)
                          }


                          if (item.id === 'ticket' && item.type === 'system') {
                            dispatch(
                              setHouseInfo({
                                ...houseInfo,
                                isDestruction:
                                  item2.name === '네'
                                    ? true
                                    : false,
                                isMoveInRight: true,
                              }),
                            );
                          }

                          if (item.id === 'certType' && item.type === 'system') {
                            if (item2.id === 'Nosubscriptionaccount') {
                              getOwnlist();
                            } else if (item2.id === 'KB') {
                              navigation.push('CertificationAcq', { data: item2.id, index, isGainsTax: false, currentPageIndex: 0 });
                            } else if (item2.id === 'naver') {
                              navigation.push('CertificationAcq', { data: item2.id, index, isGainsTax: false, currentPageIndex: 1 });
                            } else if (item2.id === 'toss') {
                              navigation.push('CertificationAcq', { data: item2.id, index, isGainsTax: false, currentPageIndex: 2 });
                            } else if (item2.id === 'kakao') {
                              navigation.push('CertificationAcq', { data: item2.id, index, isGainsTax: false, currentPageIndex: 3 });
                            };
                            /*else if() {
                              
                            };*/
                          }

                          if (item.id === 'pubLandPrice' && item.type === 'system') {
                            if (item2.id === 'yes') {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  isPubLandPriceOver100Mil: true
                                }),);
                            } else {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  isPubLandPriceOver100Mil: false
                                }),);
                            }
                          }


                          if (item.id === 'area' && item.type === 'system') {
                            if (item2.id === 'yes') {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  isAreaOver85: true
                                }),);
                            } else {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  isAreaOver85: false
                                }),);
                            }
                          }


                          if (item.id === 'apartment' && item.type === 'system') {
                            if (item2.id === 'yes') {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  houseType: '1'
                                }),);
                            } else {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  houseType: '1'
                                }),);
                            }
                          }

                          if (item.id === 'palnSale') {
                            if (houseInfo?.isDestruction === undefined && houseInfo?.isMoveInRight === undefined) {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  isDestruction: false,
                                  isMoveInRight: false,
                                }),

                              );
                            }
                          }


                          if (item2.id === 'only' && item2.type === 'my') {
                            const updatedHouseInfo = {
                              ...houseInfo,
                              ownerCnt: 1,
                              userProportion: 100,
                            }
                            setTimeout(() => {
                              dispatch(setHouseInfo(updatedHouseInfo));
                            }, 300);
                          }

                          if (item.id === 'moreHouse' && item2.id === 'no') {
                            if (houseInfo?.isDestruction === undefined && houseInfo?.isMoveInRight === undefined) {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  //   hasSellPlan: false,
                                  isDestruction: false,
                                  isMoveInRight: false,
                                  isOwnHouseCntRegist: true,
                                  ownHouseCnt: 0,
                                  additionalAnswerList: [],
                                }),
                              );
                            } else {
                              dispatch(
                                setHouseInfo({
                                  ...houseInfo,
                                  //   hasSellPlan: false,
                                  isOwnHouseCntRegist: true,
                                  ownHouseCnt: 0,
                                  additionalAnswerList: [],
                                }),
                              );
                            }

                          }
                          console.log('item2?.openSheet', item2?.openSheet);
                          if (item2?.openSheet) {

                            // ////console.log('openSheet');
                            if (item2?.id === 'ok' && item2?.chungYackYn) {
                              SheetManager.show(item2.openSheet, {
                                payload: {
                                  navigation: navigation,
                                  data: item2.id,
                                  data2: item.id,
                                  index,
                                  isGainsTax: false,
                                  currentPageIndex: item2?.currentPageIndex,
                                  chungYackYn: item2?.chungYackYn
                                },
                              });
                            } else {
                              SheetManager.show(item2.openSheet, {
                                payload: {
                                  navigation: navigation,
                                  data: item2.id,
                                  data2: item.id,
                                  index,
                                  isGainsTax: false,
                                  currentPageIndex: item2?.currentPageIndex,
                                },
                              });
                            }
                          }

                          // 양도 계획 여부
                          if (item2.id === 'planSaleYes') {
                            dispatch(
                              setHouseInfo({
                                ...houseInfo,
                                planSale: true,
                              }),
                            );
                          } else if (item2.id === 'planSaleNo') {
                            dispatch(
                              setHouseInfo({
                                ...houseInfo,
                                planSale: false,
                              }),
                            );
                          }
                        }
                      }}>
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
                      SheetManager.show('confirm', {
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
          </ChatItem>
          {item?.id === 'destruction' && (
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
                      navigation.push('CounselorList', {isGainsTax: false});
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

          {item?.id === 'calculating' && (
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
          )}

          {item?.id === 'apartmentAddressInfoSystem' && (
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
                <HouseInfoCardTitle >주택 정보</HouseInfoCardTitle>
                <HouseInfoCardSubTitle >
                  {houseInfo?.houseName} {houseInfo?.detailAdr ? houseInfo?.detailAdr : (houseInfo?.houseDetailName ? '' : '')}
                </HouseInfoCardSubTitle>

                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel >공시가격</HouseInfoListLabel>
                    <QuestionIcon
                      onPress={e => {
                        const type = '공시가격';
                        onQuestionMarkPress(type, e);
                      }}
                    />
                  </View>
                  <HouseInfoListValue >
                    {(houseInfo?.hasPubLandPrice === false || houseInfo?.hasPubLandPrice === undefined) ? (houseInfo?.isPubLandPriceOver100Mil ? '1억원 초과' : '1억원 이하') : numberToKorean(Number(houseInfo?.pubLandPrice).toString()) + '원'}
                  </HouseInfoListValue>
                </HouseInfoCardListItem>
                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel >전용면적</HouseInfoListLabel>
                    <QuestionIcon
                      onPress={e => {
                        const type = '전용면적';
                        onQuestionMarkPress(type, e);
                        // ////console.log('houseName', houseInfo?.houseName);
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: 'auto',
                    }}>
                    <HouseInfoListValue >
                      {(houseInfo?.hasArea === false || houseInfo?.hasArea === undefined) ? (houseInfo?.isAreaOver85 ? '국민평형(85㎡) 초과' : '국민평형(85㎡) 이하') : (houseInfo?.isAreaOver85 ? '국민평형(85㎡) 초과' : '국민평형(85㎡) 이하')}
                    </HouseInfoListValue>
                    {houseInfo?.hasArea && <HouseInfoListValue

                      style={{
                        fontSize: 10,
                        color: '#A3A5A8',
                        lineHeight: 8,
                      }}>
                      {'\n' + houseInfo?.area + '㎡'}
                    </HouseInfoListValue>}
                  </View>
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
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        SheetManager.show('acquisition', {
                          payload: {
                            questionId: item?.id,
                            navigation: navigation,
                            index,
                            currentPageIndex: 0,
                          },
                        });
                      }
                    }}
                    style={{
                      width: width - 80,
                      alignSelf: 'center',
                      marginTop: 20,
                    }}>
                    <ModalButtonText >다음으로</ModalButtonText>
                  </ModalButton>
                </DropShadow>
              </HouseInfoCard>
            </DropShadow >
          )}
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
              chatDataList[chatDataList.length - 1]?.id === 'cta' ||
                chatDataList[chatDataList.length - 1]?.id === 'calculating' ||
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

export default AcquisitionChat;
