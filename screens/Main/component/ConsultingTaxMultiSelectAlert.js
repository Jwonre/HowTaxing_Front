
import React, { useState, } from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet, Dimensions, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import InfoCircleIcon from '../../../assets/icons/info_circle.svg';
import DropShadow from 'react-native-drop-shadow';
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
const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;
const ConsultingTaxMultiSelectAlert = ({ visible, onClose, onTaxMultiSelect }) => {
  const [selectTaxType, setSelectTaxType] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템 관리

  const taxTypes = [
    '취득세',
    '양도소득세',
    '상속세',
    '증여세',
  ];
  const taxTypesIndex = [
    '01',
    '02',
    '03',
    '04',
  ];

  const toggleSelect = (item) => {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        // 이미 선택된 경우 제거
        return prev.filter((i) => i !== item);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, item];
      }
    });
  };

  const saveSelection = () => {
    const result = selectedItems.join(','); // 선택된 값을 ','로 구분된 문자열로 변환
    console.log('최종 선택값:', result);
    // 저장 로직 추가 가능
  };

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
          <ModalTitle>세금 종류를 선택해주세요.</ModalTitle>
          <ModalDescription>상담을 원하시는 세금 종류를 하나 이상 선택해주세요.</ModalDescription>

          <View style={{ marginStart: 15, marginEnd: 15, width: '100%' }}>
            {taxTypes.map((tax, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.6}
                style={{
                  marginBottom: 10,
                  width: '100%',
                }}
                onPress={() => {
                  toggleSelect(taxTypesIndex[index])
                }} // 선택/제거 토글
              >
                <View
                  style={{
                    borderRadius: 5,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    backgroundColor: selectedItems.includes(taxTypesIndex[index]) ? '#2F87FF' : '#E8EAED', // 선택 여부에 따라 색상 변경
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#fff',
                      fontFamily: 'Pretendard-SemiBold',
                    }}
                  >
                    {tax}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            {/* <TouchableOpacity activeOpacity={0.6}
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
                <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'Pretendard-SemiBold' }}>{taxTypes[0]}</Text>
              </ View>
            </TouchableOpacity>

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
                <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'Pretendard-SemiBold' }}>{taxTypes[1]}</Text>
              </ View>
            </TouchableOpacity>

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
                <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'Pretendard-SemiBold' }}>{taxTypes[2]}</Text>
              </ View>
            </TouchableOpacity>

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
                <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'Pretendard-SemiBold' }}>{taxTypes[3]}</Text>
              </ View>
            </TouchableOpacity> */}
          </View>


          <View style={styles.buttonContainer}>

            <Button
              style={[styles.button, styles.loginButton, { width: '100%' }]}
              onPress={() => {

                const result = selectedItems.join(','); // 선택된 값을 ','로 구분된 문자열로 변환


                onTaxMultiSelect(result);
              }}
            >
              <ButtonText style={styles.loginButtonText}>선택하기</ButtonText>
            </Button>

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
