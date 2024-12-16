
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
const ConsultingTaxMultiSelectAlert = ({ visible, onClose, onCancelRequest }) => {
  const [selectTaxType, setSelectTaxType] = useState(0);

const taxTypes = [
  '취득세',
  '양도소득세',
  '상속세',
  '증여세',
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
          <ModalTitle>세금 종류를 선택해주세요.</ModalTitle>
          <ModalDescription>상담을 원하시는 세금 종류를 하나 이상 선택해주세요.</ModalDescription>
        

            <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{marginBottom : 10}}

                onPress={() => {
                  setSelectTaxType(0);
                
                  // ////console.log('after data', data);
                }}>
                <View style={{height : 40, alignItems : 'center', justifyContent : 'center', width : '100%'}}>
                 <Text style={{fontSize : 15, color : '#fff', fontFamily : 'Pretendard-SemiBold'}}>{taxTypes[0]}</Text>
                </ View>  
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{marginBottom : 10}}

                onPress={() => {
                  setSelectTaxType(1);
                
                  // ////console.log('after data', data);
                }}>
                <View style={{height : 40, alignItems : 'center', justifyContent : 'center', width : '100%'}}>
                 <Text style={{fontSize : 15, color : '#fff', fontFamily : 'Pretendard-SemiBold'}}>{taxTypes[1]}</Text>
                </ View>  
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{marginBottom : 10}}

                onPress={() => {
                  setSelectTaxType(2);
                
                  // ////console.log('after data', data);
                }}>
                <View style={{height : 40, alignItems : 'center', justifyContent : 'center', width : '100%'}}>
                 <Text style={{fontSize : 15, color : '#fff', fontFamily : 'Pretendard-SemiBold'}}>{taxTypes[2]}</Text>
                </ View>  
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{marginBottom : 10}}

                onPress={() => {
                  setSelectTaxType(3);
                
                  // ////console.log('after data', data);
                }}>
                <View style={{height : 40, alignItems : 'center', justifyContent : 'center', width : '100%'}}>
                 <Text style={{fontSize : 15, color : '#fff', fontFamily : 'Pretendard-SemiBold'}}>{taxTypes[3]}</Text>
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

export default ConsultingTaxMultiSelectAlert;

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
