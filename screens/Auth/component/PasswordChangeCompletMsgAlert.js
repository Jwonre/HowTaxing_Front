
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
  margin-bottom: 10px;
`;

const ModalDescription = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Medium;
  color: #000;
  line-height: 20px;
  text-align: center;
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

const PasswordChangeCompletMsgAlert = ({ visible,   onLogin }) => {
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onLogin}
    >
      <View style={styles.modalOverlay}>
        <ModalContainer>
          <InfoCircleIcon style={{ color: '#FF7401', marginBottom: 10 }} />
          <ModalTitle>비밀번호 재설정이 완료되었어요.</ModalTitle>
          <ModalDescription>다시 로그인해주세요.</ModalDescription>
          <View style={styles.buttonContainer}>
            
            <Button
              style={[styles.button, styles.loginButton]}
              onPress={onLogin}
            >
              <ButtonText style={styles.loginButtonText}>로그인하기</ButtonText>
            </Button>
          </View>
        </ModalContainer>
      </View>
    </Modal>
  );
};

export default PasswordChangeCompletMsgAlert;

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
