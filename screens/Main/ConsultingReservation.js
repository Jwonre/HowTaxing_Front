// 양도소득세 홈페이지

import {
  TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, BackHandler, View, ScrollView, Keyboard, Dimensions, StyleSheet, Text,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import CloseIcon from '../../assets/icons/close_button.svg';
import styled from 'styled-components';
import { SheetManager } from 'react-native-actions-sheet';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import NetInfo from "@react-native-community/netinfo";
import Calendar from '../../components/ReservationCalendar';
import Config from 'react-native-config'
import axios from 'axios';
import { setAdBanner } from '../../redux/adBannerSlice';
import CheckOnIcon from '../../assets/icons/check_on.svg';

import CheckIcon from '../../assets/icons/check_circle.svg';
import ImpossibleIcon from '../../assets/icons/impossible_circle.svg';

const Container = styled.View`
  flex: 1.0;
  background-color: #fff;
`;

const IntroSection = styled.View`
  width: 100%;
  height: 44%;
`;

const IntroSection2 = styled.View`
  width: 100%;
  padding: 20px;
`;

const IntroSection3 = styled.View`
  width: 100%;
  padding: 10px;
`;

const ProfileAvatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 250px;
  height: 250px;
  background-color: #F0F3F8;
  align-self: center;
  border-radius: 200px; /* 둥글게 만들기 위해 추가 */
  margin-top: 20px;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #e8eaed;
`;


const ModalInputSection = styled.View`
  width: 100%;
  background-color: #fff;
`;

const ModalInputContainer = styled.View`
  width: 100%;
  padding: 0 20px;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
}))`
  width: 100%;
  height: 45px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  margin-top: 6px;
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;

const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 5px;
`;


const ProfileSection = styled.View`
  width: 90%;
  justify-content: flex-end;
  margin-left: 5%;
  border-bottom-width: 1px;
  border-bottom-color: #E8EAED;
`;

const ProfileTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  letter-spacing: -0.5px;
`;

const ProfileSubTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #717274;
  line-height: 20px;
  text-align: left;
`;

const ProfileSubTitle2 = styled.Text`
  font-size: 13px;
  font-family: Pretendard-SemiBold;
  color: #A3A5A8;
  line-height: 20px;
  text-align: left;
  margin-bottom: 10px;
`;


const ProfileSubTitle3 = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #000000;
  line-height: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 15px;
  margin-top: 10px;
`;

const SubTitle2 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
`;


const SubTitle3 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #FF7401;
  line-height: 15px;
  margin-top: 10px;
`;

const SubTitle4 = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
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
  margin-left: 1%;

`;

const TimeBox = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex: 0 0 24%;
  height: 40px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => (props?.active ? '#2F87FF' : '#E8EAED')};
  margin-bottom: 15px;
  margin-right: 1%;
`;

const TimeText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
`;

const ProfileAvatar2 = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 40px;
  height: 40px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: left;
  margin-right: 12px;
`;

const ProfileName = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 40px;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
  margin-right: 12px;
`;

const ConsultingTime = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Bold;
  color: #2F87FF;
  line-height: 40px;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const Tag = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 67px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  border-width: 1px;
  border-color: #CFD1D5;
  margin-bottom: 20px;
  align-self: flex-start; 

`;

const TagText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #CFD1D5;
  line-height: 20px;
`;

const ConsultingItem = styled.View`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: left;
  justify-content: space-between;

`;  // 세미콜론 추가

const ConsultingInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
  verticalAlign: 'top',
}))`
  width: auto; 
  height: 260px;
  background-color: #f5f7fa;
  padding: 15px; 
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
  align-self: center;
  text-align-vertical: top;
  overflow: hidden; 
`;


const TextLength = styled.Text`
  font-size: 9px;
  font-family: Pretendard-Bold;
  color: #717274;
  text-align: right;
  margin-right: 10px;
`;


const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  flex: 1;
  padding: 0 20px;
  align-items: center;
  justify-content: flex-end;  
  bottom: 10px;
  width: 100%;
`;


const ButtonSection2 = styled.View`
  flex: 1;
  padding: 0 20px;
  align-items: center;
  justify-content: flex-end;  
  width: 100%;
`;


const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 50px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  position: absolute;
  bottom: 0px;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;
const ProfileInfoSection = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;
const LeftContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const RightContainer = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;
const ListItemTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
`;
const ListItem = styled.View`
  flex-direction: row; 
  justify-content: center;
  align-items: center;
  padding-top:12px;
  padding-right : 16px;
  padding-left : 16px;
  padding-bottom: 12px;

`;
const CheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`

    width: 20px;
    height: 20px;
    border-radius: 5px;  
    background-color: #fff;
    border: 2px solid #BAC7D5;  
    align-items: center;
    justify-content: center;
    margin-left:8px;
`;
const ButtonSection3 = styled.View`
margin-top: 10px;
  width: 100%;
   padding: 16px; /* 패딩 추가 */
  background-color: #fff; /* 배경색 설정 */
    position: absolute; /* 버튼을 고정 */
 bottom: 0; /* 화면 하단에 위치 */
  left: 0; /* 왼쪽 시작 */
  right: 0; /* 오른쪽 끝 */
`;

