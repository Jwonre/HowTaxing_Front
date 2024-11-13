import {StatusBar, useWindowDimensions} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import styled from 'styled-components';
import {useNavigation} from '@react-navigation/native';
import getFontSize from '../../utils/getFontSize';
//import {login} from '@react-native-seoul/kakao-login';
//import NaverLogin from '@react-native-seoul/naver-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {useDispatch} from 'react-redux';
import {setCurrentUser} from '../../redux/currentUserSlice';
import axios from 'axios';
import {SheetManager} from 'react-native-actions-sheet';
import Config from 'react-native-config'

const Container = styled.ImageBackground.attrs(props => ({
  source: require('../../assets/images/BackGroundLogin.png'),
  resizeMode: 'cover',
}))`
  flex: 1;
  background-color: #fff;
`;

const IntroSection = styled.View`
  flex: 1;
  width: 100%;
  padding: 25px;
  justify-content: center;
`;

const SocialButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: ${props => props.width - 40}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-radius: 30px;
  padding: 10px;
  margin: 5px;
  margin-top: 8px;
`;

const SocialButtonText = styled.Text`
  width: auto;
  font-size: 15px;
  font-family: Pretendard-Regular;
  line-height: 20px;
  letter-spacing: -0.3px;
`;

const SocialButtonIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 22px;
  height: 20px;
  margin-right: 10px;
`;

const ButtonSection = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 50px;
`;

const LogoGroup = styled.View`
  width: 260px;
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
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 카카오 로그인
  const onKakaoLogin = async () => {
    const {accessToken} = await login();

    if (accessToken) {
      socialLogin(0, accessToken);
    }
  };

  // 네이버 로그인
  const onNaverLogin = async () => {
    await NaverLogin.login({
      appName: '하우택싱',
      consumerKey: 'orG8AAE8iHfRSoiySAbv',
      consumerSecret: 'DEn_pJGqup',
      serviceUrlScheme: 'howtaxingrelease',
    }).then(async res => {
      const {accessToken} = res?.successResponse;

    //  ////console.log('accessToken', accessToken);

      if (accessToken) {
        socialLogin(1, accessToken);
      }
    });
  };

  // 구글 로그인
  const onGoogleLogin = async () => {
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
     // ////console.log('accessToken', accessToken);

      socialLogin(2, accessToken);
    } catch (error) {
      ////console.log('error', error);
    }
  };

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
    dispatch(
      setCurrentUser({
        name: '김하우',
        email: '',
      }),
    );
  };

  // 소셜 로그인
  const socialLogin = async (userType, accessToken) => {
    const data = {
      userType,
      accessToken,
    };

    axios
      .post(`${Config.APP_API_URL}user/socialLogin`, data)
      .then(response => {
        if (response.data.isError) {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: '로그인에 실패했습니다.',
              description: response.data.errMsg,
              buttontext: '확인하기',
            },
          });
          return;
        }
        // 성공적인 응답 처리
        const {id} = response.data;
        getUserData(id);
      })
      .catch(error => {
        // 오류 처리
        console.error(error);
      });
  };

  // 유저 정보 가져오기
  const getUserData = async id => {
    await axios
      .get(`${Config.APP_API_URL}user/${id}`)
      .then(response => {
        // 성공적인 응답 처리
      //  ////console.log(response.data);
        const userData = response.data;
        dispatch(setCurrentUser(userData));
      })
      .catch(error => {
        // 오류 처리
        console.error(error);
      });
  };

  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <Overlay />
      <ButtonSection>
        <IntroSection>
          <LogoGroup>
            <LogoImage source={require('../../assets/images/logo.png')} />
          </LogoGroup>
        </IntroSection>
        <SocialButton
          onPress={onKakaoLogin}
          width={width}
          style={{
            backgroundColor: '#FBE54D',
          }}>
          <SocialButtonText
            style={{
              color: '#3B1F1E',
            }}>
            <SocialButtonIcon
              source={require('../../assets/images/socialIcon/kakao_ico.png')}
            />
            {'  '}
            카카오톡으로 로그인
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
            네이버로 로그인
          </SocialButtonText>
        </SocialButton>
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
      </ButtonSection>
    </Container>
  );
};

export default Login;
