// 취득세 정보 입력 시트

import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import Calendar from '../Calendar';
import numberToKorean from '../../utils/numToKorean';
import { acquisitionTax } from '../../data/chatData';
import { useDispatch, useSelector } from 'react-redux';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { setChatDataList } from '../../redux/chatDataListSlice';
import dayjs from 'dayjs';
import CancelCircle from '../../assets/icons/cancel_circle.svg';
import { LogBox } from 'react-native';




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
  height: auto;
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



const AcquisitionSheet = props => {



  LogBox.ignoreLogs(['to contain units']);
  const actionSheetRef = useRef(null);
  const _scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [currentPageIndex, setCurrentPageIndex] = useState(props.payload?.currentPageIndex ? props.payload?.currentPageIndex : 0);
  // 계약일자
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 취득일자
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  // 취득금액
  const [isActionSheetActive, setIsActionSheetActive] = useState(false);
  const [currentDate, setCurrentDate] = useState();
  const [acAmount, setAcAmount] = useState(
    houseInfo?.acAmount ? houseInfo?.acAmount : null,
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const chatDataList = useSelector(state => state.chatDataList.value);

  // 취득금액 선택 리스트
  const AC_AMOUNT_LIST = [500000000, 100000000, 10000000, 1000000];

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

  // 키보드 이벤트
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

  // 초기 진입 시
  useEffect(() => {
    if (chatDataList.find(el => el.id === 'contractDateSystem')) {
      return;
    }
    const chat1 = {
      id: 'contractDateSystem',
      type: 'system',
      message: '계약일자를 선택해주세요.',
      select: [
        {
          id: 'contractDate',
          name: '계약일자 선택하기',
          openSheet: 'acquisition',
          payload: {
            currentPageIndex: 0,
          }
        },
      ],
      progress: 2,
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
      statusBarTranslucent
      closeOnPressBack={false}
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
            height: currentPageIndex === 2 ? 420 : 620
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          scrollEventThrottle={16}>
          <SheetContainer width={width}>
            <ModalInputSection>
              <ModalTitle >계약일자를 선택해주세요.</ModalTitle>
              <InfoMessage >
                취득하실 주택의 매매 계약일자에요.{'\n'}아직 계약 전이라면, 예정일로 선택해주세요.
              </InfoMessage>
              <View
                style={{
                  width: '100%',
                  height: 350,
                  marginTop: 20,
                }}>
                <Calendar
                  setSelectedDate={setSelectedDate}
                  selectedDate={new Date(new Date().setHours(0, 0, 0, 0))}
                  currentDate={new Date(new Date().setHours(0, 0, 0, 0))}
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
                    // 계약일자 업데이트
                    dispatch(
                      setHouseInfo({
                        ...houseInfo,
                        contractDate: selectedDate,
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
                      id: 'acquisitionDateSystem',
                      type: 'system',
                      message: '취득일자를 선택해주세요.',
                      select: [
                        {
                          id: 'acquisitionDate',
                          name: '취득일자 선택하기',
                          openSheet: 'acquisition',
                          currentPageIndex: 1,
                          selectedDate: selectedDate,

                        },
                      ],

                      progress: 2,
                    };
                    //////console.log('selectedDate2', selectedDate2);
                    dispatch(setChatDataList([...chatDataList, chat2, chat3]));
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
              <ModalTitle >취득일자를 선택해주세요.</ModalTitle>
              <InfoMessage >
                취득하실 주택의 취득예정일자에요.{'\n'}아직 계약 전이라면, 예정일로 선택해주세요.
              </InfoMessage>
              <View
                style={{
                  width: '100%',
                  height: 350,
                  marginTop: 20,
                }}>
                {currentPageIndex === 1 && (<Calendar
                  minDate={new Date(new Date(houseInfo?.contractDate.setHours(0, 0, 0, 0)))}
                  setSelectedDate={setSelectedDate2}
                  selectedDate={new Date(new Date(houseInfo?.contractDate ? houseInfo?.contractDate : currentDate).setHours(0, 0, 0, 0))}
                  currentDate={new Date(new Date(houseInfo?.contractDate ? houseInfo?.contractDate : currentDate).setHours(0, 0, 0, 0))}
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
                    const newChatDataList = chatDataList.filter(item => item.id !== 'acquisitionDateSystem').filter(item => item.id !== 'contractDateMy');
                    dispatch(setChatDataList(newChatDataList));
                  }}
                  style={{
                    backgroundColor: '#fff',
                    borderColor: '#E8EAED',
                  }}>
                  <ButtonText

                    style={{
                      color: '#717274',
                    }}>
                    이전으로
                  </ButtonText>
                </Button>
              </ButtonShadow>
              <ButtonShadow>
                <Button
                  onPress={async () => {
                    setCurrentPageIndex(2);

                    // 취득일자 업데이트
                    dispatch(
                      setHouseInfo({
                        ...houseInfo,
                        buyDate: selectedDate2,
                      }),
                    );
                    const chat4 = {
                      id: 'acquisitionDateMy',
                      type: 'my',
                      message: dayjs(selectedDate2).format(
                        'YYYY년 MM월 DD일 (ddd)',
                      ),
                    };

                    const chat1 = {
                      id: 'aquiAmountSystem',
                      type: 'system',
                      message: '취득금액을 입력해주세요.',
                      select: [
                        {
                          id: 'aquiAmountDate',
                          name: '취득금액 선택하기',
                          openSheet: 'acquisition',
                          currentPageIndex: 2,

                        },
                      ],

                      progress: 2,
                    };

                    dispatch(setChatDataList([...chatDataList, chat4, chat1]));

                  }}
                  style={{
                    backgroundColor: selectedDate2 ? '#2f87ff' : '#E8EAED',
                    borderColor: selectedDate2 ? '#2f87ff' : '#E8EAED',
                  }}
                  active={selectedDate2}
                  disabled={!(selectedDate2)}>
                  <ButtonText active={selectedDate2} style={{ color: selectedDate2 ? '#fff' : '#717274' }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
          <SheetContainer width={width}>
            <ModalInputSection>
              <ModalTitle >취득금액을 입력해주세요.</ModalTitle>
              <ModalSubtitle >{numberToKorean(acAmount)}{(acAmount !== null && acAmount !== 0) ? '원' : ' '}</ModalSubtitle>
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
                  <ModalLabel >취득금액</ModalLabel>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ModalInputContainer>
                    <StyledInput
                      placeholder="취득금액을 입력해주세요."
                      keyboardType="number-pad"
                      value={acAmount ? acAmount.toLocaleString() : null}
                      onChangeText={text => {
                        const numericValue = Number(text.replace(/[^0-9]/g, ''));
                        if (numericValue <= 1000000000000000) {
                          setAcAmount(numericValue);
                        } else {
                          setAcAmount(1000000000000000)
                        }
                      }}
                    />
                    {(acAmount !== null && acAmount !== 0) && (
                      <TouchableOpacity onPress={() => setAcAmount(null)}>
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
                    const newChatDataList = chatDataList.filter(item => item.id !== 'aquiAmountSystem').filter(item => item.id !== 'acquisitionDateMy');
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
                    }}>
                    이전으로
                  </ButtonText>
                </Button>
              </ButtonShadow>
              <ButtonShadow>
                <Button
                  onPress={() => {
                    // 취득세 계산 할 주택 정보 업데이트
                    dispatch(
                      setHouseInfo({
                        ...houseInfo,
                        acAmount,
                      }),
                    );

                    actionSheetRef.current?.hide();

                    const chat2 = {
                      id: 'auiAmont',
                      type: 'my',
                      message: `${acAmount.toLocaleString()}원`,
                      questionId: 'apartment',
                      data: {
                        acAmount,
                        contractDate: selectedDate,
                        buyDate: selectedDate2,
                      },
                    };
                    const chat3 = acquisitionTax.find(el => el.id === 'joint');
                    dispatch(setChatDataList([...chatDataList, chat2, chat3]));

                    //  setTimeout(() => { ////console.log('aquiAmountDate', houseInfo) }, 500);
                  }} style={{
                    backgroundColor: acAmount ? '#2f87ff' : '#E8EAED',
                    borderColor: acAmount ? '#2f87ff' : '#E8EAED',
                  }}
                  active={acAmount}
                  disabled={!(acAmount)}>
                  <ButtonText active={acAmount} style={{ color: acAmount ? '#fff' : '#717274' }}>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </ActionSheet >
  );
};

export default React.memo(AcquisitionSheet);
