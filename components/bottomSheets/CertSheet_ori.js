
import { View, useWindowDimensions, Pressable, Keyboard } from 'react-native';
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
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { acquisitionTax, gainTax } from '../../data/chatData';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setCert } from '../../redux/certSlice';
import { LogBox } from 'react-native';
import Config from 'react-native-config'
import { setResend } from '../../redux/resendSlice';
import NetInfo from '@react-native-community/netinfo';
import ChooseHouseDongHoAlert from './ChooseHouseDongHoAlert';

const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;

`;

const ModalTitle = styled.Text`
  font-size: ${getFontSize(17)}px;
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
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 20px;
  margin-top: 15px;
  margin-bottom: 20px;
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
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const ListItemButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))``;

const ListItemButtonText = styled.Text`
  font-size: ${getFontSize(12)}px;
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
  font-size: ${getFontSize(15)}px;
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
  margin-top: 10px;
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
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const CertSheet_ori = props => {
  LogBox.ignoreLogs(['to contain units']);
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const cert = props.payload.data;
  const navigation = props.payload?.navigation;
  ////console.log('navigation', navigation);
  const { width, height } = useWindowDimensions();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentUser = useSelector(state => state.currentUser.value);
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
    if (props?.payload?.isGainsTax === true) {
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
      setResidentNumber(props.payload?.residentNumber);
    }
  }, [cert]);

  useEffect(() => {
    // 키보드가 보여질 때 높이를 설정
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        //console.log('scrollViewRef.current', scrollViewRef.current);
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToPosition(0, 100, true);
        }
      }
    );

    // 키보드가 사라질 때 높이를 초기화
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
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
  const [scrollHeight, setScrollHeight] = useState(420);

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
      const response = await axios.post(url, data, { headers });
      // console.log('response.data', response);
      if (response.data.errYn === 'Y') {
        if (response.data.errCode === 'HOUSE-005') {
          //console.log('response.data.errMsg.includes([LOGIN)', response.data.errMsg.includes('[LOGIN'));
          if (response.data.errMsgDtl) {
            if (response.data.errMsgDtl.includes("[LOGIN-301]") || response.data.errMsgDtl.includes("[LOGIN-302]")) {
              SheetManager.hide('infoCertification');
              await SheetManager.show('info', {
                payload: {
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
              }, 700);
              const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
              dispatch(setChatDataList(newChatDataList));
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
      } else {
        const list = response.data.data.list ? response.data.data.list : null;
        dispatch(setOwnHouseList(list));
        return true;
      }
    } catch (error) {

      setTimeout(async () => {
        console.error('[hypenHouseAPI] An error occurred:', error ? error : '');
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
    const url = `${Config.APP_API_URL}house/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    //////console.log('@@@@@@@@@headers:', headers);

    const data = {
      certOrg: certType === 'KB' ? 'kb' : certType === 'naver' ? 'naver' : 'toss',
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
            certType: certType,
            index: props.payload?.index,
            isGainsTax: props.payload,
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
        height: currentPageIndex === 0 ? 490 : 600,
        width: width - 40,
        overflow: 'hidden'
      }}>

      {currentPageIndex === 0 && (
        <SheetContainer width={width}>
          <ModalInputSection>
            <ModalTitle>본인인증을 진행해주세요</ModalTitle>
            <ModalDescription>
              전자증명서 이용을 위해{'\n'}서비스 약관에 동의해주세요
            </ModalDescription>
            <ListItem style={{ marginTop: 25 }}>
              <CheckCircle
                onPress={() => {
                  if (agreeCert && agreePrivacy) {
                    dispatch(
                      setCert({
                        certType,
                        agreeCert: false,
                        agreePrivacy: false,
                        //  agreeThird: false,
                      }),
                    );
                  } else {
                    dispatch(
                      setCert({
                        certType,
                        agreeCert: true,
                        agreePrivacy: true,
                        // agreeThird: true,
                      }),
                    );
                  }
                }}>
                {agreeCert && agreePrivacy && <CheckOnIcon />}
              </CheckCircle>
              <ListItemTitle
                style={{
                  fontSize: getFontSize(15),
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
                      //    agreeThird,
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
                  navigation.navigate('Cert', {
                    cert: certType,
                    isGainsTax: props.payload.isGainsTax,
                    index: props.payload.index,
                    navigation: navigation
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
                      //     agreeThird,
                      agreePrivacy: !agreePrivacy,
                    }),
                  );
                }}>
                {agreePrivacy && <CheckOnIcon />}
              </CheckCircle>
              <ListItemTitle>[필수] 청약홈 개인정보 수집 및 이용 동의</ListItemTitle>
              <ListItemButton
                onPress={() => {
                  actionSheetRef.current?.hide();
                  navigation.navigate('Privacy', {
                    cert: certType,
                    isGainsTax: props.payload.isGainsTax,
                    index: props.payload.index,
                    navigation: navigation

                  });

                }}>
                <ListItemButtonText>보기</ListItemButtonText>
              </ListItemButton>
            </ListItem>
            {/*<ListItem style={{ marginTop: 20 }}>
              <CheckCircle
                onPress={() => {
                  dispatch(
                    setCert({
                      certType,
                      agreeCert,
                      agreePrivacy,
                      agreeThird: !agreeThird,
                    }),
                  );
                }}>
                {agreeThird && <CheckOnIcon />}
              </CheckCircle>
              <ListItemTitle>
                [필수]{' '}
                {certType === 'KB'
                  ? 'KB'
                  : certType === 'naver'
                    ? '네이버'
                    : '토스'}{' '}
                개인정보 제3자 제공 동의
              </ListItemTitle>
              <ListItemButton
                onPress={() => {
                  actionSheetRef.current?.hide();
                  navigation.navigate('Third', {
                    cert: certType,
                    isGainsTax: props.payload.isGainsTax,
                    index: props.payload.index
                  });
                }}>
                <ListItemButtonText>보기</ListItemButtonText>
              </ListItemButton>
              </ListItem>*/}
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
                disabled={!(agreeCert && agreePrivacy)}
                onPress={() => {
                  if (certType === 'KB') {
                    setCurrentPageIndex(1);
                  } else if (certType === 'naver') {
                    setCurrentPageIndex(2);
                  } else {
                    setCurrentPageIndex(3);
                  }
                }}
                style={{
                  width: width - 80,
                  alignSelf: 'center',
                  marginTop: 10,
                  marginBottom: 50,
                  backgroundColor:
                    agreeCert && agreePrivacy
                      ? '#2F87FF'
                      : '#E8EAED',
                }}>
                <ModalButtonText
                  style={{
                    color:
                      agreeCert && agreePrivacy
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
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
        >
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
                <ModalLabel>휴대폰 번호</ModalLabel>
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
                <ModalLabel>주민등록번호</ModalLabel>
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
                    Keyboard.dismiss()
                    setTimeout(() => {
                      setCurrentPageIndex(0);
                    }, 100)
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
                  }} > 다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        </KeyboardAwareScrollView>
      )
      }
      {currentPageIndex === 2 && (
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
        >
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
                <ModalLabel>비밀번호</ModalLabel>
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
                <ModalLabel>주민등록번호</ModalLabel>
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
                    Keyboard.dismiss()
                    setTimeout(() => {
                      setCurrentPageIndex(0);
                    }, 100)
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
          </SheetContainer>
        </KeyboardAwareScrollView>
      )
      }
      {
        currentPageIndex === 3 && (
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
          >
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
                  <ModalLabel>휴대폰 번호</ModalLabel>
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
                  <ModalLabel>주민등록번호</ModalLabel>
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
                      Keyboard.dismiss()
                      setTimeout(() => {
                        setCurrentPageIndex(0);
                      }, 100)
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
                    }} > 다음으로</ButtonText>
                  </Button>
                </ButtonShadow>
              </ButtonSection>
            </SheetContainer>
          </KeyboardAwareScrollView>
        )
      }
    </ActionSheet >


  );
};

export default CertSheet_ori;