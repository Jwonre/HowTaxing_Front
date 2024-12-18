import React, { useCallback, useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
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

function CheckoutPage(props) {
  const navigation = useNavigation();


  console.log('log_CheckoutPage Context Data:', props);

  const paymentWidgetControl = usePaymentWidget();
  const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
  const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);
  const currentUser = useSelector(state => state.currentUser.value);


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

      // 상태가 "DONE"인 경우에만 userData 반환
      if (userData.paymentStatus === "DONE") {
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


  return (
    <>
      <PaymentMethodWidget
        selector="payment-methods"
        onLoadEnd={() => {
          paymentWidgetControl
            .renderPaymentMethods(
              'payment-methods',
              { value: productPrice }, // 결제 금액 설정
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
      <Button
      style = {
        {
          borderRadius: 6,
          backgroundColor :'#2F87FF',
          height : 50,
        }
      }
        title="결제 요청"
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
          const orderName = props.route.params.orderName;
          const productPrice = props.route.params.productPrice;
          const productDiscountPrice = props.route.params.productDiscountPrice;
          const paymentAmount = props.route.params.paymentAmount;
          const productId = props.route.params.productId;
          const productName = props.route.params.customerName;

         const result =  await setPaymentTemp(id, customerName, customerPhone, reservationDate, reservationTime,
            consultingInflowPath, calcHistoryId,
            orderId, orderName, productPrice, productDiscountPrice,
            paymentAmount, productId, productName,
          );

          if(result){
            const result = paymentWidgetControl.requestPayment({
              amount: {
                currency: 'KRW',
                value: productPrice,
              },
              orderId: orderId,
              orderName: orderName,
              // successUrl: window.location.origin + '/success.html',
              // failUrl: window.location.origin + '/fail.html',
              // customerEmail: 'customer123@gmail.com',
              customerName: customerName,
              customerMobilePhone : customerPhone,
            });

            console.log('log_result',result);
          }else{
            navigation.goBack();
          }

         
        }}
      />
    </>
  );
}

const TossPaymentScreen = props => {
  const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // 클라이언트 키
  const customerKey = uuidv4(); // 고유 고객 키

  console.log('log_Toss',props);
  return (
    <PaymentWidgetProvider clientKey={clientKey} customerKey={customerKey}>
      <View style={styles.container}>
        <CheckoutPage props  = {props} />
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
