import { Text, StatusBar, useWindowDimensions, View, Linking, BackHandler } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import getFontSize from '../../utils/getFontSize';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../redux/currentUserSlice';
import axios from 'axios';
import { SheetManager } from 'react-native-actions-sheet';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config'
import platformToKorean from '../../utils/platformUtils';
import kakaoAuthManager from '../../screens/Auth/KakaoAuthManager';
import NaverAuthManager from '../../screens/Auth/NaverAuthManager';


const Container = styled.ImageBackground.attrs(props => ({
  source: require('../../assets/images/BackGroundLogin2.png'),
  resizeMode: 'cover',
}))`
  flex: 1;
  background-color: #fff;
`;

const IntroSection = styled.View`
  flex: 0.98;
  width: 100%;
  padding: 25px;
  justify-content: center;
`;

const SansText = styled.Text`
  font-size: 22px;
  color: #fff;
  text-align: center;
  font-family: Pretendard-Regular;
  font-style: normal;
  line-height: 25px; 
`;

const SocialButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: ${props => props.width - 40}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 55px;
  border-radius: 30px;
  padding: 10px;
  margin: 5px;
  margin-top: 6px;
  line-heght: 20px;
`;

const SocialButtonText = styled.Text`
  width: auto;
  font-size: 14px;
  font-family: Pretendard-Regular;
  line-height: 20px;
  letter-spacing: -0.3px;
`
const SocialButtonIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 17px;
  height: 17px;
  margin-right: 5px;
`;

const ButtonSection = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 30px;
`;

const LogoGroup = styled.View`
  width: 240px;
  height: 50px;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 100%;
  height: 100%;
`;

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(27, 28, 31, 0.73);
`;


const Login = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  //const [isConnected, setIsConnected] = useState(true);
  const agreeMarketing = route.params ? route.params.agreeMarketing : false;
  const accessToken = null;
  // const [result, setResult] = useState<string | null>(null);

  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);



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


  // const handleWebViewMessage = async (event) => {
  //   const tokens = temp(event);
  //   //console.log('Login:', event.nativeEvent.data);
  //   if (event.nativeEvent.data.role === 'GUEST') {
  //     await navigation.push('CheckTerms', { tokens: tokens });
  //     //약관확인 화면으로 이동 후 약관 동의 완료시 handleSignUp 진행
  //   } else {
  //     //console.log('Login token:', tokens[0]);
  //     const tokenObject = { 'accessToken': tokens[0], 'refreshToken': tokens[1] };
  //     //console.log('Login tokenObject:', tokenObject);
  //     dispatch(setCurrentUser(tokenObject));
  //   }
  // };
  // const temp = (event) => {
  //   const accessToken = event.nativeEvent.data.accessToken;
  //   const refreshToken = event.nativeEvent.data.refreshToken;
  //   return [accessToken, refreshToken];
  // }


  // 카카오 로그인
  const onKakaoLogin = async () => {
    /*const { accessToken } = await login();
   
    if (accessToken) {
      socialLogin(0, accessToken);
    }
  */
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      try{

        const message = await kakaoAuthManager.unlink();
        // setResult(message ? message : '로그아웃 실패');
        console.log("message ",message ? message : '로그아웃 실패');

        const token = await kakaoAuthManager.signIn();
        // setResult(token ? JSON.stringify(token) : '로그인 실패');

        //성공시 토큰 처리 ;

        const profile = await kakaoAuthManager.getProfile();
        // setResult(profile ? JSON.stringify(profile) : '프로필 가져오기 실패');
        console.log("token ",token ? JSON.stringify(token): '로그인 실패');

        console.log("profile ",profile ? JSON.stringify(profile): '로그인 실패');
      }catch(error){
        console.error("kakao Login Error : ",error);
      }
      // navigation.navigate('LoginWebview', { onWebViewMessage: handleWebViewMessage, 'socialType': 'kakao', });
    }

  };

  // 네이버 로그인
  const onNaverLogin = async () => {
    /*
    await NaverLogin.login({
      appName: '하우택싱',
      consumerKey: 'orG8AAE8iHfRSoiySAbv',
      consumerSecret: 'DEn_pJGqup',
      serviceUrlScheme: 'howtaxing',
    }).then(async res => {
      const { accessToken } = res?.successResponse;
   
      ////console.log('accessToken', accessToken);
   
      if (accessToken) {
        socialLogin(1, accessToken);
      }
    });
    */
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      NaverAuthManager.signIn();
      // navigation.navigate('LoginWebview', { onWebViewMessage: handleWebViewMessage, 'socialType': 'naver', });
    }
  };
