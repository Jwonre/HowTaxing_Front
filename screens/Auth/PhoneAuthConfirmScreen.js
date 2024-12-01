

// import Icon from 'react-native-vector-icons/Ionicons';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar
} from 'react-native';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DeleteIcon from '../../assets/icons/delete_circle.svg';

import axios from 'axios';
import { SheetManager } from 'react-native-actions-sheet';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';

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

const PhoneAuthConfirmScreen = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authNum, setAuthNumber] = useState('');
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const _scrollViewRef = useRef(null);
  const [step, setStep] = useState(1); // 현재 단계 상태 (1: 휴대폰 입력, 2: 인증번호 입력)
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

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
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000); // 1초마다 감소
    } else if (timer === 0) {
      clearInterval(interval); // 타이머 종료
    }
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [isTimerActive, timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60); // 분
    const seconds = time % 60; // 초
    console.log("남은시간 : ", `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`; // "분:초" 형식
  };
  const handleResendAuth = () => {
    setStep(1);
    setTimer(180); // 타이머를 3분으로 초기화
    setIsTimerActive(false); // 타이머 활성화
    setAuthNumber('');
    handleNextStep(1);
    console.log('인증번호 재전송');
    // 인증번호 재전송 API 호출 로직 추가
  };

  // 버튼 클릭 핸들러
  const handleNextStep = async () => {
    if (step === 1) {
      // 첫 번째 단계에서 다음 단계로 이동
      const state = await NetInfo.fetch();
      const canProceed = await handleNetInfoChange(state);
      if (canProceed) {
        console.log("sendAuthMobile",`${props.route?.params?.authType}`)
        sendAuthMobile(phoneNumber.replace(/-/g, ''),props.route?.params?.authType,props?.route?.params?.id);
      }


    } else {
       // 첫 번째 단계에서 다음 단계로 이동
       const state = await NetInfo.fetch();
       const canProceed = await handleNetInfoChange(state);
       if (canProceed) {
         sendAuthMobileConfirm(phoneNumber.replace(/-/g, ''),props.route?.params?.authType,authNum);
       }

      // 두 번째 단계에서 확인 버튼 클릭
      console.log('인증번호 확인:', authNum);
      // 여기서 인증번호 검증 로직 추가
    }
  };

  const handleSignUp = async (phoneNumber,authKey, agreeMarketing) => {
    // 요청 헤더
   

    // 요청 바디
    const data = {
      joinType: props?.route?.params?.LoginAcessType === 'SOCIAL' ? 'SOCIAL' : 'IDPASS',
      id:  props?.route?.params?.id,
      password: props?.route?.params?.LoginAcessType === 'SOCIAL' ? null : props?.route?.params?.password,
      mktAgr: agreeMarketing,
      phoneNumber : phoneNumber,
      authKey : authKey,
      email : props?.route?.params?.email ? props?.route?.params?.email : null,
    };
    console.log('sendAuthMobile', data.joinType);
    console.log('sendAuthMobile', data.id);
    console.log('sendAuthMobile', data.mktAgr);
    console.log('sendAuthMobile', data.password);


    try {
      const response = await axios.post(`${Config.APP_API_URL}user/signUp`, data);
      console.log('response', response);
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            message: response.data.errMsg ? response.data.errMsg : '회원가입 도중에 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            buttontext: '확인하기',
          },
        });
        return false;
      } else {
        setTimer(180); // 타이머를 3분으로 초기화
    setIsTimerActive(false); // 타이머 활성화
        /* SheetManager.show('info', {
           payload: {
             type: 'info',
             message: '회원가입에 성공했습니다.',
           },
         });*/
        // 성공적인 응답 처리
        // const { id } = response.data;
        //    ////console.log("1111111", response);
        navigation.navigate('AddMembershipFinish', { prevSheet: 'PhoneAuthConfirmScreen',
          LoginAcessType : props?.route?.params.LoginAcessType,
          accessToken : props?.route?.params?.accessToken ,
          refreshToken : props?.route?.params?.refreshToken,
          id:  props?.route?.params?.id,
          password: props?.route?.params?.LoginAcessType === 'SOCIAL' ? null : props?.route?.params?.password, });

        return true;
      }
    } catch (error) {
      // 오류 처리
      SheetManager.show('info', {
        payload: {
          message: '회원가입에 실패했습니다.',
          description: error?.message,
          type: 'error',
          buttontext: '확인하기',
        }
      });
      console.error(error);
      return false;
    }
  };


  const sendAuthMobile = async ( phoneNumber, authType, id = null) => {
    const data = {
      phoneNumber,
      authType,

    };

    console.log("sendAuthMobile",`data : ${data.joinType} ${data.phoneNumber} , ${data.authType}`);
    if (id) {
      data.id =id;
    }

    axios
      .post(`${Config.APP_API_URL}sms/sendAuthCode`, data)
      .then(async response => {
        console.log("sendAuthMobile",`data : ${response.data.errYn} ${response.data.errMsg ? response.data.errMsg :''} , ${data.authType}`);

        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          const userData = response.data.data;
          setStep(2);
          setIsTimerActive(true); // 타이머 활성화
        }
        // 성공적인 응답 처리

      })
      .catch(error => {
        // 오류 처리
        SheetManager.show('info', {
          payload: {
            message: '인증번호 발송에 실패하였습니다.',
            description: error?.message,
            type: 'error',
            buttontext: '확인하기',
          }
        });
        console.error(error);
      });
  };
  const sendAuthMobileConfirm = async ( phoneNumber, authType, authCode) => {
    const data = {
      authCode,
      phoneNumber,
      authType,
    };

    

    axios
      .post(`${Config.APP_API_URL}sms/checkAuthCode`, data)
      .then(async response => {

        console.log('sendAuthMobile', response.data.errYn);

        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '인증번호 검증에 실패했습니다..',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          const userData = response.data.data;
          console.log('sendAuthMobile', userData.authKey);

          handleSignUp(
            phoneNumber.replace(/-/g, ''),
            userData.authKey,
            props?.route?.params?.agreeMarketing
          );
        }
        // 성공적인 응답 처리

      })
      .catch(error => {
        // 오류 처리
        SheetManager.show('info', {
          payload: {
            message: '인증번호 발송에 실패하였습니다.',
            description: error?.message,
            type: 'error',
            buttontext: '확인하기',
          }
        });
        console.error(error);
      });
  };

  useLayoutEffect(() => {
    // 상태 표시줄 설정 (전역 설정)
    StatusBar.setBarStyle('dark-content', true); // 아이콘 색상: 어두운 색
    StatusBar.setBackgroundColor('#ffffff'); // 배경색: 흰색 (안드로이드 전용)
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();
            // dispatch(clearHouseInfo());
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),

      headerTitleAlign: 'center',
      title: '휴대폰 인증하기',
      headerShadowVisible: false,
      // contentStyle: {
      //   borderTopColor: '#D9D9D9',
      //   borderTopWidth: 1,
      // },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,

      },

    });
  }, []);

  return (
    <View style={styles.rootContainer}>
      {/* 파란색 라인 */}
      <View style={styles.blueLine} />

      {/* 스크롤 뷰 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.bigTitle}>휴대폰 인증을 진행해주세요.</Text>
          <Text style={styles.bigSubTitleLabel}>편리한 서비스 이용을 위해 본인 인증을 부탁드려요.</Text>


          {/* Label */}
          <Text style={styles.label}>휴대폰 번호</Text>
          <Text style={styles.subTitleLabel}>본인 인증을 위해 휴대폰 번호를 알려주세요.</Text>

          {/* Input Field */}
          <View style={styles.inputWrapper}>
            <TextInput
              keyboardType="phone-pad" // 숫자 키보드 표시
              maxLength={13} // 최대 11자리 (01012345678)
              style={styles.input}
              placeholder="휴대폰 번호를 입력해주세요."
              placeholderTextColor="#A3A5A8"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))} // 포맷팅 적용
            />
            {phoneNumber !== '' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setPhoneNumber('')}
              >
                <DeleteIcon />
              </TouchableOpacity>
            )}
          </View>

        </View>

        {step === 2 && (
          <View style={styles.secondContent}>
            <View style={styles.inputSection}>
              {/* Label */}
              <Text style={styles.label}>인증번호</Text>
              <Text style={styles.subTitleLabel}>SMS로 도착한 인증번호를 알려주세요.</Text>

              {/* Input Field */}
              <View style={styles.inputAuthWrapper}>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="SMS로 도착한 인증번호를 알려주세요."
                  placeholderTextColor="#A3A5A8"
                  value={authNum}
                  onChangeText={setAuthNumber}
                />
                {isTimerActive && timer > 0 && (
                  <Text style={styles.timerText}>{formatTime(timer)}</Text>
                )}
                {authNum !== '' && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setAuthNumber('')}
                  >
                    <DeleteIcon />
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={[
                  styles.resendWrapper,
                  timer === 0 ? styles.spaceBetween : styles.flexEnd,
                ]}
              >
                {timer === 0 && (
                  <Text style={styles.expiredText}>인증번호가 만료되었습니다.</Text>
                )}
                <TouchableOpacity style={styles.findIdButton} onPress={handleResendAuth}>
                  <Text style={styles.authReSend}>인증번호 재전송</Text>
                </TouchableOpacity>
              </View>



            </View>



          </View>
        )}

        {/* 만료 메시지 */}
        {/* 만료 메시지와 재전송 버튼 */}

        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            (!phoneNumber || timer === 0) && styles.disabledButton, // 조건부 스타일
          ]}
          onPress={handleNextStep}
          disabled={!phoneNumber || timer === 0} // 비활성화 조건
        >
          <Text style={styles.loginButtonLabel}>
            {step === 1 ? '인증번호 전송하기' : '다음으로'}
          </Text>
        </TouchableOpacity>




      </ScrollView>
    </View>

  );
};

