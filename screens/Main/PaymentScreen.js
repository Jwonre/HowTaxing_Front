

// import Icon from 'react-native-vector-icons/Ionicons';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  BackHandler,

} from 'react-native';
import React, { useRef, useLayoutEffect, useState, useEffect, useCallback, } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DeleteIcon from '../../assets/icons/delete_circle.svg';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Config from 'react-native-config'
import { SheetManager } from 'react-native-actions-sheet';
import IdSendSmsCompletAlert from '../Auth/component/IdSendSmsCompletAlert';
import { useDispatch, useSelector } from 'react-redux';
import { setCert } from '../../redux/certSlice';
import CheckOnIcon from '../../assets/icons/check_on.svg';

import CheckIcon from '../../assets/icons/check_circle.svg';
import ImpossibleIcon from '../../assets/icons/impossible_circle.svg';

import CheckoutPage from '../payment/Checkout';

const ProgressSection = styled.View`
    flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #e8eaed; 
`;

const ProfileInfoSection = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;
const LeftContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const RightContainer = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;
const ListItemTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
`;
const ListItem = styled.View`
  flex-direction: row; 
  justify-content: center;
  align-items: center;
  padding-top:12px;
  padding-right : 16px;
  padding-left : 16px;
  padding-bottom: 12px;

`;

const FirstItem = styled.View`
  flex-direction: row; 
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 10px;
`;

const FirstItemTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 18px;
`;


const FirstCheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
    width: 20px;
    height: 20px;
    border-radius: 5px;  
    background-color: #fff;
    border: 2px solid #BAC7D5;  
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    margin-left: 10;
`;

const CheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`

    width: 20px;
    height: 20px;
    border-radius: 5px;  
    background-color: #fff;
    border: 2px solid #BAC7D5;  
    align-items: center;
    justify-content: center;
    margin-left:8px;
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

