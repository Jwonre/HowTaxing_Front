// 정보 또는 경고 알림창 컴포넌트

import { useWindowDimensions, Pressable, View, Text } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch } from 'react-redux';


const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  width: 80%;
  font-size: 17px;
  font-family: Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;

`;


const BoldText = styled.Text`
  font-family: Pretendard-Regular;
  font-weight: 600;
`;

const ModalDescription = styled.Text`
  font-size: 14px;
  font-family: Bold;
  width: 75%;
  color: #1b1c1f;
  line-height: 22px;
  margin-top: 15px;
  text-align: left;

`;

const Modaldetail = styled.Text`
  width: 100%;
  font-size: 12px;
  font-family: Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-top: 15px;
  text-align: left;
  margin-bottom: 10px;
`;

const ModalContentSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  align-items: center; 
  justify-content: center;
  text-align: center;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
  
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const InfoBuyPrice = () => {
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {

              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      closeOnTouchBackdrop={false}
      gestureEnabled={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 490,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalContentSection>

          <ModalTitle>
            <BoldText>매매 외 방식으로 주택 취득 시{'\n'}<Text style={{ fontFamily: 'Pretendard-Bold' }}>취득일자</Text>는 어떤 날짜인가요?</BoldText>
          </ModalTitle>
          <View style={{ height: 270}}>
            <ModalDescription>{'1) 상속으로 취득 : 상속개시일\n2) 증여로 취득 : 증여등기 접수일\n3) 재산분할청구권의 행사로 배우자로부터 취\n득하는 재산 : 배우자의 당초 재산 취득시기\n4) 이혼위자료의 대가로 배우자로부터 취득하\n는 재산 : 소유권이전등기접수일\n5) 교환자산 : 교환성립일(단, 교환가액의 차\n이가 있다면 차액 청산일 혹인 차액이 불분명\n한 경우에는 교환등기접수일)\n6) 이월과세대상 자산 : 배우자 등의 당초 재산\n취득시기'}</ModalDescription>
          </View>
        </ModalContentSection>

        <ButtonSection>
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
              width: width - 100,
            }}>
            <Button
              onPress={() => {

                actionSheetRef.current?.hide();
              }}>
              <ButtonText >돌아가기</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default InfoBuyPrice;
