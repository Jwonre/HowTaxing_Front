// 공시가격_전용면적 정의 설명 팝업(? 아이콘 누른경우)

import { useWindowDimensions, Pressable,View } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch } from 'react-redux';
  

const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: auto;
`;
const ModalContentSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  text-align: center;
  justify-content: center;

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
  font-family: Pretendard-Bold;
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
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const QuestionMarkDefinition = props => {
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  
 // ////console.log('props', props);

  const title =
    props.payload.type === '전용면적' ? '전용면적' : '공시가격';

 // const middleMessage = '아래의 조건에 해당하시는 상황을 의미해요.';
  const message =
    props.payload.type === '전용면적'
      ? '우리가 실제 거주하는 기본 면적이라고 이해\n하면 돼요. 아파트의 경우 방과 거실, 화장실,\n주방 등 그 집에 사는 사람이 독립해 사용할\n수 있는 공간을 말해요.'
      : '국토교통부장관이 전국의 개별 토지중 지가\n대표성 등이 있는 약58만 필지를 선정·조사\n하여 공시하는 것으로서 매년 1월 1일 기준\n표준지의 단위면적당 가격을 말해요.';

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
      gestureEnabled={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 300,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalContentSection>
          <ModalTitle><BoldText>{title}</BoldText>{'이란?'}</ModalTitle>
          <View style={{height: 100}}><ModalDescription>{message}</ModalDescription></View>
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
              <ButtonText>돌아가기</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default QuestionMarkDefinition;
