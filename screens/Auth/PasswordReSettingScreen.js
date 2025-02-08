

// import Icon from 'react-native-vector-icons/Ionicons';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  StatusBar
} from 'react-native';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import SmsRetriever from 'react-native-sms-retriever';
import CloseIcon from '../../assets/icons/close_button.svg';
import DeleteIcon from '../../assets/icons/delete_circle.svg';
import ConfirmIcon from '../../assets/icons/iucide_check.svg';
import CheckIcon from '../../assets/icons/check_circle.svg';
import ImpossibleIcon from '../../assets/icons/impossible_circle.svg';
import axios from 'axios';
import { SheetManager } from 'react-native-actions-sheet';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config'
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

const PasswordReSettingScreen = props => {
  const [id, setId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authNum, setAuthNumber] = useState('');
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 현재 단계 상태 (1: 휴대폰 입력, 2: 인증번호 입력)
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isTimerActive, setIsTimerActive] = useState(false);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [IdOk, setIdOk] = useState('1');
  const [IdCheckresult, setIdCheckresult] = useState('');
  const [phoneNumberOk, setPhoneNumberOk] = useState('1');
  const inputRef = useRef();
  const [errMsg, setErrMsg] = useState('');
  const { OtpModule } = NativeModules;
  const otpEmitter = new NativeEventEmitter(OtpModule);

  useEffect(() => {
    console.log('otpEmitter 테스트');
    console.log('otpEmitter', otpEmitter);

    const otpListener = otpEmitter.addListener('OtpReceived', (otp) => {
      setAuthNumber(otp);  // 자동으로 인증번호 입력
      console.log('Received OTP:', otp);
    });

    // Cleanup listener on component unmount
    return () => {
      otpListener.remove();
    };
  }, []);  // 빈 배열을 의존성으로 설정하여 한 번만 실행

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input1.current) {
        input1.current.focus();
      }
    }, 500); // 딜레이 추가
    return () => clearTimeout(timer);
  }, []);
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
  const handleResendAuth = async () => {
    setTimer(180); // 타이머를 3분으로 초기화
    setIsTimerActive(false); // 타이머 활성화
    setAuthNumber('');
    const state = await NetInfo.fetch();
      const canProceed = await handleNetInfoChange(state);
      if (canProceed) {
        console.log("sendAuthMobile", `${props.route?.params?.authType}`);
        sendAuthMobile(phoneNumber.replace(/-/g, ''), props.route?.params?.authType, props?.route?.params?.id);
      }
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
        sendAuthMobile(phoneNumber.replace(/-/g, ''), 'RESET_PW', id);
      }

    } else {
      // 첫 번째 단계에서 다음 단계로 이동
      const state = await NetInfo.fetch();
      const canProceed = await handleNetInfoChange(state);
      if (canProceed) {
        sendAuthMobileConfirm(phoneNumber.replace(/-/g, ''), props.route?.params?.authType, authNum);
      }

      // 두 번째 단계에서 확인 버튼 클릭
      console.log('인증번호 확인:', authNum);
      // 여기서 인증번호 검증 로직 추가
    }
  };

  const sendAuthMobile = async (phoneNumber, authType, id = null) => {
    const data = {
      phoneNumber,
      authType,

    };

    console.log("sendAuthMobile", `data : ${data.joinType} ${data.phoneNumber} , ${data.authType}`);
    if (id) {
      data.id = id;
    }

    axios
      .post(`${Config.APP_API_URL}sms/sendAuthCode`, data)
      .then(async response => {
        console.log("sendAuthMobile", `data : ${response.data.errYn} ${response.data.errMsg ? response.data.errMsg : ''} , ${data.authType}`);

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
  const sendAuthMobileConfirm = async (phoneNumber, authType, authCode) => {
    const data = {
      phoneNumber,
      authCode,
      authType,
    };



    axios
      .post(`${Config.APP_API_URL}sms/checkAuthCode`, data)
      .then(async response => {

        console.log('sendAuthMobile', response.data.errYn);

        if (response.data.errYn === 'Y') {

          setErrMsg('인증번호 검증에 실패했습니다.');
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

          navigation.replace('PasswordChangeScreen', { id: id, authKey: userData.authKey, phoneNumber: phoneNumber }); // 다음 화면으로 이동

        }
        // 성공적인 응답 처리

      })
      .catch(error => {
        setErrMsg('인증번호 검증에 실패했습니다.');

        // 오류 처리
        SheetManager.show('info', {
          payload: {
            message: '인증번호 검증에 실패하였습니다.',
            description: error?.message,
            type: 'error',
            buttontext: '확인하기',
          }
        });
        console.error(error);
      });
  };
  const getLoginYn = async () => {
    try {
      const url = `${Config.APP_API_URL}user/idCheck?id=${encodeURIComponent(id)}`;
      console.log('url', url);
      const response = await axios.get(url);
      console.log(`response : ${response.data.errYn}`);
      if (response.data.errYn === 'Y') {
        setIdOk('2');
        setIdCheckresult('');
        return true;
       
      } else {
        setIdOk('3');
        setIdCheckresult(response.data.errMsg ? response.data.errMsg : '로그인 중복체크 중 문제가 생겼어요.');
        return false;
      }

    } catch (error) {
      setIdOk('3');
      setIdCheckresult('로그인 중복체크 중 문제가 생겼어요.');
      return false;
    }
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
          <BackIcon />
        </TouchableOpacity>
      ),

      headerTitleAlign: 'center',
      title: '비밀번호 재설정하기',
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
  },);


  const validatePhoneNum = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    console.log("sendAuthMobile: ", `${match}, ${cleaned}`);
    if (match) {
      return true;
    }
    return false;
  };
  return (
    <View style={styles.rootContainer}>
      {/* 파란색 라인 */}
      <View style={styles.blueLine} />

      {/* 스크롤 뷰 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* Label */}
          <Text style={styles.label}>아이디</Text>
          <Text style={styles.subTitleLabel}>사용하고 계신 아이디를 알려주세요.</Text>

          {/* Input Field */}
          <View style={styles.inputWrapper}>
            <TextInput
              ref={input1}
              style={id.length > 0 ? styles.input : styles.input_not_content}
              placeholder="아이디를 입력해주세요."
              placeholderTextColor="#A3A5A8"
              value={id}
              onChangeText={async (id) => { setId(id.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/g, '')); setIdOk('1'); setIdCheckresult(''); }}
              onSubmitEditing={async () => {
                if(id.length >0) {
                  const logincheck = await getLoginYn();
                  if (logincheck) {
                    input2.current.focus();
                  } else {
                    input1.current.focus();
                  }
                }


              }
              }
              onBlur={async () => {
                if(id.length >0) {
                  const logincheck = await getLoginYn();
                  if (logincheck) {
                    input2.current.focus();
                  } else {
                    input1.current.focus();
                  }
                }


              }
              }
            />
            {IdOk === '1' &&
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setId('');
                  setIdOk('1');
                }}
              >

                <DeleteIcon />
              </TouchableOpacity>
            }
            {IdOk === '2' && <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setId('');
                setIdOk('1');
              }}
            >

              <CheckIcon />
            </TouchableOpacity>
            }
            {IdOk === '3' && <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setId('');
                setIdOk('1');
              }}
            >

              <ImpossibleIcon />
            </TouchableOpacity>
            }

          </View>
          {IdOk === '2' && (
            <Text style={styles.idCheckMsg}>유효한 아이디에요.</Text>
          )}


        </View>

        <View style={styles.inputSection2}>
          {/* Label */}
          <Text style={styles.label}>휴대폰 번호</Text>
          <Text style={styles.subTitleLabel}>본인 인증을 위해 휴대폰 번호를 알려주세요.</Text>

          {/* Input Field */}
          <View style={styles.inputWrapper}>
            <TextInput
            ref={input2}

              keyboardType="phone-pad" // 숫자 키보드 표시
              maxLength={13} // 최대 11자리 (01012345678)
              style={phoneNumber.length > 0 ? styles.input : styles.input_not_content}
              placeholder="휴대폰 번호를 입력해주세요."
              placeholderTextColor="#A3A5A8"
              value={phoneNumber}
              onSubmitEditing={async () => {
                const phoneCheck = await validatePhoneNum(phoneNumber);
                console.log("sendAuthMobile:", phoneCheck);
                setPhoneNumberOk(phoneCheck ? '2' : '3');

              }
              }
              onChangeText={async (text) => { setPhoneNumber(formatPhoneNumber(text)); setPhoneNumberOk('1'); }}

            />
            {phoneNumberOk === '1' &&
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setPhoneNumber('');
                  setPhoneNumberOk('1');
                }}
              >

                <DeleteIcon />
              </TouchableOpacity>
            }
            {phoneNumberOk === '2' && <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setPhoneNumber('')}
            >

              <CheckIcon />
            </TouchableOpacity>
            }
            {phoneNumberOk === '3' && <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setPhoneNumber('')}
            >

              <ImpossibleIcon />
            </TouchableOpacity>
            }

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
                  textContentType="oneTimeCode"
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
                {timer > 0 && errMsg.length > 0  && (

                  <Text style={styles.expiredText}>{`${errMsg}`}</Text>
                )}
                <TouchableOpacity style={styles.findIdButton} onPress={handleResendAuth}>
                  <Text style={styles.authReSend}>인증번호 재전송</Text>
                </TouchableOpacity>
              </View>



            </View>



          </View>
        )}
        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            (!phoneNumber || timer === 0) && styles.disabledButton, // 조건부 스타일
          ]}
          onPress={handleNextStep}
          disabled={!phoneNumber || timer === 0 || !IdOk || !id} // 비활성화 조건
        >
          <Text style={styles.loginButtonLabel}
           >
            {step === 1 ? '인증번호 전송하기' : '다음으로'}
          </Text>
        </TouchableOpacity>
        {/* 추가 콘텐츠를 여기에 배치 가능 */}
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
  inputAuthWrapper: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 8,
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

  inputSection2: {
    marginTop: 30,
  },
  label: {
    fontSize: 17,
    marginBottom: 10,
    color: '#1b1c1f',
    lineHeight:20,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
  },
  subTitleLabel: {
    fontSize: 13,
    marginBottom: 10,
    color: '#717274',
    lineHeight:16,

    fontFamily: 'Pretendard-Medium', // 원하는 폰트 패밀리
  },
  idCheckMsg: {
    fontSize: 13,
    marginBottom: 10,
    color: '#2F87FF',
    lineHeight:15,
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
  },
  inputWrapper: {
    flexDirection: 'row', // TextInput과 Clear 버튼 가로 배치
    alignItems: 'center', // 세로 가운데 정렬
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 10, // TextInput과 "아이디 찾기" 버튼 사이 간격
  },
  input_not_content: {
    flex: 1, // TextInput이 남은 공간을 차지하도록 설정
    color: '#000',
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
  },
  input: {
    flex: 1, // TextInput이 남은 공간을 차지하도록 설정
    color: '#000',
    fontSize: 17,
    fontFamily: 'Pretendard-Regular',
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
    color: '#717274',
    textDecorationLine: 'underline', // 밑줄 추가
    lineHeight : 15,
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
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
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

  },

  signUpText: {
    fontSize: 13,
    color: '#2F87FF',
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
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



export default PasswordReSettingScreen;
