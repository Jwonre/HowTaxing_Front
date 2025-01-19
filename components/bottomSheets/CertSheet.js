
import { View, TouchableOpacity, useWindowDimensions, Pressable, Keyboard, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import { useNavigation } from '@react-navigation/native';
import MaskInput from 'react-native-mask-input';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import InfoCircleIcon from '../../assets/icons/info_circle.svg';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { acquisitionTax, gainTax } from '../../data/chatData';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setCert } from '../../redux/certSlice';
import { LogBox } from 'react-native';
import Config from 'react-native-config'
import { setResend } from '../../redux/resendSlice';
import NetInfo from '@react-native-community/netinfo';
import { setFixHouseList } from '../../redux/fixHouseListSlice';
import { setAddHouseList } from '../../redux/addHouseListSlice';

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;

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
  margin-right: 5px;
`;

const ModalDescription = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 20px;
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: center;
`;


const ModalContentSection = styled.View`
  background-color: #fff;
  justify-content: center;
  border-radius: 10px;
`;


const CertLogoImage = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 28px;
  height: 20px;
  align-self: center;
  margin-bottom: 6px;
`;

const ModalInputContainer = styled.View`
  width: 100%;
  height: auto;
  margin-top: 15px;
  padding: 0 20px;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
}))`
  width: 100%;
  height: 45px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  margin-top: 6px;
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
  background-color: #fff;
  margin-top: 20px;
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
  bottom: 0px;
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
  background-color: ${props => (props.active ? '#2F87FF' : '#E8EAED')};
  align-items: center;
  justify-content: center;
  border-color: ${props => (props.active ? '#2F87FF' : '#E8EAED')};
  align-self: center;
  border-width: 1px;

`;


const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#717274')};
  line-height: 20px;
