// 정보 또는 경고 알림창 컴포넌트

import { useWindowDimensions, Pressable, View, Linking, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { Animated, Easing } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setResend } from '../../redux/resendSlice';
import { acquisitionTax, gainTax } from '../../data/chatData';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { setFixHouseList } from '../../redux/fixHouseListSlice';
import axios from 'axios';
import Config from 'react-native-config';
// import CheckAppInstall from 'react-native-check-app-install';


const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  width: 80%;
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 25px;
  text-align: center;
  margin-bottom: 20px;

`;
const ModalContent = styled.Text`
  width: 80%;
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #FF7401;
  line-height: 20px;
  text-align: center;
  margin-bottom: 20px;

`;
const ModalDescription = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 15px;
  text-align: left;
  padding: 20px;
  background-color: #F5F7FA;
  border-radius: 5px;
  border-color: #F5F7FA;
  border-width: 60px;

`;

const ModalContentSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;
const CertLogoImage = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 30px;
  height: 30px;
  align-self: center;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
  margin-top: 10px;
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




const InfoCertification = props => {
  const dispatch = useDispatch();
  const certType = props?.payload?.certType;
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [ActiveYN, setActiveYN] = useState(false);
  const resendYN = useSelector(state => state.resend.value);
  const chatDataList = useSelector(state => state.chatDataList.value);
  const currentUser = useSelector(state => state.currentUser.value);
  const { name, phone, residentNumber, id, password, calcType } = props?.payload;
  const navigation = props?.payload?.navigation;
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  const [isConnected, setIsConnected] = useState(true);
  const [appStatus, setAppStatus] = useState({
    kb: false,
    toss: false,
    naver: false,
  });


  // const checkAppPackageInstalled = async (packageName) => {
  //   const isInstalled = await CheckAppInstall.isAppInstalled(packageName);
  //   console.log(`${packageName} 설치 여부:`, isInstalled);
  //   return isInstalled;
  // };
  const isPackageInstalled = (packageName) => {
    try {
      require.resolve(packageName);
      return true; // 패키지가 설치되어 있음
    } catch (error) {
      return false; // 패키지가 설치되어 있지 않음
    }
  };
  const checkAppInstalled = async () => {
    try {
      // let isKBInstalled = checkAppPackageInstalled('kb-auth://');
      // let isTossInstalled = checkAppPackageInstalled('tossauth://');
      // let isNaverInstalled = checkAppPackageInstalled('naverlogin://');
      // let isKakaoInstalled = checkAppPackageInstalled('');

      // if (Platform.OS === 'android') {
      //   isKBInstalled = checkAppPackageInstalled('com.kbstar.kbbank'); // Android 패키지명 확인
      //   isTossInstalled = checkAppPackageInstalled('vn.toss');
      //   isNaverInstalled = checkAppPackageInstalled('com.nhn.android.search');
      //   isKakaoInstalled = await Linking.canOpenURL('com.kakao.talk');
      // }
      let isKBInstalled = false;
      let isTossInstalled = false;
      let isNaverInstalled = false;
      let isKakaoInstalled = false;
      // if (Platform.OS === 'ios') {
      // iOS에서 URL 스키마 확인
      isKBInstalled = await Linking.canOpenURL('kbbank://');
      isTossInstalled = await Linking.canOpenURL('supertoss://');
      isNaverInstalled = await Linking.canOpenURL('naversearchapp://');
      isKakaoInstalled = await Linking.canOpenURL('kakaotalk://');
      // } else if (Platform.OS === 'android') {
      //   // Android에서 URL 스키마 확인
      //   isKBInstalled = await Linking.canOpenURL('com.kbstar.kbbank');
      //   isTossInstalled = await Linking.canOpenURL('vn.toss');
      //   isNaverInstalled = await Linking.canOpenURL('com.nhn.android.search');
      //   isKakaoInstalled = await Linking.canOpenURL('com.kakao.talk');
      // }

      console.log("install_status : ", `${isKBInstalled} `);

      console.log("install_status : ", isTossInstalled);

      console.log("install_status : ", isNaverInstalled);

      console.log("install_status : ", isKakaoInstalled);

      setAppStatus({
        kb: isKBInstalled,
        toss: isTossInstalled,
        naver: isNaverInstalled,
        kakao: isKakaoInstalled
      });
    } catch (error) {
      console.error('앱 확인 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    checkAppInstalled();
  }, []);
  const appUrls = {
    kb: {
      ios: 'https://apps.apple.com/kr/app/id372174644',
      android: 'market://details?id=com.kbstar.kbbank',
    },
    naver: {
      ios: 'https://apps.apple.com/kr/app/id393499958',
      android: 'market://details?id=com.nhn.android.search',
    },
    toss: {
      ios: 'https://apps.apple.com/kr/app/id839333328',
      android: 'market://details?id=viva.republica.toss&hl=ko&gl=US',
    },
    kakao: {
      ios: 'https://apps.apple.com/kr/app/id362057947',
      android: 'market://details?id=com.kakao.talk',
    },
  };

  const downloadApp = async (certType) => {
    const url = Platform.OS === 'ios' ? appUrls[certType].ios : appUrls[certType].android;

    try {
      await Linking.openURL(url); // 스토어로 이동
    } catch (error) {
      console.error('스토어 열기 오류:', error);
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
    if (resendYN) {
      // resendYN이 true일 때 수행할 동작을 여기에 작성합니다.
      // 예를 들어, 알림을 다시 보내는 함수를 호출할 수 있습니다.
      setActiveYN(resendYN);
    }
  }, [resendYN]); // 의존성 배열에 resendYN 추가

  const hypenHouseAPI = async (url, data, headers) => {
    try {
      const response = await axios.post(url, data, { headers, timeout: 65000 });
      console.log('response.data : ', response.data);
      if (response.data.errYn === 'Y') {
        if (props.payload.isGainsTax) {
          if (response.data.errCode === 'HOUSE-005') {
            //console.log('response.data.errMsg.includes([LOGIN)', response.data.errMsg.includes('[LOGIN'));
            if (response.data.errMsgDtl) {
              if (response.data.errMsgDtl.includes("[LOGIN-301]")) {
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
                setActiveYN(false);
                props.payload?.input3.current.focus();
              } else if (response.data.errMsgDtl.includes("[LOGIN-302]")) {
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
                setActiveYN(false);
                props.payload?.input1.current.focus();
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
                setActiveYN(false);
                props.payload?.input1.current.focus();
              } else {
                await SheetManager.hide('infoCertification');

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
                setActiveYN(true);
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
                  navigation: navigation,
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '인증하기',
                },
              });
              dispatch(setResend(true));
              setActiveYN(true);

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
            setActiveYN(false);
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
                navigation: navigation,
                message: response.data.errMsg ? response.data.errMsg : '청약홈 인증 중\n오류가 발생했어요.\n입력하신 정보를 다시 확인해주세요.',
                description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                buttontext: '다시 확인하기',
              },
            });
            dispatch(setResend(false));
            setActiveYN(false);
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
            setActiveYN(false);
            props.payload?.input1.current.focus();
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
            setActiveYN(true);
          }
          return false;
        } else {
          if (response.data.errCode === 'HOUSE-005') {
            //console.log('response.data.errMsg.includes([LOGIN)', response.data.errMsg.includes('[LOGIN'));
            if (response.data.errMsgDtl) {
              if (response.data.errMsgDtl.includes("[LOGIN-301]") || response.data.errMsgDtl.includes("[LOGIN-302]")) {
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
                setActiveYN(false);
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
                  navigation: navigation,
                  message: response.data.errMsg ? response.data.errMsg : '청약홈 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
                  description: response.data?.errMsgDtl ? response.data?.errMsgDtl : '',
                  buttontext: '인증하기',
                },
              });
              dispatch(setResend(true));
              setActiveYN(true);

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
            setActiveYN(false);

            const networkState = await NetInfo.fetch();
            // 네트워크가 연결되어 있을 때만 updateHouseDetailName() 함수를 실행합니다.
            if (networkState.isConnected) {
              navigation.push('DirectRegister', {
                prevChat: props?.payload?.isGainsTax ? props?.payload?.isGainsTax ? 'GainsTax' : 'AcquisitionChat' : '',
                index: props?.payload?.index,
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
            setActiveYN(false);
            props?.payload?.input1.current.focus();
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
            setActiveYN(true);
          }
          return false;
        }

      } else {
        console.log('response info', response);
        console.log('props.payload?.isGainsTax', props.payload?.isGainsTax);
        if (props.payload?.isGainsTax) {
          setTimeout(async () => {
            SheetManager.hide("infoCertification");
          }, 300);



          if (response.data.data && response.data.data.length > 0) {
            list = response.data.data.map((item, index) => ({ ...item, index }));
            //console.log('[hypenHouseAPI] list:', list);
            dispatch(setResend(false));
            setActiveYN(false);
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
                  return false;
                }
              } else {
                return false;
              }
            }
          } else {
            dispatch(setResend(false));

            const registerDirectHouseResult = await registerDirectHouse([]);
            if (registerDirectHouseResult) {
              const getEtcHouseReturn = await getEtcHouse();
              if (getEtcHouseReturn === 'getEtcHouseNull') {
                return true;
              } else if (getEtcHouseReturn === 'getEtcHouse') {
                navigation.navigate('AddHouseList', { chatListindex: props?.payload?.index });
                return false;
              } else if (getEtcHouseReturn === 'getEtcHouseFailed') {
                return false;
              }
            } else {
              return false;
            }

          }

        } else {
          const list = response.data.data.list ? response.data.data.list : null;
          dispatch(setOwnHouseList(list));
          return true;
        }


      }
    } catch (error) {
      console.error('[hypenHouseAPI] An error occurred:', error);
      SheetManager.show('info', {
        payload: {
          message: '청약홈에서 정보를 불러오는 중\n오류가 발생했어요.\n인증을 다시 진행해주세요.',
          description: error?.message,
          type: 'error',
          buttontext: '인증하기',
        }
      });
      dispatch(setResend(true));
      setActiveYN(true);
      // 에러를 호출하는 함수로 전파하지 않고, 적절히 처리합니다.
      return false;
    }
  };

  const postOwnHouse = async () => {
    var url = '';
    if (props.payload?.isGainsTax) {
      url = `${Config.APP_API_URL}house/loadHouse`;
    } else {
      url = `${Config.APP_API_URL}house/search`;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    //////console.log('@@@@@@@@@headers:', headers);

    const data = {
      certOrg: certType === 'KB' ? 'kb' : certType === 'naver' ? 'naver' : certType === 'kakao' ? 'kakao' : 'toss',
      userNm: name,
      mobileNo: phone,
      rlno: residentNumber,
      userId: id,
      userPw: password,
      calcType: calcType,
      isDummy: true
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
            description: error?.message,
            type: 'error',
            buttontext: '인증하기',
          }
        });
        ////console.log('에러', error);
        const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
        dispatch(setChatDataList(newChatDataList));

        dispatch(setResend(true));
        setActiveYN(true);
      }, 400);

      return false;
    }
  };

  const registerDirectHouse = async (list) => {
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
      const data = {
        calcType: '02',
        houseSaveRequestList: list.map(({ index, complete, createAt, houseId, isCurOwn, isDestruction, kbMktPrice, moveInDate, moveOutDate, ownerCnt, sellDate, sellPrice, sourceType, updateAt, userId, userProportion, ...rest }) => rest),
      }
      console.log('data : ', data);
      axios
        .post(`${Config.APP_API_URL}house/saveAllHouse`, data, { headers: headers })
        .then(async response => {
          if (response.data.errYn === 'Y') {
            SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: response.data.type,
                navigation: navigation,
                message: response.data.errMsg ? response.data.errMsg : '보유주택 수정·등록 중 오류가 발생했습니다.',
                description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
                buttontext: '확인하기',
              },
            });
            return false;

          } else {
            console.log('[hypenHouseAPI] response.data : ', response.data.data);
            const returndata = response.data.data.list;
            dispatch(setOwnHouseList([
              ...returndata,
            ]));
            return true;

          }
        })
        .catch(error => {
          // 오류 처리
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: '보유주택 수정·등록 중 오류가 발생했습니다.',
              buttontext: '확인하기',
            },
          });
          console.error(error);
          return false;
        });
    }
  };

  const getEtcHouse = async () => {
    const url = `${Config.APP_API_URL}house/getEtcHouse`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    //console.log('headers : ', headers);
    //console.log('url : ', url);
    try {
      const response = await axios.get(url, { headers: headers });
      if (response.data.errYn === 'Y') {
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            navigation: navigation,
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


  const CircularProgress = ({ size, strokeWidth, progress }) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = ((100 - progress) / 100) * circumference;

    useEffect(() => {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, []);

    return (
      <Animated.View style={{
        transform: [{
          rotate: rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          })
        }]
      }}>
        <Svg width={size} height={size}>
          <Path
            stroke="#d3d3d3"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={0} // 이 부분을 수정했습니다.
            d={`M ${size / 2} ${size / 2}
              m -${radius}, 0
              a ${radius},${radius} 0 1,0 ${radius * 2},0
              a ${radius},${radius} 0 1,0 -${radius * 2},0`}
          />
          <Path
            stroke="#A2C62B"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset} // 이 부분을 그대로 유지했습니다.
            strokeLinecap="round"
            d={`M ${size / 2} ${size / 2}
              m -${radius}, 0
              a ${radius},${radius} 0 1,0 ${radius * 2},0
              a ${radius},${radius} 0 1,0 -${radius * 2},0`}
          />
        </Svg>
      </Animated.View>
    );
  };
  const openKBAuthApp = async () => {
    try {
      const url = 'kbbank://';

      if (appStatus.kb === true) {
        await Linking.openURL(url); // KB 인증서 앱 실행
      } else {
        console.log('KB 인증서 앱을 실행할 수 없습니다.');
        downloadApp(certType.toLowerCase());
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const opeToassAuthApp = async () => {
    try {
      // const url = 'supertoss://certificate?callback_url=howtaxingrelease://auth';
      const url = 'supertoss://';

      const supported = await Linking.canOpenURL(url);

      if (appStatus.toss === true) {
        await Linking.openURL(url); // KB 인증서 앱 실행
      } else {
        console.log('Toss 인증서 앱을 실행할 수 없습니다.');
        downloadApp(certType.toLowerCase());
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const openNaverAuthApp = async () => {
    try {
      const callbackUrl = encodeURIComponent('howtaxingrelease://auth');

      let url = `naversearchapp://default?version=${Platform.OS === 'android' ? '5' : '1'}`;

      // url = 'naversearchapp://default?version=1';
      console.log('Generated URL:', `appStatus.naver:${appStatus.naver} ${url}`);

      if (appStatus.naver === true) {
        await Linking.openURL(url); // KB 인증서 앱 실행
      } else {
        console.log('Naver 인증서 앱을 실행할 수 없습니다.');
        downloadApp(certType.toLowerCase());
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const openKakaoAuthApp = async () => {
    try {
      const callbackUrl = encodeURIComponent('howtaxingrelease://auth');

      let url = 'kakaotalk://open';

      // url = 'naversearchapp://default?version=1';
      console.log('Generated URL:', `appStatus.kakao:${appStatus.kakao} ${url}`);

      if (appStatus.kakao === true) {
        await Linking.openURL(url); // KB 인증서 앱 실행
      } else {
        console.log('Kakao 인증서 앱을 실행할 수 없습니다.');
        downloadApp(certType.toLowerCase());
      }
    } catch (error) {
      console.error('오류 발생:', error);
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
              dispatch(setResend(false));

            }}>
            {/* {(ActiveYN) && <CloseIcon width={16} height={16} />} */}
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: certType === 'KB' ? 350 : 390,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalContentSection>
          <View style={{ width: 30, height: 45 }}>
            {(() => {
              switch (certType) {
                case 'KB':
                  return <CertLogoImage
                    source={require('../../assets/images/certLogo/kb_logo.png')}
                  />;
                case 'naver':
                  return <CertLogoImage
                    source={require('../../assets/images/certLogo/naver_logo.png')}
                  />;
                case 'kakao':
                  return <CertLogoImage
                    source={require('../../assets/images/certLogo/kakao_logo.png')}
                  />;
                case 'pass':
                  return <CertLogoImage
                    source={require('../../assets/images/certLogo/pass_logo.png')}
                  />;
                case 'payco':
                  return <CertLogoImage
                    source={require('../../assets/images/certLogo/payco_logo.png')}
                  />;
                case 'samsung':
                  return <CertLogoImage
                    source={require('../../assets/images/certLogo/samsung_logo.png')}
                  />;
                case 'toss':
                  return <CertLogoImage
                    source={require('../../assets/images/certLogo/toss_logo.png')}
                  />; // 수정된 부분
                default:
                  return null;
              }
            })()}</View>

          {certType === 'KB' && (
            // <ModalTitle >{appStatus.kb === true ?
            //   props?.payload?.message : '인증 앱을 해당 기기에서 찾을 수 없어요.\n먼저 인증하실 서비스를 설치해주세요.'}</ModalTitle>
            <ModalTitle >{props?.payload?.message}</ModalTitle>
          )}
          {certType === 'toss' && (
            // <ModalTitle >{appStatus.toss.toss === true ?
            //   props?.payload?.message : '인증 앱을 해당 기기에서 찾을 수 없어요.\n먼저 인증하실 서비스를 설치해주세요.'}</ModalTitle>
            <ModalTitle >{props?.payload?.message}</ModalTitle>
          )}
          {certType === 'naver' && (
            // <ModalTitle >{appStatus.naver ?
            //   props?.payload?.message : '인증 앱을 해당 기기에서 찾을 수 없어요.\n먼저 인증하실 서비스를 설치해주세요.'}</ModalTitle>
            <ModalTitle >{props?.payload?.message}</ModalTitle>
          )}

          {certType === 'kakao' && (
            // <ModalTitle >{appStatus.naver ?
            //   props?.payload?.message : '인증 앱을 해당 기기에서 찾을 수 없어요.\n먼저 인증하실 서비스를 설치해주세요.'}</ModalTitle>
            <ModalTitle >{props?.payload?.message}</ModalTitle>
          )}



          {(certType !== 'KB' && certType !== 'kakao') && <ModalContent >신속한 인증을 원하시면 인증 앱으로 바로가기를 누르신 후 직접 인증을 부탁드려요. </ModalContent>}
          {/* {(ActiveYN === true) && <ModalContent >다른 기기를 통해 인증할 예정이라면다른 기기로 인증하기를 눌러주세요. </ModalContent>} */}


          {/* {(ActiveYN === false) && <CircularProgress size={50} strokeWidth={5} progress={30} />} */}
          <CircularProgress size={50} strokeWidth={5} progress={30} />
        </ModalContentSection>



        <ButtonSection>
          <View
            style={{
              marginBottom: 40, // 하단에서 40px 띄우기
              flexDirection: 'row', // 버튼을 가로로 배치
              justifyContent: 'space-between', // 버튼 사이 간격 균등
              alignItems: 'center', // 버튼의 세로 중심 정렬
              marginTop: 10, // 로딩바와 여백
              width: '100%', // 전체 너비 사용
              paddingHorizontal: 20, // 양쪽에 여백 추가
            }}
          >
            <Button
              onPress={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {
                  dispatch(setResend(false));
                  setActiveYN(false);
                  const certresult = await postOwnHouse();
                  if (certresult) {
                    SheetManager.hide('infoCertification');
                    const { isGainsTax } = props.payload.isGainsTax;
                    const chatItem = isGainsTax
                      ? gainTax.find(el => el.id === 'allHouse1')
                      : acquisitionTax.find(el => el.id === 'moment1');
                    dispatch(setChatDataList([...chatDataList, chatItem]));
                    setTimeout(() => navigation.goBack(), 300);
                  }
                } else {
                  actionSheetRef.current?.hide();
                }
              }}
              style={{
                width: certType === 'KB'|| certType === 'kakao' ? '100%' : '49%', // 버튼 너비를 부모 View의 45%로 설정
                // backgroundColor: ActiveYN ? '#2f87ff' : '#FFF',
                // borderColor: ActiveYN ? '#2f87ff' : '#E8EAED',
                backgroundColor: '#FFF',
                borderColor: '#E8EAED',
              }}
            // active={ActiveYN}
            // disabled={!ActiveYN}
            >
              {/* <ButtonText active={ActiveYN} style={{ color: ActiveYN ? '#fff' : '#717274' }}>
                다시 보내기
              </ButtonText> */}
              <ButtonText active={ActiveYN} style={{ color: '#717274' }}>
                다시 보내기
              </ButtonText>
            </Button>


            {(certType !== 'KB' && certType !== 'kakao') && (
              <DropShadow
                style={{
                  shadowColor: 'rgba(0,0,0,0.25)',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                  alignSelf: 'center',
                  width: '49%', // 버튼 너비를 부모 View의 45%로 설정
                }}
              >
                <Button
                  style={{
                    // backgroundColor: !ActiveYN ? '#2f87ff' : '#E8EAED',
                    // borderColor: !ActiveYN ? '#2f87ff' : '#E8EAED',
                    backgroundColor: '#2f87ff',
                    borderColor: '#2f87ff',
                  }}
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      if (certType === 'toss') opeToassAuthApp();
                      else if (certType === 'naver') openNaverAuthApp();
                      //else if (certType === 'kakao') openKakaoAuthApp();
                    } else {
                      actionSheetRef.current?.hide();
                    }
                  }}
                >
                  {/* <ButtonText style={{ color: !ActiveYN ? '#fff' : '#717274' }}>
                    앱 바로가기
                  </ButtonText> */}
                  <ButtonText style={{ color: '#fff' }}>
                    앱으로 바로가기
                  </ButtonText>
                </Button>
              </DropShadow>
            )}
          </View>
        </ButtonSection>

      </SheetContainer>
    </ActionSheet >
  );
};

export default InfoCertification;
