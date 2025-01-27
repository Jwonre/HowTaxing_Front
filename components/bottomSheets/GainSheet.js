// 양도세 정보 입력 시트

import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Keyboard,
  Dimensions,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import Calendar from '../Calendar';
import numberToKorean from '../../utils/numToKorean';
import { useDispatch, useSelector } from 'react-redux';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { setChatDataList, addChatDataList } from '../../redux/chatDataListSlice';
import dayjs from 'dayjs';
import { gainTax } from '../../data/chatData';
import CancelCircle from '../../assets/icons/cancel_circle.svg';
import { LogBox } from 'react-native';

dayjs.locale('ko');

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;

`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
`;

const InfoMessage = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Medium;
  color: #A3A5A8;
  line-height: 23px;
  margin-top: 18px;
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
  background-color: #fff;
`;

const ModalButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 48%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
`;

const ModalButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 20px;
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

const GainSheet = props => {
  LogBox.ignoreLogs(['to contain units']);
  const actionSheetRef = useRef(null);
  const _scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get('window');
  const [currentPageIndex, setCurrentPageIndex] = useState(props.payload.currentPageIndex ? props.payload.currentPageIndex : 0);
  // 계약일자
  const [isActionSheetActive, setIsActionSheetActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(props.payload.selectedDate ? new Date(props.payload.selectedDate) : new Date(),
  );

  // 양도일자
  const [selectedDate2, setSelectedDate2] = useState(new Date(new Date(selectedDate).setDate(new Date(selectedDate).getDate() + 1)),
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  // 양도금액
  const [sellAmount, setAcAmount] = useState(
    houseInfo?.sellAmount ? houseInfo?.sellAmount : 0,
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const chatDataList = useSelector(state => state.chatDataList.value);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  //console.log('houseInfo', houseInfo);
  //console.log('currentDate', currentDate);
  // 양도금액 선택 리스트
  const AC_AMOUNT_LIST = [500000000, 100000000, 10000000, 1000000];

  // 추가 질의 함수


  useEffect(() => {
    console.log('isActionSheetActive', isActionSheetActive);
    if (!isActionSheetActive) {
      setTimeout(() => {
        _scrollViewRef.current?.scrollTo({
          x: (width - 40) * currentPageIndex,
          y: 0,
          animated: true,
        });
      }, 600)
      setIsActionSheetActive(true);
    } else {
      _scrollViewRef.current?.scrollTo({
        x: (width - 40) * currentPageIndex,
        y: 0,
        animated: true,
      });
    }
  }, [currentPageIndex]);


  useEffect(() => {
    // 키보드가 보여질 때 높이를 설정
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );

    // 키보드가 사라질 때 높이를 초기화
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => { setKeyboardVisible(false); }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  // 초기 세팅
  useEffect(() => {

    if (chatDataList.find(el => el.id === 'contractDateSystem')) {
      return;
    }
    const chat1 = {
      id: 'contractDateSystem',
      type: 'system',
      message: '양도계약일자를 선택해주세요.',
      select: [
        {
          id: 'contractDate',
          name: '양도계약일자 선택하기',
          openSheet: 'gain',
          currentPageIndex: 0,
        },
      ],
      progress: 4,
    };

    dispatch(setChatDataList([...chatDataList, chat1]));
  }, []);

  useEffect(() => {
    dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: [], necessaryExpense: 0 }));
  }, []);

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      closeOnPressBack={false}
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
      statusBarTranslucent
      closeOnTouchBackdrop={false}
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: currentPageIndex === 2 ? 420 : 620,
        width: width - 40,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          ref={_scrollViewRef}
          pagingEnabled
          style={{
            width: width - 40,
            height: currentPageIndex === 2 ? 420 : 620,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          scrollEventThrottle={16}>
          <SheetContainer width={width}>
            <ModalInputSection>
              <ModalTitle >양도계약일자를 선택해주세요.</ModalTitle>
              <InfoMessage >
                양도하실 주택의 매매 계약일자에요.{'\n'}아직 계약 전이라면, 예정일로 선택해주세요.
              </InfoMessage>
              <View
                style={{
                  width: '100%',
                  height: 350,
                  marginTop: 20,
                }}>
                <Calendar
                  setSelectedDate={setSelectedDate}
                  minDate={new Date(new Date(houseInfo?.buyDate ? houseInfo?.buyDate : '').setHours(0, 0, 0, 0))}
                  currentDate={new Date(new Date((new Date(houseInfo?.buyDate) <= currentDate) ? currentDate : houseInfo?.buyDate).setHours(0, 0, 0, 0))}
                  selectedDate={new Date(new Date((new Date(houseInfo?.buyDate) <= currentDate) ? currentDate : houseInfo?.buyDate).setHours(0, 0, 0, 0))}
                />
              </View>
            </ModalInputSection>
            <ButtonSection
              style={{
                justifyContent: 'center',
              }}>
              <DropShadow
                style={{
                  shadowColor: 'rgba(0,0,0,0.25)',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  alignSelf: 'center',
                }}>
                <ModalButton
                  active={selectedDate}
                  disabled={!(selectedDate)}
                  onPress={async () => {
                    setCurrentPageIndex(1);
                    setCurrentDate(selectedDate);
                    dispatch(
                      setHouseInfo({
                        ...houseInfo,
                        sellContractDate: selectedDate,
                      }),
                    );
                    const chat2 = {
                      id: 'contractDateMy',
                      type: 'my',
                      message: dayjs(selectedDate).format(
                        'YYYY년 MM월 DD일 (ddd)',
                      ),
                    };

                    const chat3 = {
                      id: 'sellDateSystem',
                      type: 'system',
                      message: '양도일자를 선택해주세요.',
                      select: [
                        {
                          id: 'sellDate',
                          name: '양도일자 선택하기',
                          openSheet: 'gain',
                          currentPageIndex: 1,
                          selectedDate: selectedDate,
                        },
                      ],
                      progress: 4,
                    };

                    dispatch(setChatDataList([...chatDataList, chat2, chat3]));
                    ('selectedDate', selectedDate);
                  }}
                  style={{
                    width: width - 80,
                    alignSelf: 'center',
                    marginBottom: 50,
                    backgroundColor: selectedDate ? '#2f87ff' : '#E8EAED',
                    borderColor: selectedDate ? '#2f87ff' : '#E8EAED',
                  }}>
                  <ModalButtonText active={selectedDate} style={{ color: selectedDate ? '#fff' : '#717274' }}>다음으로</ModalButtonText>
                </ModalButton>
              </DropShadow>
            </ButtonSection>
          </SheetContainer>

          <SheetContainer width={width}>
            <ModalInputSection>
              <ModalTitle >양도일자를 선택해주세요.</ModalTitle>
              <InfoMessage >
                양도하실 주택의 양도예정일자에요.{'\n'}아직 계약 전이라면, 예정일로 선택해주세요.
              </InfoMessage>
              <View
                style={{
                  width: '100%',
                  height: 350,
                  marginTop: 20,
                }}>

                {currentPageIndex === 1 && (<Calendar
                  minDate={new Date(new Date(houseInfo?.sellContractDate).setHours(0, 0, 0, 0))}
                  currentDate={new Date(new Date(houseInfo?.sellContractDate ? houseInfo?.sellContractDate : currentDate).setHours(0, 0, 0, 0))}
                  setSelectedDate={setSelectedDate2}
                  selectedDate={new Date(new Date(houseInfo?.sellContractDate ? houseInfo?.sellContractDate : currentDate).setHours(0, 0, 0, 0))}
                />)}
              </View>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
                    setSelectedDate2();
                    const newChatDataList = chatDataList.filter(item => item.id !== 'sellDateSystem').filter(item => item.id !== 'contractDateMy');
                    dispatch(setChatDataList(newChatDataList));
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
                  active={selectedDate2}
                  disabled={!(selectedDate2)}
                  onPress={async () => {
                    setCurrentPageIndex(2);

                    dispatch(
                      setHouseInfo({
                        ...houseInfo,
                        sellDate: selectedDate2,
                      }),
                    );
                    const chat4 = {
                      id: 'sellDateMy',
                      type: 'my',
                      message: dayjs(selectedDate2).format(
                        'YYYY년 MM월 DD일 (ddd)',
                      ),
                    };

                    const chat5 = {
                      id: 'sellAmountSystem',
                      type: 'system',
                      message: '양도금액을 입력해주세요.',
                      select: [
                        {
                          id: 'sellAmount',
                          name: '양도금액 입력하기',
                          openSheet: 'gain',
                          currentPageIndex: 2,
                        },
                      ],
                      progress: 4,
                    };
                    if (chatDataList.find(el => el.id === 'sellDateSystem')) {
                      dispatch(setChatDataList([...chatDataList, chat4, chat5]));
                    }
                  }}

                  style={{
                    backgroundColor: selectedDate2 ? '#2f87ff' : '#E8EAED',
                    borderColor: selectedDate2 ? '#2f87ff' : '#E8EAED',
                  }}>
                  <ButtonText active={selectedDate2} style={{ color: selectedDate2 ? '#fff' : '#717274' }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>

          <SheetContainer width={width}>
            <ModalInputSection>
              <ModalTitle >양도금액을 입력해주세요.</ModalTitle>
              <ModalSubtitle >{numberToKorean(sellAmount)}{(sellAmount !== null && sellAmount !== 0) ? '원' : ' '}</ModalSubtitle>
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
                  <ModalLabel >양도금액</ModalLabel>
                </View>
                <ModalInputContainer>
                  <StyledInput

                    placeholder="양도금액을 입력해주세요."
                    keyboardType="number-pad"
                    value={sellAmount ? sellAmount.toLocaleString() : null}
                    onChangeText={text => {
                      const numericValue = Number(text.replace(/[^0-9]/g, ''));
                      if (numericValue <= 1000000000000000) {
                        setAcAmount(numericValue);
                      } else {
                        setAcAmount(1000000000000000)
                      }
                    }}
                  />
                  {(sellAmount !== null && sellAmount !== 0) && (
                    <TouchableOpacity onPress={() => setAcAmount(null)}>
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
                        setAcAmount(prev => prev + item);
                      }}>
                      <ModalSelectButtonText >
                        {item === 10000000 ? '1천만' : item === 1000000 ? '1백만' : numberToKorean(item)}
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
                    const newChatDataList = chatDataList.filter(item => item.id !== 'sellAmountSystem').filter(item => item.id !== 'sellDateMy');
                    dispatch(setChatDataList(newChatDataList));
                    setCurrentPageIndex(1);
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
                    actionSheetRef.current?.hide();

                    //////console.log('houseInfo', houseInfo);

                    dispatch(
                      setHouseInfo({
                        ...houseInfo,
                        sellAmount: sellAmount,
                      })
                    );

                    const chat6 = {
                      id: 'sellAmount',
                      type: 'my',
                      message: `${sellAmount?.toLocaleString()}원`,
                      data: {
                        sellAmount,
                        sellContractDate: selectedDate,
                        sellDate: selectedDate2,
                      },
                    };

                    const chat7 = gainTax.find(el => el.id === 'jointGain');
                    dispatch(
                      setChatDataList([
                        ...chatDataList,
                        chat6,
                        chat7
                      ])
                    );



                    //console.log('additionalAnswerList', houseInfo?.additionalAnswerList);
                  }
                  } style={{
                    backgroundColor: sellAmount ? '#2f87ff' : '#E8EAED',
                    borderColor: sellAmount ? '#2f87ff' : '#E8EAED',
                  }}
                  active={sellAmount}
                  disabled={!(sellAmount)}>
                  <ButtonText active={sellAmount} style={{ color: sellAmount ? '#fff' : '#717274' }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </ActionSheet >
  );
};

export default GainSheet;