`;


const FirstItem = styled.View`
  flex-direction: row; 
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const FirstItemTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 18px;
`;


const FirstCheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
    width: 20px;
    height: 20px;
    border-radius: 5px;  
    background-color: #fff;
    border: 2px solid #BAC7D5;  
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;


const CertSheet = props => {
  LogBox.ignoreLogs(['to contain units']);
  console.log('props', props);
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const cert = props.payload?.data;
  const navigation = props.payload?.navigation;
  ////console.log('navigation', navigation);
  const { width, height } = useWindowDimensions();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentUser = useSelector(state => state.currentUser.value);
  const fixHouseList = useSelector(state => state.fixHouseList.value);
  const [isGainsTax, setIsGainsTax] = useState('');
  //const [certresult, setCertresult] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { certType, agreeCert, agreePrivacy } = useSelector(
    state => state.cert.value,
  );
  //console.log('props', props);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isConnected, setIsConnected] = useState(true);
  const [CheckPrivacy, setCheckPrivacy] = useState(props?.payload?.checkPrivacy ? props?.payload?.checkPrivacy : true);

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


  //  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    //   ////console.log('props?.payload?.isGainsTax', props?.payload?.isGainsTax)
    if (props?.payload?.isGainsTax) {
      setIsGainsTax('02');
    } else {
      setIsGainsTax('01');
    }
    if (cert) {
      dispatch(
        setCert({
          certType: cert,
        }),
      );
    }
    if (props.payload?.failreturn) {
      setId(props.payload?.id);
      setPassword(props.payload?.password);
      setName(props.payload?.name);
      setPhone(props.payload?.phone);
      setResidentNumber(props.payload?.residentNumber);
      setCurrentPageIndex(props.payload?.currentPageIndex);
    }
  }, [cert]);

  useEffect(() => {
    // 키보드가 보여질 때 높이를 설정
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        scrollViewRef.current?.scrollTo({ y: 100, animated: true });
      }
    );

    // 키보드가 사라질 때 높이를 초기화
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => { setKeyboardHeight(0); scrollViewRef.current?.scrollTo({ y: 0, animated: true }); }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



  useEffect(() => {

    dispatch(setFixHouseList([]));
    dispatch(setAddHouseList([]));
    dispatch(setOwnHouseList([]));
  }, []);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [residentNumber, setResidentNumber] = useState('');
  const chatDataList = useSelector(state => state.chatDataList.value);
  const dispatch = useDispatch();
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  //console.log('height', height);
  //console.log('keyboardHeight', keyboardHeight);

  const registerDirectHouse = async (list) => {
    
    //console.log('list : ', list);
    try {
      const state = await NetInfo.fetch();
      const canProceed = await handleNetInfoChange(state);

      if (!canProceed) return false;

      const accessToken = currentUser.accessToken;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      };

      //console.log('list : ', list);
      const data = {
        calcType : '02',
        houseSaveRequestList : list.map(({ index, complete, createAt, houseId, isCurOwn, isDestruction, kbMktPrice, moveInDate, moveOutDate, ownerCnt, sellDate, sellPrice, sourceType, updateAt, userId, userProportion, ...rest }) => rest),
      }
      console.log('request : ', data);

      const response = await axios.post(`${Config.APP_API_URL}house/saveAllHouse`, data, { headers });

      //console.log('response : ', response);

      if (response.data.errYn === 'Y') {
        //console.log('response.data', response.data);
        await showErrorMessage(response.data.errMsg, response.data.errMsgDtl);
        return false;
      } else {
        dispatch(setOwnHouseList([...response.data.data.list]));
        return true;
      }
    } catch (error) {
      await showErrorMessage();
      console.error(error); // 여기서 error 변수를 사용
      return false;
    }
  };

  const showErrorMessage = async (errMsg = '보유주택 수정·등록 중 오류가 발생했습니다.', errMsgDtl = '') => {
    await new Promise((resolve) => {
      SheetManager.show('info', {
        payload: {
          errorType: response.data.type,
          type: 'error',
          message: errMsg,
          description: errMsgDtl,
          buttontext: '확인하기',
          onClose: resolve, // 사용자가 확인 버튼을 누르면 resolve 호출
        },
      });
    });
  };


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
    try {
      const response = await axios.post(url, data, { headers, timeout: 65000 });
      console.log('response', response);
      console.log('response.data', response.data);
      if (response.data.errYn === 'Y') {
        if (response.data.errCode === 'HOUSE-005') {
          //console.log('response.data.errMsg.includes([LOGIN)', response.data.errMsg.includes('[LOGIN'));
          if (response.data.errMsgDtl) {
            if (response.data.errMsgDtl.includes("[LOGIN-301]") || response.data.errMsgDtl.includes("[LOGIN-302]") || response.data.errMsgDtl.includes("[LOGIN-999]")) {
              await SheetManager.hide('infoCertification');
              await SheetManager.show('info', {
                payload: {
                  errorType: response.data.type,
                  type: 'error',
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 중\n오류가 발생했어요.\n입력하신 정보를 다시 확인해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '다시 확인하기',
                },
              });
              dispatch(setResend(false));
              setTimeout(async () => {
                const networkState = await NetInfo.fetch();
                // 네트워크가 연결되어 있을 때만 updateHouseDetailName() 함수를 실행합니다.
                if (networkState.isConnected) {
                  SheetManager.show('cert', {
                    payload: {
                      data: props.payload.data,
                      index: props.payload?.index,
                      currentPageIndex,
                      name,
                      phone,
                      id,
                      password,
                      residentNumber,
                      failreturn: true,
                      CheckPrivacy: false
                    },
                  });
                }
              }, 300);
              const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
              dispatch(setChatDataList(newChatDataList));
            } else {
              await SheetManager.show('info', {
                payload: {
                  errorType: response.data.type,
                  type: 'error',
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '인증하기',
                },
              });
              dispatch(setResend(true));
            }
            /*else if (response.data.errMsgDtl.includes("[LOGIN-303]")) {
              await SheetManager.hide('infoCertification');
              await SheetManager.show('info', {
                payload: {
                  type: 'error',
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 결과\n청약통장을 보유하고 있지 않으시군요.\n보유주택을 직접 등록해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '직접 등록하기',
                },
              });
              dispatch(setResend(false));

              const networkState = await NetInfo.fetch();
              // 네트워크가 연결되어 있을 때만 updateHouseDetailName() 함수를 실행합니다.
              if (networkState.isConnected) {
                navigation.push('DirectRegister', {
                  prevChat: props?.payload?.isGainsTax ? props?.payload?.isGainsTax ? 'GainsTax' : 'AcquisitionChat' : '',
                  index: props?.payload?.index,
                  certError: true,
                });
              }

              //     const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
              //    dispatch(setChatDataList(newChatDataList));
            }*/
          } else {
            await SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: response.data.type,
                message: response.data.errMsg ? response.data.errMsg : '청약홈 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
                description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                buttontext: '인증하기',
              },
            });
            dispatch(setResend(true));

          }
        } else if (response.data.errCode === 'HOUSE-006') {
          await SheetManager.hide('infoCertification');
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 결과\n청약통장을 보유하고 있지 않으시군요.\n보유주택을 직접 등록해주세요.',
              description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
              buttontext: '직접 등록하기',
            },
          });
          dispatch(setResend(false));

          const networkState = await NetInfo.fetch();
          // 네트워크가 연결되어 있을 때만 updateHouseDetailName() 함수를 실행합니다.
          if (networkState.isConnected) {
            navigation.push('DirectRegister', {
              prevChat: props?.payload?.isGainsTax ? props?.payload?.isGainsTax ? 'GainsTax' : 'AcquisitionChat' : '',
              index: props?.payload?.index,
              certError: true,
            });
          }

        } else if (response.data.errCode === 'HOUSE-018') {
          await SheetManager.hide('infoCertification');
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 중\n오류가 발생했어요.\n입력하신 정보를 다시 확인해주세요.',
              description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
              buttontext: '다시 확인하기',
            },
          });
          dispatch(setResend(false));
          setTimeout(async () => {
            const networkState = await NetInfo.fetch();
            // 네트워크가 연결되어 있을 때만 updateHouseDetailName() 함수를 실행합니다.
            if (networkState.isConnected) {
              SheetManager.show('cert', {
                payload: {
                  data: props.payload.data,
                  index: props.payload?.index,
                  currentPageIndex,
                  name,
                  phone,
                  id,
                  password,
                  residentNumber,
                  failreturn: true,
                  CheckPrivacy: false
                },
              });
            }
          }, 300);
          const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
          dispatch(setChatDataList(newChatDataList));
        } else {

          setTimeout(async () => {
            await SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: response.data.type,
                message: response.data.errMsg ? response.data.errMsg : '청약홈에서 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
                description: response.data?.errMsgDtl ? response.data?.errMsgDtl : null,
                buttontext: '확인하기',
              },
            });
          }, 400);
          dispatch(setResend(true));
        }
        return false;
      } else {
        setTimeout(async () => {
          SheetManager.hide("infoCertification");
        }, 300);



        if (response.data.data && response.data.data.length > 0) {
          list = response.data.data.map((item, index) => ({ ...item, index }));
          
          console.log('[hypenHouseAPI] list:', list);
          dispatch(setResend(false));
          if (list.some(item => item.complete === false)) {
            setTimeout(async () => {
              dispatch(
                setFixHouseList(
                  list
                ));
              // console.log('[hypenHouseAPI] props.payload?.isGainsTax:', props.payload?.isGainsTax);
              navigation.push('FixedHouseList', { isGainsTax: props.payload?.isGainsTax ? true : false, chatListindex: props?.payload?.index });
            }, 300);
            return false;
          } else {
            const registerDirectHouseResult = await registerDirectHouse(list);
            if (registerDirectHouseResult) {

              const getEtcHouseReturn = await getEtcHouse();
              console.log('getEtcHouseReturn : ', getEtcHouseReturn);
              if (getEtcHouseReturn === 'getEtcHouseNull') {
                console.log('getEtcHouseNull');
                return true;
              } else if (getEtcHouseReturn === 'getEtcHouse') {
                navigation.navigate('AddHouseList', { chatListindex: props?.payload?.index });
                return false;
              } else if (getEtcHouseReturn === 'getEtcHouseFailed') {
                const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                dispatch(setChatDataList(newChatDataList));
                return false;
              }
            } else {
              const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
              dispatch(setChatDataList(newChatDataList));
              return false;
            }
          }
        } else {
          dispatch(setResend(false));
          const getEtcHouseReturn = await getEtcHouse();
          if (getEtcHouseReturn === 'getEtcHouseNull') {
            dispatch(setOwnHouseList([]));
            return true;
          } else if (getEtcHouseReturn === 'getEtcHouse') {
            navigation.navigate('AddHouseList', { chatListindex: props?.payload?.index });
            return false;
          } else if (getEtcHouseReturn === 'getEtcHouseFailed') {
            const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
            dispatch(setChatDataList(newChatDataList));
            return false;
          }

        }


      }
    } catch (error) {

      setTimeout(async () => {
        //console.error('[hypenHouseAPI] An error occurred:', error ? error : '');
        SheetManager.show('info', {
          payload: {
            message: '청약홈에서 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
            description: error?.message ? error?.message : null,
            type: 'error',
            buttontext: '인증하기',
          }
        });
      }, 400);
      dispatch(setResend(true));
      // 에러를 호출하는 함수로 전파하지 않고, 적절히 처리합니다.
      return false;
    }
  };

  const postOwnHouse = async () => {
    const url = `${Config.APP_API_URL}house/loadHouse`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    //////console.log('@@@@@@@@@headers:', headers);

    const data = {
      certOrg: props.payload?.data === 'KB' ? 'kb' : props.payload?.data === 'naver' ? 'naver' : props.payload?.data === 'kakao' ? 'kakao' : 'toss',
      userNm: name,
      mobileNo: phone,
      rlno: residentNumber,
      userId: id,
      userPw: password,
      calcType: isGainsTax,
    };
    //////console.log('certdata : ', data);
    try {
      // ////console.log('[CertSheet]headers:', headers);
      // ////console.log('[CertSheet]data:', data);
      const response = await hypenHouseAPI(url, data, headers);

      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error) {

      setTimeout(async () => {
        await SheetManager.show('info', {
          payload: {
            message: '청약홈에서 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
            description: error?.message ? error?.message : '',
            type: 'error',
            buttontext: '인증하기',
          }
        });
        ////console.log('에러', error ? error : '');
        const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
        dispatch(setChatDataList(newChatDataList));

        dispatch(setResend(true));
      }, 400);

      return false;
    }
  };

  const nextHandler = async () => {

    /*  if (currentPageIndex === 1 || currentPageIndex === 3) {
        if (name.trim() === '' || phone.trim() === '' || residentNumber.trim() === '') {
          SheetManager.show('info', {
            payload: {
              message: '정보를 모두 입력해주세요.',
              description: 'InputAlert',
              type: 'info',
            },
          });
          return;
        }
      } else if (currentPageIndex === 2) {
        if (id.trim() === '' || password.trim() === '' || residentNumber.trim() === '') {
          SheetManager.show('info', {
            payload: {
              message: '정보를 모두 입력해주세요.',
              description: 'InputAlert2',
              type: 'info',
            },
          });
          return;
        }
      }
   
    if (chatDataList.find(el => el.id === 'over12')) {
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
   
      dispatch(
        setHouseInfo({
          ...houseInfo,
          livePeriod: '34',
        }),
      );
   
      dispatch(setChatDataList([...chatDataList, chat1, chat2, chat3, chat4])) // 1초 후에 실행);
      ////console.log(chat4);
   
      // 인증 데이터 초기화
      dispatch({
        setCert: {
          certType: null,
          agreeCert: false,
          agreePrivacy: false,
       //  agreeThird: false,
        },
      });
   
      return;
   
   
    }
      */
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      actionSheetRef.current?.hide(); // 본인인증 창 닫기

      setTimeout(() => {
        SheetManager.show('infoCertification', {
          payload: {
            message: '인증 알림을 보냈어요.\n인증이 완료되면 다음화면으로 넘어가요.',
            certType: props.payload?.data,
            index: props.payload?.index,
            isGainsTax: props.payload.isGainsTax,
            name: name,
            phone: phone,
            residentNumber: residentNumber,
            id: id,
            password: password,
            calcType: isGainsTax
          },
        });
      }, 500);

      const certresult = await postOwnHouse();

      //console.log('certresult', certresult)
      if (certresult) {
        SheetManager.hide("infoCertification");
        const { isGainsTax } = props.payload;
        const chatItem = isGainsTax
          ? gainTax.find(el => el.id === 'allHouse1')
          : acquisitionTax.find(el => el.id === 'moment1');
        //console.log(chatItem);
        dispatch(setChatDataList([...chatDataList, chatItem]));

      }
      dispatch(setCert({ agreePrivacy: false }));
    } else {
      actionSheetRef.current?.hide();
      dispatch(setCert({ agreePrivacy: false }));
    }
  };

  const getEtcHouse = async () => {
    const url = `${Config.APP_API_URL}house/getEtcHouse`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    console.log('headers : ', headers);
    console.log('url : ', url);
    try {
      const response = await axios.get(url, { headers: headers });
      if (response.data.errYn === 'Y') {
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
        const result = response.data.data ? response.data.data : undefined;
        if (result) {
          if (response.data.data.length === 0) {
            return 'getEtcHouseNull';
          } else {
            var list = response.data.data.map((item, index) => ({ ...item, index }));
            dispatch(setFixHouseList(list));
            return 'getEtcHouse';
          }
        } else {
          return 'getEtcHouseFailed';
        }

      }
    } catch (error) {
      await SheetManager.show('info', {
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

  const toggleModal = () => {
    console.log('certType : ', props.payload?.data);
    if (CheckPrivacy) {
      setCheckPrivacy(false);
      if (props.payload?.data === 'KB') {
        setCurrentPageIndex(1);
      } else if (props.payload?.data === 'naver') {
        setCurrentPageIndex(2);
      } else {
        setCurrentPageIndex(3);
      }
    } else {
      setCheckPrivacy(true);
      setCurrentPageIndex(0);
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
              dispatch(setCert({ agreePrivacy: false }));
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
        height: currentPageIndex === 0 ? 0 : 600,
        width: width - 40,
      }}>

      {currentPageIndex === 0 && (
        <Modal isVisible={CheckPrivacy} backdropColor="#000" // 원하는 색으로 설정
          backdropOpacity={0}>
          <SheetContainer style={{ borderRadius: 8, height: '35%' }}>
            <ModalContentSection>
              <InfoCircleIcon
                style={{
                  color: '#FF7401',
                  marginTop: 20,
                  marginBottom: 10,
                  alignSelf: 'center'
                }}
              />
              <ModalTitle >본인인증을 진행해주세요.</ModalTitle>

              <FirstItem style={{ marginTop: 20, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={async () => {
                      await actionSheetRef.current?.hide();
                      console.log('props.payload?.data : ', props.payload?.data);
                      navigation.navigate('CertificationPrivacy', {
                        prevChat: 'GainsTaxChat',
                        prevSheet: 'cert',
                        cert: props.payload?.data,
                        isGainsTax: props.payload.isGainsTax,
                        index: props.payload.index,
                        navigation: navigation
                      });
                    }}>
                    <FirstItemTitle style={{ color: '#2F87FF', textDecorationLine: 'underline' }}>개인정보 수집 및 이용</FirstItemTitle>
                  </TouchableOpacity>
                  <FirstItemTitle>에 대하여 동의하시나요?</FirstItemTitle>
                </View>
                <FirstCheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        agreePrivacy: !agreePrivacy,
                      }),
                    );
                  }}>
                  {agreePrivacy && <CheckOnIcon />}
                </FirstCheckCircle>

              </FirstItem>
              <ButtonSection style={{
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 20,
                paddingLeft: 20
              }}>
                <Button
                  disabled={!agreePrivacy}
                  width={width}
                  active={agreePrivacy}
                  onPress={() => {
                    toggleModal();
                  }}>
                  <ButtonText active={agreePrivacy}>동의 후 인증하기</ButtonText>
                </Button>
              </ButtonSection>
            </ModalContentSection>

          </SheetContainer>
        </Modal >
      )
      }

      {
        currentPageIndex === 1 && (
          <SheetContainer width={width} height={height - (keyboardHeight * 1.3)}>
            <ScrollView keyboardShouldPersistTaps='always' ref={scrollViewRef}>
              <ModalInputSection>
                <CertLogoImage
                  source={require('../../assets/images/certLogo/kb_logo.png')}
                />
                <ModalTitle >KB 간편 인증 정보 입력</ModalTitle>
                <ModalDescription

                  style={{
                    lineHeight: 20,
                  }}>
                  인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                  입력해주세요
                </ModalDescription>
                <ModalInputContainer>
                  <ModalLabel >이름</ModalLabel>
                  <ModalInput
                    ref={input1}
                    onSubmitEditing={() => input2.current.focus()}
                    placeholder="이름"
                    value={name}
                    onChangeText={setName}
                    maxLength={20}
                    autoFocus
                    autoCompleteType="name"
                    autoCapitalize="none"
                  />
                </ModalInputContainer>
                <ModalInputContainer>
                  <ModalLabel >휴대폰 번호</ModalLabel>
                  <ModalInput
                    ref={input2}
                    onSubmitEditing={() => input3.current.focus()}
                    placeholder="휴대폰 번호를 입력해주세요"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={11}
                    keyboardType="number-pad"
                    autoCompleteType="tel"
                  />
                </ModalInputContainer>
                <ModalInputContainer>
                  <ModalLabel >주민등록번호</ModalLabel>
                  <RegisterNumberInput
                    ref={input3}
                    value={residentNumber}
                    keyboardType="number-pad"
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
              </ModalInputSection>

              <ButtonSection>
                <ButtonShadow
                  style={{
                    shadowColor: '#fff',
                  }}>
                  <Button
                    onPress={() => {
                      Keyboard.dismiss();
                      toggleModal();
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
                    }}
                    > 다음으로</ButtonText>
                  </Button>
                </ButtonShadow>
              </ButtonSection>
            </ScrollView>
          </SheetContainer>
        )
      }

      {
        currentPageIndex === 2 && (

          <SheetContainer width={width} height={height - (keyboardHeight * 1.3)}>
            <ScrollView keyboardShouldPersistTaps='always' ref={scrollViewRef}>
              <ModalInputSection>
                <CertLogoImage
                  source={require('../../assets/images/certLogo/naver_logo.png')}
                />
                <ModalTitle >네이버 간편 인증 정보 입력</ModalTitle>
                <ModalDescription

                  style={{
                    lineHeight: 20,
                  }}>
                  인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                  입력해주세요
                </ModalDescription>

                <ModalInputContainer>
                  <ModalLabel >아이디</ModalLabel>
                  <ModalInput
                    ref={input1}
                    onSubmitEditing={() => input2.current.focus()}
                    placeholder="아이디"
                    value={id}
                    autoFocus
                    onChangeText={setId}
                    maxLength={30}
                  />
                </ModalInputContainer>
                <ModalInputContainer>
                  <ModalLabel >비밀번호</ModalLabel>
                  <ModalInput
                    ref={input2}
                    onSubmitEditing={() => input3.current.focus()}
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    maxLength={40}

                  />
                </ModalInputContainer>
                <ModalInputContainer>
                  <ModalLabel >주민등록번호</ModalLabel>
                  <RegisterNumberInput
                    ref={input3}
                    value={residentNumber}
                    keyboardType="number-pad"
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

              </ModalInputSection>

              <ButtonSection>
                <ButtonShadow
                  style={{
                    shadowColor: '#fff',
                  }}>
                  <Button
                    onPress={() => {
                      Keyboard.dismiss();
                      toggleModal();
                    }}
                    style={{
                      backgroundColor: '#fff',
                      borderColor: '#E8EAED',
                    }}>
                    <ButtonText
                      style={{
                        color: '#717274',
                      }}
                    >
                      이전으로
                    </ButtonText>
                  </Button>
                </ButtonShadow>
                <ButtonShadow>
                  <Button onPress={nextHandler} style={{
                    backgroundColor: id && password && residentNumber.length === 13
                      ? '#2F87FF'
                      : '#E8EAED',
                    borderColor: id && password && residentNumber.length === 13
                      ? '#2F87FF'
                      : '#E8EAED',
                  }} disabled={!(id && password && residentNumber.length === 13)}>
                    <ButtonText style={{
                      color: id && password && residentNumber.length === 13
                        ? '#fff'
                        : '#717274',
                    }} > 다음으로</ButtonText>
                  </Button>
                </ButtonShadow>
              </ButtonSection>
            </ScrollView>
          </SheetContainer>

        )
      }
      {
        currentPageIndex === 3 && (
          <SheetContainer width={width} height={height - (keyboardHeight * 1.3)}>
            <ScrollView keyboardShouldPersistTaps='always' ref={scrollViewRef}>
              <ModalInputSection>
                <CertLogoImage
                  source={require('../../assets/images/certLogo/toss_logo.png')}
                />
                <ModalTitle >토스 간편 인증 정보 입력</ModalTitle>
                <ModalDescription
                  style={{
                    lineHeight: 20,
                  }} >
                  인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                  입력해주세요
                </ModalDescription>
                <ModalInputContainer>
                  <ModalLabel >이름</ModalLabel>
                  <ModalInput placeholder="이름"
                    ref={input1}
                    onSubmitEditing={() => input2.current.focus()}
                    value={name}
                    onChangeText={setName}
                    maxLength={20}
                    autoFocus
                    autoCompleteType="name"
                    autoCapitalize="none"
                  />
                </ModalInputContainer>
                <ModalInputContainer>
                  <ModalLabel >휴대폰 번호</ModalLabel>
                  <ModalInput
                    ref={input2}
                    onSubmitEditing={() => input3.current.focus()}
                    placeholder="휴대폰 번호를 입력해주세요"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={11}
                    keyboardType="number-pad"
                    autoCompleteType="tel"
                  />
                </ModalInputContainer>
                <ModalInputContainer>
                  <ModalLabel >주민등록번호</ModalLabel>
                  <RegisterNumberInput
                    ref={input3}
                    value={residentNumber}
                    keyboardType="number-pad"
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
              </ModalInputSection>

              <ButtonSection>
                <ButtonShadow
                  style={{
                    shadowColor: '#fff',
                  }}>
                  <Button
                    onPress={() => {
                      Keyboard.dismiss();
                      toggleModal();
                    }}
                    style={{
                      backgroundColor: '#fff',
                      borderColor: '#E8EAED',
                    }}>
                    <ButtonText
                      style={{
                        color: '#717274',
                      }} >
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
                    }} > 다음으로</ButtonText>
                  </Button>
                </ButtonShadow>
              </ButtonSection>
            </ScrollView>
          </SheetContainer>
        )
      }

    </ActionSheet >


  );
};

const styles = StyleSheet.create({
  dropShadow: {
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    alignSelf: 'center',
    width: 130,
  },
});

export default CertSheet;
