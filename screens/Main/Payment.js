// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler, View, ScrollView, Animated, Text, TextInput,  StyleSheet,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import BackIcon from '../../assets/icons/back_button.svg';
import CloseIcon from '../../assets/icons/close_button.svg';
import Bottompolygon from '../../assets/icons/bottom_polygon.svg';
import styled from 'styled-components';
import { SheetManager } from 'react-native-actions-sheet';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import NetInfo from "@react-native-community/netinfo";
import Calendar from '../../components/ReservationCalendar';
import Config from 'react-native-config'
import axios from 'axios';
import TaxCard from '../../components/TaxCard';
import TaxInfoCard from '../../components/TaxInfoCard';
import TaxCard2 from '../../components/TaxCard2';
import TaxInfoCard2 from '../../components/TaxInfoCard2';
import HouseInfo from '../../components/HouseInfo';
import CalculationWarningCard from '../../components/CalculationWarning';

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
  margin-bottom: 20px;

`;  // 세미콜론 추가

const ConsultingInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
  verticalAlign: 'top',
}))`
  width: auto; 
  height: 100px;
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
  flex: 1;
  padding: 0 20px;
  align-items: center;
  justify-content: flex-end;  
  margin-top: 10px;
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

const Button2 = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 60px;
  height: 30px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: right;