const Button2 = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
  disabled: !props.active, // active가 false일 때 버튼 비활성화

}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => (props.active ? '#2F87FF' : '#e5e5e5')};
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: #2F87FF;
`;

const ButtonText2 = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#a3a5a8')};
  line-height: 20px;
  color: #fff;
`;

const ConsultingReservation = props => {
  const _scrollViewRef = useRef(null);
  const _scrollViewRef2 = useRef(null);
  // const data = [{ key: 'dummy' }]; // FlatList에 필요한 데이터
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPageIndexList = [0, 1, 2, 3, 4];
  const currentUser = useSelector(state => state.currentUser.value);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const input1 = useRef(null);
  const input2 = useRef(null);
  const dispatch = useDispatch();
  const input3 = useRef(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedList, setSelectedList] = useState([]);
  const ConsultingList = ['취득세', '양도소득세', '상속세', '증여세'];
  const morningTimes = [];
  const afternoonTimes = [];
  const [text, setText] = useState('');
  const [dataList, setDataList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [taxTypeList, setTaxTypeList] = useState([]);
  const [agreePrivacy, setAgreePrivacy] = useState(false); // 팝업 상태 관리

  for (let i = 9; i <= 11; i++) {
    if (i < 10) {
      morningTimes.push(`0${i}:00`);
      morningTimes.push(`0${i}:30`);
    } else {
      morningTimes.push(`${i}:00`);
      morningTimes.push(`${i}:30`);
    }
  }
  for (let i = 12; i < 18; i++) {
    afternoonTimes.push(`${i}:00`);
    afternoonTimes.push(`${i}:30`);
  }

  const handleBackPress = () => {
    if (currentPageIndex === 0) {
      SheetManager.show('InfoConsultingCancel', {
        payload: {
          type: 'info',
          message: '상담 예약을 다음에 하시겠어요?',
          onPress: { handlePress },
        },
      });
    } else {
      if (currentPageIndex != 4) {
        setCurrentPageIndex((currentPageIndex === 5 ? currentPageIndex - 1 : currentPageIndex) - 1);

      }
    }
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])
  );

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


  useEffect(() => {

    console.log("PaymentScreen", currentPageIndex);
    if (currentPageIndex === 0) {
      getDateTimelist('1', '');
    }
  }, [currentPageIndex]);

  useEffect(() => {
    dispatch(setAdBanner(false));
  }, []);




  useEffect(() => {
    if (selectedDate && currentPageIndex === 3) {
      console.log('selectedDate', selectedDate);
      getDateTimelist('2', selectedDate);
    }
    //console.log('timeList', timeList);
  }, [selectedDate, currentPageIndex]);

  const getDateTimelist = async (searchType, selectedDate) => {
    var consultantId = 1;
    const url = searchType === '1' ? `${Config.APP_API_URL}consulting/availableSchedule?consultantId=${consultantId}&searchType=${searchType}` : `${Config.APP_API_URL}consulting/availableSchedule?consultantId=${consultantId}&searchType=${searchType}&searchDate=${selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()}-${(selectedDate ? selectedDate.getMonth() + 1 : new Date().getMonth() + 1).toString().padStart(2, '0')}-${(selectedDate ? selectedDate : new Date()).getDate().toString().padStart(2, '0')}`;
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
      .then(async response => {
        console.log('response.data.dateList', response.data.dateList ? response.data.dateList : []);
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상담 가능 일정을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          if (searchType === "1") {
            //console.log('response.data', response.data.data);
            //console.log('response.data.dateList', response.data.data.dateList);
            const result = response === undefined ? [] : response.data.data.dateList;
            if (result.length > 0) {
              const list = result
                .filter(item => item.isReservationAvailable)
                .map(item => item.consultingDate);

              console.log('Datelist:', list);
              console.log('new Date(list[0]):', new Date(list[0]));
              setDataList([...list]);
            } else {
              setTimeout(async () => {
                await SheetManager.show('info', {
                  payload: {
                    type: 'info',
                    errorType: 1,
                    message: '앗, 현재 예약가능한 날짜가 없어요.\n나중에 다시 시도해주세요.',
                    buttontext: '확인하기',
                  },
                });
                navigation.goBack();
              }, 300);
            }

          } else if (searchType === "2") {
            const result = response === undefined ? [] : response.data.data.timeList;
            const list = result
              .filter(item => item.reservationStatus === "1")
              .map(item => item.consultingTime);

            console.log('Timelist:', list);
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

  const requestReservation = async () => {
    console.log('selectedDate', selectedDate);
    var NumTaxTypeList = taxTypeList.map(taxType => {
      switch (taxType) {
        case "취득세":
          return "01";
        case "양도소득세":
          return "02";
        case "상속세":
          return "03";
        case "증여세":
          return "04";
        default:
          return "";
      }
    });
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
      consultantId: '1',
      customerName: name ? name : '',
      customerPhone: phone ? phone.replace(/-/g, "") : '',
      reservationDate: selectedDate ? `${year}-${month}-${day}` : '',
      reservationTime: selectedList ? selectedList[0] : '',
      consultingType: NumTaxTypeList ? NumTaxTypeList.sort().join(",") : '',
      consultingInflowPath: '00',
      calcHistoryId: '',
      consultingRequestContent: text ? text : '',
    };
    console.log('data', data);
    console.log('headers', headers);
    try {
      const response = await axios.post(`${Config.APP_API_URL}consulting/reservationApply`, data, { headers: headers });
      if (response.data.errYn === 'Y') {
        if (response.data.errCode === 'CONSULTING-013') {
          setCurrentPageIndex(3);
          setTimeout(async () => {
            await getDateTimelist('1', '');
            if (dataList.length === 0) {
              await SheetManager.show('info', {
                payload: {
                  type: 'info',
                  errorType: 1,
                  message: '앗, 현재 모든 예약이 완료되었어요.\n나중에 다시 시도해주세요.',
                  buttontext: '확인하기',
                },
              });
              navigation.goBack();
            } else {
              await getDateTimelist('2', selectedDate);
              setSelectedList([]);
            }
          }, 300);
        } else {
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상담 예약 중 오류가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        }
        return false;
      } else {
        if (response.data.data && response.data.data.isApplyComplete) {
          const result = response.data.data;
          await SheetManager.show('InfoConsulting', {
            payload: {
              message: '상담 예약이 확정되었어요.',
              description: '요청하신 ' + result.reservationDate + ' 일자에\n주택세금 상담 예약이 확정되었어요.\n세무사님이 예약된 시간이 되면\n연락을 드릴 예정이에요.\n하우택싱을 이용해주셔서 감사해요.',
              buttontext: '처음으로 돌아가기',
            },
          });
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ? error?.errMsg : '상담 예약 중 오류가 발생했어요.',
        errorMessage: error?.errCode ? error?.errCode : 'error',
        buttontext: '확인하기',
      });
      console.error(error ? error : 'error');
      return false;
    }
  };

  const handlePress = buttonIndex => {
    if (buttonIndex === 'YES') {
      navigation.goBack();
    }
  };


  useEffect(() => {
    const focusInput = () => {
      if (currentPageIndex === 1 && input1.current) {
        input1.current.focus();
      } else if (currentPageIndex === 2 && input2.current) {
        input2.current.focus();
      } else if (currentPageIndex === 5 && input3.current) {
        input3.current.focus();
      };
    }

    _scrollViewRef.current?.scrollTo({
      x: width * currentPageIndex,
      y: 0, animated: true,
    });

    setTimeout(() => {
      focusInput();
    }, 200)

  }, [currentPageIndex]);


  useLayoutEffect(() => {
    navigation.setOptions({

      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            console.log('currentPageIndex', currentPageIndex);
            SheetManager.show('InfoConsultingCancel', {
              payload: {
                type: 'info',
                message: '상담 예약을 다음에 하시겠어요?',
                onPress: { handlePress },
              },
            });
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '상담 예약하기',
      headerShadowVisible: false,
      contentStyle: {
        borderTopColor: '#F7F7F7',
        borderTopWidth: 1,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
      },
    });
  }, [currentPageIndex]);

  return (
    <Container style={{ width: width }}>
      {currentPageIndex === 0 &&  <Container style={{ width: width }}>
          <ProgressSection>
          </ProgressSection>

          <><IntroSection>
            <ProfileAvatar
              source={require('../../assets/images/Minjungum_Lee_consulting.png')} />
          </IntroSection>
            <View style={{
              marginLeft: '5%',
              width: '90%',
              borderBottomWidth: 1,
              borderBottomColor: '#E8EAED', flexDirection: 'row', justifyContent: 'space-between'
            }}>
              <ProfileSection style={{
                flexDirection: 'column', alignItems: 'flex-start',  // 변경 
                justifyContent: 'flex-start',  // 변경
                alignSelf: 'flex-start',  // 변경 
                zIndex: 2,
                width: '50%',
                borderBottomWidth: 0,
                marginLeft: 0
              }}>
                <ProfileTitle>이민정음 세무사</ProfileTitle>
                <ProfileSubTitle>JS회계법인</ProfileSubTitle>
                <ProfileSubTitle2>세무사, 공인중개사 전문가</ProfileSubTitle2>
              </ProfileSection>
              <ProfileSection style={{
                flexDirection: 'column',
                alignItems: 'flex-end',  // 변경 
                justifyContent: 'flex-end',  // 변경
                alignSelf: 'flex-end',
                zIndex: 2,
                width: '50%',
                marginLeft: 0,
                borderBottomWidth: 0,
                marginLeft: 0
              }}>
                <View style={{
                  flexDirection: 'row',
                  zIndex: 2,
                  marginBottom: -10
                }}>
                  <Tag style={{ color: '#fff', borderColor: '#2F87FF', backgroundColor: '#2F87FF', marginRight: 5 }}><TagText style={{ color: '#FFFFFF' }}>양도소득세</TagText></Tag>
                  <Tag style={{ color: '#fff', borderColor: '#2F87FF', backgroundColor: '#2F87FF', width: 50 }}><TagText style={{ color: '#FFFFFF' }}>증여세</TagText></Tag>
                </View>
                <View style={{
                  flexDirection: 'row',
                  zIndex: 2,
                }}>
                  <Tag style={{ color: '#fff', borderColor: '#2F87FF', backgroundColor: '#2F87FF', width: 50 }}><TagText style={{ color: '#FFFFFF' }}>상속세</TagText></Tag>
                </View>
              </ProfileSection>
            </View>
            <ProfileSection>
              <ProfileSubTitle3>1,000건 이상의 재산제세 경험을 바탕으로 양도, 증여, 상속에 관한
                전문적인 상담 및 컨설팅 진행 도와드리겠습니다.{'\n'}감사합니다.</ProfileSubTitle3>
            </ProfileSection>
            <ProfileSection style={{
              borderBottomWidth: 0, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'
            }}>
              <View style={{
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'left',
                alignSelf: 'left',
                zIndex: 2,
                width: '50%',
              }}>
                <ProfileTitle style={{ marginBottom: 10 }}>전문분야</ProfileTitle>
                <ProfileSubTitle2>• 양도/상속/증여세 신고{'\n'}
                  • 자금출처조사{'\n'}
                  • 부동산 관련 절세{'\n'}
                  • 상속 및 가업승계</ProfileSubTitle2>
              </View>
              <View style={{
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'left',
                alignSelf: 'left',
                zIndex: 2,
                width: '50%',
              }}>
                <ProfileTitle style={{ marginBottom: 10 }}>주요경력</ProfileTitle>
                <ProfileSubTitle2>• 텍스온세무법인 2021{'\n'}
                  • 신승세무법인 2021{'\n'}
                  • JS세무회계 2023</ProfileSubTitle2>
              </View>
            </ProfileSection>
            <ButtonSection>
              <ShadowContainer>
                <Button
                  width={width}
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      setCurrentPageIndex(1);

                    }
                  }}>
                  <ButtonText >다음으로</ButtonText>
                </Button>
              </ShadowContainer>
              <View
                style={{
                  marginTop: 5,
                  marginBottom: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  zIndex: 2,
                }}>
                {currentPageIndexList?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.6}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{
                      width: 0 === index ? 20 : 8, // Elongate the dot
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 0 === index ? '#2F87FF' : '#1b1c1f',
                      borderWidth: 1,
                      borderColor: 0 === index ? '#2F87FF' : '#1b1c1f',
                      marginRight: 4,
                    }}
                  />
                ))}
              </View>
            </ButtonSection></>
        </Container>}
      {currentPageIndex === 1 &&   <Container style={{ width: width }}>
        <ProgressSection>
        </ProgressSection>
        <><IntroSection2 style={{ width: width }}>
          <Title>고객님의 이름을 알려주세요.</Title>
          <SubTitle>이름을 밝히고 싶지않다면 닉네임도 괜찮아요.</SubTitle>
        </IntroSection2>
          <ModalInputSection>
            <ModalInputContainer>
              <ModalInput
                ref={input1}
                //  onSubmitEditing={() => input2.current.focus()}
                autoFocus={currentPageIndex === 1}
                placeholder="이름을 입력해주세요."
                value={name}
                onChangeText={setName}
                maxLength={20}
                autoCompleteType="name"
                autoCapitalize="none"
                onSubmitEditing={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    if (name.length > 0) {
                      setCurrentPageIndex(2);
                    }
                  }
                }}
              />
            </ModalInputContainer>
          </ModalInputSection>
          <ButtonSection>
            <ShadowContainer>
              <Button
                style={{
                  backgroundColor: name.length < 1 ? '#E8EAED' : '#2F87FF',
                  color: name.length < 1 ? '#1b1c1f' : '#FFFFFF',
                }}
                disabled={name.length < 1}
                active={name.length > 0}
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    setCurrentPageIndex(2);
                  }
                }}>
                <ButtonText >다음으로</ButtonText>
              </Button>
            </ShadowContainer>
            <View
              style={{
                marginTop: 5,
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                zIndex: 2,
              }}>
              {currentPageIndexList?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  style={{
                    width: 1 === index ? 20 : 8, // Elongate the dot
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 1 === index ? '#2F87FF' : '#1b1c1f',
                    borderWidth: 1,
                    borderColor: 1 === index ? '#2F87FF' : '#1b1c1f',
                    marginRight: 4,
                  }}
                />
              ))}
            </View>
          </ButtonSection></>

      </Container>}

      {currentPageIndex === 2 &&     <Container style={{ width: width }}>
        <ProgressSection>
        </ProgressSection>
        <><IntroSection2 style={{ width: width }}>
          <Title>고객님의 전화번호를 알려주세요.</Title>
          <SubTitle>세무사님께서 고객님에게 직접 연락을 드릴 예정이예요.</SubTitle>
        </IntroSection2>
          <ModalInputSection>
            <ModalInputContainer>
              <ModalInput
                ref={input2}
                //  onSubmitEditing={() => input2.current.focus()}
                placeholder="전화번호를 입력해주세요."
                autoFocus={currentPageIndex === 2}
                value={phone}
                maxLength={13}
                keyboardType="phone-pad" // 숫자 키보드 표시
                autoCompleteType="tel"
                onChangeText={async (phone) => {
                  const filteredPhone = phone.replace(/[^0-9]/g, '');
                  let formattedPhone = filteredPhone;
                  if (filteredPhone.length > 3 && filteredPhone.length <= 7) {
                    formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3)}`;
                  } else if (filteredPhone.length > 7) {
                    formattedPhone = `${filteredPhone.slice(0, 3)}-${filteredPhone.slice(3, 7)}-${filteredPhone.slice(7, 11)}`;
                  }
                  setPhone(formattedPhone);
                }}
                onSubmitEditing={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    if (phone.length === 13) {
                      setCurrentPageIndex(3);
                    }
                  }
                }}
              />
            </ModalInputContainer>
          </ModalInputSection>
          <ButtonSection>
            <View
              style={{
                alignItems: 'center', // align-items를 camelCase로 변경
                flexDirection: 'row', // flex-direction을 camelCase로 변경
                justifyContent: 'space-between', // justify-content를 camelCase로 변경 
              }}>
              <View style={{ width: '49%', marginRight: '1%' }}>
                <Button
                  style={{
                    backgroundColor: '#fff',
                    color: '#1b1c1f',
                    width: '100%',
                    height: 50, // height 값을 숫자로 변경하고 단위 제거
                    alignItems: 'center', // align-items를 camelCase로 변경
                    justifyContent: 'center', // justify-content를 camelCase로 변경
                    borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                    borderColor: '#E8EAED',
                  }}
                  width={width}
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      setCurrentPageIndex(1);
                    }
                  }}>
                  <ButtonText style={{ color: '#717274' }}>이전으로</ButtonText>
                </Button>
              </View>
              <ShadowContainer style={{
                width: '49%', marginLeft: '1%', shadowColor: 'rgba(0,0,0,0.25)',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 2,
              }}>
                <Button
                  style={{
                    backgroundColor: phone.length < 11 ? '#E8EAED' : '#2F87FF',
                    color: phone.length < 13 ? '#1b1c1f' : '#FFFFFF',
                    width: '100%',
                    height: 50, // height 값을 숫자로 변경하고 단위 제거
                    alignItems: 'center', // align-items를 camelCase로 변경
                    justifyContent: 'center', // justify-content를 camelCase로 변경
                    borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                    borderColor: '#E8EAED',
                  }}
                  disabled={phone.length < 13}
                  active={phone.length > 12}
                  width={width}
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      if (phone.length > 12) {
                        setCurrentPageIndex(3);
                        Keyboard.dismiss();
                      }
                    }
                  }}>
                  <ButtonText >다음으로</ButtonText>
                </Button>
              </ShadowContainer>
            </View>
            <View
              style={{
                marginTop: 5,
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                zIndex: 2,
              }}>
              {currentPageIndexList?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  style={{
                    width: 2 === index ? 20 : 8, // Elongate the dot
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 2 === index ? '#2F87FF' : '#1b1c1f',
                    borderWidth: 1,
                    borderColor: 2 === index ? '#2F87FF' : '#1b1c1f',
                    marginRight: 4,
                  }}
                />
              ))}
            </View>
          </ButtonSection></>

      </Container>}

      {currentPageIndex === 3 &&       <Container style={{ width: width }}>
        <ProgressSection>
        </ProgressSection>
        <><FlatList
          ref={_scrollViewRef2}
          scrollEnabled={true}
          scrollEventThrottle={16}
          data={[]}
          renderItem={() => null} // 실제로 렌더링할 항목이 없으므로 null 반환
          showsVerticalScrollIndicator={false}
          overScrollMode="never" // 이 줄을 추가하세요
          ListHeaderComponent={
            <>
              <IntroSection2>
                <Title>예약일자와 시간을 선택해주세요.</Title>
                <SubTitle3>예약과 동시에 일정이 확정되니, 신중하게 선택해 주세요.{'\n'}상담을 전화로 진행될 거예요.</SubTitle3>
              </IntroSection2>
              <View
                style={{
                  height: 350,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E8EAED',
                }}>
                <Calendar
                  setSelectedDate={setSelectedDate}
                  selectedDate={dataList ? new Date(dataList[0]).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)}
                  currentDate={dataList ? new Date(dataList[0]).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)}
                  dateList={dataList}
                />
              </View>
              <ReservationtimeSection>
                <TimeTitle>오전</TimeTitle>
                <TimeContainer style={{ marginBottom: 10 }}>
                  <FlatList
                    //contentContainerStyle={styles.container}
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
                    numColumns={4} // 한 줄에 4개의 
                  ></FlatList>
                </TimeContainer>
                <TimeTitle>오후</TimeTitle>
                <TimeContainer style={{ marginBottom: 70 }}>
                  <FlatList
                    //contentContainerStyle={styles.container}
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
                    numColumns={4} // 한 줄에 4개의 
                  ></FlatList>
                </TimeContainer>
              </ReservationtimeSection>
            </>
          }
          ListFooterComponent={
            <><ButtonSection>
              <View
                style={{
                  alignItems: 'center', // align-items를 camelCase로 변경
                  flexDirection: 'row', // flex-direction을 camelCase로 변경
                  justifyContent: 'space-between', // justify-content를 camelCase로 변경 
                }}>
                <View style={{ width: '49%', marginRight: '1%' }}>
                  <Button
                    style={{
                      backgroundColor: '#fff',
                      color: '#1b1c1f',
                      width: '100%',
                      height: 50, // height 값을 숫자로 변경하고 단위 제거
                      alignItems: 'center', // align-items를 camelCase로 변경
                      justifyContent: 'center', // justify-content를 camelCase로 변경
                      borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                      borderColor: '#E8EAED',
                    }}
                    width={width}
                    onPress={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        setCurrentPageIndex(2);
                      }
                    }}>
                    <ButtonText style={{ color: '#717274' }}>이전으로</ButtonText>
                  </Button>
                </View>
                <ShadowContainer style={{
                  width: '49%', marginLeft: '1%', shadowColor: 'rgba(0,0,0,0.25)',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                }}>
                  <Button
                    style={{
                      backgroundColor: selectedList.length < 1 ? '#E8EAED' : '#2F87FF',
                      color: selectedList.length < 1 ? '#1b1c1f' : '#FFFFFF',
                      width: '100%',
                      height: 50, // height 값을 숫자로 변경하고 단위 제거
                      alignItems: 'center', // align-items를 camelCase로 변경
                      justifyContent: 'center', // justify-content를 camelCase로 변경
                      borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                      borderColor: '#E8EAED',
                    }}
                    disabled={selectedList.length < 1}
                    active={selectedList.length > 0}
                    width={width}
                    onPress={async () => {
                      // try {
                      //   const state = await NetInfo.fetch();
                      //   const canProceed = await handleNetInfoChange(state);

                      //   if (canProceed) {
                      //     console.log('Navigating to PaymentScreen');

                      //   }
                      // } catch (error) {
                      //   console.error('Error navigating to PaymentScreen:', error);
                      // }

                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        setCurrentPageIndex(4);
                      }
                      // setTimeout(() => {
                      //   navigation.navigate('PaymentScreen', {
                      //     onPaymentComplete: () => {
                      //       setCurrentPageIndex(4);
                      //     },
                      //   });
                      // }, 100); // 100ms 딜레이 추가
                      // console.log('PaymentScreen', 'PaymentScreen');
                     
                    }}>
                    <ButtonText>다음으로</ButtonText>
                  </Button>
                </ShadowContainer>
              </View>


              <View
                style={{
                  marginTop: 5,
                  marginBottom: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  zIndex: 2,
                }}>
                {currentPageIndexList?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.6}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{
                      width: 3 === index ? 20 : 8, // Elongate the dot
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 3 === index ? '#2F87FF' : '#1b1c1f',
                      borderWidth: 1,
                      borderColor: 3 === index ? '#2F87FF' : '#1b1c1f',
                      marginRight: 4,
                    }}
                  />
                ))}
              </View>
            </ButtonSection></>
          }
        /></>
      </Container>}

      {currentPageIndex === 4 &&     <Container style={{ width: width, height: height * 0.89 }}>
        <ProgressSection>
        </ProgressSection>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Input Section */}
          <View style={styles.inputSection}>
            {/* Label */}
            <Text style={styles.bigTitle}>입력 정보를 확인하신 후 결제해주세요.</Text>
            <View style={styles.Line1} />

            <ProfileInfoSection>

              <LeftContainer>
                <Text style={styles.dateText}>2024년 5월 7일 (수)</Text>
                <Text style={styles.timeText}>
                  <Text style={styles.timeHighlight}>13:00</Text>
                  <Text style={styles.timeSubtext}> (오후 1시)</Text>
                </Text>
              </LeftContainer>
              <RightContainer>
                <Text style={styles.titleText}>JS회계법인</Text>
                <Text style={styles.nameText}>이민정음 세무사</Text>
                <Text style={styles.addressText}>서울특별시 송파구</Text>
              </RightContainer>
            </ProfileInfoSection>
            <View style={styles.Line1} />

            <Text style={styles.subTitleLabel}>신청정보</Text>

            <View style={styles.infoBox}>
              {/* 고객명 */}
              <View style={styles.rowInfo}>
                <Text style={styles.labelInfo}>고객명</Text>
                <Text style={styles.valueIfno}>홍길동</Text>
              </View>

              {/* 할인 금액 */}
              <View style={styles.rowInfo}>
                <Text style={styles.labelInfo}>전화번호</Text>
                <Text style={styles.valueIfno}>010-0000-0000</Text>
              </View>


            </View>
            <View style={styles.Line1} />

            <Text style={styles.subTitleLabel}>결제 금액</Text>
            <View style={styles.infoBox}>
              {/* 상품 금액 */}
              <View style={styles.rowInfo}>
                <Text style={styles.labelInfo}>상품 금액</Text>
                <Text style={styles.valueIfno}>50,000 원</Text>
              </View>

              {/* 할인 금액 */}
              <View style={styles.rowInfo}>
                <Text style={styles.labelInfo}>할인 금액</Text>
                <Text style={styles.valueIfno}>0 원</Text>
              </View>

              {/* 구분선 */}
              <View style={styles.separator} />

              {/* 결제 금액 */}
              <View style={styles.rowInfo}>
                <Text style={styles.labelInfo}>결제 금액</Text>
                <Text style={styles.totalValue}>50,000 원</Text>
              </View>
            </View>

            <View style={styles.Line1} />

            <ListItem style={{ marginTop: 0 }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Privacy2', { agreePrivacy: agreePrivacy, navigation: navigation, tokens: props?.route?.params?.tokens ? props?.route?.params?.tokens : null, id: props?.route?.params?.id ? props?.route?.params?.id : null, password: props?.route?.params?.password ? props?.route?.params?.password : null });
                  }} >
                  <ListItemTitle style={{ color: '#2F87FF', textDecorationLine: 'underline' }}>개인정보 수집 및 이용</ListItemTitle>
                </TouchableOpacity>
                <ListItemTitle>에 대하여 동의하시나요?</ListItemTitle>
              </View>
              <CheckCircle
                onPress={() => {
                  setAgreePrivacy(!agreePrivacy);
                }}>
                {agreePrivacy && <CheckOnIcon />}
              </CheckCircle>
            </ListItem>


            <View style={styles.Line1} />


            {/* 만료 메시지 */}
            {/* 만료 메시지와 재전송 버튼 */}


          </View>


        </ScrollView>
        <ButtonSection3>
          <Button2
            style={{ backgroundColor: agreePrivacy ? '#2F87FF' : '#E8EAED' }}
            active={agreePrivacy} // agreePrivacy 값에 따라 버튼 활성화
            width={width}
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                console.log('결제하기');
                navigation.push('PaymentCompletScreen',);
                navigation.navigate('PaymentCompletScreen', {
                  onPaymentComplete: () => {
                    if (props.route.params?.onPaymentComplete) {
                      props.route.params.onPaymentComplete(); // 콜백 호출
                    }
                    navigation.goBack(); // 이전 화면으로 이동
                  },
                });

              }
            }
              // 동의하기 버튼 클릭 시 redux에 저장
            }>
            <ButtonText2
              active={agreePrivacy}>{'결제하기'}</ButtonText2>
          </Button2>

        </ButtonSection3>
      </Container>}

      {currentPageIndex === 5 &&     <ScrollView scrollEnabled={false} overScrollMode="never"><TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container style={{ width: width, height: height * 0.89 }}>

          <ProgressSection>
          </ProgressSection>
          <>
            <IntroSection2>
              <View style={{ flexDirection: 'row', alignItems: 'left', marginBottom: 10 }}>
                <ProfileAvatar2 source={require('../../assets/images/Minjungum_Lee_consulting.png')}></ProfileAvatar2>
                <ProfileName>이민정음 세무사</ProfileName>
                <ConsultingTime>{selectedDate ? new Date(selectedDate).getFullYear() + '년 ' + (new Date(selectedDate).getMonth() + 1) + '월 ' + new Date(selectedDate).getDate() + '일 ' + selectedList : ''}</ConsultingTime>
              </View>
              <View style={{
                flexDirection: 'column', alignItems: 'left', borderBottomWidth: 1,
                borderBottomColor: '#E8EAED', borderTopWidth: 1,
                borderTopColor: '#E8EAED',
              }}>
                <Title style={{ marginBottom: 10, marginTop: 10 }}>상세 내용을 알려주세요.</Title>
                <SubTitle4>세금종류</SubTitle4>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  {ConsultingList.map((item, index) => (
                    <Tag
                      style={{
                        borderColor: taxTypeList.indexOf(item) < 0 ? '#E8EAED'
                          : item === '취득세'
                            ? '#2F87FF'
                            : item === '양도소득세'
                              ? '#2F87FF'
                              : item === '상속세'
                                ? '#2F87FF'
                                : item === '증여세'
                                  ? '#2F87FF'
                                  : '#E8EAED',
                        margin: 5 // 각 Tag 간에 5px의 간격을 추가
                      }}
                      //disabled={taxTypeList.indexOf(item) < 0}
                      active={taxTypeList.indexOf(item) > -1}
                      onPress={() => {
                        if (taxTypeList.indexOf(item) > -1) {
                          setTaxTypeList(
                            taxTypeList.filter(selectedItem => selectedItem !== item),
                          );
                        } else {
                          setTaxTypeList([...taxTypeList, item]);
                        }
                      }}
                      key={index}>
                      <TagText style={{
                        color: taxTypeList.indexOf(item) < 0 ? '#E8EAED'
                          : item === '취득세'
                            ? '#2F87FF'
                            : item === '양도소득세'
                              ? '#2F87FF'
                              : item === '상속세'
                                ? '#2F87FF'
                                : item === '증여세'
                                  ? '#2F87FF'
                                  : '#E8EAED'
                      }}>
                        {item}
                      </TagText>
                    </Tag>
                  ))}
                </View>
              </View>
              <SubTitle4 style={{ marginTop: 20, marginBottom: 20 }}>상세 내용</SubTitle4>
              <ConsultingItem>
                <ScrollView keyboardShouldPersistTaps='always'>
                  <ConsultingInput
                    ref={input3}
                    autoFocus={currentPageIndex === 5}
                    multiline={true}
                    width={width}
                    placeholder="정확한 상담을 위해 사실 관계 및 문의사항을 자세하게 입력해주세요."
                    onChangeText={(input) => {
                      let byteCount = encodeURI(input).split(/%..|./).length - 1;
                      if (byteCount <= 1000) {
                        setText(input);
                      }
                    }}
                    value={text.slice(0, 1000)}
                    style={{ flexWrap: 'wrap' }}
                    blurOnSubmit={false}
                  />
                </ScrollView>
              </ConsultingItem>
            </IntroSection2>
            <ButtonSection2>


              <View
                style={{
                  alignItems: 'center', // align-items를 camelCase로 변경
                  flexDirection: 'row', // flex-direction을 camelCase로 변경
                  justifyContent: 'space-between', // justify-content를 camelCase로 변경 
                }}>
                <View style={{ width: '49%', marginRight: '1%' }}>
                  <Button
                    style={{
                      backgroundColor: '#fff',
                      color: '#1b1c1f',
                      width: '100%',
                      height: 50, // height 값을 숫자로 변경하고 단위 제거
                      alignItems: 'center', // align-items를 camelCase로 변경
                      justifyContent: 'center', // justify-content를 camelCase로 변경
                      borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                      borderColor: '#E8EAED',
                    }}
                    width={width}
                    onPress={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        setCurrentPageIndex(3);
                      }


                      // setTimeout(() => {
                      //   navigation.navigate('PaymentScreen', {
                      //     onPaymentComplete: () => {
                      //       setIsPayment(false);
                      //       setCurrentPageIndex(4);
                      //     },
                      //   });
                      // }, 200)
                    }}>
                    <ButtonText style={{ color: '#717274' }}>이전으로</ButtonText>
                  </Button>
                </View>
                <ShadowContainer style={{ width: '49%', marginLeft: '1%' }}>
                  <Button
                    style={{
                      backgroundColor: text === '' ? '#E8EAED' : '#2F87FF',
                      color: text === '' ? '#1b1c1f' : '#FFFFFF',
                      width: '100%',
                      height: 50, // height 값을 숫자로 변경하고 단위 제거
                      alignItems: 'center', // align-items를 camelCase로 변경
                      justifyContent: 'center', // justify-content를 camelCase로 변경
                      borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                      borderColor: '#E8EAED',
                    }}
                    disabled={!text}
                    active={text}
                    width={width}
                    onPress={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        const result = await requestReservation();
                        console.log('result', result);;
                        if (result) {
                          navigation.navigate('Home');
                        }
                      }
                    }}>
                    <ButtonText>상담 예약하기</ButtonText>
                  </Button>
                </ShadowContainer>
              </View>
              <View
                style={{
                  marginTop: 5,
                  marginBottom: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  zIndex: 2,
                }}>
                {currentPageIndexList?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.6}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{
                      width: 4 === index ? 20 : 8, // Elongate the dot
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 4 === index ? '#2F87FF' : '#1b1c1f',
                      borderWidth: 1,
                      borderColor: 4 === index ? '#2F87FF' : '#1b1c1f',
                      marginRight: 4,
                    }}
                  />
                ))}
              </View>
            </ButtonSection2>
          </>
        </Container>

      </TouchableWithoutFeedback>
      </ScrollView>}
    </Container>
    
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 13,
    color: '#FF7401', // 빨간색 텍스트
    marginRight: 10,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blueLine: {
    height: 5, // 라인 두께
    backgroundColor: '#2f87ff', // 파란색
  },
  bigTitle: {
    fontSize: 20,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    lineHeight: 24,
  },

  subTitleLabel: {
    fontSize: 17,

    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리

  },

  infoBox: {
    marginTop: 20,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d9d9d9', // 연한 테두리
    alignSelf: 'center',
  },

  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // 각 행 간 간격
  },

  labelInfo: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#717274', // 회색 텍스트
  },
  valueIfno: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    color: '#a3a5a8', // 회색 텍스트
  },

  totalValue: {
    fontSize: 13,
    color: '#2F87FF', // 파란 텍스트
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
  },
  separator: {
    height: 1,
    backgroundColor: '#E8EAED', // 구분선 색상
  },
  content: {
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    marginBottom: 30,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 80, // 버튼 공간 확보
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  secondContent: {
    marginTop: 20,
  },
  inputSection: {
    marginTop: 22,
  },
  Line1: {
    height: 1, // 라인 두께
    backgroundColor: '#E8EaEd', // 파란색
    marginBottom: 20,
    marginTop: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
  },
  timeText: {
    marginTop: 5,
  },
  timeHighlight: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#1B1C1F',
  },
  timeSubtext: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
  },
  titleText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
    color: '#717274',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 17,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#a3a5a8', // 연회색
  },
});

export default ConsultingReservation;
