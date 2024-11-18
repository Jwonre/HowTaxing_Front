// 양도세 정보 입력 시트

import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import InfoIcon from '../../assets/icons/info_tooltip_ico.svg';
import numberToKorean from '../../utils/numToKorean';
import { useDispatch, useSelector } from 'react-redux';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { gainTax } from '../../data/chatData';
import { SheetManager } from 'react-native-actions-sheet';
import CancelCircle from '../../assets/icons/cancel_circle.svg';



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
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
`;

const ModalSubtitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Medium;
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
  font-family: Pretendard-SemiBold;
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

const InfoMessage = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #FF7401;
  line-height: 20px;
  margin-top: 10px;
  text-align: center;
`;


const ExpenseSheet = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  // 필요경비금액
  const [ExpenseAmount, setExpenseAmount] = useState(
    houseInfo?.ExpenseAmount ? houseInfo?.ExpenseAmount : null,
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const chatDataList = useSelector(state => state.chatDataList.value);


  // 필요경비금액 선택 리스트
  const AC_AMOUNT_LIST = [50000000, 10000000, 5000000, 1000000];


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


    // 초기 세팅
  }, []);

  useEffect(() => {
    if (chatDataList.find(el => el.id === 'ExpenseAnswer')) {
      return;
    }
    const chat1 = {
      id: 'ExpenseAnswer',
      type: 'system',
      message: '필요경비를 입력해주세요.',
      progress: 2,
      select: [
        {
          id: 'ExpenseAmount',
          name: '필요경비 입력하기',
          openSheet: 'Expense',
          currentPageIndex: 0,
        },
      ],
    };

    dispatch(setChatDataList([...chatDataList, chat1]));
  }, []);



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
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: currentPageIndex === 0 ? (isKeyboardVisible ? 280 : 460) : 600,
        width: width - 40,
      }}>

      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >필요경비를 입력해주세요.</ModalTitle>
          <InfoMessage >
            * 적합한 증빙 없이 현금(계좌이체)으로{'\n'}지출한 필요경비는 인정받지 못할 수 있습니다.
          </InfoMessage>
          <ModalSubtitle >{numberToKorean(ExpenseAmount === null ? 0 : ExpenseAmount)}{(ExpenseAmount !== null && ExpenseAmount !== 0) ? '원' : null}</ModalSubtitle>

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
              <ModalLabel >필요경비</ModalLabel>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <InfoIcon
                  onPress={() => {
                    SheetManager.show('infoExpense', {
                      payload: {
                        Title: "필요경비",
                        Description: "부동산을 취득할 때부터 매매할 때까지 발생\n하는 비용 중 소득세법에서 인정하는 비용들을\n말해요. 취득세, 중개수수료, 보일러 교체비용\n등이 해당돼요. 양도소득세는 양도차익이 클\n수록 세금이 많아지므로 필요경비 금액이 커질\n수록 세금은 줄어들게 돼요.",
                        height: 360,
                      },
                    });
                  }}
                />
              </TouchableOpacity>
            </View>
            <ModalInputContainer>
              <StyledInput

                placeholder="필요경비를 입력해주세요."
                keyboardType="number-pad"
                value={ExpenseAmount === null ? '' : ExpenseAmount.toLocaleString()}
                onChangeText={text => {
                  const numericValue = Number(text.replace(/[^0-9]/g, ''));
                  if (numericValue <= 1000000000000000) {
                    setExpenseAmount(numericValue);
                  } else {
                    setExpenseAmount(1000000000000000)
                  }
                }}
              />
              {(ExpenseAmount !== null) && (
                <TouchableOpacity onPress={() => setExpenseAmount(null)}>
                  <CancelCircle style={{ marginRight: 10 }} width={20} height={20} />
                </TouchableOpacity>
              )}
            </ModalInputContainer>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              {AC_AMOUNT_LIST.map((item, index) => (
                <ModalSelectButton
                  key={index}
                  onPress={() => {
                    setExpenseAmount(prev => prev + item);
                  }}>
                  <ModalSelectButtonText >
                    {item === 50000000 ? '5천만' : item === 10000000 ? '1천만' : item === 5000000 ? '5백만' : '1백만'}
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
                이전으로
              </ButtonText>
            </Button>
          </ButtonShadow>
          <ButtonShadow>
            <Button
              onPress={async () => {
                // ////console.log('ExpenseAmount', ExpenseAmount);
                dispatch(
                  setHouseInfo({
                    ...houseInfo,
                    necessaryExpense: ExpenseAmount ? ExpenseAmount : 50000000,
                  }),
                );
                actionSheetRef.current?.hide();
                const chat = {
                  id: 'ExpenseAnswer',
                  type: 'system',
                  message: '필요경비를 입력해주세요.',
                  select: [
                    {
                      id: 'ExpenseAmount',
                      name: '필요경비 입력하기',
                      openSheet: 'Expense',
                      currentPageIndex: 0,
                      key: 'ExpenseAnswer',
                    },
                  ],
                  progress: 9,
                };

                const chat2 = {
                  id: 'ExpenseAmount2',
                  type: 'my',
                  progress: 4,
                  message: `${ExpenseAmount?.toLocaleString()}원`,
                  data: {
                    necessaryExpense: ExpenseAmount,
                  }
                };

                const chatList =
                  chatDataList[chatDataList.length - 1].id ===
                    'ExpenseAnswer'
                    ? chat2
                    : [chat, chat2];

                const chat3 = gainTax.find(el => el.id === 'getInfoDone');
                const chat4 = gainTax.find(el => el.id === 'getInfoConfirm');

                dispatch(setChatDataList([...chatDataList, chatList, chat3, chat4]));
              }} style={{
                backgroundColor: ExpenseAmount !== null ? '#2f87ff' : '#E8EAED',
                borderColor: ExpenseAmount !== null ? '#2f87ff' : '#E8EAED',
              }}
              active={ExpenseAmount !== null}
              disabled={!(ExpenseAmount !== null)}>
              <ButtonText active={ExpenseAmount !== null} style={{ color: ExpenseAmount !== '' ? '#fff' : '#717274' }}>다음으로</ButtonText>
            </Button>
          </ButtonShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default ExpenseSheet;
