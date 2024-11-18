// 보유 주택 목록에서 공시가격 수정 선택시 뜨는 팝업

import {
  View,
  useWindowDimensions,
  Pressable,
  ScrollView,
  Keyboard,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'
import Calendar from '../ReservationCalendar';

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
  margin-bottom: 10px;
`;


const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const TimeTitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 25px;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;


const ReservationtimeSection = styled.View`
  width: 100%;
  padding: 20px;
  justify-content: flex-end;
`;

const TimeContainer = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 2%;

`;

const TimeBox = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex: 0 0 26%;
  height: 40px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => (props?.active ? '#2F87FF' : '#E8EAED')};
  margin-bottom: 15px;
  margin-right: 2%;
`;


const TimeText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
`;




const SubTitle2 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #FF7401;
  line-height: 15px;
  margin-top: 10px;
  line-height: 20px;
  text-align: center;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  position: absolute;
  bottom: 30;
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


const UpdateConsultingDateAndTimeAlert = props => {


  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const { handleHouseChange1, consultingReservationId, navigation, prevSheet } = props.payload;
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const _scrollViewRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date(),
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const currentUser = useSelector(state => state.currentUser.value);
  const [selectedList, setSelectedList] = useState([]);

  const morningTimes = [];
  const afternoonTimes = [];

  for (let i = 9; i <= 11; i++) {
    morningTimes.push(`${i}:00`);
    morningTimes.push(`${i}:30`);
  }
  for (let i = 12; i < 18; i++) {
    afternoonTimes.push(`${i}:00`);
    afternoonTimes.push(`${i}:30`);
  }


  /*  useEffect(() => {
      _scrollViewRef.current?.scrollTo({
        x: (width - 40) * currentPageIndex,
        y: 0,
        animated: true,
      });
    }, [currentPageIndex]);*/

  useEffect(() => {
    getDateTimelist('1', '');
  }, []);

  useEffect(() => {
    if (selectedDate && currentPageIndex === 1) {
      console.log('selectedDate', selectedDate);
      getDateTimelist('2', selectedDate);
    }
    //console.log('timeList', timeList);
  }, [selectedDate, currentPageIndex]);

  const getDateTimelist = async (searchType, selectedDate) => {
    var consultantId = 1;
    const url = searchType === '1' ? `${Config.APP_API_URL}consulting/availableSchedule?consultantId=${consultantId}&searchType=${searchType}` : `${Config.APP_API_URL}consulting/availableSchedule?consultantId=${consultantId}&searchType=${searchType}&searchDate=${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    //const url = `https://devapp.how-taxing.com/consulting/availableSchedule?consultantId=${consultantId}&searchType="${searchType}"`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    /*
    const params = {
      consultantId: consultantId,
      searchType: searchType,
    }*/
    console.log('url', url);
    // console.log('params', params);
    console.log('headers', headers);
    await axios
      .get(url,
        { headers: headers }
      )
      .then(response => {
        console.log('response.data', response.data);
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '상담 가능 일정을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          if (searchType === "1") {
            //console.log('response.data', response.data.data);
            //console.log('response.data.dateList', response.data.data.dateList);
            const result = response === undefined ? [] : response.data.data.dateList;
            const list = result
              .filter(item => item.isReservationAvailable)
              .map(item => item.consultingDate);

            console.log('list:', list);
            setDataList([...list]);
          } else if (searchType === "2") {
            const result = response === undefined ? [] : response.data.data.timeList;
            const list = result
              .filter(item => item.reservationStatus === "1")
              .map(item => item.consultingTime);

            console.log('list:', list);
            setTimeList([...list]);
          }
        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '상담 가능 일정을 불러오는데 문제가 발생했어요.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
      });
  };

  const reservationModify = async () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const accessToken = currentUser.accessToken;
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // 요청 바디
    const data = {
      consultingReservationId: consultingReservationId ? consultingReservationId : '',
      reservationDate: selectedDate ? `${year}-${month}-${day}` : '',
      reservationTime: selectedList ? selectedList[0] : '',
    };
    console.log('data', data);
    console.log('headers', headers);
    try {
      const response = await axios.post(`${Config.APP_API_URL}consulting/reservationModify`, data, { headers: headers });
      console.log('response.data', response.data);
      if (response.data.errYn === 'Y') {
        if (response.data.errCode === 'CONSULTING-013') {
          setTimeout(async () => {
            await getDateTimelist('1', '');
            if (dataList.length === 0) {
              await SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '앗, 현재 모든 예약이 완료되었어요.\n나중에 다시 시도해주세요.',
                  buttontext: '확인하기',
                },
              });
              actionSheetRef.current?.hide();
            } else {
              await getDateTimelist('2', selectedDate);
              setSelectedList([]);
            }
          }, 300);
        } else {
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '상담 예약 변경 중 오류가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        }
      } else {
        const result = response.data.data;
        await SheetManager.show('InfoConsulting', {
          payload: {
            message: '상담 예약이 변경되었어요.',
            description: '요청하신 ' + result.reservationDate + ' 일자에\n주택세금 상담 예약이 변경되었어요.\n세무사님이 변경된 시간이 되면\n연락을 드릴 예정이에요.',
            buttontext: '처음으로 돌아가기',
          },
        });
        await handleHouseChange1(selectedDate, selectedList[0]);
      }
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ? error?.errMsg : '상담 예약 변경 중 오류가 발생했어요.',
        errorMessage: error?.errCode ? error?.errCode : 'error',
        buttontext: '확인하기',
      });
      console.error(error ? error : 'error');
    }
  };




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
      await reservationModify();
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
          height: currentPageIndex === 0 ? height - 190 : height - 150,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        scrollEventThrottle={16}>
        {currentPageIndex === 0 && <SheetContainer width={width}>
          <ModalInputSection>
            <ModalTitle>변경하실 날짜를 선택해주세요.</ModalTitle>
            <SubTitle2>예약과 동시에 일정이 확정되니{'\n'}신중하게 선택해주세요.</SubTitle2>
            <View
              style={{
                width: '100%',
                height: 460,
                marginTop: 20,
              }}>
              <Calendar
                setSelectedDate={setSelectedDate}
                selectedDate={new Date(selectedDate ? new Date(selectedDate).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0))}
                currentDate={new Date(selectedDate ? new Date(selectedDate).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0))}
                dateList={dataList}
              />
            </View>
          </ModalInputSection>
          <ButtonSection>
            <ButtonShadow style={{ width: '100%' }}>
              <Button
                active={selectedDate}
                disabled={!(selectedDate)}
                onPress={async () => {
                  // 주택 정보 업데이트
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    setCurrentPageIndex(1);
                  }
                }}
                style={{
                  width: '95%',
                  height: 50, // height 값을 숫자로 변경하고 단위 제거경하고 단위 제거
                  alignItems: 'center', // align-items를 camelCase로 변경
                  justifyContent: 'center', // justify-content를 camelCase로 변경
                  borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                  alignSelf: 'center',
                  backgroundColor: selectedDate ? '#2f87ff' : '#E8EAED',
                  borderColor: selectedDate ? '#2f87ff' : '#E8EAED',
                }}>
                <ButtonText active={selectedDate} style={{ color: selectedDate ? '#fff' : '#717274' }}>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>}

        {currentPageIndex === 1 && <SheetContainer width={width} >
          <ModalInputSection>
            <ModalTitle>변경하실 시간을 선택해주세요.</ModalTitle>
            <SubTitle2>예약과 동시에 일정이 확정되니{'\n'}신중하게 선택해주세요.</SubTitle2>
            <ReservationtimeSection style={{ alignItems: 'center' }}>
              <TimeTitle>오전</TimeTitle>
              <TimeContainer style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                <FlatList
                  contentContainerStyle={styles.container}
                  data={morningTimes}
                  renderItem={({ item }) => (
                    <TimeBox
                      disabled={timeList.indexOf(item) < 0}
                      active={selectedList.indexOf(item) > -1}
                      onPress={() => {
                        if (selectedList.indexOf(item) > -1) {
                          setSelectedList(
                            selectedList.filter(selectedItem => selectedItem !== item),
                          );
                        } else {
                          setSelectedList([item]);
                        }
                      }}>
                      <TimeText style={{ color: timeList.indexOf(item) < 0 ? '#E8EAED' : '#1b1c1f' }}>{item}</TimeText>
                    </TimeBox>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3} // 한 줄에 4개의 
                ></FlatList>
              </TimeContainer>
              <TimeTitle>오후</TimeTitle>
              <TimeContainer style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                <FlatList
                  contentContainerStyle={styles.container}
                  data={afternoonTimes}
                  renderItem={({ item }) => (
                    <TimeBox
                      disabled={timeList.indexOf(item) < 0}
                      active={selectedList.indexOf(item) > -1}
                      onPress={() => {
                        if (selectedList.indexOf(item) > -1) {
                          setSelectedList(
                            selectedList.filter(selectedItem => selectedItem !== item),
                          );
                        } else {
                          setSelectedList([item]);
                        }
                      }}>
                      <TimeText style={{ color: timeList.indexOf(item) < 0 ? '#E8EAED' : '#1b1c1f' }}>{item}</TimeText>
                    </TimeBox>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3} // 한 줄에 4개의 
                ></FlatList>
              </TimeContainer>
            </ReservationtimeSection>
          </ModalInputSection>
          <ButtonSection>
            <ButtonShadow
              style={{
                shadowColor: '#fff',
              }}>
              <Button
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    setCurrentPageIndex(0);
                  }
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
                active={selectedList.length > 0}
                disabled={!(selectedList.length > 0)}
                onPress={() => {
                  // 주택 정보 업데이트
                  nextHandler();

                }}
                style={{
                  alignSelf: 'center',
                  backgroundColor: selectedList.length > 0 ? '#2f87ff' : '#E8EAED',
                  borderColor: selectedList.length > 0 ? '#2f87ff' : '#E8EAED',
                }}>
                <ButtonText active={selectedList.length > 0} style={{ color: selectedList.length > 0 ? '#fff' : '#717274' }}>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>}


      </ScrollView>
    </ActionSheet >
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default UpdateConsultingDateAndTimeAlert;