const PaymentScreen = props => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser.value);

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
  const [reservationProductInfo, setReservationProductInfo] = useState(null);

  const [agreePrivacy, setAgreePrivacy] = useState(false); // 팝업 상태 관리

  const id = props.route?.params.consultantId;
  console.log('log_1', id);

  // 페이지 들어가자마자 호출

  useEffect(() => {

    const id = props.route?.params.consultantId ?? '1';
    console.log('log_id 2', id);

    // id가 존재하고, 공백이 아닐 때만 실행
    if (id) {
      console.log('log_Calling getProductInfo with id:', id);
      getProductInfo(id);
    } else {
      console.warn('log_Consultant ID is missing!');
    }

  }, [props.route?.params?.consultantId]);

  console.log('log_currentUser:', currentUser);

  const getProductInfo = async (consultantId) => {
    const url = `${Config.APP_API_URL}product/productInfo?consultantId=${consultantId}`;
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
    console.log('log_url', url);
    // console.log('params', params);
    console.log('log_headers', headers);
    await axios
      .get(url,
        { headers: headers }
      )
      .then(response => {
        console.log('log_response.data', response.data);
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상품 정보를 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          console.log('log_response.data', response.data.data);

          const result = response === undefined ? null : response.data.data;
          if (result != null) {
            console.log('result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setReservationProductInfo(result);

          }

        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '상품 정보를 불러오는데 문제가 발생했어요.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
      });
  };





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
      title: '결제하기',
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

  const selectedDate = props.route?.params?.selectedDate;
  const selectedList = props.route?.params?.selectedList;

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = String(selectedDate.getDate()).padStart(2, '0');

  const default_date = `${year}-${month}-${day}`;
  const date = new Date(default_date);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const dayOfWeek = dayNames[date.getDay()];

  const time = selectedList ? selectedList[0] : '00:00'; // 시간
  const [hours, minutes] = time.split(':').map(Number); // 시간과 분 분리
  const isPM = hours >= 12; // 12 이상이면 오후
  const formattedHours = isPM ? hours - 12 || 12 : hours || 12; // 12시간제로 변환
  const period = isPM ? '오후' : '오전'; // 오전/오후 결정

  const dateInfo = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  const timeInfo = `(${period} ${formattedHours}시)`;

  const productPrice = Number(reservationProductInfo?.productPrice ?? '0')?.toLocaleString();
  const productDiscountPrice = Number(reservationProductInfo?.productDiscountPrice ?? '0')?.toLocaleString();
  const paymentAmount = Number(reservationProductInfo?.paymentAmount ?? '0')?.toLocaleString();
  const name = props?.route?.params?.name;
  const phone = props?.route?.params?.phone;

  console.log('log_reservationProductInfo', reservationProductInfo);
  console.log('log_reservationProductInfo_productPrice', productPrice);
  console.log('log_reservationProductInfo_productDiscountPrice', productDiscountPrice);
  console.log('log_reservationProductInfo_paymentAmount', paymentAmount);
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
          <Text style={styles.bigTitle}>입력 정보를 확인하신 후 결제해주세요.</Text>
          <View style={styles.Line1} />

          <ProfileInfoSection>

            <LeftContainer>
              <Text style={styles.dateText}>{dateInfo}</Text>
              <Text style={styles.timeText}>
                <Text style={styles.timeHighlight}>{time}</Text>
                <Text style={styles.timeSubtext}> {timeInfo}</Text>
              </Text>
            </LeftContainer>
            <RightContainer>
              <Text style={styles.titleText}>JS회계법인</Text>
              <Text style={styles.nameText}>이민정음 세무사</Text>
              <Text style={styles.addressText}>서울특별시 송파구</Text>
            </RightContainer>
          </ProfileInfoSection>
          <View style={styles.Line1} />

          <Text style={styles.subTitleLabel}>신청정보</Text>

          <View style={styles.infoBox}>
            {/* 고객명 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>고객명</Text>
              <Text style={styles.valueIfno}>{name}</Text>
            </View>

            {/* 할인 금액 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>전화번호</Text>
              <Text style={styles.valueIfno}>{phone}</Text>
            </View>


          </View>
          <View style={styles.Line1} />

          <Text style={styles.subTitleLabel}>결제 금액</Text>
          <View style={styles.infoBox}>
            {/* 상품 금액 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>상품 금액</Text>
              <Text style={styles.valueIfno}>{productPrice} 원</Text>
            </View>

            {/* 할인 금액 */}
            <View style={styles.rowInfo}>
              <Text style={styles.labelInfo}>할인 금액</Text>
              <Text style={styles.valueIfno}>{paymentAmount} 원</Text>
            </View>

            {/* 구분선 */}
            <View style={styles.separator} />

            {/* 결제 금액 */}
            <View style={styles.rowInfo2}>
              <Text style={styles.labelInfo}>결제 금액</Text>
              <Text style={styles.valueIfno}>{productDiscountPrice} 원</Text>
            </View>
          </View>

          <View style={styles.Line1} />

          <ListItem style={{ marginTop: 0 }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={async () => {
                  //console.log('개인정보 수집 및 이용');
                  navigation.navigate('CertificationPrivacy', {
                    prevSheet: 'ConsultingReservation',
                  });
                }}>
                <FirstItemTitle style={{ color: '#2F87FF', textDecorationLine: 'underline' }}>개인정보 수집 및 이용</FirstItemTitle>
              </TouchableOpacity>
              <FirstItemTitle>에 대하여 동의하시나요?</FirstItemTitle>
            </View>
            <CheckCircle
              onPress={() => {
                setAgreePrivacy(!agreePrivacy);
              }}>
              {agreePrivacy && <CheckOnIcon />}
            </CheckCircle>
          </ListItem>


          <View style={styles.Line1} />


          {/* 만료 메시지 */}
          {/* 만료 메시지와 재전송 버튼 */}


        </View>


      </ScrollView>
      <ButtonSection>
        <Button
          style={{ backgroundColor: agreePrivacy ? '#2F87FF' : '#E8EAED' }}
          active={agreePrivacy} // agreePrivacy 값에 따라 버튼 활성화
          width={width}
          onPress={async () => {
            const state = await NetInfo.fetch();
            const canProceed = await handleNetInfoChange(state);
            if (canProceed) {
              console.log('log_결제하기');
              const today = new Date(); // 현재 날짜와 시간

              const orderId = `order_${today.getMilliseconds()}_${reservationProductInfo.productId}`
              console.log('log_결제하기', orderId);
              console.log('log_결제하기 productPrice', Number(reservationProductInfo?.productPrice ?? '0'));
              console.log('log_결제하기 productDiscountPrice', Number(reservationProductInfo?.productDiscountPrice ?? '0'));
              console.log('log_결제하기 paymentAmount', Number(reservationProductInfo?.paymentAmount ?? '0'));
              console.log('log_결제하기 id', id);
              console.log('log_결제하기 name', name);
              console.log('log_결제하기 phone', phone);
              console.log('log_결제하기 default_date',default_date);
              console.log('log_결제하기 consultingInflowPath',props?.route?.params?.consultingInflowPath ?? '');
              console.log('log_결제하기 calcHistoryId',props?.route?.params?.calcHistoryId ?? '');
              console.log('log_결제하기 orderId',orderId);
              console.log('log_결제하기 productName',reservationProductInfo?.productName);

              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                console.log('log_결제하기',canProceed);

                navigation.navigate('TossPaymentScreen', {
                  consultantId: id,
                  customerName: name,
                  customerPhone: phone,
                  reservationDate: default_date,
                  reservationTime: time,
                  consultingInflowPath: props?.route?.params?.consultingInflowPath ?? '',
                  calcHistoryId: props?.route?.params?.calcHistoryId ?? '',
                  orderId: orderId,
                  orderName: reservationProductInfo?.productNameproductName,
                  productPrice: Number(reservationProductInfo?.productPrice ?? '0'),
                  productDiscountPrice: Number(reservationProductInfo?.productDiscountPrice ?? '0'),
                  paymentAmount: Number(reservationProductInfo?.paymentAmount ?? '0'),
  
                  productId: reservationProductInfo?.productId, // 고유 주문 ID
                  productName: reservationProductInfo?.productName, // 주문 이름
                });
              }
              
              // Checkout 호출
              // await CheckoutPage({
              //   amount: 50000, // 결제 금액
              //   orderId: 'ORDER_ID_12345', // 고유 주문 ID
              //   orderName: 'JS회계법인 서비스', // 주문 이름
              //   successUrl: `${Config.APP_API_URL}payment/success`, // 결제 성공 리다이렉트 URL
              //   failUrl: `${Config.APP_API_URL}payment/fail`, // 결제 실패 리다이렉트 URL
              // });

              // navigation.navigate('CheckoutPage', {
              //   amount: 50000,
              //   orderId: 'ORDER_ID_12345',
              //   orderName: 'JS회계법인 서비스',
              //   successUrl: `${Config.APP_API_URL}payment/success`,
              //   failUrl: `${Config.APP_API_URL}payment/fail`,
              // });
            }
          }
            // 동의하기 버튼 클릭 시 redux에 저장
          }>
          <ButtonText
            style={{ color: agreePrivacy ? '#fff' : '#a3a5a8' }}
            active={agreePrivacy}>{'결제하기'}</ButtonText>
        </Button>

      </ButtonSection>
      {/* 모달 */}
    </View >

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
    marginTop: 2,
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
});



export default PaymentScreen;