`;


const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const Payment = props => {
  const _scrollViewRef = useRef(null);
  const _scrollViewRef2 = useRef(null);
  const _scrollViewRef3 = useRef(null);
  // const data = [{ key: 'dummy' }]; // FlatList에 필요한 데이터
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPageIndexList = [0, 1, 2, 3, 4];
  const currentUser = useSelector(state => state.currentUser.value);
  const Pdata = props?.route.params?.Pdata;
  const navigation = useNavigation();
  const houseInfo = props?.route.params?.houseInfo;
  const { width, height } = useWindowDimensions();
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedList, setSelectedList] = useState([]);
  const ConsultingList = ['취득세', '양도소득세', '상속세', '증여세'];
  const morningTimes = [];
  const afternoonTimes = [];
  const [text, setText] = useState('');
  const [dataList, setDataList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [taxTypeList, setTaxTypeList] = useState([]);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
    navigation.goBack();

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
    const focusInput = () => {
      if (currentPageIndex === 1 && input1.current) {
        input1.current.focus();
      } else if (currentPageIndex === 2 && input2.current) {
        input2.current.focus();
      } else if (currentPageIndex === 4 && input3.current) {
        input3.current.focus();
      }
    };

    focusInput();
  }, [currentPageIndex]);



  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            // SheetManager.show('InfoConsultingCancel', {
            //   payload: {
            //     type: 'info',
            //     message: '상담 예약을 다음에 하시겠어요?',
            //     onPress: { handlePress },
            //   },
            // });
            navigation.goBack();
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '결제하기',
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
  }, []);

  const handlePress = buttonIndex => {
    if (buttonIndex === 'YES') {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.rootContainer}>
      {/* 파란색 라인 */}
      <ProgressSection>
      </ProgressSection>

      {/* 스크롤 뷰 */}
      <ScrollView contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Input Section */}
        <View style={styles.baseContent}>
          <Text style={styles.bigTitle}>입력 정보를 확인하신 후 결제해주세요.</Text>
          <View style={styles.Line1} />


          {/* Label */}
          <Text style={styles.label}>휴대폰 번호</Text>
          <Text style={styles.subTitleLabel}>본인 인증을 위해 휴대폰 번호를 알려주세요.</Text>

          {/* Input Field */}
          {/* <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef} // ref 연결
              keyboardType="phone-pad" // 숫자 키보드 표시
              maxLength={13} // 최대 11자리 (01012345678)
              style={styles.input}
              placeholder="휴대폰 번호를 입력해주세요."
              placeholderTextColor="#A3A5A8"
              value={phoneNumber}
              onSubmitEditing={async () => {
                const phoneCheck = await validatePhoneNum(phoneNumber);
                console.log("sendAuthMobile:", phoneCheck);
                setPhoneNumberOk(phoneCheck ? '2' : '3');

              }

              }
              onChangeText={async (text) => { setPhoneNumber(formatPhoneNumber(text)); setPhoneNumberOk('1'); }}

            />
            {phoneNumberOk === '1' &&
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setPhoneNumber('');
                  setPhoneNumberOk('1');
                }}
              >

                <DeleteIcon />
              </TouchableOpacity>
            }
            {phoneNumberOk === '2' && <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setPhoneNumber('')}
            >

              <CheckIcon />
            </TouchableOpacity>
            }
            {phoneNumberOk === '3' && <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setPhoneNumber('')}
            >

              <ImpossibleIcon />
            </TouchableOpacity>
            }

          </View> */}

        </View>

        
        {/* 만료 메시지 */}
        {/* 만료 메시지와 재전송 버튼 */}

        {/* Login Button */}
        {/* <TouchableOpacity
          style={[
            styles.loginButton,
            (!phoneNumber || timer === 0) && styles.disabledButton, // 조건부 스타일
          ]}
          onPress={handleNextStep}
          disabled={!phoneNumber || timer === 0} // 비활성화 조건
        >
          <Text style={styles.loginButtonLabel}>
            {step === 1 ? '인증번호 전송하기' : '다음으로'}
          </Text>
        </TouchableOpacity> */}




      </ScrollView>
    </View>
    // <ScrollView
    //   ref={_scrollViewRef}
    //   pagingEnabled
    //   style={{
    //     width: width,
    //   }}
    //   horizontal
    //   keyboardShouldPersistTaps='always'
    //   showsHorizontalScrollIndicator={false}
    //   scrollEnabled={false}
    //   scrollEventThrottle={16}>
    //   {currentPageIndex === 0 && <Container style={{ width: width }}>
    //     <ProgressSection>
    //     </ProgressSection>

    //     <><IntroSection>
    //       <ProfileAvatar
    //         source={require('../../assets/images/Minjungum_Lee_consulting.png')} />
    //     </IntroSection>
    //       <View style={{
    //         marginLeft: '5%',
    //         width: '90%',
    //         borderBottomWidth: 1,
    //         borderBottomColor: '#E8EAED', flexDirection: 'row', justifyContent: 'space-between'
    //       }}>
    //         <ProfileSection style={{
    //           flexDirection: 'column', alignItems: 'flex-start',  // 변경 
    //           justifyContent: 'flex-start',  // 변경
    //           alignSelf: 'flex-start',  // 변경 
    //           zIndex: 2,
    //           width: '50%',
    //           borderBottomWidth: 0,
    //           marginLeft: 0
    //         }}>
    //           <ProfileTitle>이민정음 세무사</ProfileTitle>
    //           <ProfileSubTitle>JS회계법인</ProfileSubTitle>
    //           <ProfileSubTitle2>세무사, 공인중개사 전문가</ProfileSubTitle2>
    //         </ProfileSection>
    //         <ProfileSection style={{
    //           flexDirection: 'column',
    //           alignItems: 'flex-end',  // 변경 
    //           justifyContent: 'flex-end',  // 변경
    //           alignSelf: 'flex-end',
    //           zIndex: 2,
    //           width: '50%',
    //           marginLeft: 0,
    //           borderBottomWidth: 0,
    //         }}>
    //           <View style={{
    //             flexDirection: 'row',
    //             zIndex: 2,
    //             marginBottom: -10
    //           }}>
    //             <Tag style={{ color: '#fff', borderColor: '#2F87FF', backgroundColor: '#2F87FF', marginRight: 5 }}><TagText style={{ color: '#FFFFFF' }}>양도소득세</TagText></Tag>
    //             <Tag style={{ color: '#fff', borderColor: '#2F87FF', backgroundColor: '#2F87FF', width: 50 }}><TagText style={{ color: '#FFFFFF' }}>증여세</TagText></Tag>
    //           </View>
    //           <View style={{
    //             flexDirection: 'row',
    //             zIndex: 2,
    //           }}>
    //             <Tag style={{ color: '#fff', borderColor: '#2F87FF', backgroundColor: '#2F87FF', width: 50 }}><TagText style={{ color: '#FFFFFF' }}>상속세</TagText></Tag>
    //           </View>
    //         </ProfileSection>
    //       </View>
    //       <ProfileSection>
    //         <ProfileSubTitle3>1,000건 이상의 재산제세 경험을 바탕으로 양도, 증여, 상속에 관한
    //           전문적인 상담 및 컨설팅 진행 도와드리겠습니다.{'\n'}감사합니다.</ProfileSubTitle3>
    //       </ProfileSection>
    //       <ProfileSection style={{
    //         borderBottomWidth: 0, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'
    //       }}>
    //         <View style={{
    //           flexDirection: 'column',
    //           alignItems: 'left',
    //           justifyContent: 'left',
    //           alignSelf: 'left',
    //           zIndex: 2,
    //           width: '50%',
    //         }}>
    //           <ProfileTitle style={{ marginBottom: 10 }}>전문분야</ProfileTitle>
    //           <ProfileSubTitle2>• 양도/상속/증여세 신고{'\n'}
    //             • 자금출처조사{'\n'}
    //             • 부동산 관련 절세{'\n'}
    //             • 상속 및 가업승계</ProfileSubTitle2>
    //         </View>
    //         <View style={{
    //           flexDirection: 'column',
    //           alignItems: 'left',
    //           justifyContent: 'left',
    //           alignSelf: 'left',
    //           zIndex: 2,
    //           width: '50%',
    //         }}>
    //           <ProfileTitle style={{ marginBottom: 10 }}>주요경력</ProfileTitle>
    //           <ProfileSubTitle2>• 텍스온세무법인 2021{'\n'}
    //             • 신승세무법인 2021{'\n'}
    //             • JS세무회계 2023</ProfileSubTitle2>
    //         </View>
    //       </ProfileSection>
    //       <ButtonSection>
    //         <ShadowContainer>
    //           <Button
    //             width={width}
    //             onPress={async () => {
    //               const state = await NetInfo.fetch();
    //               const canProceed = await handleNetInfoChange(state);
    //               if (canProceed) {
    //                 setCurrentPageIndex(1);
    //               }
    //             }}>
    //             <ButtonText >다음으로</ButtonText>
    //           </Button>
    //         </ShadowContainer>
    //         <View
    //           style={{
    //             marginTop: 5,
    //             marginBottom: 5,
    //             flexDirection: 'row',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             alignSelf: 'center',
    //             zIndex: 2,
    //           }}>
    //           {currentPageIndexList?.map((item, index) => (
    //             <TouchableOpacity
    //               key={index}
    //               activeOpacity={0.6}
    //               hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    //               style={{
    //                 width: 0 === index ? 20 : 8, // Elongate the dot
    //                 height: 8,
    //                 borderRadius: 4,
    //                 backgroundColor: 0 === index ? '#2F87FF' : '#1b1c1f',
    //                 borderWidth: 1,
    //                 borderColor: 0 === index ? '#2F87FF' : '#1b1c1f',
    //                 marginRight: 4,
    //               }}
    //             />
    //           ))}
    //         </View>
    //       </ButtonSection></>
    //   </Container>}

    //   {currentPageIndex === 1 && <Container style={{ width: width }}>
    //     <ProgressSection>
    //     </ProgressSection>


    //     <><IntroSection2 style={{ width: width }}>
    //       <Title>고객님의 이름을 알려주세요.</Title>
    //       <SubTitle>이름을 밝히고 싶지않다면 닉네임도 괜찮아요.</SubTitle>
    //     </IntroSection2>
    //       <ModalInputSection>
    //         <ModalInputContainer>
    //           <ModalInput
    //             ref={input1}
    //             //  onSubmitEditing={() => input2.current.focus()}
    //             autoFocus={currentPageIndex === 1}
    //             placeholder="이름을 입력해주세요."
    //             value={name}
    //             onChangeText={setName}
    //             maxLength={20}
    //             autoCompleteType="name"
    //             autoCapitalize="none"
    //             onSubmitEditing={async () => {
    //               const state = await NetInfo.fetch();
    //               const canProceed = await handleNetInfoChange(state);
    //               if (canProceed) {
    //                 if (name.length > 0) {
    //                   setCurrentPageIndex(2);
    //                 }
    //               }
    //             }}
    //           />
    //         </ModalInputContainer>
    //       </ModalInputSection>
    //       <ButtonSection>
    //         <ShadowContainer>
    //           <Button
    //             style={{
    //               backgroundColor: name.length < 1 ? '#E8EAED' : '#2F87FF',
    //               color: name.length < 1 ? '#1b1c1f' : '#FFFFFF',
    //             }}
    //             disabled={name.length < 1}
    //             active={name.length > 0}
    //             width={width}
    //             onPress={async () => {
    //               const state = await NetInfo.fetch();
    //               const canProceed = await handleNetInfoChange(state);
    //               if (canProceed) {
    //                 setCurrentPageIndex(2);
    //               }
    //             }}>
    //             <ButtonText >다음으로</ButtonText>
    //           </Button>
    //         </ShadowContainer>
    //         <View
    //           style={{
    //             marginTop: 5,
    //             marginBottom: 5,
    //             flexDirection: 'row',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             alignSelf: 'center',
    //             zIndex: 2,
    //           }}>
    //           {currentPageIndexList?.map((item, index) => (
    //             <TouchableOpacity
    //               key={index}
    //               activeOpacity={0.6}
    //               hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    //               style={{
    //                 width: 1 === index ? 20 : 8, // Elongate the dot
    //                 height: 8,
    //                 borderRadius: 4,
    //                 backgroundColor: 1 === index ? '#2F87FF' : '#1b1c1f',
    //                 borderWidth: 1,
    //                 borderColor: 1 === index ? '#2F87FF' : '#1b1c1f',
    //                 marginRight: 4,
    //               }}
    //             />
    //           ))}
    //         </View>
    //       </ButtonSection></>

    //   </Container>}
    //   {currentPageIndex === 2 && <Container style={{ width: width }}>
    //     <ProgressSection>
    //     </ProgressSection>
    //     <><IntroSection2 style={{ width: width }}>
    //       <Title>고객님의 전화번호를 알려주세요.</Title>
    //       <SubTitle>세무사님께서 고객님에게 직접 연락을 드릴 예정이예요.</SubTitle>
    //     </IntroSection2>
    //       <ModalInputSection>
    //         <ModalInputContainer>
    //           <ModalInput
    //             ref={input2}
    //             //  onSubmitEditing={() => input2.current.focus()}
    //             autoFocus={currentPageIndex === 2}
    //             placeholder="전화번호를 입력해주세요."
    //             value={phone}
    //             onChangeText={setPhone}
    //             maxLength={11}
    //             keyboardType="phone-pad"
    //             autoCompleteType="tel"
    //             onSubmitEditing={async () => {
    //               const state = await NetInfo.fetch();
    //               const canProceed = await handleNetInfoChange(state);
    //               if (canProceed) {
    //                 if (phone.length > 10) {
    //                   setCurrentPageIndex(3);
    //                 }

    //               }
    //             }}
    //           />
    //         </ModalInputContainer>
    //       </ModalInputSection>
    //       <ButtonSection>
    //         <View
    //           style={{
    //             alignItems: 'center', // align-items를 camelCase로 변경
    //             flexDirection: 'row', // flex-direction을 camelCase로 변경
    //             justifyContent: 'space-between', // justify-content를 camelCase로 변경 
    //           }}>
    //           <View style={{ width: '49%', marginRight: '1%' }}>
    //             <Button
    //               style={{
    //                 backgroundColor: '#fff',
    //                 color: '#1b1c1f',
    //                 width: '100%',
    //                 height: 50, // height 값을 숫자로 변경하고 단위 제거
    //                 alignItems: 'center', // align-items를 camelCase로 변경
    //                 justifyContent: 'center', // justify-content를 camelCase로 변경
    //                 borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
    //                 borderColor: '#E8EAED',
    //               }}
    //               width={width}
    //               onPress={async () => {
    //                 const state = await NetInfo.fetch();
    //                 const canProceed = await handleNetInfoChange(state);
    //                 if (canProceed) {
    //                   setCurrentPageIndex(1);
    //                 }
    //               }}>
    //               <ButtonText style={{ color: '#717274' }}>이전으로</ButtonText>
    //             </Button>
    //           </View>
    //           <ShadowContainer style={{
    //             width: '49%', marginLeft: '1%', shadowColor: 'rgba(0,0,0,0.25)',
    //             shadowOffset: {
    //               width: 0,
    //               height: 4,
    //             },
    //             shadowOpacity: 0.15,
    //             shadowRadius: 2,
    //           }}>
    //             <Button
    //               style={{
    //                 backgroundColor: phone.length < 11 ? '#E8EAED' : '#2F87FF',
    //                 color: phone.length < 11 ? '#1b1c1f' : '#FFFFFF',
    //                 width: '100%',
    //                 height: 50, // height 값을 숫자로 변경하고 단위 제거
    //                 alignItems: 'center', // align-items를 camelCase로 변경
    //                 justifyContent: 'center', // justify-content를 camelCase로 변경
    //                 borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
    //                 borderColor: '#E8EAED',
    //               }}
    //               disabled={phone.length < 11}
    //               active={phone.length > 10}
    //               width={width}
    //               onPress={async () => {
    //                 const state = await NetInfo.fetch();
    //                 const canProceed = await handleNetInfoChange(state);
    //                 if (canProceed) {
    //                   setCurrentPageIndex(3);
    //                 }
    //               }}>
    //               <ButtonText >다음으로</ButtonText>
    //             </Button>
    //           </ShadowContainer>
    //         </View>
    //         <View
    //           style={{
    //             marginTop: 5,
    //             marginBottom: 5,
    //             flexDirection: 'row',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             alignSelf: 'center',
    //             zIndex: 2,
    //           }}>
    //           {currentPageIndexList?.map((item, index) => (
    //             <TouchableOpacity
    //               key={index}
    //               activeOpacity={0.6}
    //               hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    //               style={{
    //                 width: 2 === index ? 20 : 8, // Elongate the dot
    //                 height: 8,
    //                 borderRadius: 4,
    //                 backgroundColor: 2 === index ? '#2F87FF' : '#1b1c1f',
    //                 borderWidth: 1,
    //                 borderColor: 2 === index ? '#2F87FF' : '#1b1c1f',
    //                 marginRight: 4,
    //               }}
    //             />
    //           ))}
    //         </View>
    //       </ButtonSection></>

    //   </Container>}
    //   {currentPageIndex === 3 && <Container style={{ width: width }}>
    //     <ProgressSection>
    //     </ProgressSection>
    //     <><FlatList
    //       ref={_scrollViewRef2}
    //       scrollEnabled={true}
    //       scrollEventThrottle={16}
    //       data={[]}
    //       renderItem={() => null} // 실제로 렌더링할 항목이 없으므로 null 반환
    //       showsVerticalScrollIndicator={false}
    //       overScrollMode="never" // 이 줄을 추가하세요
    //       ListHeaderComponent={
    //         <>
    //           <IntroSection2>
    //             <Title>예약일자와 시간을 선택해주세요.</Title>
    //             <SubTitle3>예약과 동시에 일정이 확정되니, 신중하게 선택해 주세요.{'\n'}상담을 전화로 진행될 거예요.</SubTitle3>
    //           </IntroSection2>
    //           <View
    //             style={{
    //               height: 350,
    //               borderBottomWidth: 1,
    //               borderBottomColor: '#E8EAED',
    //             }}>
    //             <Calendar
    //               setSelectedDate={setSelectedDate}
    //               selectedDate={dataList ? new Date(dataList[0]).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)}
    //               currentDate={dataList ? new Date(dataList[0]).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)}
    //               dateList={dataList}
    //             />
    //           </View>
    //           <ReservationtimeSection>
    //             <TimeTitle>오전</TimeTitle>
    //             <TimeContainer style={{ marginBottom: 10 }}>
    //               <FlatList
    //                 //contentContainerStyle={styles.container}
    //                 data={morningTimes}
    //                 renderItem={({ item }) => (
    //                   <TimeBox
    //                     disabled={timeList.indexOf(item) < 0}
    //                     active={selectedList.indexOf(item) > -1}
    //                     onPress={() => {
    //                       if (selectedList.indexOf(item) > -1) {
    //                         setSelectedList(
    //                           selectedList.filter(selectedItem => selectedItem !== item),
    //                         );
    //                       } else {
    //                         setSelectedList([item]);
    //                       }
    //                     }}>
    //                     <TimeText style={{ color: timeList.indexOf(item) < 0 ? '#E8EAED' : '#1b1c1f' }}>{item}</TimeText>
    //                   </TimeBox>
    //                 )}
    //                 keyExtractor={(item, index) => index.toString()}
    //                 numColumns={4} // 한 줄에 4개의 
    //               ></FlatList>
    //             </TimeContainer>
    //             <TimeTitle>오후</TimeTitle>
    //             <TimeContainer>
    //               <FlatList
    //                 //contentContainerStyle={styles.container}
    //                 data={afternoonTimes}
    //                 renderItem={({ item }) => (
    //                   <TimeBox
    //                     disabled={timeList.indexOf(item) < 0}
    //                     active={selectedList.indexOf(item) > -1}
    //                     onPress={() => {
    //                       if (selectedList.indexOf(item) > -1) {
    //                         setSelectedList(
    //                           selectedList.filter(selectedItem => selectedItem !== item),
    //                         );
    //                       } else {
    //                         setSelectedList([item]);
    //                       }
    //                     }}>
    //                     <TimeText style={{ color: timeList.indexOf(item) < 0 ? '#E8EAED' : '#1b1c1f' }}>{item}</TimeText>
    //                   </TimeBox>
    //                 )}
    //                 keyExtractor={(item, index) => index.toString()}
    //                 numColumns={4} // 한 줄에 4개의 
    //               ></FlatList>
    //             </TimeContainer>
    //             <View style={{
    //               marginBottom: 60
    //             }}>
    //               <SubTitle3 style={{ textAlign: 'center' }}>{'상담시간은 15분이예요.'}</SubTitle3>
    //             </View>
    //           </ReservationtimeSection>
    //         </>
    //       }
    //       ListFooterComponent={
    //         <><ButtonSection>
    //           <View
    //             style={{
    //               alignItems: 'center', // align-items를 camelCase로 변경
    //               flexDirection: 'row', // flex-direction을 camelCase로 변경
    //               justifyContent: 'space-between', // justify-content를 camelCase로 변경 
    //             }}>
    //             <View style={{ width: '49%', marginRight: '1%' }}>
    //               <Button
    //                 style={{
    //                   backgroundColor: '#fff',
    //                   color: '#1b1c1f',
    //                   width: '100%',
    //                   height: 50, // height 값을 숫자로 변경하고 단위 제거
    //                   alignItems: 'center', // align-items를 camelCase로 변경
    //                   justifyContent: 'center', // justify-content를 camelCase로 변경
    //                   borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
    //                   borderColor: '#E8EAED',
    //                 }}
    //                 width={width}
    //                 onPress={async () => {
    //                   const state = await NetInfo.fetch();
    //                   const canProceed = await handleNetInfoChange(state);
    //                   if (canProceed) {
    //                     setCurrentPageIndex(2);
    //                   }
    //                 }}>
    //                 <ButtonText style={{ color: '#717274' }}>이전으로</ButtonText>
    //               </Button>
    //             </View>
    //             <ShadowContainer style={{
    //               width: '49%', marginLeft: '1%', shadowColor: 'rgba(0,0,0,0.25)',
    //               shadowOffset: {
    //                 width: 0,
    //                 height: 4,
    //               },
    //               shadowOpacity: 0.15,
    //               shadowRadius: 2,
    //             }}>
    //               <Button
    //                 style={{
    //                   backgroundColor: selectedList.length < 1 ? '#E8EAED' : '#2F87FF',
    //                   color: selectedList.length < 1 ? '#1b1c1f' : '#FFFFFF',
    //                   width: '100%',
    //                   height: 50, // height 값을 숫자로 변경하고 단위 제거
    //                   alignItems: 'center', // align-items를 camelCase로 변경
    //                   justifyContent: 'center', // justify-content를 camelCase로 변경
    //                   borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
    //                   borderColor: '#E8EAED',
    //                 }}
    //                 disabled={selectedList.length < 1}
    //                 active={selectedList.length > 0}
    //                 width={width}
    //                 onPress={async () => {
    //                   const state = await NetInfo.fetch();
    //                   const canProceed = await handleNetInfoChange(state);
    //                   if (canProceed) {
    //                     setCurrentPageIndex(4);
    //                   }
    //                 }}>
    //                 <ButtonText>다음으로</ButtonText>
    //               </Button>
    //             </ShadowContainer>
    //           </View>
    //           <View
    //             style={{
    //               marginTop: 5,
    //               marginBottom: 5,
    //               flexDirection: 'row',
    //               alignItems: 'center',
    //               justifyContent: 'center',
    //               alignSelf: 'center',
    //               zIndex: 2,
    //             }}>
    //             {currentPageIndexList?.map((item, index) => (
    //               <TouchableOpacity
    //                 key={index}
    //                 activeOpacity={0.6}
    //                 hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    //                 style={{
    //                   width: 3 === index ? 20 : 8, // Elongate the dot
    //                   height: 8,
    //                   borderRadius: 4,
    //                   backgroundColor: 3 === index ? '#2F87FF' : '#1b1c1f',
    //                   borderWidth: 1,
    //                   borderColor: 3 === index ? '#2F87FF' : '#1b1c1f',
    //                   marginRight: 4,
    //                 }}
    //               />
    //             ))}
    //           </View>
    //         </ButtonSection></>
    //       }
    //     /></>
    //   </Container>}

    //   {currentPageIndex === 4 && <Container style={{ width: width }}>
    //     <ProgressSection>
    //     </ProgressSection>
    //     <><FlatList
    //       ref={_scrollViewRef3}
    //       scrollEnabled={true}
    //       scrollEventThrottle={16}
    //       data={[]}
    //       renderItem={() => null} // 실제로 렌더링할 항목이 없으므로 null 반환
    //       showsVerticalScrollIndicator={false}
    //       overScrollMode="never" // 이 줄을 추가하세요
    //       ListHeaderComponent={
    //         <>
    //           <IntroSection2 style={{ height: 'auto' }}>
    //             <View style={{ flexDirection: 'row', alignItems: 'left', marginBottom: 10 }}>
    //               <ProfileAvatar2 source={require('../../assets/images/Minjungum_Lee_consulting.png')}></ProfileAvatar2>
    //               <ProfileName>이민정음 세무사</ProfileName>
    //               <ConsultingTime>{selectedDate.getFullYear() + '년 ' + (selectedDate.getMonth() + 1) + '월 ' + selectedDate.getDate() + '일 ' + selectedList}</ConsultingTime>
    //             </View>
    //             <View style={{
    //               flexDirection: 'column', alignItems: 'left', borderBottomWidth: 1,
    //               borderBottomColor: '#E8EAED', borderTopWidth: 1,
    //               borderTopColor: '#E8EAED',
    //             }}>
    //               <Title style={{ marginBottom: 10, marginTop: 10 }}>상세 내용을 알려주세요.</Title>
    //               <SubTitle4>세금종류</SubTitle4>
    //               <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    //                 {ConsultingList.map((item, index) => (
    //                   <Tag
    //                     style={{
    //                       borderColor: taxTypeList.indexOf(item) < 0 ? '#E8EAED'
    //                         : item === '취득세'
    //                           ? '#2F87FF'
    //                           : item === '양도소득세'
    //                             ? '#2F87FF'
    //                             : item === '상속세'
    //                               ? '#2F87FF'
    //                               : item === '증여세'
    //                                 ? '#2F87FF'
    //                                 : '#E8EAED',
    //                       margin: 5
    //                     }}
    //                     //disabled={taxTypeList.indexOf(item) < 0}
    //                     active={taxTypeList.indexOf(item) > -1}
    //                     onPress={() => {
    //                       if (taxTypeList.indexOf(item) > -1) {
    //                         setTaxTypeList(
    //                           taxTypeList.filter(selectedItem => selectedItem !== item),
    //                         );
    //                       } else {
    //                         setTaxTypeList([...taxTypeList, item]);
    //                       }
    //                     }}
    //                     key={index}>
    //                     <TagText style={{
    //                       color: taxTypeList.indexOf(item) < 0 ? '#E8EAED'
    //                         : item === '취득세'
    //                           ? '#2F87FF'
    //                           : item === '양도소득세'
    //                             ? '#2F87FF'
    //                             : item === '상속세'
    //                               ? '#2F87FF'
    //                               : item === '증여세'
    //                                 ? '#2F87FF'
    //                                 : '#E8EAED'
    //                     }}>
    //                       {item}
    //                     </TagText>
    //                   </Tag>
    //                 ))}
    //               </View>
    //             </View>
    //             <View style={{
    //               borderBottomWidth: 1,
    //               borderBottomColor: '#E8EAED'
    //             }}>
    //               <SubTitle4 style={{ marginTop: 20, marginBottom: 20 }}>상세 내용</SubTitle4>
    //               <ConsultingItem>
    //                 <ScrollView keyboardShouldPersistTaps='always'>
    //                   <ConsultingInput
    //                     ref={input3}
    //                     autoFocus={currentPageIndex === 4}
    //                     multiline={true}
    //                     width={width}
    //                     placeholder="정확한 상담을 위해 사실 관계 및 문의사항을 자세하게 입력해주세요."
    //                     onChangeText={(input) => {
    //                       let byteCount = encodeURI(input).split(/%..|./).length - 1;
    //                       if (byteCount <= 1000) {
    //                         setText(input);
    //                       }
    //                     }}
    //                     value={text.slice(0, 1000)}
    //                     style={{ flexWrap: 'wrap' }}
    //                     blurOnSubmit={false}
    //                   />
    //                 </ScrollView>
    //               </ConsultingItem>
    //             </View>

    //             <View style={{
    //               borderBottomWidth: 1,
    //               borderBottomColor: '#E8EAED',
    //               marginBottom: 10,
    //               flexDirection: 'row',
    //               flexWrap: 'wrap',
    //             }}>
    //               <SubTitle4 style={{ marginTop: 20, marginBottom: 20 }}>세금 계산 결과</SubTitle4>
    //               <ButtonSection2 style={{
    //                 flex: 1,
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //                 justifyContent: 'flex-end',
    //                 width: '100%'
    //               }}>
    //                 <Button2 onPress={toggleExpand} style={{
    //                   borderWidth: 1, borderColor: '#E8EAED', backgroundColor: '#fff', width: 80, flexDirection: 'row',
    //                   alignItems: 'center',

    //                 }}>
    //                   <ButtonText style={{ color: '#717274', fontSize: 12, fontFamily: 'Pretendard-regular' }}> {isExpanded ? '접기' : '펼치기'}</ButtonText>
    //                   {!isExpanded ? <Bottompolygon style={{ marginLeft: 5, marginTop: 1 }} />
    //                     : <Bottompolygon style={{
    //                       marginLeft: 5,
    //                       marginTop: 1,
    //                       transform: [{ rotate: '180deg' }]
    //                     }} />}
    //                 </Button2>
    //               </ButtonSection2>
    //             </View>

    //             {isExpanded && (<>
    //               {!props?.route.params.IsGainTax ? <HouseInfo item={houseInfo} navigation={navigation} ChatType='AcquisitionChat' /> : <HouseInfo item={houseInfo} navigation={navigation} ChatType='GainsTaxChat' />}
    //               {!props?.route.params.IsGainTax ? <TaxCard navigation={navigation} Pdata={Pdata ? Pdata : null} /> : <TaxCard2 navigation={navigation} Pdata={Pdata ? Pdata : null} />}
    //               {!props?.route.params.IsGainTax ? <TaxInfoCard Pdata={Pdata ? Pdata : null} /> : <TaxInfoCard2 Pdata={Pdata ? Pdata : null} />}
    //             </>)
    //             }
    //             <SubTitle3>고객님께서 본인 인증하여 로드하거나 직접 입력하신 주택정보와{'\n'}아래 세금 계산 결과를 활용하여 세금 상담을 진행할 예정이에요.{'\n'}이에 동의하시나요?{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</SubTitle3>
    //           </IntroSection2>
    //         </>
    //       }
    //       ListFooterComponent={
    //         <>
    //           <ButtonSection2>
    //             <View
    //               style={{
    //                 alignItems: 'center', // align-items를 camelCase로 변경
    //                 flexDirection: 'row', // flex-direction을 camelCase로 변경
    //                 justifyContent: 'space-between', // justify-content를 camelCase로 변경 
    //               }}>
    //               <View style={{ width: '49%', marginRight: '1%' }}>
    //                 <Button
    //                   style={{
    //                     backgroundColor: '#fff',
    //                     color: '#1b1c1f',
    //                     width: '100%',
    //                     height: 50, // height 값을 숫자로 변경하고 단위 제거
    //                     alignItems: 'center', // align-items를 camelCase로 변경
    //                     justifyContent: 'center', // justify-content를 camelCase로 변경
    //                     borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
    //                     borderColor: '#E8EAED',
    //                   }}
    //                   width={width}
    //                   onPress={async () => {
    //                     const state = await NetInfo.fetch();
    //                     const canProceed = await handleNetInfoChange(state);
    //                     if (canProceed) {
    //                       setCurrentPageIndex(3);
    //                     }
    //                   }}>
    //                   <ButtonText style={{ color: '#717274' }}>이전으로</ButtonText>
    //                 </Button>
    //               </View>
    //               <ShadowContainer style={{ width: '49%', marginLeft: '1%' }}>
    //                 <Button
    //                   style={{
    //                     backgroundColor: text === '' ? '#E8EAED' : '#2F87FF',
    //                     color: text === '' ? '#1b1c1f' : '#FFFFFF',
    //                     width: '100%',
    //                     height: 50, // height 값을 숫자로 변경하고 단위 제거
    //                     alignItems: 'center', // align-items를 camelCase로 변경
    //                     justifyContent: 'center', // justify-content를 camelCase로 변경
    //                     borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
    //                     borderColor: '#E8EAED',
    //                   }}
    //                   disabled={!text}
    //                   active={text}
    //                   width={width}
    //                   onPress={async () => {
    //                     const state = await NetInfo.fetch();
    //                     const canProceed = await handleNetInfoChange(state);
    //                     if (canProceed) {
    //                       const result = await requestReservation();
    //                       if (result) {
    //                         navigation.goBack();
    //                       }
    //                     }
    //                   }}>
    //                   <ButtonText>동의 후 상담 예약하기</ButtonText>
    //                 </Button>
    //               </ShadowContainer>
    //             </View>
    //             <View
    //               style={{
    //                 marginTop: 5,
    //                 marginBottom: 15,
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 alignSelf: 'center',
    //                 zIndex: 2,
    //               }}>
    //               {currentPageIndexList?.map((item, index) => (
    //                 <TouchableOpacity
    //                   key={index}
    //                   activeOpacity={0.6}
    //                   hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    //                   style={{
    //                     width: 4 === index ? 20 : 8, // Elongate the dot
    //                     height: 8,
    //                     borderRadius: 4,
    //                     backgroundColor: 4 === index ? '#2F87FF' : '#1b1c1f',
    //                     borderWidth: 1,
    //                     borderColor: 4 === index ? '#2F87FF' : '#1b1c1f',
    //                     marginRight: 4,
    //                   }}
    //                 />
    //               ))}
    //             </View>
    //           </ButtonSection2></>}
    //     /></>
    //   </Container>}



    // </ScrollView>
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
  Line1: {
    height: 1, // 라인 두께
    backgroundColor: '#E8EaEd', // 파란색
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
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  secondContent: {
    marginTop: 20,
  },
  baseContent: {
    marginTop: 22,
  },
  bigTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    lineHeight: 24,
  },

  label: {
    fontSize: 17,
    marginBottom: 5,
    lineHeight:20,
    letterSpacing:-0.3,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  bigSubTitleLabel: {
    fontSize: 14,
    marginBottom: 30,
    color: '#a3a5a8',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
    lineHeight:20,
    textAlign: 'left',

  },
  subTitleLabel: {
    fontSize: 13,
    marginBottom: 10,
    color: '#717274',
    fontFamily: 'Pretendard-Medium', // 원하는 폰트 패밀리
    fontWeight: '500', // 폰트 두께 (400은 기본)
  },
  inputWrapper: {
    flexDirection: 'row', // TextInput과 Clear 버튼 가로 배치
    alignItems: 'center', // 세로 가운데 정렬
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 8, // TextInput과 "아이디 찾기" 버튼 사이 간격
  },

  inputAuthWrapper: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 8,
  },

  input: {
    flex: 1, // TextInput이 남은 공간을 차지하도록 설정
    color: '#000',
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    fontWeight: '400',
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
  authReSend: {
    fontSize: 13, // 폰트 크기
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
    color: '#717274',
    textDecorationLine: 'underline', // 밑줄 추가
    textDecorationColor: '#717274', // 밑줄 색상 설정
  },
  disabledButton: {
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 30,
  },

  loginButton: {
    backgroundColor: '#2F87ff',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 30,
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)

  },

  signUpText: {
    fontSize: 13,
    color: '#2F87FF',
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
    textDecorationLine: 'underline', // 밑줄 추가
    textDecorationColor: '#2F87FF', // 밑줄 색상 설정
  },
  resendWrapper: {
    flexDirection: 'row', // 가로 배치
    justifyContent: 'space-between', // 양 끝 정렬
    alignItems: 'center', // 세로 중앙 정렬
    marginTop: 5,
  },
  spaceBetween: {
    justifyContent: 'space-between', // 메시지와 버튼을 양 끝에 배치
  },
  flexEnd: {
    justifyContent: 'flex-end', // 버튼만 오른쪽 정렬
  },
  expiredText: {
    fontSize: 13,
    color: '#FF7401', // 빨간색 텍스트
    marginVertical: 5,
    fontFamily: 'Pretendard-Regular',
  },
  findIdButton: {
    alignSelf: 'flex-end', // 부모의 오른쪽 끝에 정렬
  },
});

export default Payment;
