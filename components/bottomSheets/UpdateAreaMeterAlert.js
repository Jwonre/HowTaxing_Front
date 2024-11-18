// 보유 주택 목록에서 전용면적 수정 선택시 뜨는 팝업

import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import CancelCircle from '../../assets/icons/cancel_circle.svg';
import NetInfo from "@react-native-community/netinfo";

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
`;

const ModalSubtitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
  margin: 20px 0;
`;

const ModalInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f3f8;
  border-radius: 10px;
  margin-top: 10px;
`;

const StyledInput = styled.TextInput.attrs({
  placeholderTextColor: '#C1C3C5',
})`
  flex: 1;
  height: 50px;
  padding: 0 10px;
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: right;
`;

const ModalSelectButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 24%;
  height: 48px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border: 1px solid #e8eaed;
`;

const ModalSelectButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard;
  color: #1b1c1f;
  line-height: 20px;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
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
  justify-content: space-between;
  padding: 20px;
  border-top-width: 1px;
  border-top-color: #e8eaed;
`;

const ButtonShadow = styled(DropShadow)`
  width: 48%;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 10;
  }
  shadow-opacity: 0.25;
  shadow-radius: 4;
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




const UpdateAreaMeterAlert = props => {

  const { handleHouseChange, data, navigation, prevSheet } = props.payload;

  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();


  // 전용면적
  const [areaMeter, setAreaMeter] = useState(
    data?.area ? data?.area : 0,
  );

  // 전용면적 선택 리스트
  const AC_AREA_LIST = [43, 59, 79, 84];

  // 키보드 이벤트
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [isConnected, setIsConnected] = useState(true);

  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
      if (!state.isConnected && isConnected) {
        setIsConnected(false);
        navigation.push('NetworkAlert', navigation);
        resolve(false);
      } else if (state.isConnected && !isConnected) {
        setIsConnected(true);
        if (!hasNavigatedBackRef.current) {
          setHasNavigatedBack(true);
        }
        resolve(true);
      } else {
        resolve(true);
      }
    });
  };


  const nextHandler = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      var p = data;
      p.area = areaMeter;
      await handleHouseChange(p, p?.isMoveInRight);

      actionSheetRef.current?.hide();
    }
  };

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
        height: 450,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >전용면적을 입력해주세요.</ModalTitle>
          <ModalSubtitle >{areaMeter}㎡</ModalSubtitle>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <ModalLabel >제곱미터</ModalLabel>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ModalInputContainer>
                <StyledInput
                  
                  placeholder="전용면적을 입력해주세요."
                  keyboardType="number-pad"
                  value={areaMeter ? areaMeter?.toLocaleString() : null}
                  onChangeText={text => {
                    const numericValue = Number(text.replace(/[^0-9]/g, ''));
                    if (numericValue <= 1000000000000000) {
                      setAreaMeter(numericValue);
                    } else {
                      setAreaMeter(1000000000000000)
                    }
                  }}
                />
                {(areaMeter !== null && areaMeter !== 0) && (
                  <TouchableOpacity onPress={() => setAreaMeter(0)}>
                    <CancelCircle style={{ marginRight: 10 }} width={20} height={20} />
                  </TouchableOpacity>
                )}
              </ModalInputContainer>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              {AC_AREA_LIST.map((item, index) => (
                <ModalSelectButton
                  onPress={() => {
                    setAreaMeter(item);
                  }}>
                  <ModalSelectButtonText >
                    {item}
                  </ModalSelectButtonText>
                </ModalSelectButton>
              ))}
            </View>
          </View>
        </ModalInputSection>
        <ButtonSection
          style={{
            borderTopWidth: 0,
          }}>
          <ButtonShadow
            style={{
              shadowColor: '#fff',
            }}>
            <Button
              onPress={() => {
                actionSheetRef.current?.hide();
              }}
              style={{
                backgroundColor: '#fff',
                borderColor: '#E8EAED',
              }}>
              <ButtonText
                style={{
                  color: '#717274',
                }} >
                돌아가기
              </ButtonText>
            </Button>
          </ButtonShadow>
          <ButtonShadow>
            <Button
              onPress={() => {
                // 주택 정보 업데이트
                nextHandler();
              }}>
              <ButtonText >입력하기</ButtonText>
            </Button>
          </ButtonShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default UpdateAreaMeterAlert;
