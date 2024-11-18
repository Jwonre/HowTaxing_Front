// 보유 주택 목록에서 공시가격 수정 선택시 뜨는 팝업

import {
  View,
  useWindowDimensions,
  Pressable,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from '../Calendar';
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
  margin-bottom: 20px;
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




const UpdateBuyDateAlert = props => {


  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const { handleHouseChange, data, navigation, prevSheet } = props.payload;
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const _scrollViewRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date(),
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  const nextHandler = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      var p = data;
      p.buyDate = selectedDate;
      // ////console.log('[UpdateBuyDateAlert]nextHandler p:', p);
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
        width: width - 40,
      }}>
      <ScrollView
        keyboardShouldPersistTaps='always'
        ref={_scrollViewRef}
        pagingEnabled
        style={{
          width: width - 40,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        scrollEventThrottle={16}>
        <SheetContainer width={width}>
          <ModalInputSection>
            <ModalTitle >취득 당시 취득일자를 선택해주세요.</ModalTitle>
            <View
              style={{
                width: '100%',
                height: 350,
                marginTop: 20,
              }}>
              <Calendar
                currentPageIndex={1}
                minDate={data?.contractDate ? new Date(new Date(data?.contractDate).setHours(0, 0, 0, 0)) : ''}
                currentDate={data?.buyDate ? new Date(new Date(data?.buyDate).setHours(0, 0, 0, 0)) : data?.contractDate ? new Date(data?.contractDate) > new Date() ? new Date(new Date(data?.contractDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0))}
                selectedDate={data?.buyDate ? new Date(new Date(data?.buyDate).setHours(0, 0, 0, 0)) : data?.contractDate ? new Date(data?.contractDate) > new Date() ? new Date(new Date(data?.contractDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0))}
                setSelectedDate={setSelectedDate}
              />
            </View>
          </ModalInputSection>
          <ButtonSection>
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
                  이전으로
                </ButtonText>
              </Button>
            </ButtonShadow>
            <ButtonShadow>
              <Button
                active={selectedDate}
                disabled={!(selectedDate)}
                onPress={() => {
                  // 주택 정보 업데이트
                  nextHandler();
                }}
                style={{
                  alignSelf: 'center',
                  backgroundColor: selectedDate ? '#2f87ff' : '#E8EAED',
                  borderColor: selectedDate ? '#2f87ff' : '#E8EAED',
                }}>
                <ButtonText active={selectedDate} style={{ color: selectedDate ? '#fff' : '#717274' }}>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>
      </ScrollView>
    </ActionSheet >
  );
};

export default UpdateBuyDateAlert;
