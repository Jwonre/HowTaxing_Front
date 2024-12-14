// 양도소득세 홈페이지

import {
  TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform, StatusBar,
  Dimensions, Image,
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
import StatusOffIcon from '../../assets/icons/progress_1.svg';
import StatusOnIcon from '../../assets/icons/progress_2.svg';

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

const ReservationDetail = props => {
  const _scrollViewRef = useRef(null);

  const actionSheetRef = useRef(null);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [reservationDetail, setReservationDetail] = useState({});
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser.value);
  const [isExpanded, setIsExpanded] = useState(false);
  const houseInfo = props?.route.params?.houseInfo;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [authNum, setAuthNumber] = useState('');

  const [step, setStep] = useState(1); // 현재 단계 상태 (1: 휴대폰 입력, 2: 인증번호 입력)
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isModalVisible, setIsModalVisible] = useState(false); // 팝업 상태 관리
  const [progressStatus, setProgressStatus] = useState(0);
  const inputRef = useRef();

  const [agreePrivacy, setAgreePrivacy] = useState(false); // 팝업 상태 관리

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleBackPress = () => {
    navigation.goBack();
    return true;
  }

  const handleHouseChange1 = async (Date, Time) => {
    setReservationDetail(prevDetail => ({
      ...prevDetail,
      reservationDate: Date,
      reservationStartTime: Time,
    }));
  };

  const handleHouseChange2 = async (Content, Type) => {
    setReservationDetail(prevDetail => ({
      ...prevDetail,
      consultingType: Type,
      consultingRequestContent: Content,
    }));
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])
  );

  useFocusEffect(
    useCallback(() => {
      console.log('consultingReservationId', props.route?.params?.consultingReservationId);
      getReservationDetail(props.route?.params?.consultingReservationId);
    }, [])
  );


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
  const getReservationDetail = async (consultingReservationId) => {
    const url = `${Config.APP_API_URL}consulting/reservationDetail?consultingReservationId=${consultingReservationId}`;
    //const url = `https://devapp.how-taxing.com/consulting/availableSchedule?consultantId=${consultantId}&searchType="${searchType}"`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    /*
    const params = {
      consultantId: consultantId,
      searchType: searchType,
    }*/
    console.log('url', url);
    // console.log('params', params);
    console.log('headers', headers);
    await axios
      .get(url,
        { headers: headers }
      )
      .then(response => {
        console.log('response.data', response.data);
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          console.log('response.data', response.data.data);
          const result = response === undefined ? [] : response.data.data;
          if (result) {
            console.log('result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setReservationDetail({ ...result });

          }
        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
      });
  };





  // 미입력
  const progressStatus1 = [
    { id: 1, status: '결제 완료', isActive: true },
    { id: 2, status: '상담 상세정보 입력', isActive: false },
    { id: 3, status: '상담 대기', isActive: false },
    { id: 4, status: '상담 시작', isActive: false },
    { id: 5, status: '상담 종료', isActive: false },
  ];
  // 상담대기
  const progressStatus2 = [
    { id: 1, status: '결제 완료', isActive: false },
    { id: 2, status: '상담 상세정보 입력', isActive: false },
    { id: 3, status: '상담 대기', isActive: true },
    { id: 4, status: '상담 시작', isActive: false },
    { id: 5, status: '상담 종료', isActive: false },
  ];
  // 상담중중
  const progressStatus3 = [
    { id: 1, status: '결제 완료', isActive: false },
    { id: 2, status: '상담 상세정보 입력', isActive: false },
    { id: 3, status: '상담 대기', isActive: false },
    { id: 4, status: '상담 시작', isActive: true },
    { id: 5, status: '상담 종료', isActive: false },
  ];
  // 상담종료
  const progressStatus4 = [
    { id: 1, status: '결제 완료', isActive: false },
    { id: 2, status: '상담 상세정보 입력', isActive: false },
    { id: 3, status: '상담 대기', isActive: false },
    { id: 4, status: '상담 시작', isActive: false },
    { id: 5, status: '상담 종료', isActive: true },
  ];
  const progressCancelData = [
    { id: 1, status: '결제 완료', isActive: false },
    { id: 2, status: '상담 상세정보 입력', isActive: false },
    { id: 3, status: '상담 취소', isActive: true },
  ];

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
          <HoustInfoSection style={{ paddingTop: 10, paddingBottom: 10 }}>
            <ProfileAvatar2 source={require('../../assets/images/Minjungum_Lee_consulting.png')} />
            <Text style={styles.contentPayment}>
              {'#' + `${'3272'}`}
            </Text>
            <Text style={styles.namePayment}>이민정음 세무사</Text>


          </HoustInfoSection>

          <View style={styles.Line1} />

          <Text style={styles.subTitleLabel}>진행 상태 </Text>

          <View style={styles.progressStatus}>

            {/* 세로 라인 */}
            <View style={styles.verticalLine} />
            {/* 상태 아이콘 리스트 */}

            <View style={styles.progressContainer}>
              <View style={styles.rowInfoProgress}>
                {/* 아이콘 */}
                <View
                  style={{
                    position: 'relative',
                    left: (progressStatus === 0 ? progressStatus1 :
                      progressStatus === 1 ? progressStatus2 :
                        progressStatus === 2 ? progressStatus3 :
                          progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? 0 : 9,
                    zIndex: 1,
                  }}
                >
                  {(progressStatus === 0 ? progressStatus1 :
                    progressStatus === 1 ? progressStatus2 :
                      progressStatus === 2 ? progressStatus3 :
                        progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? <StatusOnIcon /> : <StatusOffIcon />}
                </View>

                {/* 상태 텍스트 */}
                <Text style={styles.statusText}>결제 완료</Text>

                <Text style={styles.progressDate}>-</Text>

              </View>
              <View style={styles.rowInfoProgress}>
                {/* 아이콘 */}
                <View
                  style={{
                    position: 'relative',
                    left: (progressStatus === 0 ? progressStatus1 :
                      progressStatus === 1 ? progressStatus2 :
                        progressStatus === 2 ? progressStatus3 :
                          progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? 0 : 9,
                    zIndex: 1,
                  }}
                >
                  {(progressStatus === 0 ? progressStatus1 :
                    progressStatus === 1 ? progressStatus2 :
                      progressStatus === 2 ? progressStatus3 :
                        progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? <StatusOnIcon /> : <StatusOffIcon />}
                </View>

                {/* 상태 텍스트 */}
                <Text style={styles.statusText}>결제 완료</Text>

                <Text style={styles.progressDate}>-</Text>

              </View>
              <View style={styles.rowInfoProgress}>
                {/* 아이콘 */}
                <View
                  style={{
                    position: 'relative',
                    left: (progressStatus === 0 ? progressStatus1 :
                      progressStatus === 1 ? progressStatus2 :
                        progressStatus === 2 ? progressStatus3 :
                          progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? 0 : 9,
                    zIndex: 1,
                  }}
                >
                  {(progressStatus === 0 ? progressStatus1 :
                    progressStatus === 1 ? progressStatus2 :
                      progressStatus === 2 ? progressStatus3 :
                        progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? <StatusOnIcon /> : <StatusOffIcon />}
                </View>

                {/* 상태 텍스트 */}
                <Text style={styles.statusText}>결제 완료</Text>

                <Text style={styles.progressDate}>-</Text>

              </View>
              <View style={styles.rowInfoProgress}>
                {/* 아이콘 */}
                <View
                  style={{
                    position: 'relative',
                    left: (progressStatus === 0 ? progressStatus1 :
                      progressStatus === 1 ? progressStatus2 :
                        progressStatus === 2 ? progressStatus3 :
                          progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? 0 : 9,
                    zIndex: 1,
                  }}
                >
                  {(progressStatus === 0 ? progressStatus1 :
                    progressStatus === 1 ? progressStatus2 :
                      progressStatus === 2 ? progressStatus3 :
                        progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? <StatusOnIcon /> : <StatusOffIcon />}
                </View>

                {/* 상태 텍스트 */}
                <Text style={styles.statusText}>결제 완료</Text>

                <Text style={styles.progressDate}>-</Text>

              </View>
              <View style={styles.rowInfoProgress}>
                {/* 아이콘 */}
                <View
                  style={{
                    position: 'relative',
                    left: (progressStatus === 0 ? progressStatus1 :
                      progressStatus === 1 ? progressStatus2 :
                        progressStatus === 2 ? progressStatus3 :
                          progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? 0 : 9,
                    zIndex: 1,
                  }}
                >
                  {(progressStatus === 0 ? progressStatus1 :
                    progressStatus === 1 ? progressStatus2 :
                      progressStatus === 2 ? progressStatus3 :
                        progressStatus === 3 ? progressStatus4 : progressCancelData).isActive ? <StatusOnIcon /> : <StatusOffIcon />}
                </View>

                {/* 상태 텍스트 */}
                <Text style={styles.statusText}>결제 완료</Text>

                <Text style={styles.progressDate}>-</Text>

              </View>
            </View>
            {/* <FlatList
              data={progressStatus === 0 ? progressStatus1 :
                progressStatus === 1 ? progressStatus2 :
                  progressStatus === 2 ? progressStatus3 :
                    progressStatus === 3 ? progressStatus4 : progressCancelData
              }
              renderItem={({ item, index }) => (
                <View style={[styles.itemContainer, {
                  marginTop: 10, marginBottom: index < (
                    progressStatus === 0 ? progressStatus1.length :
                      progressStatus === 1 ? progressStatus2.length :
                        progressStatus === 2 ? progressStatus3.length :
                          progressStatus === 3 ? progressStatus4.length :
                            progressCancelData.length
                  ) - 1 ? 15 : 0
                }]}>
            
                  <View style={styles.iconAndTextContainer}>
                    <View
                      style={{
                        position: 'relative',
                        left: item.isActive ? 0 : 9,
                        zIndex: 1,
                      }}
                    >
                      {item.isActive ? <StatusOnIcon /> : <StatusOffIcon />}
                    </View>

                    <Text style={styles.statusText}>{item.status}</Text>

                    <Text style={styles.progressDate}>{item.status}</Text>

                  </View>


                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            /> */}
          </View>

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
            onPress={() => {
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
  progressStatus: {
    height: 200,
    marginVertical: 20,
    flexDirection: 'row',
  },

  verticalLine: {
    position: 'absolute',
    left: 13, // 라인의 위치
    top: 0,
    width: 2,
    height: '100%',
    // height:180,
    backgroundColor: '#BDBDBD',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // 아이콘을 라인 위에 겹치도록 설정
  },
  progressContainer: {
    flex: 1,
  },
  rowInfoProgress: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20, // 각 행 간 간격
  },
  iconAndTextContainer: {
    flexDirection: 'row', // 아이콘과 텍스트를 수평으로 배치
    // alignItems: 'center', // 세로축 중앙 정렬
  },
  statusText: {
    marginStart: 30,
    fontSize: 14,
    color: '#333',
    // marginLeft: 10, // 아이콘과 텍스트 간 간격
  },
  progressDate: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10, // 아이콘과 텍스트 간 간격
  },
  iconContainer: {
    position: 'relative', // 아이콘을 라인 위에 배치
    left: 0, // 라인의 위치와 맞춤
    zIndex: 1, // 라인 위에 배치
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

  textContainer: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  // statusText: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  dateText: {
    fontSize: 14,
    color: '#757575',
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



export default ReservationDetail;
