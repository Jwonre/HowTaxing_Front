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

function CheckoutPage() {
  const paymentWidgetControl = usePaymentWidget();
  const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
  const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);

  return (
    <>
      <PaymentMethodWidget
        selector="payment-methods"
        onLoadEnd={() => {
          paymentWidgetControl
            .renderPaymentMethods(
              'payment-methods',
              { value: 50000 }, // 결제 금액 설정
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
        title="결제 요청"
        onPress={async () => {
          if (!paymentWidgetControl || !agreementWidgetControl) {
            Alert.alert('주문 정보가 초기화되지 않았습니다.');
            return;
          }

          const agreement = await agreementWidgetControl.getAgreementStatus();
          if (!agreement.agreedRequiredTerms) {
            Alert.alert('약관에 동의하지 않았습니다.');
            return;
          }

          paymentWidgetControl.requestPayment({
            orderId: 'order-id-123',
            orderName: '테스트 상품',
          });
        }}
      />
    </>
  );
}

const TossPaymentScreen = () => {
  const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // 클라이언트 키
  const customerKey = uuidv4(); // 고유 고객 키

  return (
    <PaymentWidgetProvider clientKey={clientKey} customerKey={customerKey}>
      <View style={styles.container}>
        <CheckoutPage />
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
