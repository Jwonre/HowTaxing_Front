

// import Icon from 'react-native-vector-icons/Ionicons';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,

  StyleSheet,
  StatusBar
} from 'react-native';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CloseIcon from '../../assets/icons/close_button.svg';
import DeleteIcon from '../../assets/icons/delete_circle.svg';
import ConfirmIcon from '../../assets/icons/iucide_check.svg';
import FailPwdIcon from '../../assets/icons/fail_pwd.svg';

import axios from 'axios';
import { SheetManager } from 'react-native-actions-sheet';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config'
import PasswordChangeConfirmMsgAlert from './component/PasswordChangeConfirmMsgAlert';

const PasswordChangeScreen = props => {
  const [password, setPassword] = useState('');
  const [checkpassword, setCheckPassword] = useState('');
  const [PasswordOk, setPasswordOk] = useState('1');
  const [PasswordCheckOk, setPasswordCheckOk] = useState('1');
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 현재 단계 상태 (1: 휴대폰 입력, 2: 인증번호 입력)
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isTimerActive, setIsTimerActive] = useState(false);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isModalVisible, setIsModalVisible] = useState(false); // 팝업 상태 관리
  const openModal = () => {
    setIsModalVisible(true); // 팝업 열기
  };

  const closeModal = () => {
    setIsModalVisible(false); // 팝업 닫기
  };
  const handlerChange = async () => {
    console.log('로그인 로직 실행');
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      resetPassword(props?.route?.params?.phoneNumber,
        props?.route?.params?.authKey,
        props?.route?.params?.id,
        password,
        checkpassword
      );
    }
    closeModal();

  };
  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 16;
    const regex = /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*]){2,}[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (password.length < minLength || password.length > maxLength) { return false; }
    return regex.test(password);
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





  const resetPassword = async (phoneNumber, authKey, id, newPassword, newPasswordConfirm) => {
    const data = {
      phoneNumber,
      authKey,
      id,
      newPassword,
      newPasswordConfirm,
    };

    console.log("resetPassword", `data : ${data.phoneNumber} ${data.authKey} , ${data.id}, ${data.newPassword},${data.newPasswordConfirm}`);
    if (id) {
      data.id = id;
    }

    axios
      .post(`${Config.APP_API_URL}user/resetPassword`, data)
      .then(async response => {
        console.log("resetPassword", `data : ${response.data.errYn} ${response.data.errMsg ? response.data.errMsg : ''} , ${data.authType}`);

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
          navigation.push('Login_ID');

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

  return (
    <View style={styles.rootContainer}>
      {/* 파란색 라인 */}
      <View style={styles.blueLine} />

      {/* 스크롤 뷰 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* Label */}
          <Text style={styles.label}>새 비밀번호 설정</Text>
          <Text style={styles.subTitleLabel}>인증이 완료되었어요. 새로운 비밀번호를 입력해주세요.</Text>

          <Text style={styles.newpasswordLabel}>새 비밀번호</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={input1}
              autoCompleteType="pwd"
              maxLength={16}
              style={styles.input}
              placeholder="새로운 비밀번호를 입력해주세요."
              placeholderTextColor="#A3A5A8"
              secureTextEntry={true} // 비밀번호 마스킹 처리
              keyboardType="default" // 기본 키보드
              autoCapitalize="none" // 자동 대문자 변환 비활성화
              autoCorrect={false} // 자동 교정 비활성화
              value={password}
              onChangeText={async (password) => {
                if (password.length === 0) {
                  setPasswordOk('1');
                  setPassword('');
                } else {
                  if (validatePassword(password)) {
                    setPassword(password);
                    setPasswordOk('2');
                    setCheckPassword('');
                    setPasswordCheckOk('1');
                  }
                  else {
                    setPassword(password);
                    setPasswordOk('3');
                    setCheckPassword('');
                    setPasswordCheckOk('1');
                  }
                }

              }}
              onSubmitEditing={async () => {
                if (validatePassword(password)) { input2.current.focus(); } else { input1.current.focus(); }
              }}
            />
            {password !== '' && (
              validatePassword(password) ?
                <ConfirmIcon /> :
                <FailPwdIcon />
            )}
          </View>
          <Text style={styles.newpasswordLabel}>새 비밀번호</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              autoCompleteType="pwd"
              maxLength={16}
              style={styles.input}
              placeholder="설정하신 비밀번호를 다시 입력해주세요."
              placeholderTextColor="#A3A5A8"
              secureTextEntry={true} // 비밀번호 마스킹 처리
              keyboardType="default" // 기본 키보드
              autoCapitalize="none" // 자동 대문자 변환 비활성화
              autoCorrect={false} // 자동 교정 비활성화
              value={checkpassword}
              onChangeText={async (checkpassword) => {
                if (checkpassword.length === 0) {
                  setCheckPassword('');
                  setPasswordCheckOk('1');
                }
                else {
                  if (checkpassword === password) {
                    setCheckPassword(checkpassword); setPasswordCheckOk('2');
                  } else { setCheckPassword(checkpassword); setPasswordCheckOk('3'); }
                }
              }}
            />
            {checkpassword !== '' && (
             validatePassword(checkpassword) ?
             <ConfirmIcon /> :
             <FailPwdIcon />
            )}
          </View>

        </View>


        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.loginButton, // 조건부 스타일
          ]}
          onPress={openModal}
        >
          <Text style={styles.loginButtonLabel}>변경하기</Text>
        </TouchableOpacity>
        {/* 추가 콘텐츠를 여기에 배치 가능 */}
      </ScrollView>
      <PasswordChangeConfirmMsgAlert visible={isModalVisible} onClose={closeModal} onChange={handlerChange} />

    </View>

  );
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
  newpasswordLabel: {
    fontSize: 17,
    marginTop: 20,

    marginBottom: 10,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },

  label: {
    fontSize: 17,
    marginTop: 15,

    marginBottom: 10,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  subTitleLabel: {
    fontSize: 13,
    marginBottom: 10,
    color: '#717274',
    fontFamily: 'Pretendard-medium', // 원하는 폰트 패밀리
    fontWeight: '500', // 폰트 두께 (400은 기본)
  },


  inputWrapper: {
    flexDirection: 'row', // TextInput과 Clear 버튼 가로 배치
    alignItems: 'center', // 세로 가운데 정렬
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 8, // TextInput과 "아이디 찾기" 버튼 사이 간격
  },
  input: {
    flex: 1, // TextInput이 가로로 공간을 채움
    color: '#000', // 글자 색상
    fontSize: 13, // 폰트 크기
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
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



export default PasswordChangeScreen;
