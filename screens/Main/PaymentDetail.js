// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform ,   StatusBar,
  Dimensions,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import { SheetManager, useScrollHandlers } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'
import TaxCard from '../../components/TaxCard';
import TaxInfoCard from '../../components/TaxInfoCard';
import TaxCard2 from '../../components/TaxCard2';
import TaxInfoCard2 from '../../components/TaxInfoCard2';
import HouseInfo from '../../components/HouseInfo';
import Bottompolygon from '../../assets/icons/bottom_polygon.svg';
import EditButtom from '../../assets/icons/edit_Reservation.svg';
import FastImage from 'react-native-fast-image';
import CloseIcon from '../../assets/icons/close_button.svg';

const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;

const ButtonSection = styled.View`
margin-top: 10px;
  width: 100%;
   padding: 16px; /* 패딩 추가 */
  background-color: #fff; /* 배경색 설정 */
    position: absolute; /* 버튼을 고정 */
 bottom: 0; /* 화면 하단에 위치 */
  left: 0; /* 왼쪽 시작 */
  right: 0; /* 오른쪽 끝 */
`;
const ProfileAvatar2 = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 40px;
  height: 40px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: left;
  margin-right: 12px;
`;
const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
  disabled: !props.active, // active가 false일 때 버튼 비활성화

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
  line-height: 20px;
  color: #fff;
`;


const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  flex-direction: row;
`;
const ProgressSection = styled.View`
    flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #e8eaed; 
