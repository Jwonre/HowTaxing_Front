// 양도소득세 홈페이지

import {
  TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform, StatusBar,
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
  const currentUser = useSelector(state => state.currentUser.value);

  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const inputRef = useRef();



  const [paymentDetail, setPaymentDetail] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500); // 딜레이 추가
    return () => clearTimeout(timer);
  }, []);


  const paymentHistoryId = props.route?.params?.paymentHistoryId || null;

  console.log('log_id 1', paymentHistoryId);

  useFocusEffect(

    useCallback(() => {
      const id = props.route?.params?.paymentHistoryId;
      console.log('log_id 2', id);
      console.log('log_id 4', paymentHistoryId);
      if (id) {
        getReservationDetail(paymentHistoryId);
      } else {
        console.warn('consultingReservationId 값이 없습니다.');
      }
    }, [props.route?.params?.paymentHistoryId])
  );


  useEffect(() => {
    const id = props.route?.params?.paymentHistoryId??'';
    console.log('log_id 2', id);
  
    // id가 존재하고, 공백이 아닐 때만 실행
    getReservationDetail(id);

  }, [props.route?.params?.paymentHistoryId]);


  const getReservationDetail = async (paymentHistoryId) => {
    const url = `${Config.APP_API_URL}payment/detail?paymentHistoryId=${(paymentHistoryId ?? props.route?.params?.paymentHistoryId ?? '')}`;
    //const url = `https://devapp.how-taxing.com/consulting/availableSchedule?consultantId=${consultantId}&searchType="${searchType}"`;
    console.log('log_id url', url);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    /*
    const params = {
      consultantId: consultantId,
      searchType: searchType,
    }*/
    console.log(' log_id url', url);
    // console.log('params', params);
    console.log('log_id headers', headers);
    await axios
      .get(url,
        { headers: headers }
      )
      .then(response => {
        console.log('log_id response.data', response.data);
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
          console.log('log_id response.data', response.data.data);
          const result = response === undefined ? false : response.data.data;
          if (result) {
            console.log('log_id result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setPaymentDetail({ ...result });

            // setProgressStatus(consultingStatusTypeIndexMap[response.data.data.consultingStatus])

          }
        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '결제 상세 내역을 불러오는데 문제가 발생했어요.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
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
          <HoustInfoSection style={{ paddingTop: 10, paddingBottom: 10 }}>
          <ProfileAvatar2 source={paymentDetail?.profileImageUrl ?? require('../../assets/images/Minjungum_Lee_consulting.png')} />
          <Text style={styles.contentPayment}>
              {'#' + `${'3272'}`}
            </Text>
            <Text style={styles.namePayment}>{paymentDetail?.consultantName ?? ''}</Text>


          </HoustInfoSection>

          <View style={styles.Line1} />

          <Text style={styles.subTitleLabel}>결제 정보</Text>

          <View style={styles.infoBox}>
            {/* 고객명 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>고객명</Text>
              <Text style={styles.valueIfno}>-</Text>
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
              <Text style={styles.valueIfno}>
                {Number(paymentDetail?.productPrice ?? '0')?.toLocaleString() + '원'}
              </Text>
            </View>

            {/* 할인 금액 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>할인 금액</Text>
              <Text style={styles.valueIfno}>
                {Number(paymentDetail?.productDiscountPrice ?? '0')?.toLocaleString() + '원'}
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.rowInfo2}>
              <Text style={styles.labelInfo}>결제 금액</Text>
              <Text style={styles.totalValue}>
                {Number(paymentDetail?.paymentAmount ?? '0')?.toLocaleString() + '원'}
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.rowInfo2}>
              <Text style={styles.labelInfo}>결제 방식</Text>
              <Text style={styles.valueIfno}>{paymentDetail?.method}</Text>
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
            active={true} /* 버튼 활성화 */
            onPress={() => {
              console.log('돌아가기');
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
