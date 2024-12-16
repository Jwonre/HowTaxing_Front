
import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';
import InfoCircleIcon from '../../../assets/icons/info_circle.svg';


const ModalContainer = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 90%; /* 화면 너비의 90% */
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #000;
  line-height: 26px;
  text-align: center;
  margin-bottom: 20px;
`;

const ModalDescription = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Medium;
  color: #000;
  line-height: 20px;
  text-align: left;
  margin-bottom: 20px;

`;

const Button = styled.TouchableOpacity`
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 48%;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Medium;
`;
const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;
const ConsultingCancelConfirmAlert = ({ visible, onClose, onCancelRequest }) => {
  const [selectCancelType, setSelectCancelType] = useState(0);

const cancelTitle = [
  '마음이 변했어요',
  '상담이 더 이상 필요하지 않아요',
  '다른 세무사를 이미 구했어요',
];
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ModalContainer>
          <InfoCircleIcon style={{ color: '#FF7401', marginBottom: 10 }} />
          <ModalTitle>상담을 정말로 취소하실건가요?</ModalTitle>
          <ModalDescription>이전에 결제하셨던 금액은 자동으로 환불 요청이 되며, 환불 취소까지 영업일 기준 2~3일 소요될 수 있어요.</ModalDescription>
          <ModalDescription>상담을 취소하시려는 사유를 알려주세요.</ModalDescription>

        

            <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{marginBottom : 10}}

                onPress={() => {
                  setSelectCancelType(0);
                
                  // ////console.log('after data', data);
                }}>
                <View style={{height : 40, alignItems : 'center', justifyContent : 'center', width : '100%',backgroundColor : selectCancelType === 0 ? '#2F87FF' : '#E8EAED'}}>
                 <Text style={{fontSize : 15, color : '#fff', fontFamily : 'Pretendard-SemiBold'}}>{cancelTitle[0]}</Text>
                </ View>  
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{marginBottom : 10}}

                onPress={() => {
                  setSelectCancelType(1);
                
                  // ////console.log('after data', data);
                }}>
                <View style={{height : 40, alignItems : 'center', justifyContent : 'center', width : '100%',backgroundColor : selectCancelType === 1 ? '#2F87FF' : '#E8EAED'}}>
                 <Text style={{fontSize : 15, color : '#fff', fontFamily : 'Pretendard-SemiBold'}}>{cancelTitle[1]}</Text>
                </ View>  
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{marginBottom : 10}}

                onPress={() => {
                  setSelectCancelType(2);
                
                  // ////console.log('after data', data);
                }}>
                <View style={{height : 40, alignItems : 'center', justifyContent : 'center', width : '100%',backgroundColor : selectCancelType === 2 ? '#2F87FF' : '#E8EAED'}}>
                 <Text style={{fontSize : 15, color : '#fff', fontFamily : 'Pretendard-SemiBold'}}>{cancelTitle[2]}</Text>
                </ View>  
              </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button
              style={[styles.button, styles.resetButton]}
              onPress={onClose}
            >
              <ButtonText style={styles.resetButtonText}>아니오</ButtonText>
            </Button>
            <ShadowContainer>
            <Button
              style={[styles.button, styles.loginButton]}
              onPress={onCancelRequest(selectCancelType, cancelTitle[selectCancelType])}
            >
              <ButtonText style={styles.loginButtonText}>네</ButtonText>
            </Button>
          </ShadowContainer>
            
          </View>
        </ModalContainer>
      </View>
    </Modal>
  );
};

export default ConsultingCancelConfirmAlert;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%', // 버튼 간격 자동 조정
  },
  resetButton: {
    backgroundColor: '#fff',
    borderColor: '#E8EAED',
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: '#2F87FF',
  },
  resetButtonText: {
    color: '#717274',
  },
  loginButtonText: {
    color: '#fff',
  },
});
