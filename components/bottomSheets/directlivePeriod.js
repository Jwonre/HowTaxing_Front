// 챗 스크린에서 주택 검색 시트

import {
  View,
  useWindowDimensions,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet, {
  SheetManager,
} from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import WheelPicker from 'react-native-wheely';
import { useDispatch, useSelector } from 'react-redux';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { gainTax } from '../../data/chatData';
import dayjs from 'dayjs';
import axios from 'axios';
import Config from 'react-native-config'

const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: auto;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
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

const ApartmentInfoGroup = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ApartmentInfoTitle = styled.Text`
  width: 60%;
  font-size: 16px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 30px;
  text-align: center;
  margin-bottom: auto;
`;

const ButtonSection = styled.View`
  width: ${props => props.width - 40}px;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  margin-top: 10px;
`;

const SelectGroup = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px 20px;
`;

const SelectLabel = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
`;

const PickerContainer = styled.View`
  width: 100%;
  height: 187px;
  background-color: #f5f7fa;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
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


const directlivePeriod = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const chatDataList = useSelector(state => state.chatDataList.value);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const currentUser = useSelector(state => state.currentUser.value);
  const YearList = Array.from({ length: 101 }, (_, i) => `${i}년`);
  const MonthList = Array.from({ length: 12 }, (_, i) => `${i}개월`);
  const getadditionalQuestion = async (questionId, answerValue, houseId, sellDate, sellPrice) => {
    /*
    [필수] calcType | String | 계산유형(01:취득세, 02:양도소득세)
    [선택] questionId | String | 질의ID
    [선택] answerValue | String | 응답값
    [선택] sellHouseId | Long | 양도주택ID (  양도소득세 계산 시 세팅)
    [선택] sellDate | LocalDate | 양도일자 (양도소득세 계산 시 세팅)
    [선택] sellPrice | Long | 양도가액 (양도소득세 계산 시 세팅)
*/
    try {
      const url = `${Config.APP_API_URL}question/additionalQuestion`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`
      };

      const param = {
        calcType: '02',
        questionId: questionId,
        answerValue: answerValue ? answerValue : '',
        sellHouseId: houseId ? houseId : '',
        sellDate: sellDate ? dayjs(sellDate).format('YYYY-MM-DD') : null,
        sellPrice: sellPrice ? sellPrice : 0,
        ownHouseCnt: houseInfo?.ownHouseCnt ? houseInfo?.ownHouseCnt : 0
      };
      ////console.log('[additionalQuestion] additionalQuestion param:', param);
      //////console.log('[HouseDetail] Fetching house details for item:', item);
      const response = await axios.post(url, param, { headers });
      const detaildata = response.data.data;
      ////console.log('response.data', response.data);
      if (response.data.errYn == 'Y') {
        setTimeout(() => {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '추가질의를 가져오지 못했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        }, 500)
        return {
          returndata: false
        };
      } else {
        //  ////console.log('[additionalQuestion] additionalQuestion retrieved:', detaildata);
        // ////console.log('[additionalQuestion] detaildata?.houseType:', detaildata?.houseType);
        //  ////console.log('[additionalQuestion] additionalQuestion houseInfo:', houseInfo);
        return {
          detaildata: detaildata,
          returndata: true
        }
      }
    } catch (error) {
      setTimeout(() => {
        ////console.log(error ? error : 'error');
        SheetManager.show('info', {
          payload: {
            message: '추가질의를 가져오는데\n알수없는 오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          },
        });
      }, 500)
      return {
        returndata: false
      };
    }
  };
  // 다음으로 버튼 핸들러
  const nextHandler = async () => {
    actionSheetRef.current?.hide();
    const chat1 = {
      id: 'livePeriodMy',
      type: 'my',
      message:
        (selectedDate.year ? (selectedDate.year === '0년' ? '' : selectedDate.year) : '')
        +
        (selectedDate.month ? (selectedDate.month === '0개월' ? (selectedDate.year === '0년' ? '거주기간 없음' : '') : (selectedDate.year ? ' ' + selectedDate.month : selectedDate.month)) : '0개월')
      ,
      questionId: 'livePeriod',
    };
    let tempadditionalAnswerList = houseInfo?.additionalAnswerList || [];
    let Index1 = tempadditionalAnswerList.findIndex(item => 'Q_0005' in item);
    let Index2 = tempadditionalAnswerList.findIndex(item => 'PERIOD_DIAL' in item);

    let newIndex1 = "01";
    let newIndex2 = (selectedDate.year ? (selectedDate.year === '0년' ? '' : selectedDate.year) : '') + (selectedDate.month ? (selectedDate.month === '0개월' ? (selectedDate.year === '0년' ? '0개월' : '') : (selectedDate.year !== '0년' ? ' ' + selectedDate.month : selectedDate.month)) : '');

    if (Index1 !== -1 && Index2 !== -1) {
      if (tempadditionalAnswerList[Index1]['Q_0005'] !== newIndex1 || tempadditionalAnswerList[Index2]['PERIOD_DIAL'] !== newIndex2) {
        tempadditionalAnswerList = [
          ...tempadditionalAnswerList.slice(0, Index1),
          { ...tempadditionalAnswerList[Index1], 'Q_0005': newIndex1 },
          ...tempadditionalAnswerList.slice(Index1 + 1)
        ];
        tempadditionalAnswerList = [
          ...tempadditionalAnswerList.slice(0, Index2),
          { ...tempadditionalAnswerList[Index2], 'PERIOD_DIAL': newIndex2 },
          ...tempadditionalAnswerList.slice(Index2 + 1)
        ];
      }
    } else if (Index1 !== -1 && Index2 === -1) {
      tempadditionalAnswerList = [
        ...tempadditionalAnswerList.slice(0, Index1),
        { ...tempadditionalAnswerList[Index1], 'Q_0005': newIndex1 },
        ...tempadditionalAnswerList.slice(Index1 + 1),
        { "PERIOD_DIAL": newIndex2 }
      ];
    } else {
      tempadditionalAnswerList = [
        ...tempadditionalAnswerList,
        { "Q_0005": newIndex1 },
        { "PERIOD_DIAL": newIndex2 }
      ];
    }
    setTimeout(() => {
      dispatch(setHouseInfo({
        ...houseInfo,
        livePeriodYear: (selectedDate.year ? selectedDate.year.replace('년', '') : ''),
        livePeriodMonth: (selectedDate.month ? selectedDate.month.replace('개월', '') : ''),
        additionalAnswerList: tempadditionalAnswerList
      }))
    }, 300);

    const livePeriod = (selectedDate.year ? (selectedDate.year === '0년' ? '' : selectedDate.year) : '') + (selectedDate.month ? (selectedDate.month === '0개월' ? (selectedDate.year === '0년' ? '0개월' : '') : (selectedDate.year !== '0년' ? ' ' + selectedDate.month : selectedDate.month)) : '');
    ////console.log('livePeriod', livePeriod);
    ////console.log('livePeriodYear', (selectedDate.year ? selectedDate.year.replace('년', '') : ''));
    ////console.log('livePeriodMonth', (selectedDate.month ? selectedDate.year.replace('개월', '') : ''));
    const chat9 = gainTax.find(el => el.id === 'ExpenseInquiry');
    const chat10 = gainTax.find(el => el.id === 'ExpenseAnswer');
    const additionalQuestion = await getadditionalQuestion('PERIOD_DIAL', livePeriod, houseInfo?.houseId, houseInfo?.sellDate, houseInfo?.sellAmount);
    //console.log('PERIOD_DIAL additionalQuestion', additionalQuestion);
    let chat7;
    if (additionalQuestion.returndata) {
      if (additionalQuestion.detaildata?.hasNextQuestion === true) {
        if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0006') {
          let chatIndex = gainTax.findIndex(el => el.id === 'additionalQuestion');
          if (chatIndex !== -1) {
            chat7 = {
              ...gainTax[chatIndex],
              message: additionalQuestion.detaildata?.nextQuestionContent,
              questionId: additionalQuestion.detaildata?.nextQuestionId,
              select: gainTax[chatIndex].select.map(item => ({
                ...item,
                name: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0]?.answerContent : additionalQuestion?.detaildata?.answerSelectList[1]?.answerContent,
                answer: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0]?.answerValue : additionalQuestion?.detaildata?.answerSelectList[1]?.answerValue,
                select: ['ExpenseInquiry', 'ExpenseAnswer'],
              }))
            };
          }
        } else {
          let chatIndex = gainTax.findIndex(el => el.id === 'landlord2');
          chat7 = {
            ...gainTax[chatIndex],
          };
        }

        dispatch(
          setChatDataList([
            ...chatDataList,
            chat1,
            chat7
          ])
        );
      } else {
        if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {


          let tempadditionalAnswerList = houseInfo?.additionalAnswerList;
          if (tempadditionalAnswerList) {
            let foundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0006' in item);
            if (foundIndex !== -1) {
              // 불변성을 유지하면서 Q_0005 값을 삭제
              tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== foundIndex);
              //console.log('tempadditionalAnswerList', tempadditionalAnswerList);
              setTimeout(() => {
                dispatch(setHouseInfo({
                  ...houseInfo, additionalAnswerList: tempadditionalAnswerList
                }));
              }, 300);
            }
          }
        }
        dispatch(
          setChatDataList([
            ...chatDataList,
            chat1,
            chat9,
            chat10
          ])
        );
      }

    } else {


      let tempadditionalAnswerList = houseInfo?.additionalAnswerList;
      if (tempadditionalAnswerList) {
        let foundIndex = tempadditionalAnswerList?.findIndex(item => 'Q_0006' in item);
        if (foundIndex !== -1) {
          // 불변성을 유지하면서 Q_0005 값을 삭제
          tempadditionalAnswerList = tempadditionalAnswerList.filter((_, index) => index !== foundIndex);
          setTimeout(() => {
            dispatch(setHouseInfo({
              ...houseInfo, additionalAnswerList: tempadditionalAnswerList
            }));
          }, 300);
        }
      }

      const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
      dispatch(setChatDataList(newChatDataList));
    }

    // ////console.log('selectedYear :', Math.floor(selectedYear.replace('년', '')));
    // ////console.log('selectedMonth :', selectedMonth.replace('개월', ''));


  };

  const WheelPickerConfig = {
    containerStyle: {
      width: 120,
      height: 180,
      borderRadius: 10,
    },
    itemTextStyle: {
      fontFamily: 'Pretendard-Regular',
      fontSize: 18,
      color: '#1B1C1F',
    },
    selectedIndicatorStyle: {
      backgroundColor: 'transparent',
    },
    itemHeight: 40,
  };

  const [selectedDate, setSelectedDate] = useState({ year: YearList[0], month: MonthList[0] });


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
              const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
              dispatch(setChatDataList(newChatDataList));

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
        height: 420,
        width: width - 40,
      }}>

      <SheetContainer>
        <ModalTitle
          style={{
            marginBottom: 10,
          }} >
          실거주 기간을 입력해 주세요.
        </ModalTitle>

        <SelectGroup>
          <View style={{ width: '48%' }}>
            <PickerContainer>
              <WheelPicker
                allowFontScaling= {false}
                selectedIndex={YearList.indexOf(selectedDate.year)}
                {...WheelPickerConfig}
                options={YearList}
                onChange={index => {
                  setSelectedDate({ ...selectedDate, year: YearList[index] });
                }}
              />
            </PickerContainer>
          </View>
          <View style={{ width: '48%' }}>
            <PickerContainer>
              <WheelPicker
                
                selectedIndex={MonthList.indexOf(selectedDate.month)}
                {...WheelPickerConfig}
                options={MonthList}
                onChange={index => {
                  setSelectedDate({ ...selectedDate, month: MonthList[index] });
                }}
              />
            </PickerContainer>
          </View>
        </SelectGroup>
        <ButtonSection
          style={{
            marginTop: 0,
          }}>
          <DropShadow
            style={{
              shadowColor: '#fff',
              width: '48%',
            }}>
            <Button
              onPress={() => {
                const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                dispatch(setChatDataList(newChatDataList));
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
          </DropShadow>

          <DropShadow style={styles.dropshadow}>
            <Button onPress={nextHandler}>
              <ButtonText >다음으로</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  dropdownStyle: {
    width: '37%',
    height: 300,
    borderRadius: 10,
    marginTop: -20,
  },
  buttonStyle: {
    width: '100%',
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EAED',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#A3A5A8',
    letterSpacing: -0.3,
    lineHeight: 16,
    marginRight: 15,
  },
  rowStyle: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0,
    borderBottomColor: '#E8EAED',
  },
  rowTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1C1F',
    letterSpacing: -0.3,
    lineHeight: 16,
  },
  dropshadow: {
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});

export default directlivePeriod;
