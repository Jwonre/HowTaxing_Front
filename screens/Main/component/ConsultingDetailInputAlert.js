
import React, { useState,useRef,useEffect } from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet, Dimensions, TouchableOpacity, TextInput,ScrollView
} from 'react-native';
import styled from 'styled-components';
import InfoCircleIcon from '../../../assets/icons/info_circle.svg';
import CloseIcon from '../../../assets/icons/close_button.svg';


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
const ConsultingInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  autoCapitalize: 'none',
  autoCorrect: false,
  verticalAlign: 'top',
}))`
  width: 100%; 
  height: 120px;
  background-color: #f5f7fa;
  padding: 15px; 
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 15px;
  text-align: left;
  align-self: center;
  text-align-vertical: top;
  overflow: hidden; 
`;

const ConsultingItem = styled.View`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: left;
  justify-content: space-between;

`;  // 세미콜론 추가

const ConsultingDetailInputAlert = ({ content, visible, onClose, onInputCallback }) => {
  const [selectCancelType, setSelectCancelType] = useState(0);
  const [consultingContent, setConsultingContent] = useState('');
  const text = content ?? ''; // content가 undefined 또는 null이면 빈 문자열로 설정
  const inputRef = useRef(null);
    const width = Dimensions.get('window').width;
  
 useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500); // 딜레이 추가
    return () => clearTimeout(timer);
  }, []);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ModalContainer>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>

            <TouchableOpacity
              activeOpacity={0.6}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={() => {
                navigation.goBack();
                // dispatch(clearHouseInfo());
              }}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <ModalTitle>상세 내용을 입력해주세요.</ModalTitle>
          <ModalDescription>정확한 상담을 위해 사실 관계 및 문의사항을 자세하게 입력해주세요.</ModalDescription>


          <View style={styles.inputAuthWrapper}>
            <ConsultingItem>
              <ScrollView keyboardShouldPersistTaps='always'>
                <ConsultingInput
                  ref={inputRef}
                  autoFocus={true}
                  multiline={true}
                  width={width}
                  placeholder="상담 내용을 입력해주세요"

                  onChangeText={(input) => {
                    // setConsultingContent(input)
                    let byteCount = encodeURI(input).split(/%..|./).length - 1;
                    if (byteCount <= 1000) {
                      setConsultingContent(input);
                    }
                  }}
                  value={consultingContent.slice(0, 1000)}
                  // style={{ flexWrap: 'wrap' }}
                  blurOnSubmit={false}
                />
              </ScrollView>
            </ConsultingItem>

          </View>
          <View style={styles.buttonContainer}>

            <Button
              style={[styles.button, styles.loginButton]}
              onPress={() => {
                onInputCallback(consultingContent.length > 0 ? consultingContent : text.length > 0 ? text : '')
              }}
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
    paddingVertical: 14,
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
