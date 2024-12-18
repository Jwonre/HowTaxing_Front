
import React, { useState, } from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet, Dimensions, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import InfoCircleIcon from '../../../assets/icons/info_circle.svg';
import DropShadow from 'react-native-drop-shadow';
import CloseIcon from '../../../assets/icons/close_button.svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


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
  const navigation = useNavigation();

  console.log('log_03', visible);
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
          <View style={{  width: '100%', flexDirection: 'row', justifyContent: 'flex-end' , marginBottom : 20}}>

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

          <InfoCircleIcon style={{ color: '#FF7401', marginBottom: 10 }} />
          <ModalTitle>상담을 정말로 취소하실건가요?</ModalTitle>
          <ModalDescription>이전에 결제하셨던 금액은 자동으로 환불 요청이 되며, 환불 취소까지 영업일 기준 2~3일 소요될 수 있어요.</ModalDescription>
          <ModalDescription>상담을 취소하시려는 사유를 알려주세요.</ModalDescription>



          <View style={{ marginStart: 15, marginEnd: 15, width: '100%' }}>
            <TouchableOpacity activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                marginBottom: 10,
                width: '100%', // 부모 컨테이너도 가로로 채우기
              }}

              onPress={() => {
                setSelectCancelType(0);

                // ////console.log('after data', data);
              }}>
              <View style={{ borderRadius: 5, height: 40, alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: selectCancelType === 0 ? '#2F87FF' : '#E8EAED' }}>
                <Text style={{ fontSize: 15, color: selectCancelType === 0 ?'#fff':'#000', fontFamily: 'Pretendard-SemiBold' }}>{cancelTitle[0]}</Text>
              </ View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                marginBottom: 10,
                width: '100%', // 부모 컨테이너도 가로로 채우기
              }}

              onPress={() => {
                setSelectCancelType(1);

                // ////console.log('after data', data);
              }}>
              <View style={{ borderRadius: 5, height: 40, alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: selectCancelType === 1 ? '#2F87FF' : '#E8EAED' }}>
                <Text style={{ fontSize: 15, color: selectCancelType === 1 ?'#fff':'#000', fontFamily: 'Pretendard-SemiBold' }}>{cancelTitle[1]}</Text>
              </ View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{

                marginBottom: 10,
                width: '100%', // 부모 컨테이너도 가로로 채우기
              }}

              onPress={() => {
                setSelectCancelType(2);

                // ////console.log('after data', data);
              }}>
              <View style={{ borderRadius: 5, height: 40, alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: selectCancelType === 2 ? '#2F87FF' : '#E8EAED' }}>
                <Text style={{ fontSize: 15, color:selectCancelType === 2 ?'#fff':'#000', fontFamily: 'Pretendard-SemiBold' }}>{cancelTitle[2]}</Text>
              </ View>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Button
                style={[styles.button, styles.resetButton]}
                onPress={() => {
                  onClose();
                }}
              >
                <ButtonText style={styles.resetButtonText}>아니오</ButtonText>
              </Button>


              <DropShadow
                style={{
                  shadowColor: 'rgba(0,0,0,0.25)',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                  alignSelf: 'center',
                  width: '48%',
                }}>
                <Button
                  style={[styles.button, styles.loginButton, { width: '100%' }]}

                  onPress={() => {
                    onCancelRequest(selectCancelType, cancelTitle[selectCancelType]);
                  }}>
                  <ButtonText style ={{color : '#fff'}}>네</ButtonText>
                </Button>
              </DropShadow>
              {/* <Button
                style={[styles.button, styles.resetButton]}
                onPress={() => {
                  onCancelRequest(selectCancelType, cancelTitle[selectCancelType]);
                }}
              >
                <ButtonText style={styles.resetButtonText}>아니오</ButtonText>
              </Button> */}

            </View>
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