const formatPhoneNumber = (number) => {
  // 숫자만 남기기
  const cleaned = ('' + number).replace(/\D/g, '');

  // 010-XXXX-XXXX 형식으로 포맷팅
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  // 포맷이 적용되지 않는 경우 원본 반환
  return number;
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 13,
    color: '#FF7401', // 빨간색 텍스트
    marginRight: 10,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blueLine: {
    height: 5, // 라인 두께
    backgroundColor: '#2f87ff', // 파란색
  },
  content: {
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  secondContent: {
    marginTop: 20,
  },
  inputSection: {
    marginTop: 10,
  },
  bigTitle: {
    fontSize: 25,
    marginTop: 15,
    marginBottom: 20,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },

  label: {
    fontSize: 17,
    marginBottom: 5,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  bigSubTitleLabel: {
    fontSize: 17,
    marginBottom: 30,
    color: '#A3A5A8',
    fontFamily: 'Pretendard_Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  subTitleLabel: {
    fontSize: 13,
    marginBottom: 10,
    color: '#717274',
    fontFamily: 'Pretendard-Medium', // 원하는 폰트 패밀리
    fontWeight: '500', // 폰트 두께 (400은 기본)
  },
  inputWrapper: {
    flexDirection: 'row', // TextInput과 Clear 버튼 가로 배치
    alignItems: 'center', // 세로 가운데 정렬
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 8, // TextInput과 "아이디 찾기" 버튼 사이 간격
  },

  inputAuthWrapper: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 8,
  },

  input: {
    flex: 1, // TextInput이 남은 공간을 차지하도록 설정
    color: '#000',
    fontSize: 17,
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
  authReSend: {
    fontSize: 13, // 폰트 크기
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
    color: '#717274',
    textDecorationLine: 'underline', // 밑줄 추가
    textDecorationColor: '#717274', // 밑줄 색상 설정
  },
  disabledButton: {
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 30,
  },

  loginButton: {
    backgroundColor: '#2F87ff',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 30,
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Pretendard-Medium', // 원하는 폰트 패밀리
    fontWeight: 'medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)

  },

  signUpText: {
    fontSize: 13,
    color: '#2F87FF',
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
    textDecorationLine: 'underline', // 밑줄 추가
    textDecorationColor: '#2F87FF', // 밑줄 색상 설정
  },
  resendWrapper: {
    flexDirection: 'row', // 가로 배치
    justifyContent: 'space-between', // 양 끝 정렬
    alignItems: 'center', // 세로 중앙 정렬
    marginTop: 5,
  },
  spaceBetween: {
    justifyContent: 'space-between', // 메시지와 버튼을 양 끝에 배치
  },
  flexEnd: {
    justifyContent: 'flex-end', // 버튼만 오른쪽 정렬
  },
  expiredText: {
    fontSize: 13,
    color: '#FF7401', // 빨간색 텍스트
    marginVertical: 5,
    fontFamily: 'Pretendard-Regular',
  },
  findIdButton: {
    alignSelf: 'flex-end', // 부모의 오른쪽 끝에 정렬
  },
});



export default PhoneAuthConfirmScreen;
