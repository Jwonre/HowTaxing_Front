
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
const ConsultingDetailInputAlert = ({content, visible, onClose,onInputCallback }) => {
  const [selectCancelType, setSelectCancelType] = useState(0);
  const [consultingContent, setConsultingContent] = useState('');


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
          <ModalTitle>상세 내용을 입력해주세요.</ModalTitle>
          <ModalDescription>정확한 상담을 위해 사실 관계 및 문의사항을 자세하게 입력해주세요.</ModalDescription>
        

          <View style={styles.inputAuthWrapper}>
                <TextInput
                  keyboardType="numeric"
                  style={{    flex: 1, // TextInput이 남은 공간을 차지하도록 설정
                    color: content.trim().length > 0 ? '#000':'#A3A5A8',
                    fontSize: 13,
                    fontFamily: 'Pretendard-Regular',}}
                  placeholder={content.trim().length > 0 ? `${content}`:"상담 내용을 입력해주세요."}
                  placeholderTextColor="#A3A5A8"
                  value={consultingContent}
                  onChangeText={consultingContent}
                />
                
              </View>
          <View style={styles.buttonContainer}>
            
            <Button
              style={[styles.button, styles.loginButton]}
              onPress={onInputCallback(consultingContent.length > 0 ? consultingContent : content.length > 0 ? content : '')}
            >
              <ButtonText style={styles.loginButtonText}>입력하기</ButtonText>
            </Button>
            
          </View>
        </ModalContainer>
      </View>
    </Modal>
  );
};

export default ConsultingDetailInputAlert;

const styles = StyleSheet.create({
  inputAuthWrapper: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    paddingVertical : 14,
    height: 120,
    marginBottom: 20,
  },

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
    width: '100%', // 버튼 간격 자동 조정
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
