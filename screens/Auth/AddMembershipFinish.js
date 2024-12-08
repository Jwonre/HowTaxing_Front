// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, { useLayoutEffect, useState, useCallback, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import CloseIcon from '../../assets/icons/close_button.svg';
import { SheetManager } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import Config from 'react-native-config'
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { setCurrentUser } from '../../redux/currentUserSlice';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;

const IntroSection = styled.View`

  padding: 20px;
  margin-top: 20px;
`;

const ProfileAvatar = styled(FastImage).attrs(props => ({
  resizeMode: 'stretch',
}))`
  width: 250px;
  height: 250px;
  align-self: center;
  margin-Top: 20px;
  margin-Bottom: 10px;
`;

const ModalText = styled.Text`
  font-size: 25px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  letter-spacing: -0.3px;
  margin-bottom: 5px;
  text-align: center;
  margin-bottom: 30px;
`;

const MembershipText = styled.Text`
  font-size: 17px;
  font-family: Pretendard-medium;
  text-align: center;
  color: #A3A5A8;
  line-height: 20px;
  //letter-spacing: -0.3px;
  //text-decoration: underline;
    margin-bottom: 10px;
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
  color: #ffffff;
  line-height: 20px;
`;


const AddMembershipFinish = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const webviewRef = useRef(null);
  const { width } = useWindowDimensions();
  const [activeButton, setActiveButton] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  const handleBackPress = () => {
    navigation.navigate('Login_ID');
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

  const getLogin = async () => {
    console.log('아이디 로그인');
    const data = {
      id: props?.route?.params?.id,
      password : props?.route?.params?.password
    }
    try {
      //////console.log('[HouseDetail] Fetching house details for item:', item);
      const response = await axios.post(`${Config.APP_API_URL}user/login`, data, { headers: null });
      console.log('response', response);
      const detaildata = response.data.data;
      console.log('detaildata', detaildata);
      if (response.data.errYn == 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '로그인을 하는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
          },
        });
      } else {
        console.log('detaildata.accessToken', detaildata.accessToken);
        console.log('detaildata.refreshToken', detaildata.refreshToken);
        await onIDLogin(detaildata.accessToken, detaildata.refreshToken);
      }
    } catch (error) {
      console.log('error', error);
      SheetManager.show('info', {
        payload: {
          type: 'error',
          message: error?.errMsg ? error?.errMsg : '로그인을 하는데 문제가 발생했어요.',
          errorMessage: error?.errCode ? error?.errCode : 'error',
        },
      });
    }
  };


  const onIDLogin = async (accessToken, refreshToken) => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      const tokens = temp(accessToken, refreshToken);
      console.log('tokens', tokens);
      //console.log('Login:', event.nativeEvent.data);
      //console.log('Login token:', tokens[0]);
      const tokenObject = { 'accessToken': tokens[0], 'refreshToken': tokens[1] };
      //console.log('Login tokenObject:', tokenObject);
      dispatch(setCurrentUser(tokenObject));

    }
  };

  const temp = (accessToken, refreshToken) => {
    return [accessToken, refreshToken];
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.navigate('Login_ID');
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '회원가입 완료하기',
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
      <IntroSection>
        <ProfileAvatar source={require('../../assets/images/addmembership_finish.png')} />
        <ModalText>회원가입이 완료되었어요!</ModalText>
        <MembershipText>하우택싱에 오신 여러분 진심으로 환영해요.{'\n'}어떤 주택세금 걱정도 이제는 그만!</MembershipText>
      </IntroSection>
      <ButtonSection>
        <Button
          style={{ backgroundColor: '#2F87FF' }}
          width={width}
          onPress={async () => {
            
            if( props?.route?.params?.LoginAcessType === 'SOCIAL'){
              console.log('loginAcessType:',props?.route?.params?.LoginAcessType);
              console.log('loginAcessType:',props?.route?.params?.accessToken);
              console.log('loginAcessType:',navigation);

              // await navigation.push('Home', { accessToken : props?.route?.params?.accessToken ,
              //   LoginAcessType : props?.route?.params?.LoginAcessType});

                const tokens = temp(props?.route?.params?.accessToken, props?.route?.params?.refreshToken);
                console.log('tokens', tokens);
                //console.log('Login:', event.nativeEvent.data);
                //console.log('Login token:', tokens[0]);
                const tokenObject = { 'accessToken': tokens[0], 'refreshToken': tokens[1] };
                //console.log('Login tokenObject:', tokenObject);
                dispatch(setCurrentUser(tokenObject));

            }else{
              const state = await NetInfo.fetch();
            const canProceed = await handleNetInfoChange(state);
            if (canProceed) {
              getLogin();
             
            }
            }
           
          }
            // 동의하기 버튼 클릭 시 redux에 저장
          }>
          <ButtonText>{'시작하기'}</ButtonText>
        </Button>
      </ButtonSection>
    </Container>
  );
};

export default AddMembershipFinish;