`;

const PaymentDetail = props => {
  const dispatch = useDispatch();

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
  const [isModalVisible, setIsModalVisible] = useState(false); // 팝업 상태 관리
  const [phoneNumberOk, setPhoneNumberOk] = useState('1');
  const inputRef = useRef();

  const [agreePrivacy, setAgreePrivacy] = useState(false); // 팝업 상태 관리

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500); // 딜레이 추가
    return () => clearTimeout(timer);
  }, []);
  const openModal = () => {
    setIsModalVisible(true); // 팝업 열기
  };

  const closeModal = () => {
    setIsModalVisible(false); // 팝업 닫기
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
      console.log("sendAuthMobile:", '팝업');

      const state = await NetInfo.fetch();
      const canProceed = await handleNetInfoChange(state);
      console.log("test:", `state :$state [${canProceed}]`);

      if (canProceed) {
        sendAuthMobile(phoneNumber.replace(/-/g, ''), props.route?.params?.authType, props?.route?.params?.id);

      }


    } else {
      const state = await NetInfo.fetch();
      const canProceed = await handleNetInfoChange(state);
      if (canProceed) {
        sendAuthMobileConfirm(phoneNumber.replace(/-/g, ''), props.route?.params?.authType, authNum);
      }
      // // 두 번째 단계에서 확인 버튼 클릭
      // console.log('인증번호 확인:', authNum);
      // // 여기서 인증번호 검증 로직 추가
      // navigation.navigate('NextScreen'); // 다음 화면으로 이동
    }
  };




  const sendAuthMobile = async (phoneNumber, authType, id = null) => {
    console.log("sendAuthMobile:", `${phoneNumber} || ${authType}`);
    const data = {
      phoneNumber,
      authType,
    };

    if (id) {
      data.id = id;
    }

    axios
      .post(`${Config.APP_API_URL}sms/sendAuthCode`, data)
      .then(async response => {
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '인증번호 발송에 실패하였습니다.',
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
      authType,
      authCode,

    };

    console.log("sendAuthMobile: ", data.phoneNumber);
    console.log("sendAuthMobile: ", data.authCode);
    console.log("sendAuthMobile: ", data.authType);


    axios
      .post(`${Config.APP_API_URL}sms/checkAuthCode`, data)
      .then(async response => {
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
          console.log("sendAuthMobile: ", userData.authKey);

          findUserId(phoneNumber.replace(/-/g, ''), userData.authKey);

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


  const findUserId = async (phoneNumber, authKey) => {
    const data = {
      phoneNumber,
      authKey,

    };

    console.log("sendAuthMobile:22 ", data.authCode);


    axios
      .post(`${Config.APP_API_URL}user/findUserId`, data)
      .then(async response => {
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '아이디 찾기에 실패했습니다..',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          const userData = response.data.data;
          openModal();
        }
        // 성공적인 응답 처리

      })
      .catch(error => {
        // 오류 처리
        SheetManager.show('info', {
          payload: {
            message: '아이디 찾기에 실패하였습니다.',
            description: error?.message,
            type: 'error',
            buttontext: '확인하기',
          }
        });
        console.error(error);
      });
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
  const validatePhoneNum = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return /^(\d{3})(\d{3,4})(\d{4})$/.test(cleaned);
  };

  const handleResetPassword = () => {
    console.log('비밀번호 재설정 로직 실행');
    navigation.push('PasswordReSettingScreen', { authType: 'RESET_PW', LoginAcessType: 'IDPASS' });
    closeModal();

  };

  const handleLogin = () => {
    console.log('로그인 로직 실행');
    closeModal();
    navigation.goBack();

  };
  const handleBackPress = () => {
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
      title: '결제 상세 정보',
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
    <View style={styles.rootContainer}>
      {/* 파란색 라인 */}
      <ProgressSection>
      </ProgressSection>

      {/* 스크롤 뷰 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* Label */}
          <HoustInfoSection style = {{paddingTop : 10, paddingBottom: 10}}>
            <ProfileAvatar2 source={require('../../assets/images/Minjungum_Lee_consulting.png')} />
            <Text style={styles.contentPayment}>
              {'#' + `${'3272'}`}
            </Text>
            <Text style={styles.namePayment}>이민정음 세무사</Text>


          </HoustInfoSection>

          <View style={styles.Line1} />

          <Text style={styles.subTitleLabel}>결제 정보</Text>

          <View style={styles.infoBox}>
            {/* 고객명 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>고객명</Text>
              <Text style={styles.valueIfno}>홍길동</Text>
            </View>

            {/* 할인 금액 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>전화번호</Text>
              <Text style={styles.valueIfno}>010-0000-0000</Text>
            </View>
            {/* 구분선 */}
            <View style={styles.separator} />
            <View style={styles.rowInfo2}>
              <Text style={styles.labelInfo}>상품 금액</Text>
              <Text style={styles.valueIfno}>50,000 원</Text>
            </View>

            {/* 할인 금액 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>할인 금액</Text>
              <Text style={styles.valueIfno}>0 원</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.rowInfo2}>
              <Text style={styles.labelInfo}>결제 금액</Text>
              <Text style={styles.totalValue}>50,000 원</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.rowInfo2}>
              <Text style={styles.labelInfo}>결제 방식</Text>
              <Text style={styles.valueIfno}>-</Text>
            </View>
          </View>

          {/* 만료 메시지 */}
          {/* 만료 메시지와 재전송 버튼 */}

        </View>


      </ScrollView>
      <ButtonSection>
        <ShadowContainer>
          <Button
            style={{ backgroundColor: '#2F87FF' }}

            width={width}
            onPress={ () => {
              navigation.goBack();

            }}>
            <ButtonText style={{ color: '#fff' }}>돌아가기</ButtonText>
          </Button>
        </ShadowContainer>
        

      </ButtonSection>
      {/* 모달 */}
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
  bigTitle: {
    fontSize: 20,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    lineHeight: 24,
  },

  subTitleLabel: {
    fontSize: 17,

    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리

  },

  infoBox: {
    marginTop: 20,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d9d9d9', // 연한 테두리
    alignSelf: 'center',
  },

  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // 각 행 간 간격
  },
  rowInfo2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10, // 각 행 간 간격
    marginBottom: 10, // 각 행 간 간격
  },

  labelInfo: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#717274', // 회색 텍스트
  },
  valueIfno: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    color: '#a3a5a8', // 회색 텍스트
  },

  totalValue: {
    fontSize: 13,
    color: '#2F87FF', // 파란 텍스트
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
  },
  separator: {
    height: 1,
    backgroundColor: '#E8EAED', // 구분선 색상
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
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    marginBottom: 30,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 80, // 버튼 공간 확보
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  secondContent: {
    marginTop: 20,
  },
  inputSection: {
    marginTop: 22,
  },
  Line1: {
    height: 1, // 라인 두께
    backgroundColor: '#E8EaEd', // 파란색
    marginBottom: 20,
    marginTop: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
  },
  timeText: {
    marginTop: 5,
  },
  timeHighlight: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#1B1C1F',
  },
  timeSubtext: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
  },
  titleText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
    color: '#717274',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 17,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#a3a5a8', // 연회색
  },


  contentPayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    marginStart: 10,

    color: '#1b1c1f',
  },

  namePayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    marginStart: 10,
    color: '#717274',
  },
});



export default PaymentDetail;