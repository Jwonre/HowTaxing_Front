// 본인인증 시트

import { View, useWindowDimensions, Pressable, BackHandler, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import { useNavigation } from '@react-navigation/native';
import MaskInput from 'react-native-mask-input';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { acquisitionTax, gainTax } from '../../data/chatData';
import ChevronDownIcon from '../../assets/icons/chevron_down.svg';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setCert } from '../../redux/certSlice';
import { AREA_LIST } from '../../data/areaData';
import { LogBox } from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import dayjs from 'dayjs';
import Config from 'react-native-config'

const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: auto;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
`;

const ModalDescription = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 26px;
  margin-top: 10px;
  text-align: center;
`;

const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
`;

const CheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #fff;
  border: 1px solid #cfd1d5;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const ListItemTitle = styled.Text`
  flex: 1;
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const ListItemButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))``;

const ListItemButtonText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
  text-decoration-line: underline;
  text-decoration-color: #717274;
`;

const CertLogoImage = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 28px;
  height: 20px;
  align-self: center;
  margin-bottom: 10px;
`;

const ModalInputContainer = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  padding: 0 20px;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
}))`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  margin-top: 10px;
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;

const RegisterNumberInput = styled(MaskInput).attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  placeholder: '주민등록번호를 입력해주세요',
  autoCapitalize: 'none',
  autoCorrect: false,
  keyboardType: 'number-pad',
  maxLength: 14,
}))`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  margin-top: 10px;
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
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

const MapSearchResultHeader = styled.View`
  width: 100%;
  height: 55px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 0px;
  background-color: #fff;
`;


const SelectButtonContainer = styled.View`
  width: 47%;
  height: 36px;
`;


const SelectButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-SemiBold;
  color: #a3a5a8;
  letter-spacing: -0.3px;
  line-height: 16px;
  margin-right: 15px;
  text-align: center;
