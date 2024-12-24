import React, { useCallback, useLayoutEffect, useState ,useRef} from 'react';
import {
  View, Alert, StyleSheet, StatusBar, TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  PaymentWidgetProvider,
  usePaymentWidget,
  PaymentMethodWidget,
  AgreementWidget,
} from '@tosspayments/widget-sdk-react-native';
import 'react-native-get-random-values'; // Random Values 지원
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import BackIcon from '../../assets/icons/back_button.svg';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import Config from 'react-native-config'
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';


const ButtonText = styled.Text`
font-size: 16px;
font-family: Pretendard-Bold;
color: #fff;
line-height: 20px;
`;


const ShadowContainer = styled(DropShadow)`
shadow-color: rgba(0, 0, 0, 0.25);
shadow-offset: 2px 3px;
shadow-opacity: 0.2;
shadow-radius: 3px;
elevation: 5;
`;


const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 100%;
  height: 50px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  position: absolute;
  bottom: 0px;
  margin-bottom: 10px;
`;

function CheckoutPage(props, navigation) {


  console.log('log_CheckoutPage Context Data:', props.route.params);

  const paymentWidgetControl = usePaymentWidget();
  const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
  const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);
  const currentUser = useSelector(state => state.currentUser.value);
  const [paymentConfirmData, setPaymentConfirmData] = useState(null);
    const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isConnected, setIsConnected] = useState(true);


  const setPaymentTemp = async (consultantId, customerName, customerPhone, reservationDate, reservationTime,
    consultingInflowPath, calcHistoryId, orderId, orderName, productPrice, productDiscountPrice, paymentAmount, productId, productName) => {
    const data = {
      consultantId,
      customerName,
      customerPhone,
      reservationDate,
      reservationTime,
      consultingInflowPath,
      calcHistoryId,
      orderId,
      orderName,
      productPrice,
      productDiscountPrice,
      paymentAmount,
      productId,
      productName,
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    console.log("log_Request Data: ", data);
    console.log("log_Request Data: ", headers);
    console.log("log_Request Data: ", `${Config.APP_API_URL}payment/saveTemp`);

    try {

      const response = await axios.post(`${Config.APP_API_URL}payment/saveTemp`, data, { headers: headers });
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            message: response.data.errMsg || '결제정보를 임시 저장하지 못했습니다.',
            description: response.data.errMsgDtl || '',
            buttontext: '확인하기',
          },
        });
        return null; // 실패 시 null 반환
      }

      const userData = response.data.data;
      console.log("log_saveTemp: ", userData);

      // 상태가 "DONE"인 경우에만 userData 반환
      if (userData.paymentStatus === "READY") {
        return true; // 성공 시 userData 반환
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error in setPaymentTemp:", error);
      SheetManager.show('info', {
        payload: {
          message: '결제정보를 임시 저장하지 못했습니다.',
          description: error?.message || '',
          type: 'error',
          buttontext: '확인하기',
        },
      });
      return false; // 예외 발생 시 null 반환
    }


  };
 
  const requestPaymentConfirm = async (paymentHistoryId, paymentKey, orderId, paymentAmount) => {
    const data = {
      paymentHistoryId,
      paymentKey,

      orderId,
      paymentAmount,
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    console.log("log_Request Data: ", data);
    try {
      const response = await axios.post(`${Config.APP_API_URL}payment/saveTemp`, { headers: headers }, data);
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            message: response.data.errMsg || '결제정보를 임시 저장하지 못했습니다.',
            description: response.data.errMsgDtl || '',
            buttontext: '확인하기',
          },
        });
        return null; // 실패 시 null 반환
      }

      const userData = response.data.data;
      console.log("log_saveTemp: ", userData.paymentStatus);

      setPaymentConfirmData(userData);
      // 상태가 "DONE"인 경우에만 userData 반환
      if (userData.paymentStatus === "DONE") {

        navigation.push('PaymentCompletScreen', {
          consultantId: props?.route.params?.consultantId,
          customerName: props?.route.params?.customerName,
          customerPhone: props?.route.params?.customerPhone,
          reservationDate: props?.route.params?.reservationDate,
          reservationTime: props?.route.params?.reservationTime,
          consultingInflowPath: props?.route?.params?.consultingInflowPath ?? '',
          calcHistoryId: props?.route?.params?.calcHistoryId ?? '',
          orderId: props?.route.params?.orderId,
          orderName: props?.route.params?.orderName,
          productPrice: props?.route.params?.productPrice,
          productDiscountPrice: props?.route.params?.productDiscountPrice,
          paymentAmount: props?.route.params?.paymentAmount,

          productId: productId, // 고유 주문 ID
          productName: productName, // 주문 이름
        });

        return true; // 성공 시 userData 반환
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error in setPaymentTemp:", error);
      SheetManager.show('info', {
        payload: {
          message: '결제정보를 임시 저장하지 못했습니다.',
          description: error?.message || '',
          type: 'error',
          buttontext: '확인하기',
        },
      });
      return false; // 예외 발생 시 null 반환
    }


  };

  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
      console.log('log_toss 22', !state.isConnected && isConnected)
      console.log('log_toss 221', state.isConnected && !isConnected)

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
  const width = Dimensions.get('window').width;

  const paymentAmount = props?.route.params?.paymentAmount;
  console.log('log_paymentAmount ', paymentAmount);
  return (
    <>
      <PaymentMethodWidget
        selector="payment-methods"
        onLoadEnd={() => {
          paymentWidgetControl
            .renderPaymentMethods(
              'payment-methods',
              { value: paymentAmount }, // 결제 금액 설정
              { variantKey: 'DEFAULT' }
            )
            .then((control) => {
              setPaymentMethodWidgetControl(control);
            });
        }}
      />
      <AgreementWidget
        selector="agreement"
        onLoadEnd={() => {
          paymentWidgetControl
            .renderAgreement('agreement', { variantKey: 'DEFAULT' })
            .then((control) => {
              setAgreementWidgetControl(control);
            });
        }}
      />

      <ShadowContainer style={{ width: '100%', height: 50 }}>
        <Button
          style={{
            backgroundColor: '#2F87FF',
            color: '#FFFFFF',
            width: '100%',
            height: 50, // height 값을 숫자로 변경하고 단위 제거
            alignItems: 'center', // align-items를 camelCase로 변경
            justifyContent: 'center', // justify-content를 camelCase로 변경
            borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
            borderColor: '#E8EAED',
          }}
          active={true}
          width={width}
          onPress={async () => {
            if (!paymentWidgetControl || !agreementWidgetControl) {
              SheetManager.show('info', {
                payload: {
                  message: '주문 정보가 초기화되지 않았습니다.',
                  description: error?.message,
                  type: 'error',
                  buttontext: '확인하기',
                }
              });
              // Alert.alert('주문 정보가 초기화되지 않았습니다.');
              return;
            }

            const agreement = await agreementWidgetControl.getAgreementStatus();
            if (!agreement.agreedRequiredTerms) {
              SheetManager.show('info', {
                payload: {
                  message: '약관에 동의하지 않았습니다.',
                  description: error?.message,
                  type: 'error',
                  buttontext: '확인하기',
                }
              });
              // Alert.alert('약관에 동의하지 않았습니다.');
              return;
            }

            const id = props.route.params.consultantId;
            const customerName = props.route.params.customerName;
            const customerPhone = props.route.params.customerPhone;
            const reservationDate = props.route.params.reservationDate;
            const reservationTime = props.route.params.reservationTime;
            const consultingInflowPath = props.route.params.consultingInflowPath;
            const calcHistoryId = props.route.params.calcHistoryId;
            const orderId = props.route.params.orderId;
            const orderName = props.route.params.productName;
            const productPrice = props.route.params.productPrice;
            const productDiscountPrice = props.route.params.productDiscountPrice;
            const paymentAmount = props.route.params.paymentAmount;
            const productId = props.route.params.productId;
            const productName = props.route.params.productName;


            console.log('log_toss 2', props.route.params)

            const state = await NetInfo.fetch();
            const canProceed = await handleNetInfoChange(state);
            console.log('log_toss 3-1', canProceed)

            if (canProceed) {
              console.log('log_toss 3', canProceed)

              const result = await setPaymentTemp(id, customerName, customerPhone, reservationDate, reservationTime,
                consultingInflowPath, calcHistoryId,
                orderId, orderName, productPrice, productDiscountPrice,
                paymentAmount, productId, productName,
              );
              console.log('log_toss 4', result)

              if (result) {
                const result1 = paymentWidgetControl.requestPayment({
                  amount: {
                    currency: 'KRW',
                    value: productDiscountPrice,
                  },
                  orderId: orderId,
                  orderName: orderName,
                  // successUrl: window.location.origin + '/success.html',
                  // failUrl: window.location.origin + '/fail.html',
                  // customerEmail: 'customer123@gmail.com',
                  customerName: customerName,
                  customerMobilePhone: customerPhone,
                });
                console.log('log_toss 5', result1)

                const paymentKey = result1.paymentKey;
                const paymentHistoryId = result1.paymentHistoryId;

                await requestPaymentConfirm(paymentHistoryId, paymentKey, orderId, productDiscountPrice);

                console.log('log_result', result);
              } else {
                navigation.goBack();
              }

            }
          }}>
          <ButtonText>결제 요청</ButtonText>
        </Button>
      </ShadowContainer>


    </>
  );
}

const TossPaymentScreen = props => {
  const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // 클라이언트 키
  const customerKey = uuidv4(); // 고유 고객 키
  const navigation = useNavigation();

  console.log('log_toss', props.route.params)

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

  return (
    <PaymentWidgetProvider clientKey={clientKey} customerKey={customerKey}>
      <View style={styles.container}>
        <CheckoutPage {...props} navigation={navigation} />
      </View>
    </PaymentWidgetProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default TossPaymentScreen;