// 네이버 로그인
const onAppleLogin = async () => {
  /*
  await NaverLogin.login({
    appName: '하우택싱',
    consumerKey: 'orG8AAE8iHfRSoiySAbv',
    consumerSecret: 'DEn_pJGqup',
    serviceUrlScheme: 'howtaxing',
  }).then(async res => {
    const { accessToken } = res?.successResponse;

    ////console.log('accessToken', accessToken);

    if (accessToken) {
      socialLogin(1, accessToken);
    }
  });
  */
  const state = await NetInfo.fetch();
  const canProceed = await handleNetInfoChange(state);
  if (canProceed) {
    // navigation.navigate('LoginWebview', { onWebViewMessage: handleWebViewMessage, 'socialType': 'naver', });
  }
};
  const onIDLogin = async () => {
    /*
    await NaverLogin.login({
      appName: '하우택싱',
      consumerKey: 'orG8AAE8iHfRSoiySAbv',
      consumerSecret: 'DEn_pJGqup',
      serviceUrlScheme: 'howtaxing',
    }).then(async res => {
      const { accessToken } = res?.successResponse;
   
      ////console.log('accessToken', accessToken);
   
      if (accessToken) {
        socialLogin(1, accessToken);
      }
    });
    */
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      navigation.navigate('IdLoginScreen');
    }
  };



  // 구글 로그인
  const onGoogleLogin = async () => {
    /*
    await GoogleSignin.hasPlayServices();
   
    const GOOGLE_CLIENT_ID =
      '797361358853-j9mpkpnq9bgrnmahi46dgkb5loufk5bg.apps.googleusercontent.com';
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
    try {
      await GoogleSignin.signIn();
      const user = await GoogleSignin.getTokens();
   
      const accessToken = user.accessToken;
      ////console.log('accessToken', accessToken);
   
      socialLogin(2, accessToken);
    } catch (error) {
      ////console.log('error', error);
    }
*/
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      // navigation.navigate('LoginWebview', { onWebViewMessage: handleWebViewMessage, 'socialType': 'google', });
    }



  };
  /*
    // 애플 로그인
    const onAppleLogin = async () => {
      // if (appleAuthAndroid.isSupported) {
      //   const appleAuthRequestResponse = await appleAuth.performRequest({
      //     requestedOperation: appleAuth.Operation.LOGIN,
      //     // Note: it appears putting FULL_NAME first is important, see issue #293
      //     requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      //   });
      //   // Ensure Apple returned a user identityToken
      //   if (!appleAuthRequestResponse.identityToken) {
      //     throw 'Apple Sign-In failed - no identify token returned';
      //   }
      //   // get current authentication state for user
      //   // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      //   const credentialState = await appleAuth.getCredentialStateForUser(
      //     appleAuthRequestResponse.user,
      //   );
      //   // Create a Firebase credential from the response
      //   const {identityToken, nonce} = appleAuthRequestResponse;
  
      //   // use credentialState response to ensure the user is authenticated
      //   if (credentialState === appleAuth.State.AUTHORIZED) {
      //     // user is authenticated
      //     ////console.log('user is authenticated', credentialState);
      //   }
      // } else {
      //   ////console.log('ios only');
      // }
      //    dispatch(
      //      setCurrentUser({
      //        name: '김하우',
      //        email: '',
      //      }),
      //    );
      /*
       <SocialButton
                onPress={onGoogleLogin}
                width={width}
                style={{
                  backgroundColor: '#fff',
                }}>
                <SocialButtonIcon
                  source={require('../../assets/images/socialIcon/google_ico_color.png')}
                />
                <SocialButtonText
                  style={{
                    color: '#3B1F1E',
                  }}>
                  구글로 로그인
                </SocialButtonText>
              </SocialButton>
              <SocialButton
                onPress={onAppleLogin}
                width={width}
                style={{
                  backgroundColor: '#161617',
                }}>
                <SocialButtonIcon
                  style={{
                    width: 16,
                    height: 20,
                  }}
                  source={require('../../assets/images/socialIcon/apple_ico.png')}
                />
                <SocialButtonText
                  style={{
                    color: '#fff',
                  }}>
                  애플로 로그인
                </SocialButtonText>
              </SocialButton>
      
      dispatch(setCurrentUser(null));
      navigation.push('CheckTerms');
    };
    */
  // 소셜 로그인
  const socialLogin = async (userType, accessToken) => {
    const data = {
      userType,
      accessToken,
    };

    axios
      .post(`${Config.APP_API_URL}user/socialLogin`, data)
      .then(response => {
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '소셜 로그인에 실패했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          const { id } = response.data;
          getUserData(id);
        }
        // 성공적인 응답 처리

      })
      .catch(error => {
        // 오류 처리
        SheetManager.show('info', {
          payload: {
            message: '로그인에 실패했습니다.',
            description: error?.message,
            type: 'error',
            buttontext: '확인하기',
          }
        });
        console.error(error);
      });
  };

  // const getLogin = async () => {
  //   console.log('아이디 로그인');
  //   const data = {
  //     id,
  //     password
  //   }
  //   try {
  //     //////console.log('[HouseDetail] Fetching house details for item:', item);
  //     const response = await axios.post(`${Config.APP_API_URL}auth2/authorization`, data, { headers: null });
  //     console.log('response', response);
  //     const detaildata = response.data.data;
  //     console.log('detaildata', detaildata);
  //     if (response.data.errYn === 'Y') {
  //       if (response.data.errCode === 'LOGIN-003') {
  //         SheetManager.show('info', {
  //           payload: {
  //             prevSheet: 'Login_ID',
  //             type: 'error',
  //             message: '존재하지 않는 아이디에요.',
  //           },
  //         });
  //       } else if (response.data.errCode === 'LOGIN-002') {
  //         SheetManager.show('info', {
  //           payload: {
  //             prevSheet: 'Login_ID',
  //             type: 'error',
  //             message: '비밀번호가 정확하지 않아요.',
  //             description: '5회 잘못 입력 시 5분 후 재시도 할 수 있어요.\n(현재 ' + response.data.errMsgDtl.substring(0, 1) + '회 불일치)',
  //           },
  //         });
  //       } else if (response.data.errCode === 'LOGIN-004') {
  //         SheetManager.show('info', {
  //           payload: {
  //             prevSheet: 'Login_ID',
  //             type: 'error',
  //             message: '잠시 후에 다시 시도해주세요.',
  //             description: '비밀번호를 반복하여 잘못 입력하셨어요.',
  //           },
  //         });
  //       } else {
  //         SheetManager.show('info', {
  //           payload: {
  //             prevSheet: 'Login_ID',
  //             type: 'error',
  //             message: response.data.errMsg ? response.data.errMsg : '로그인을 하는데 문제가 발생했어요.',
  //             description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
  //           },
  //         });
  //       }
  //     } else {
  //       console.log('detaildata.accessToken', detaildata.accessToken);
  //       console.log('detaildata.refreshToken', detaildata.refreshToken);
  //       await onIDLogin(detaildata.accessToken, detaildata.refreshToken);
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //     SheetManager.show('info', {
  //       payload: {
  //         prevSheet: 'Login_ID',
  //         type: 'error',
  //         message: error?.errMsg ? error?.errMsg : '로그인을 하는데 문제가 발생했어요.',
  //         errorMessage: error?.errCode ? error?.errCode : 'error',
  //       },
  //     });
  //   }
  // };

   
  // 유저 정보 가져오기
  const getUserData = async id => {
    await axios
      .get(`${Config.APP_API_URL}user/${id}`)
      .then(response => {
        // 성공적인 응답 처리
        // ////console.log(response.data);
        const userData = response.data;
        dispatch(setCurrentUser(userData));
      })
      .catch(error => {
        // 오류 처리
        console.error(error);
      });
  };

  const handleBackPress = () => {
    BackHandler.exitApp(); // 앱 종료
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



  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <Overlay />
      <ButtonSection>
        <IntroSection>
          <LogoGroup>
            <LogoImage source={require('../../assets/images/logo.png')} />
          </LogoGroup>
          <View styled={{ height: 'auto', minHeight: 40 }}>
            <SansText >어렵지 않은 주택세금</SansText>
          </View>
        </IntroSection>
        <SocialButton
          onPress={onKakaoLogin}
          width={width}
          style={{
            backgroundColor: '#FBE54D',
          }}>
          <SocialButtonIcon
            source={require('../../assets/images/socialIcon/kakao_ico.png')}
          />
          <SocialButtonText

            style={{
              color: '#3B1F1E',
            }}>
            카카오톡으로 시작하기
          </SocialButtonText>
        </SocialButton>
        <SocialButton
          onPress={onNaverLogin}
          width={width}
          style={{
            backgroundColor: '#3BAC37',
          }}>
          <SocialButtonIcon
            source={require('../../assets/images/socialIcon/naver_ico.png')}
          />
          <SocialButtonText

            style={{
              color: '#fff',
            }}>
            네이버로 시작하기
          </SocialButtonText>

        </SocialButton>

        {platformToKorean.isIOS && (
        <SocialButton
          onPress={onAppleLogin}
          width={width}
          style={{
            backgroundColor: '#000000',
          }}>
          <SocialButtonIcon
            source={require('../../assets/images/socialIcon/apple_ico.png')}
          />
          <SocialButtonText

            style={{
              color: '#fff',
            }}>
            애플로 시작하기
          </SocialButtonText>

        </SocialButton>
          )}

        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              paddingTop: 3,
              paddingBottom: 3,
            }}>또는</Text>
        </View>
        <SocialButton
          onPress={onIDLogin}
          width={width}
          style={{
            backgroundColor: '#2F87FF',
          }}>
          <SocialButtonIcon
            style={{
              width: 13,
              height: 13,
            }}
            source={require('../../assets/images/questionmark.png')}
          />
          <SocialButtonText

            style={{
              color: '#fff',
            }}>
            아이디로 시작하기
          </SocialButtonText>
        </SocialButton>
      </ButtonSection>
    </Container>
  );
};

export default Login;
