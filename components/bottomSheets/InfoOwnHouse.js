// 정보 또는 경고 알림창 컴포넌트

import { useWindowDimensions, Pressable, View, Text, Linking } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import InfoCircleIcon from '../../assets/icons/info_circle.svg';


const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  width: 100%;
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;

`;

const ModalDescription = styled.Text`
  width: 100%;
  font-size: 15px;
  font-family: Pretendard-Regular;
  font-weight: 500;
  color: #1b1c1f;
  line-height: 23px;
  text-align: left;


`;

const ModalContentSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
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
  padding: 10px;
  margin-top: 20px;
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


const InfoOwnHouse = props => {
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
      gestureEnabled={false}
      closeOnPressBack={true}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: props.payload?.height,
        width: width - 40
      }}>
      <SheetContainer width={width}>
        <ModalContentSection>
          <InfoCircleIcon
            style={{
              color: '#FF7401',
              marginBottom: 10
            }}
          />
          <ModalTitle >{props?.payload?.message}</ModalTitle>
          <View width={width - 60} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 25, paddingTop: 20 }}>
            <Text style={{
              alignSelf: 'flex-start',
              fontFamily: 'Pretendard-Medium',
              marginRight: 5
            }}>ㆍ</Text>
            <ModalDescription style={{ fontFamily: 'Pretendard-Medium' }}>
              {props?.payload?.description}
            </ModalDescription>
          </View>
          {props?.payload?.isGainsTax && <View width={width - 60} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 25, paddingTop: 20 }}>
            <Text style={{
              alignSelf: 'flex-start',
              fontFamily: 'Pretendard-Medium',
              marginRight: 5
            }}>ㆍ</Text>
            <ModalDescription style={{ fontFamily: 'Pretendard-Medium' }}>
              {props?.payload?.description2}
            </ModalDescription>
          </View>}
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
              width: width - 80,
            }}>
            <Button
              onPress={() => {
                actionSheetRef.current?.hide();

              }}>
              <ButtonText >{props?.payload?.buttontext ? props?.payload?.buttontext : '확인하기'}</ButtonText>
            </Button>
          </DropShadow>

        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default InfoOwnHouse;
