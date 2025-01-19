// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Pressable,
  BackHandler,
  Keyboard,
} from 'react-native';
import React, { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DeleteIcon from '../../assets/icons/delete_circle.svg';
import CheckIcon from '../../assets/icons/check_circle.svg';
import ImpossibleIcon from '../../assets/icons/impossible_circle.svg';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import getFontSize from '../../utils/getFontSize';
import DropShadow from 'react-native-drop-shadow';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import { SheetManager } from 'react-native-actions-sheet';
import BackIcon from '../../assets/icons/back_button.svg';
import { useDispatch, useSelector } from 'react-redux';
import InfoCircleIcon from '../../assets/icons/info_circle.svg';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { acquisitionTax } from '../../data/chatData';
import { setChatDataList } from '../../redux/chatDataListSlice';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config'
import { setCert } from '../../redux/certSlice';
import MaskInput from 'react-native-mask-input';
import axios from 'axios';
import { setResend } from '../../redux/resendSlice';

const Container = styled.View`
  flex: 1;
  background-color: #FFF;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;

const CertLogoImage = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 30px;
  height: 20px;
  align-self: center;
  margin-right: 5px;
`;

const ModalTitle = styled.Text`
  font-size: 23px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: left;
`;


const ModalDescription = styled.Text`
  font-size: 14px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 20px;
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: left;
`;



const IntroSection = styled.View`

  padding: 20px;
  margin-top: 10px;
`;

const ModalText = styled.Text`
  font-size: 14px;
  font-family: Pretendard-Bold;
  color: #000;
  line-height: 20px;
  letter-spacing: -0.3px;
  margin-bottom: 5px;
`;

const MembershipText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-regular;
  text-align: center;
  color: #2F87FF;
  line-height: 20px;
  letter-spacing: -0.3px;
  text-decoration: underline;
`;



const ModalInputContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
}))`
  width: 100%;
  height: 56px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 40px 0 15px; 
  font-size: 13px;
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
  height: 56px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;



const ButtonSection = styled.View`
  width: 100%;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => (props.active ? '#2F87FF' : '#e5e5e5')};
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: #2F87FF;
`;

const ButtonText = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#a3a5a8')};
  line-height: 20px;
  color: #fff;
`;

const CircleButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))`
  width: 13px;
  height: 13px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
  align-items: center;
  justify-content: center;
  right: 10%;

`;

const FirstItem = styled.View`
  flex-direction: row; 
  justify-content: flex-end;
  align-items: center;
  margin-top: 30; 
  margin-bottom: 10;
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
    margin-right: 15px;
    margin-left: 10;
`;


const CertificationAcq = props => {
  console.log('props', props);
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const cert = props?.route?.params?.data;
  const navigation = props?.navigation;


  const dispatch = useDispatch();
  const [currentPageIndex, setCurrentPageIndex] = useState(props.route?.params?.currentPageIndex);
  const currentUser = useSelector(state => state.currentUser.value);
  const [isGainsTax, setIsGainsTax] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { certType, agreeCert, agreePrivacy } = useSelector(
    state => state.cert.value,
  );



  const { width, height } = useWindowDimensions();
  const [activeButton, setActiveButton] = useState(true);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [residentNumber, setResidentNumber] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [residentNumberOk, setResidentNumberOk] = useState('1');
  const [phoneOk, setPhoneOk] = useState('1');


  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);



  const chatDataList = useSelector(state => state.chatDataList.value);
  const [CheckPrivacy, setCheckPrivacy] = useState(props?.route?.params?.CheckPrivacy ? props?.route?.params?.CheckPrivacy : true);

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


  const handleBackPress = () => {
    const newChatDataList = chatDataList.slice(0, props?.route?.params?.index + 1);
    dispatch(setChatDataList(newChatDataList));
    dispatch(setCert({ agreePrivacy: false }));
    navigation.goBack();
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
    console.log('props?.route?.params?.isGainsTax', props?.route?.params?.isGainsTax)
    if (props?.route?.params?.isGainsTax) {
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
  }, [cert]);


  useEffect(() => {
    // 키보드가 보여질 때 높이를 설정
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        //scrollViewRef.current?.scrollTo({ y: 100, animated: true });
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




  const hypenHouseAPI = async (url, data, headers) => {
    try {
      const response = await axios.post(url, data, { headers, timeout: 65000 });
      console.log('response.data', response);
      if (response.data.errYn === 'Y') {
        if (response.data.errCode === 'HOUSE-005') {
          //console.log('response.data.errMsg.includes([LOGIN)', response.data.errMsg.includes('[LOGIN'));
          if (response.data.errMsgDtl) {
            if (response.data.errMsgDtl.includes("[LOGIN-301]")) {
              SheetManager.hide('infoCertification');
              await SheetManager.show('info', {
                payload: {
                  type: 'error',
                  errorType: response.data.type,
                  navigation: navigation,
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 중\n오류가 발생했어요.\n입력하신 정보를 다시 확인해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '다시 확인하기',
                },
              });
              dispatch(setResend(false));
              input3.current.focus();
            } else if (response.data.errMsgDtl.includes("[LOGIN-302]")) {
              SheetManager.hide('infoCertification');
              await SheetManager.show('info', {
                payload: {
                  type: 'error',
                  errorType: response.data.type,
                  navigation: navigation,
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 중\n오류가 발생했어요.\n입력하신 정보를 다시 확인해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '다시 확인하기',
                },
              });
              dispatch(setResend(false));
              input1.current.focus();
            } else if (response.data.errMsgDtl.includes("[LOGIN-999]")) {
              await SheetManager.hide('infoCertification');
              await SheetManager.show('info', {
                payload: {
                  type: 'error',
                  errorType: response.data.type,
                  navigation: navigation,
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 중\n오류가 발생했어요.\n입력하신 정보를 다시 확인해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '다시 확인하기',
                },
              });
              dispatch(setResend(false));
              input1.current.focus();
            } else {
              await SheetManager.show('info', {
                payload: {
                  type: 'error',
                  errorType: response.data.type,
                  navigation: navigation,
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
                  prevChat: props?.payload?.isGainsTax ? props?.payload?.isGainsTax == true ? 'GainsTax' : 'AcquisitionChat' : '',
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
                navigation: navigation,
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
              navigation: navigation,
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
              prevChat: 'AcquisitionChat',
              index: props?.route?.params?.index,
              certError: true,
            });
          }

        } else if (response.data.errCode === 'HOUSE-021') {
          await SheetManager.hide('infoCertification');
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              navigation: navigation,
              message: '본인인증 중 오류가 발생했습니다.\n입력하신 정보를 다시 확인해주세요.',
              description: response.data.errMsg ? response.data.errMsg : '',
              buttontext: '다시 확인하기',
            },
          });
          dispatch(setResend(false));
          input1.current.focus();
        } else {

          setTimeout(async () => {
            await SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: response.data.type,
                navigation: navigation,
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
        const list = response.data.data.list ? response.data.data.list : null;
        dispatch(setOwnHouseList(list));
        return true;
      }
    } catch (error) {
      console.error('[hypenHouseAPI] An error occurred:', error ? error : '');
      SheetManager.show('info', {
        payload: {
          message: '청약홈에서 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
          description: error?.message ? error?.message : null,
          type: 'error',
          buttontext: '인증하기',
        }
      });
      dispatch(setResend(true));
      // 에러를 호출하는 함수로 전파하지 않고, 적절히 처리합니다.
      return false;
    }
  };

  const postOwnHouse = async () => {
    const url = `${Config.APP_API_URL}house/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    //////console.log('@@@@@@@@@headers:', headers);

    const data = {
      certOrg: props?.route?.params?.data === 'KB' ? 'kb' : props?.route?.params?.data === 'naver' ? 'naver' : props?.route?.params?.data === 'kakao' ? 'kakao' :'toss',
      userNm: name,
      mobileNo: phone ? phone.replace(/-/g, '') : '',
      rlno: residentNumber.replace(/-/g, ''),
      userId: id,
      userPw: password,
      calcType: isGainsTax,
      isDummy: false
    };
    console.log('certdata : ', data);
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
        const newChatDataList = chatDataList.slice(0, props?.route?.params?.index + 1);
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
              errorType: 1,
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
              errorType: 1,
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
            certType: props?.route?.params?.data,
            index: props?.route?.params?.index,
            isGainsTax: props?.route?.params?.isGainsTax,
            navigation: navigation,
            name: name,
            phone: phone,
            residentNumber: residentNumber,
            id: id,
            password: password,
            calcType: isGainsTax,
            input1: input1,
            input3: input3
          },
        });
      }, 500);

      const certresult = await postOwnHouse();

      //console.log('certresult', certresult)
      if (certresult) {
        SheetManager.hide("infoCertification");
        const chatItem = acquisitionTax.find(el => el.id === 'moment1');
        //console.log(chatItem);
        dispatch(setChatDataList([...chatDataList, chatItem]));
        setTimeout(() =>
          navigation.goBack()
          , 300);
        dispatch(setCert({ agreePrivacy: false }));
      }


    } else {
      dispatch(setCert({ agreePrivacy: false }));
    }

  };






  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            const newChatDataList = chatDataList.slice(0, props?.route?.params?.index + 1);
            dispatch(setChatDataList(newChatDataList));
            dispatch(setCert({ agreePrivacy: false }));
            navigation.goBack();

          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '본인 인증하기',
      headerShadowVisible: false,
      contentStyle: {
        borderTopWidth: 0,
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
    <Container>
      <ProgressSection>
      </ProgressSection>
      <ScrollView keyboardShouldPersistTaps='always' ref={scrollViewRef} style={{ width: width }}>
        {
          currentPageIndex === 0 && (<><IntroSection>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              <CertLogoImage
                source={require('../../assets/images/certLogo/kb_logo.png')}
              />
              <ModalTitle>본인 인증을 진행해주세요.</ModalTitle>
            </View>
            <ModalDescription
              style={{
                lineHeight: 20,
              }}>
              주택을 자동으로 불러오기 위해 본인인증을 부탁드려요.
            </ModalDescription>

            <View style={{ marginBottom: 15 }}>
              <ModalText>이름</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input1}
                  onSubmitEditing={async () => {
                    input2.current.focus();

                  }}
                  placeholder="이름을 입력해주세요."
                  //  autoFocus={currentPageIndex === 2}
                  value={name}
                  onChangeText={async (name) => {
                    setName(name);
                  }}
                  autoCapitalize="none"
                  maxLength={20}
                  autoFocus
                  autoCompleteType="name"
                />
                <CircleButton onPress={() => { setName(''); }}>
                  <DeleteIcon />
                </CircleButton>
              </ModalInputContainer>
            </View>
            <View style={{ marginBottom: 15 }}>
              <ModalText>전화번호</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input2}
                  //  onSubmitEditing={() => input2.current.focus()}
                  value={phone}
                  placeholder="전화번호를 입력해주세요."
                  keyboardType="number-pad"
                  onChangeText={async (phone) => {
                    const filteredPhone = phone.replace(/[^0-9]/g, '');
                    let formattedPhone = filteredPhone;
                    if (filteredPhone.length > 3 && filteredPhone.length <= 7) {
                      formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3)}`;
                    } else if (filteredPhone.length > 7) {
                      formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3, 7)}-${filteredPhone.slice(7, 11)}`;
                    }

                    setPhone(formattedPhone);

                    if (filteredPhone.length === 11) {
                      setPhoneOk('2');
                    } else {
                      setPhoneOk('1');
                    }
                  }}


                  autoCompleteType="tel"
                  maxLength={13}
                  onSubmitEditing={async () => {
                    input3.current.focus();
                  }} />
                {phoneOk === '1' && <CircleButton onPress={() => { setPhone(''); }}>
                  <DeleteIcon />
                </CircleButton>}
                {phoneOk === '2' && <CircleButton>
                  <CheckIcon />
                </CircleButton>}
              </ModalInputContainer>
            </View>
            <View>
              <ModalText>주민등록번호</ModalText>
              <ModalInputContainer>
                <RegisterNumberInput
                  ref={input3}
                  //  onSubmitEditing={() => input2.current.focus()}
                  placeholder="주민등록번호를 입력해주세요."
                  value={residentNumber}
                  onChangeText={async (residentNumber) => {
                    if (residentNumber.length === 0) {
                      setResidentNumber('');
                    }
                    else if (residentNumber.length < 15 || residentNumber.length > 0) {
                      setResidentNumber(residentNumber);
                      if (residentNumber.length === 14) {
                        setResidentNumberOk('2');
                        if (phoneOk === '2' && name) {
                          Keyboard.dismiss();
                        }
                      } else {
                        setResidentNumberOk('1');
                      }
                    }
                  }}
                  // autoCompleteType="residentNumber"
                  keyboardType="number-pad"
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                  maxLength={14} />
                {residentNumberOk === '1' && <CircleButton onPress={() => { setResidentNumber(''); }}>
                  <DeleteIcon />
                </CircleButton>}
                {residentNumberOk === '2' && <CircleButton>
                  <CheckIcon />
                </CircleButton>}
              </ModalInputContainer>
            </View>
            <FirstItem>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={async () => {
                    await actionSheetRef.current?.hide();
                    navigation.navigate('CertificationPrivacy', {
                      prevChat: 'AcquisitionChat',
                      prevSheet: 'CertificationAcq',
                      cert: props.route?.params?.data,
                      isGainsTax: props.route?.params?.isGainsTax,
                      index: props.route?.params?.index,
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
          </IntroSection><ButtonSection>
              <Button
                active={phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy}
                disabled={!(phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy)}
                style={{ backgroundColor: (phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy) ? '#2F87FF' : '#E8EAED' }}
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    // await navigation.push('CheckTerms', { LoginAcessType: 'IDPASS', id: id, password: password });
                    nextHandler();
                  }
                }
                  // 동의하기 버튼 클릭 시 redux에 저장
                }>
                <ButtonText style={{ color: phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy ? '#FFFFFF' : '#a3a5a8' }}>{'인증하기'}</ButtonText>
              </Button>
            </ButtonSection></>
          )
        }

        {
          currentPageIndex === 1 && (<><IntroSection>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              <CertLogoImage
                source={require('../../assets/images/certLogo/naver_logo.png')}
              />
              <ModalTitle>본인 인증을 진행해주세요.</ModalTitle>
            </View>
            <ModalDescription
              style={{
                lineHeight: 20,
              }}>
              주택을 자동으로 불러오기 위해 본인인증을 부탁드려요.
            </ModalDescription>
            <View style={{ marginBottom: 15 }}>
              <ModalText>아이디</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input1}
                  onSubmitEditing={async () => {
                    input2.current.focus();
                  }}
                  onBlur={async () => {
                    input2.current.focus();
                  }}
                  placeholder="아이디를 입력해주세요."
                  //  autoFocus={currentPageIndex === 2}
                  value={id}
                  onChangeText={async (id) => { setId(id); }}
                  autoCompleteType="id"
                  autoFocus
                  autoCapitalize="none" />
                <CircleButton onPress={() => { setId(''); }}>
                  <DeleteIcon />
                </CircleButton>
              </ModalInputContainer>
            </View>
            <View style={{ marginBottom: 15 }}>
              <ModalText>비밀번호</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input2}
                  //  onSubmitEditing={() => input2.current.focus()}
                  value={password}
                  placeholder="비밀번호를 입력해주세요."
                  onChangeText={async (password) => {
                    if (password.length === 0) {
                      setPassword('');
                    } else {
                      setPassword(password);
                    }

                  }}
                  autoCompleteType="pwd"
                  secureTextEntry={true}
                  maxLength={16}
                  onSubmitEditing={async () => {
                    input3.current.focus();
                  }} />
                <CircleButton onPress={() => { setPassword(''); }}>
                  <DeleteIcon />
                </CircleButton>
              </ModalInputContainer>
            </View>
            <View>
              <ModalText>주민등록번호</ModalText>
              <ModalInputContainer>
                <RegisterNumberInput
                  ref={input3}
                  //  onSubmitEditing={() => input2.current.focus()}
                  placeholder="주민등록번호를 입력해주세요."
                  value={residentNumber}
                  onChangeText={async (residentNumber) => {
                    if (residentNumber.length === 0) {
                      setResidentNumber('');
                    }
                    else if (residentNumber.length < 15 || residentNumber.length > 0) {
                      setResidentNumber(residentNumber);
                      if (residentNumber.length === 14) {
                        setResidentNumberOk('2');
                        if (id && password) {
                          Keyboard.dismiss();
                        }
                      } else {
                        setResidentNumberOk('1');
                      }
                    }
                  }}
                  autoCompleteType="residentNumber"
                  keyboardType="number-pad"
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                  maxLength={14} />
                {residentNumberOk === '1' && <CircleButton onPress={() => { setResidentNumber(''); }}>
                  <DeleteIcon />
                </CircleButton>}
                {residentNumberOk === '2' && <CircleButton>
                  <CheckIcon />
                </CircleButton>}
              </ModalInputContainer>
            </View>
            <FirstItem>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={async () => {
                    await actionSheetRef.current?.hide();
                    navigation.navigate('CertificationPrivacy', {
                      prevChat: 'AcquisitionChat',
                      prevSheet: 'CertificationAcq',
                      cert: props.route?.params?.data,
                      isGainsTax: props.route?.params?.isGainsTax,
                      index: props.route?.params?.index,
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
          </IntroSection><ButtonSection>
              <Button
                active={id && password && residentNumberOk === '2' && agreePrivacy}
                disabled={!(id && password && residentNumberOk === '2' && agreePrivacy)}
                style={{ backgroundColor: (id && password && residentNumberOk === '2' && agreePrivacy) ? '#2F87FF' : '#E8EAED' }}
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    // await navigation.push('CheckTerms', { LoginAcessType: 'IDPASS', id: id, password: password });
                    nextHandler();
                  }
                }
                  // 동의하기 버튼 클릭 시 redux에 저장
                }>
                <ButtonText style={{ color: id && password && residentNumberOk === '2' && agreePrivacy ? '#FFFFFF' : '#a3a5a8' }}>{'인증하기'}</ButtonText>
              </Button>
            </ButtonSection></>
          )
        }

        {
          currentPageIndex === 2 && (<><IntroSection>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              <CertLogoImage
                source={require('../../assets/images/certLogo/toss_logo.png')}
              />
              <ModalTitle>본인 인증을 진행해주세요.</ModalTitle>
            </View>
            <ModalDescription
              style={{
                lineHeight: 20,
              }}>
              주택을 자동으로 불러오기 위해 본인인증을 부탁드려요.
            </ModalDescription>
            <View style={{ marginBottom: 15 }}>
              <ModalText>이름</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input1}
                  onSubmitEditing={async () => {
                    input2.current.focus();

                  }}
                  placeholder="이름을 입력해주세요."
                  //  autoFocus={currentPageIndex === 2}
                  value={name}
                  onChangeText={async (name) => {
                    setName(name);
                  }}
                  autoCapitalize="none"
                  maxLength={20}
                  autoFocus
                  autoCompleteType="name"
                />
                <CircleButton onPress={() => { setName(''); }}>
                  <DeleteIcon />
                </CircleButton>
              </ModalInputContainer>
            </View>
            <View style={{ marginBottom: 15 }}>
              <ModalText>전화번호</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input2}
                  //  onSubmitEditing={() => input2.current.focus()}
                  value={phone}
                  placeholder="전화번호를 입력해주세요."
                  keyboardType="number-pad"
                  onChangeText={async (phone) => {
                    const filteredPhone = phone.replace(/[^0-9]/g, '');
                    let formattedPhone = filteredPhone;
                    if (filteredPhone.length > 3 && filteredPhone.length <= 7) {
                      formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3)}`;
                    } else if (filteredPhone.length > 7) {
                      formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3, 7)}-${filteredPhone.slice(7, 11)}`;
                    }

                    setPhone(formattedPhone);

                    if (filteredPhone.length === 11) {
                      setPhoneOk('2');
                    } else {
                      setPhoneOk('1');
                    }
                  }}
                  autoCompleteType="tel"
                  maxLength={13}
                  onSubmitEditing={async () => {
                    input3.current.focus();
                  }} />
                {phoneOk === '1' && <CircleButton onPress={() => { setPhone(''); }}>
                  <DeleteIcon />
                </CircleButton>}
                {phoneOk === '2' && <CircleButton>
                  <CheckIcon />
                </CircleButton>}
              </ModalInputContainer>
            </View>
            <View>
              <ModalText>주민등록번호</ModalText>
              <ModalInputContainer>
                <RegisterNumberInput
                  ref={input3}
                  //  onSubmitEditing={() => input2.current.focus()}
                  placeholder="주민등록번호를 입력해주세요."
                  value={residentNumber}
                  onChangeText={async (residentNumber) => {
                    if (residentNumber.length === 0) {
                      setResidentNumber('');
                    }
                    else if (residentNumber.length < 15 || residentNumber.length > 0) {
                      setResidentNumber(residentNumber);
                      if (residentNumber.length === 14) {
                        setResidentNumberOk('2');
                        Keyboard.dismiss();
                      } else {
                        setResidentNumberOk('1');
                      }
                    }
                  }}
                  autoCompleteType="residentNumber"
                  keyboardType="number-pad"
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                  maxLength={14} />
                {residentNumberOk === '1' && <CircleButton onPress={() => { setResidentNumber(''); }}>
                  <DeleteIcon />
                </CircleButton>}
                {residentNumberOk === '2' && <CircleButton>
                  <CheckIcon />
                </CircleButton>}
              </ModalInputContainer>
            </View>
            <FirstItem>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={async () => {
                    await actionSheetRef.current?.hide();
                    navigation.navigate('CertificationPrivacy', {
                      prevChat: 'AcquisitionChat',
                      prevSheet: 'CertificationAcq',
                      cert: props.route?.params?.data,
                      isGainsTax: props.route?.params?.isGainsTax,
                      index: props.route?.params?.index,
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
          </IntroSection><ButtonSection>
              <Button
                active={phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy}
                disabled={!(phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy)}
                style={{ backgroundColor: (phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy) ? '#2F87FF' : '#E8EAED' }}
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    // await navigation.push('CheckTerms', { LoginAcessType: 'IDPASS', id: id, password: password });
                    nextHandler();
                  }
                }
                  // 동의하기 버튼 클릭 시 redux에 저장
                }>
                <ButtonText style={{ color: phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy ? '#FFFFFF' : '#a3a5a8' }}>{'인증하기'}</ButtonText>
              </Button>
            </ButtonSection></>
          )
        }

        {
          currentPageIndex === 3 && (<><IntroSection>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              <CertLogoImage
                source={require('../../assets/images/certLogo/kakao_logo.png')}
              />
              <ModalTitle>본인 인증을 진행해주세요.</ModalTitle>
            </View>
            <ModalDescription
              style={{
                lineHeight: 20,
              }}>
              주택을 자동으로 불러오기 위해 본인인증을 부탁드려요.
            </ModalDescription>
            <View style={{ marginBottom: 15 }}>
              <ModalText>이름</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input1}
                  onSubmitEditing={async () => {
                    input2.current.focus();

                  }}
                  placeholder="이름을 입력해주세요."
                  //  autoFocus={currentPageIndex === 2}
                  value={name}
                  onChangeText={async (name) => {
                    setName(name);
                  }}
                  autoCapitalize="none"
                  maxLength={20}
                  autoFocus
                  autoCompleteType="name"
                />
                <CircleButton onPress={() => { setName(''); }}>
                  <DeleteIcon />
                </CircleButton>
              </ModalInputContainer>
            </View>
            <View style={{ marginBottom: 15 }}>
              <ModalText>전화번호</ModalText>
              <ModalInputContainer>
                <ModalInput
                  ref={input2}
                  //  onSubmitEditing={() => input2.current.focus()}
                  value={phone}
                  placeholder="전화번호를 입력해주세요."
                  keyboardType="number-pad"
                  onChangeText={async (phone) => {
                    const filteredPhone = phone.replace(/[^0-9]/g, '');
                    let formattedPhone = filteredPhone;
                    if (filteredPhone.length > 3 && filteredPhone.length <= 7) {
                      formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3)}`;
                    } else if (filteredPhone.length > 7) {
                      formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3, 7)}-${filteredPhone.slice(7, 11)}`;
                    }

                    setPhone(formattedPhone);

                    if (filteredPhone.length === 11) {
                      setPhoneOk('2');
                    } else {
                      setPhoneOk('1');
                    }
                  }}
                  autoCompleteType="tel"
                  maxLength={13}
                  onSubmitEditing={async () => {
                    input3.current.focus();
                  }} />
                {phoneOk === '1' && <CircleButton onPress={() => { setPhone(''); }}>
                  <DeleteIcon />
                </CircleButton>}
                {phoneOk === '2' && <CircleButton>
                  <CheckIcon />
                </CircleButton>}
              </ModalInputContainer>
            </View>
            <View>
              <ModalText>주민등록번호</ModalText>
              <ModalInputContainer>
                <RegisterNumberInput
                  ref={input3}
                  //  onSubmitEditing={() => input2.current.focus()}
                  placeholder="주민등록번호를 입력해주세요."
                  value={residentNumber}
                  onChangeText={async (residentNumber) => {
                    if (residentNumber.length === 0) {
                      setResidentNumber('');
                    }
                    else if (residentNumber.length < 15 || residentNumber.length > 0) {
                      setResidentNumber(residentNumber);
                      if (residentNumber.length === 14) {
                        setResidentNumberOk('2');
                        if (phoneOk === '2' && name) {
                          Keyboard.dismiss();
                        }
                      } else {
                        setResidentNumberOk('1');
                      }
                    }
                  }}
                  autoCompleteType="residentNumber"
                  keyboardType="number-pad"
                  obfuscationCharacter="*"
                  showObfuscatedValue
                  mask={rlno_mask}
                  maxLength={14} />
                {residentNumberOk === '1' && <CircleButton onPress={() => { setResidentNumber(''); }}>
                  <DeleteIcon />
                </CircleButton>}
                {residentNumberOk === '2' && <CircleButton>
                  <CheckIcon />
                </CircleButton>}
              </ModalInputContainer>
            </View>
            <FirstItem>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={async () => {
                    await actionSheetRef.current?.hide();
                    navigation.navigate('CertificationPrivacy', {
                      prevChat: 'AcquisitionChat',
                      prevSheet: 'CertificationAcq',
                      cert: props.route?.params?.data,
                      isGainsTax: props.route?.params?.isGainsTax,
                      index: props.route?.params?.index,
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
          </IntroSection><ButtonSection>
              <Button
                active={phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy}
                disabled={!(phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy)}
                style={{ backgroundColor: (phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy) ? '#2F87FF' : '#E8EAED' }}
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    // await navigation.push('CheckTerms', { LoginAcessType: 'IDPASS', id: id, password: password });
                    nextHandler();
                  }
                }
                  // 동의하기 버튼 클릭 시 redux에 저장
                }>
                <ButtonText style={{ color: phoneOk === '2' && residentNumberOk === '2' && name && agreePrivacy ? '#FFFFFF' : '#a3a5a8' }}>{'인증하기'}</ButtonText>
              </Button>
            </ButtonSection></>
          )
        }

      </ScrollView>
    </Container>

  );

}

export default CertificationAcq;