`;

const SelectItem = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 100%;
  height: 50px;
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const SelectItemText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;


const CertSheet = props => {
  LogBox.ignoreLogs(['to contain units']);
  const actionSheetRef = useRef(null);
  const data = props.payload.data;
  const navigation = props.payload?.navigation;
  const { width, height } = useWindowDimensions();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const currentUser = useSelector(state => state.currentUser.value);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedArea2, setSelectedArea2] = useState('');
  const selectRef2 = useRef(null);
  const selectRef = useRef(null);

  const [isGainsTax, setIsGainsTax] = useState('');
  const { certType, agreeCert, agreePrivacy, agreeCopyright, agreeGov24 } = useSelector(
    state => state.cert.value,
  );

  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  const [isConnected, setIsConnected] = useState(true);

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
        sellPrice: sellPrice ? sellPrice : 0
      };
      ////console.log('[additionalQuestion] additionalQuestion param:', param);
      //////console.log('[HouseDetail] Fetching house details for item:', item);
      const response = await axios.post(url, param, { headers });
      const detaildata = response.data.data;
      ////console.log('response.data', response.data);
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
            type: 'error',
            message: '추가질의를 가져오는데\n알수없는 오류가 발생했습니다.',
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
    if (props?.payload?.isGainsTax === true) {
      setIsGainsTax('02');
    } else {
      setIsGainsTax('01');
    }
    if (data) {
      dispatch(
        setCert({
          certType: data,
        }),
      );
    }
  }, [data]);



  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [residentNumber, setResidentNumber] = useState('');
  const [maskedResidentNumber, setMaskedResidentNumber] = useState('');
  const chatDataList = useSelector(state => state.chatDataList.value);
  const dispatch = useDispatch();

  //https://www.npmjs.com/package/react-native-mask-input
  const rlno_mask = [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    [/\d/],
    [/\d/],
    [/\d/],
    [/\d/],
    [/\d/],
    [/\d/],
  ];


  const hypenHouseAPI = async (url, data, headers) => {
    const response = await axios.post(url, data, { headers: headers });
    if (response.data.errYn === 'Y') {
      if (response.data.errCode === 'HOUSE-005') {
        ////console.log('response.data', response.data);
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            message: response.data.errMsg ? response.data.errMsg : '공공기관에서 보유주택 정보를 가져오는 중 오류가 발생했습니다.',
            description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
            buttontext: '다시 확인하기',
          },
        });
        dispatch(setResend(false));
        SheetManager.hide('infoCertification');
        setTimeout(async () => {
          const networkState = await NetInfo.fetch();
          // 네트워크가 연결되어 있을 때만 updateHouseDetailName() 함수를 실행합니다.
          if (networkState.isConnected) {
            SheetManager.show('cert', {
              payload: {
                cert: cert,
                index: props.payload?.index,
                currentPageIndex,
                name,
                phone,
                id,
                password,
                residentNumber,
                failreturn: true,
              },
            });
          }
        }, 900);
        const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
        dispatch(setChatDataList(newChatDataList));

      } else {

        setTimeout(async () => {
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '청약홈에서 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
              description: response.data?.errMsgDtl ? response.data?.errMsgDtl : null,
              buttontext: '확인하기',
            },
          });
        }, 400);
        dispatch(setResend(true));
      }
      return false;
    }
    const list = response.data.data.list ? response.data.data.list : null;
    //////console.log('[hypenHouseAPI]list:', list);
    //인증서 확인요청 팝업 화면 출력
    dispatch(setOwnHouseList(list));
  };

  const postOwnHouse = async () => {
    //const url = `${Config.APP_API_URL}house/loadHouse'; real api
    const url = `${Config.APP_API_URL}house/loadHouse`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    //////console.log('@@@@@@@@@headers:', headers);

    const data = {
      certOrg: certType === 'KB' ? 'kb' : certType === 'naver' ? 'naver' : certType === 'toss' ? 'toss' : certType === 'pass' ? 'pass' : certType === 'payco' ? 'payco' : certType === 'samsung' ? 'samsung' : 'kakao',
      userNm: name,
      mobileNo: phone,
      rlno: residentNumber,
      userId: id,
      userPw: password,
    };

    try {
      //////console.log('[CertSheet]headers:', headers);
      // ////console.log('[CertSheet]data:', data);
      await hypenHouseAPI(url, data, headers);
    } catch (error) {
      SheetManager.show('info', {
        payload: {
          message: '주택정보를 조회하는데 문제가 발생했습니다.',
          description: error.message,
          type: 'error',
          buttontext: '확인하기',
        },
      });
      ////console.log('에러', error);
    }
  };

  const nextHandler = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      if (chatDataList.find(el => el.id === 'under12')) {
        // 실거주기간 가져와야함

        actionSheetRef.current?.hide();

        const chat1 = gainTax.find(el => el.id === 'real');
        const chat2 = {
          id: 'year',
          type: 'my',
          progress: 5,
          message: '2년 10개월',
        };

        const chat3 = gainTax.find(el => el.id === 'ExpenseInquiry');
        const chat4 = gainTax.find(el => el.id === 'ExpenseAnswer');

        let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
        let Index1 = tempadditionalAnswerList.findIndex(item => 'Q_0005' in item);
        let Index2 = tempadditionalAnswerList.findIndex(item => 'PERIOD_CERT' in item);

        let newIndex1 = "02";
        let newIndex2 = "2년 10개월";

        if (Index1 !== -1 && Index2 !== -1) {
          if (tempadditionalAnswerList[Index1]['Q_0005'] !== newIndex1 || tempadditionalAnswerList[Index2]['PERIOD_CERT'] !== newIndex2) {
            tempadditionalAnswerList = [
              ...tempadditionalAnswerList.slice(0, Index1),
              { ...tempadditionalAnswerList[Index1], 'Q_0005': newIndex1 },
              ...tempadditionalAnswerList.slice(Index1 + 1)
            ];
            tempadditionalAnswerList = [
              ...tempadditionalAnswerList.slice(0, Index2),
              { ...tempadditionalAnswerList[Index2], 'PERIOD_CERT': newIndex2 },
              ...tempadditionalAnswerList.slice(Index2 + 1)
            ];
          }
        } else if (Index1 !== -1 && Index2 === -1) {
          tempadditionalAnswerList = [
            ...tempadditionalAnswerList.slice(0, Index1),
            { ...tempadditionalAnswerList[Index1], 'Q_0005': newIndex1 },
            ...tempadditionalAnswerList.slice(Index1 + 1),
            { "PERIOD_CERT": newIndex2 }
          ];
        } else {
          tempadditionalAnswerList = [
            ...tempadditionalAnswerList,
            { "Q_0005": newIndex1 },
            { "PERIOD_CERT": newIndex2 }
          ];
        }

        dispatch(setHouseInfo({
          ...houseInfo,
          livePeriodYear: '2',
          livePeriodMonth: '10',
          additionalAnswerList: tempadditionalAnswerList
        }));
        const additionalQuestion = await getadditionalQuestion('PERIOD_CERT', '2년 10개월', houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
        ////console.log('additionalQuestion', additionalQuestion);
        let chat7;
        if (additionalQuestion.returndata) {
          if (additionalQuestion.detaildata?.hasNextQuestion === true) {
            if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0006') {
              let chatIndex = gainTax.findIndex(el => el.id === 'additionalQuestion');
              if (chatIndex !== -1) {
                chat7 = {
                  ...gainTax[chatIndex],
                  message: additionalQuestion.detaildata?.nextQuestionContent,
                  questionId: additionalQuestion.detaildata?.nextQuestionId,
                  select: gainTax[chatIndex].select.map(item => ({
                    ...item,
                    name: item.id === 'additionalQuestionY' ?  additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent : additionalQuestion?.detaildata?.answerSelectList[1]?.answerContent,
                    answer: item.id === 'additionalQuestionY' ?  additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue : additionalQuestion?.detaildata?.answerSelectList[1]?.answerValue,
                    select: ['ExpenseInquiry', 'ExpenseAnswer'],
                  }))
                };
              }
            } else {
              let chatIndex = gainTax.findIndex(el => el.id === 'landlord2');
              chat7 = {
                ...gainTax[chatIndex],
              };
            }

            dispatch(
              setChatDataList([
                ...chatDataList,
                chat1,
                chat2,
                chat7
              ])
            );
          } else {
            if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {

              let tempadditionalAnswerList = houseInfo?.additionalAnswerList;
              if (tempadditionalAnswerList) {
                let foundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0006' in item);
                if (foundIndex !== -1) {
                  // 불변성을 유지하면서 Q_0006 값을 삭제
                  const { 'Q_0006': _, ...rest } = tempadditionalAnswerList[foundIndex];
                  tempadditionalAnswerList = [
                    ...tempadditionalAnswerList.slice(0, foundIndex),
                    rest,
                    ...tempadditionalAnswerList.slice(foundIndex + 1)
                  ];
                  dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
                }
              }
            }
            dispatch(
              setChatDataList([
                ...chatDataList,
                chat1,
                chat2,
                chat3,
                chat4
              ])
            );
          }

        } else {
          let tempadditionalAnswerList = houseInfo?.additionalAnswerList;
          if (tempadditionalAnswerList) {
            let foundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0006' in item);
            if (foundIndex !== -1) {
              // 불변성을 유지하면서 Q_0006 값을 삭제
              const { 'Q_0006': _, ...rest } = tempadditionalAnswerList[foundIndex];
              tempadditionalAnswerList = [
                ...tempadditionalAnswerList.slice(0, foundIndex),
                rest,
                ...tempadditionalAnswerList.slice(foundIndex + 1)
              ];
              dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: tempadditionalAnswerList }));
            }
          }
          const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
          dispatch(setChatDataList(newChatDataList));
        }
        //////console.log(chat4);

        // 인증 데이터 초기화
        dispatch(
          setCert({
            certType: null,
            agreeCert: false,
            agreePrivacy: false,
            agreeCopyright: false,
            agreeGov24: false,
          }),
        );

        return;


      }
    } else {
      actionSheetRef.current?.hide();
    }
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      closeOnPressBack={false}
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
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: currentPageIndex === 0 ? 560 : 630,
        width: width - 40,
      }}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {currentPageIndex === 0 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <ModalTitle>본인인증을 진행해주세요</ModalTitle>
              <ModalDescription>
                전자증명서 이용을 위해{'\n'}서비스 약관에 동의해주세요
              </ModalDescription>
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    if (agreeCert && agreePrivacy && agreeCopyright && agreeGov24) {
                      dispatch(
                        setCert({
                          certType,
                          agreeCert: false,
                          agreePrivacy: false,
                          agreeCopyright: false,
                          agreeGov24: false
                        }),
                      );
                    } else {
                      dispatch(
                        setCert({
                          certType,
                          agreeCert: true,
                          agreePrivacy: true,
                          agreeCopyright: true,
                          agreeGov24: true
                        }),
                      );
                    }
                  }}>
                  {agreeCert && agreePrivacy && agreeCopyright && agreeGov24 && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle
                  style={{
                    fontSize: 15,
                    fontFamily: 'Pretendard-Medium',
                  }}>
                  전체 동의하기
                </ListItemTitle>
              </ListItem>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#E8EAED',
                  marginTop: 20,
                }}
              />
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        certType,
                        agreePrivacy,
                        agreeCopyright,
                        agreeGov24,
                        agreeCert: !agreeCert,
                      }),
                    );
                  }}>
                  {agreeCert && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle>
                  [필수] 전자증명서 서비스 이용 약관
                </ListItemTitle>
                <ListItemButton
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    navigation.navigate('Cert3', {
                      cert: certType,
                      isGainsTax: props.payload.isGainsTax,
                      index: props.payload.index,
                      navigation: props.payload?.navigation
                    });
                  }}>
                  <ListItemButtonText>보기</ListItemButtonText>
                </ListItemButton>
              </ListItem>
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        certType,
                        agreeCert,
                        agreeCopyright,
                        agreeGov24,
                        agreePrivacy: !agreePrivacy,
                      }),
                    );
                  }}>
                  {agreePrivacy && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle>[필수] 정부24 개인정보처리방침</ListItemTitle>
                <ListItemButton
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    navigation.navigate('Privacy3', {
                      cert: certType,
                      isGainsTax: props.payload.isGainsTax,
                      index: props.payload.index,
                      navigation: props.payload?.navigation
                    });
                  }}>
                  <ListItemButtonText>보기</ListItemButtonText>
                </ListItemButton>
              </ListItem>
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        certType,
                        agreeCert,
                        agreePrivacy,
                        agreeCopyright: !agreeCopyright,
                        agreeGov24,
                      }),
                    );
                  }}>
                  {agreeCopyright && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle>
                  [필수] 정부24 저작권보호정책
                </ListItemTitle>
                <ListItemButton
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    navigation.navigate('Copyright3', {
                      cert: certType,
                      isGainsTax: props.payload.isGainsTax,
                      index: props.payload.index,
                      navigation: props.payload?.navigation
                    });
                  }}>
                  <ListItemButtonText>보기</ListItemButtonText>
                </ListItemButton>
              </ListItem>
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        certType,
                        agreeCert,
                        agreePrivacy,
                        agreeCopyright,
                        agreeGov24: !agreeGov24,
                      }),
                    );
                  }}>
                  {agreeGov24 && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle>
                  [필수] 정부24 이용약관
                </ListItemTitle>
                <ListItemButton
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    //   ////console.log('certType', certType);
                    navigation.navigate('Gov24', {
                      cert: certType,
                      isGainsTax: props.payload.isGainsTax,
                      index: props.payload.index
                    });
                  }}>
                  <ListItemButtonText>보기</ListItemButtonText>
                </ListItemButton>
              </ListItem>
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
                  disabled={!(agreeCert && agreePrivacy && agreeCopyright && agreeGov24)}
                  onPress={() => {
                    //////console.log('certType', certType);
                    if (certType === 'KB') {
                      setCurrentPageIndex(1);
                    } else if (certType === 'naver') {
                      setCurrentPageIndex(2);
                    } else if (certType === 'toss') {
                      setCurrentPageIndex(3);
                    } else if (certType === 'KAKAO') {
                      setCurrentPageIndex(4);
                    } else if (certType === 'PASS') {
                      setCurrentPageIndex(5);
                    } else if (certType === 'SAMSUNG') {
                      setCurrentPageIndex(6);
                    } else if (certType === 'PAYCO') {
                      setCurrentPageIndex(7);
                    }
                  }}
                  style={{
                    width: width - 80,
                    alignSelf: 'center',
                    marginTop: 20,
                    marginBottom: 50,
                    backgroundColor:
                      agreeCert && agreePrivacy && agreeCopyright && agreeGov24
                        ? '#2F87FF'
                        : '#E8EAED',
                  }}>
                  <ModalButtonText
                    style={{
                      color:
                        agreeCert && agreePrivacy && agreeCopyright && agreeGov24
                          ? '#fff'
                          : '#717274',
                    }}>
                    동의 후 인증하기
                  </ModalButtonText>
                </ModalButton>
              </DropShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 1 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/kb_logo.png')}
              />
              <ModalTitle>KB 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput
                  placeholder="이름"
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  autoFoucs
                  autoCompleteType="name"
                  autoCapitalize="none"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    setResidentNumber(unmasked);
                    // ////console.log("mask:", masked);
                    // ////console.log("unmask:", unmasked);
                    // ////console.log("obfuscated:", obfuscated);
                  }}
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주소지</ModalLabel>
                <MapSearchResultHeader>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef}
                      data={AREA_LIST}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea ? selectedArea : '시/도'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/도"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              setSelectedArea(item.name);
                              setSelectedAreaIndex(index);
                              if (index === 0) {
                                setSelectedArea2('전체');
                              } else {
                                setSelectedArea2('');
                              }
                              selectRef.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item.name}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef2}
                      data={
                        selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                      }
                      /* onSelect={(selectedItem, index) => {
                         ////console.log(selectedItem, index);
                       }}*/
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea2 ? selectedArea2 : '시/군/구'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/군/구"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              //////console.log(item);
                              setSelectedArea2(item);
                              selectRef2.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                </MapSearchResultHeader>
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler} style={{
                  backgroundColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                  borderColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                }} disabled={!(name && phone.length === 11 && residentNumber.length === 13)}>
                  <ButtonText style={{
                    color: name && phone.length === 11 && residentNumber.length === 13
                      ? '#fff'
                      : '#717274',
                  }}> 다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 2 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/naver_logo.png')}
              />
              <ModalTitle>네이버 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>아이디</ModalLabel>
                <ModalInput
                  placeholder="아이디"
                  value={id}
                  autoFoucs
                  onChangeText={setId}
                  maxLength={30}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>비밀번호</ModalLabel>
                <ModalInput
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  maxLength={40}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    setResidentNumber(unmasked);
                    // ////console.log("mask:", masked);
                    // ////console.log("unmask:", unmasked);
                    // ////console.log("obfuscated:", obfuscated);
                  }}
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주소지</ModalLabel>
                <MapSearchResultHeader>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef}
                      data={AREA_LIST}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea ? selectedArea : '시/도'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/도"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              setSelectedArea(item.name);
                              setSelectedAreaIndex(index);
                              if (index === 0) {
                                setSelectedArea2('전체');
                              } else {
                                setSelectedArea2('');
                              }
                              selectRef.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item.name}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef2}
                      data={
                        selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                      }
                      /*onSelect={(selectedItem, index) => {
                        ////console.log(selectedItem, index);
                      }}*/
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea2 ? selectedArea2 : '시/군/구'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/군/구"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              //////console.log(item);
                              setSelectedArea2(item);
                              selectRef2.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                </MapSearchResultHeader>
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler} style={{
                  backgroundColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                  borderColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                }} disabled={!(name && phone.length === 11 && residentNumber.length === 13)}>
                  <ButtonText style={{
                    color: name && phone.length === 11 && residentNumber.length === 13
                      ? '#fff'
                      : '#717274',
                  }}> 다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 3 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/toss_logo.png')}
              />
              <ModalTitle>토스 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput placeholder="이름" />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    setResidentNumber(unmasked);
                    // ////console.log("mask:", masked);
                    // ////console.log("unmask:", unmasked);
                    // ////console.log("obfuscated:", obfuscated);
                  }}
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주소지</ModalLabel>
                <MapSearchResultHeader>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef}
                      data={AREA_LIST}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea ? selectedArea : '시/도'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/도"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              setSelectedArea(item.name);
                              setSelectedAreaIndex(index);
                              if (index === 0) {
                                setSelectedArea2('전체');
                              } else {
                                setSelectedArea2('');
                              }
                              selectRef.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item.name}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef2}
                      data={
                        selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                      }
                      /* onSelect={(selectedItem, index) => {
                         ////console.log(selectedItem, index);
                       }}*/
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea2 ? selectedArea2 : '시/군/구'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/군/구"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              // ////console.log(item);
                              setSelectedArea2(item);
                              selectRef2.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                </MapSearchResultHeader>
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler} style={{
                  backgroundColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                  borderColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                }} disabled={!(name && phone.length === 11 && residentNumber.length === 13)}>
                  <ButtonText style={{
                    color: name && phone.length === 11 && residentNumber.length === 13
                      ? '#fff'
                      : '#717274',
                  }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 4 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/kakao_logo.png')}
              />
              <ModalTitle>카카오톡 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput
                  placeholder="이름"
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  autoFoucs
                  autoCompleteType="name"
                  autoCapitalize="none"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    setResidentNumber(unmasked);
                    // ////console.log("mask:", masked);
                    // ////console.log("unmask:", unmasked);
                    // ////console.log("obfuscated:", obfuscated);
                  }}
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주소지</ModalLabel>
                <MapSearchResultHeader>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef}
                      data={AREA_LIST}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea ? selectedArea : '시/도'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/도"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              setSelectedArea(item.name);
                              setSelectedAreaIndex(index);
                              if (index === 0) {
                                setSelectedArea2('전체');
                              } else {
                                setSelectedArea2('');
                              }
                              selectRef.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item.name}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef2}
                      data={
                        selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                      }
                      /*  onSelect={(selectedItem, index) => {
                          ////console.log(selectedItem, index);
                        }}*/
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea2 ? selectedArea2 : '시/군/구'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/군/구"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              //  ////console.log(item);
                              setSelectedArea2(item);
                              selectRef2.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                </MapSearchResultHeader>
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler} style={{
                  backgroundColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                  borderColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                }} disabled={!(name && phone.length === 11 && residentNumber.length === 13)}>
                  <ButtonText style={{
                    color: name && phone.length === 11 && residentNumber.length === 13
                      ? '#fff'
                      : '#717274',
                  }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 5 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/pass_logo.png')}
              />
              <ModalTitle>PASS 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput
                  placeholder="이름"
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  autoFoucs
                  autoCompleteType="name"
                  autoCapitalize="none"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    setResidentNumber(unmasked);
                    // ////console.log("mask:", masked);
                    // ////console.log("unmask:", unmasked);
                    // ////console.log("obfuscated:", obfuscated);
                  }}
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주소지</ModalLabel>
                <MapSearchResultHeader>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef}
                      data={AREA_LIST}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea ? selectedArea : '시/도'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/도"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              setSelectedArea(item.name);
                              setSelectedAreaIndex(index);
                              if (index === 0) {
                                setSelectedArea2('전체');
                              } else {
                                setSelectedArea2('');
                              }
                              selectRef.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item.name}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef2}
                      data={
                        selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                      }
                      /*onSelect={(selectedItem, index) => {
                        ////console.log(selectedItem, index);
                      }}*/
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea2 ? selectedArea2 : '시/군/구'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/군/구"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              //////console.log(item);
                              setSelectedArea2(item);
                              selectRef2.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                </MapSearchResultHeader>
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler} style={{
                  backgroundColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                  borderColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                }} disabled={!(name && phone.length === 11 && residentNumber.length === 13)}>
                  <ButtonText style={{
                    color: name && phone.length === 11 && residentNumber.length === 13
                      ? '#fff'
                      : '#717274',
                  }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 6 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/samsung_logo.png')}
              />
              <ModalTitle>삼성 패스 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput
                  placeholder="이름"
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  autoFoucs
                  autoCompleteType="name"
                  autoCapitalize="none"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    setResidentNumber(unmasked);
                    // ////console.log("mask:", masked);
                    // ////console.log("unmask:", unmasked);
                    // ////console.log("obfuscated:", obfuscated);
                  }}
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주소지</ModalLabel>
                <MapSearchResultHeader>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef}
                      data={AREA_LIST}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea ? selectedArea : '시/도'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/도"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              setSelectedArea(item.name);
                              setSelectedAreaIndex(index);
                              if (index === 0) {
                                setSelectedArea2('전체');
                              } else {
                                setSelectedArea2('');
                              }
                              selectRef.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item.name}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef2}
                      data={
                        selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                      }
                      /*onSelect={(selectedItem, index) => {
                        ////console.log(selectedItem, index);
                      }}*/
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea2 ? selectedArea2 : '시/군/구'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/군/구"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              //////console.log(item);
                              setSelectedArea2(item);
                              selectRef2.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                </MapSearchResultHeader>
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler} style={{
                  backgroundColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                  borderColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                }} disabled={!(name && phone.length === 11 && residentNumber.length === 13)}>
                  <ButtonText style={{
                    color: name && phone.length === 11 && residentNumber.length === 13
                      ? '#fff'
                      : '#717274',
                  }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 7 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/payco_logo.png')}
              />
              <ModalTitle>페이코 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput
                  placeholder="이름"
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  autoFoucs
                  autoCompleteType="name"
                  autoCapitalize="none"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    setResidentNumber(unmasked);
                    // ////console.log("mask:", masked);
                    // ////console.log("unmask:", unmasked);
                    // ////console.log("obfuscated:", obfuscated);
                  }}
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주소지</ModalLabel>
                <MapSearchResultHeader>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef}
                      data={AREA_LIST}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea ? selectedArea : '시/도'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/도"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              setSelectedArea(item.name);
                              setSelectedAreaIndex(index);
                              if (index === 0) {
                                setSelectedArea2('전체');
                              } else {
                                setSelectedArea2('');
                              }
                              selectRef.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item.name}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                  <SelectButtonContainer>
                    <SelectDropdown
                      ref={selectRef2}
                      data={
                        selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                      }
                      /*  onSelect={(selectedItem, index) => {
                          ////console.log(selectedItem, index);
                        }}*/
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <SelectButtonText>
                              {selectedArea2 ? selectedArea2 : '시/군/구'}
                            </SelectButtonText>
                            <ChevronDownIcon />
                          </View>
                        );
                      }}
                      defaultButtonText="시/군/구"
                      dropdownStyle={styles.dropdownStyle}
                      buttonStyle={styles.buttonStyle}
                      buttonTextStyle={styles.buttonTextStyle}
                      rowStyle={styles.rowStyle}
                      rowTextStyle={styles.rowTextStyle}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <SelectItem
                            onPress={() => {
                              // ////console.log(item);
                              setSelectedArea2(item);
                              selectRef2.current?.closeDropdown();
                            }}>
                            <SelectItemText>{item}</SelectItemText>
                          </SelectItem>
                        );
                      }}
                    />
                  </SelectButtonContainer>
                </MapSearchResultHeader>
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler} style={{
                  backgroundColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                  borderColor: name && phone.length === 11 && residentNumber.length === 13
                    ? '#2F87FF'
                    : '#E8EAED',
                }} disabled={!(name && phone.length === 11 && residentNumber.length === 13)}>
                  <ButtonText style={{
                    color: name && phone.length === 11 && residentNumber.length === 13
                      ? '#fff'
                      : '#717274',
                  }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
      </KeyboardAwareScrollView>
    </ActionSheet>
  );
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
    height: 40,
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
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});

export default CertSheet;
