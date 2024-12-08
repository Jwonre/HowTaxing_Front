// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  BackHandler,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React, { useLayoutEffect, useRef, useCallback, useState,useEffect } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import DeleteIcon from '../../assets/icons/delete_circle.svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
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

const ModalText = styled.Text`
  font-size: 17px;
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

const UnserLineButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-regular;
  text-align: center;
  color: #717274;
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

const ButtonSection = styled.View`
margin-top: 10px;
  width: 100%;
`;
const Button2 = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  align-self: center;
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

const DeleteCircleButton = styled.TouchableOpacity.attrs(props => ({
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

const Login_ID = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const webviewRef = useRef(null);
  const { width } = useWindowDimensions();
  const [activeButton, setActiveButton] = useState(true);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input1.current) {
        input1.current.focus();
      }
    }, 100); // 딜레이 추가
    return () => clearTimeout(timer);
  }, []);

  const getLogin = async () => {
    console.log('아이디 로그인');
    const data = {
      id,
      password
    }
    try {
      //////console.log('[HouseDetail] Fetching house details for item:', item);
      const response = await axios.post(`${Config.APP_API_URL}user/login`, data, { headers: null });
      console.log('response', response);
      const detaildata = response.data.data;
      console.log('detaildata', detaildata);
      if (response.data.errYn === 'Y') {
        if (response.data.errCode === 'LOGIN-003') {
          SheetManager.show('info', {
            payload: {
              errorType: response.data.type,
              type: 'error',
              message: '존재하지 않는 아이디에요.',
            },
          });
        } else if (response.data.errCode === 'LOGIN-002') {
          SheetManager.show('info', {
            payload: {
              errorType: response.data.type,
              type: 'error',
              message: '비밀번호가 정확하지 않아요.',
              description: '5회 잘못 입력 시 5분 후 재시도 할 수 있어요.\n(현재 ' + response.data.errMsgDtl.substring(0, 1) + '회 불일치)',
            },
          });
        } else if (response.data.errCode === 'LOGIN-004') {
          SheetManager.show('info', {
            payload: {
              errorType: response.data.type,
              type: 'error',
              message: '잠시 후에 다시 시도해주세요.',
              description: '비밀번호를 반복하여 잘못 입력하셨어요.',
            },
          });
        } else {
          SheetManager.show('info', {
            payload: {
              errorType: response.data.type,
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '로그인을 하는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            },
          });
        }
      } else {
        console.log('detaildata.accessToken', detaildata.accessToken);
        console.log('detaildata.refreshToken', detaildata.refreshToken);
        await onIDLogin(detaildata.accessToken, detaildata.refreshToken);
      }
    } catch (error) {
      console.log('error', error);
      SheetManager.show('info', {
        payload: {
          errorType: response.data.type,
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


  /**
   * This function is a callback function for NetInfo's
   * event listener. It returns a promise that resolves
   * to true if the internet is connected and false if
   * it is not. It also navigates to the NetworkAlert
   * screen if the internet is not connected.
   *
   * @param {Object} state - The state of the internet
   *   connection.
   *
   * @return {Promise<Boolean>} - A promise that resolves
   *   to true if the internet is connected and false if
   *   it is not.
   */
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

  const handleBackPress = () => {
    navigation.navigate('Login');
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
    StatusBar.setBarStyle('dark-content', true); // 아이콘 색상: 어두운 색
    StatusBar.setBackgroundColor('#ffffff'); // 배경색: 흰색 (안드로이드 전용)
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '아이디로 시작하기',
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
        <View style={{ marginBottom: 25 }}>
          <ModalText>아이디</ModalText>
          <ModalInputContainer>
            <ModalInput
              ref={input1}
              onSubmitEditing={() => input2.current.focus()}
              placeholder="아이디를 입력해주세요."
              //  autoFocus={currentPageIndex === 2}
              value={id}
              onChangeText={setId}
              autoCompleteType="id"
              autoCapitalize="none"
            />
            <DeleteCircleButton
              onPress={() => {
                setId('');
              }}>
              <DeleteIcon />
            </DeleteCircleButton>
          </ModalInputContainer>
          {/* Find ID Button */}
          <TouchableOpacity style={styles.findIdButton}
            onPress={() => {
              // navigation.push('CheckTerms', { LoginAcessType: 'IDPASS', id: id, password: password })
              navigation.navigate('IdFindScreen', { id:id, authType : 'FIND_ID',LoginAcessType : 'IDPASS'});
              // dispatch(clearHouseInfo());
              // navigation.navigate('PaymentScreen', { id:id, authType : 'FIND_ID',LoginAcessType : 'IDPASS'});

            }}>
            <UnserLineButtonText>아이디 찾기</UnserLineButtonText>
          </TouchableOpacity>
        </View>
        <View>
          <ModalText>비밀번호</ModalText>
          <ModalInputContainer>
            <ModalInput
              ref={input2}
              //  onSubmitEditing={() => input2.current.focus()}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChangeText={setPassword}
              autoCompleteType="pwd"
              secureTextEntry={true}
              onSubmitEditing={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {

                }
              }}
            />
            <DeleteCircleButton
              onPress={() => {
                setPassword('');
              }}>
              <DeleteIcon />
            </DeleteCircleButton>
          </ModalInputContainer>
          <TouchableOpacity style={styles.findIdButton}
            onPress={() => {
              navigation.navigate('PasswordReSettingScreen', { id:id, authType : 'RESET_PW',LoginAcessType : 'IDPASS'});
              // dispatch(clearHouseInfo());
            }}>
            <UnserLineButtonText>비밀번호 재설정</UnserLineButtonText>
          </TouchableOpacity>
        </View>
      </IntroSection>
      <ButtonSection>
        <Button
          width={width}
          onPress={async() => {
            const state = await NetInfo.fetch();
            const canProceed = await handleNetInfoChange(state);
            if (canProceed) {
              getLogin();
            }
          }
            // 동의하기 버튼 클릭 시 redux에 저장
          }>
          <ButtonText>{'시작하기'}</ButtonText>
        </Button>
        <View style={{ marginTop: 20 }}>
          <ModalText style={{ textAlign: 'center', marginBottom: 10 }}>계정이 없으신가요?</ModalText>
          <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('AddMembership')}>
            <MembershipText>회원가입</MembershipText>
          </TouchableOpacity>
        </View>
      </ButtonSection>
    </Container>
  );
};


const styles = StyleSheet.create({
  
  findId: {
    fontSize: 13, // 폰트 크기
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
    color: '#717274',
    textDecorationLine: 'underline', // 밑줄 추가
    textDecorationColor: '#717274', // 밑줄 색상 설정
  },
 
  findIdButton: {
    marginTop:10,
    alignSelf: 'flex-end', // 부모의 오른쪽 끝에 정렬
  },
});
export default Login_ID;
