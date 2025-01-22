// 양도소득세 홈페이지

import { TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, BackHandler, View, ScrollView, Keyboard, Dimensions } from 'react-native';
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
import RefundReport from '../../assets/images/refund_report.svg';
import RefundHome from '../../assets/images/refund_home.svg';
import RefundCall from '../../assets/images/refund_call.svg';
import { setCert } from '../../redux/certSlice';


const Container = styled.View`
  flex: 1.0;
  background-color: #FFF;
`;

const IntroSection = styled.View`
  width: 100%;
  height: 44%;
`;

const IntroSection2 = styled.View`
  width: 100%;
  padding: 20px;
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
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;


const Title = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 28px;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 25px;
  margin-top: 10px;
`;

const RefundImage = styled.View`
  width: 300px;
  height: 155px;
  background-color: #FFF;
  align-self: center;
  margin-top: 55%;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  padding: 0 20px;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  bottom: 10px;
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



const GainTaxRefund = props => {
  const _scrollViewRef = useRef(null);
  // const data = [{ key: 'dummy' }]; // FlatList에 필요한 데이터
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPageIndexList = [0, 1, 2];
  const currentUser = useSelector(state => state.currentUser.value);
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const input2 = useRef(null);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedList, setSelectedList] = useState([]);
  const [text, setText] = useState('');
  const [dataList, setDataList] = useState([]);

  const handleBackPress = () => {
    if (currentPageIndex === 0 || currentPageIndex === 2) {
      SheetManager.show('InfoRefundingCancel', {
        payload: {
          type: 'info',
          message: '양도소득세 환급 조회를\n다음에 하시겠어요?',
          onPress: { handlePress },
        },
      });
    } else {
      Keyboard.dismiss();
      setCurrentPageIndex(currentPageIndex - 1);
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
    const focusInput = () => {
      if (currentPageIndex === 2 && input2.current) {
        input2.current.focus();
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


  useEffect(() => {
    dispatch(setAdBanner(false));
  }, []);


  const refundApply = async () => {
    const accessToken = currentUser.accessToken;
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // 요청 바디;
    const data = {
      customerPhone: phone ? phone.replace(/[^0-9]/g, '') : '',
      isRefundAvailable: true,
    };
    console.log('data', data);

    try {
      const response = await axios.post(`${Config.APP_API_URL}refund/apply`, data, { headers: headers });
      console.log('response', response);
      if (response.data.errYn === 'Y') {
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '양도소득세 환급액 조회 중 오류가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            buttontext: '확인하기',
          },
        });
      } else {
        if (response.data.data) {
          await SheetManager.show('InfoRefunding', {
            payload: {
              message: '양도소득세 환급액 조회 신청이 완료되었어요.',
              description: '입력해주신 전화번호로\n빠른 시간 안에 세무사님이 연락드릴 예정이에요.',
              buttontext: '처음으로 돌아가기',
            },
          });
          navigation.goBack();
        } 
      }
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ? error?.errMsg : '양도소득세 환급액 조회 중 오류가 발생했어요.',
        errorMessage: error?.errCode ? error?.errCode : 'error',
        buttontext: '확인하기',
      });
      console.error(error ? error : 'error');
    }
  };

  const handlePress = buttonIndex => {
    if (buttonIndex === 'YES') {
      navigation.goBack();
    }
  };



  useLayoutEffect(() => {
    navigation.setOptions({

      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            if (currentPageIndex === 0 || currentPageIndex === 2) {
              SheetManager.show('InfoRefundingCancel', {
                payload: {
                  type: 'info',
                  message: '양도소득세 환급 조회를\n다음에 하시겠어요?',
                  onPress: { handlePress },
                },
              });
            } else {
              Keyboard.dismiss();
              setCurrentPageIndex(currentPageIndex - 1);
            }

          }}>
          {currentPageIndex === 0 || currentPageIndex === 2 ? <CloseIcon /> : <BackIcon />}
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '양도소득세 환급액 조회하기',
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
    <ScrollView
      ref={_scrollViewRef}
      pagingEnabled
      style={{
        width: width,
      }}
      horizontal
      keyboardShouldPersistTaps='always'
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      scrollEventThrottle={16}>

      <Container style={{ width: width, height: height * 0.92 }}>
        <ProgressSection>
        </ProgressSection>
        <><IntroSection2 style={{ width: width }}>
          <Title>양도소득세 납부 시,{'\n'}중과세 적용을 받으신 적이 있으신가요?</Title>

        </IntroSection2>
          <ModalInputSection>
            <RefundImage style={{ alignItems: 'center' }}>
              <RefundReport />
            </RefundImage>
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
                      navigation.goBack();
                    }
                  }}>
                  <ButtonText style={{ color: '#717274' }}>아니오</ButtonText>
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
                    backgroundColor: '#2F87FF',
                    color: '#FFFFFF',
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
                  <ButtonText >네</ButtonText>
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

      </Container>

      <Container style={{ width: width, height: height * 0.92 }}>
        <ProgressSection>
        </ProgressSection>
        <><IntroSection2 style={{ width: width }}>
          <Title>해당 양도 주택의 취득 시기가{'\n'}2009년 3월 16일부터{'\n'}2012년 12월 31일 사이인가요?</Title>
          <SubTitle>만약 기억이 나지 않으시면 '네'라고 눌러주세요.{'\n'}직접 상담해드릴게요.</SubTitle>
        </IntroSection2>
          <ModalInputSection>
            <RefundImage style={{ marginTop: '35%', alignItems: 'center' }}>
              <RefundHome />
            </RefundImage>
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
                      navigation.goBack();
                    }
                  }}>
                  <ButtonText style={{ color: '#717274' }}>아니오</ButtonText>
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
                    backgroundColor: '#2F87FF',
                    color: '#FFFFFF',
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
                  <ButtonText >네</ButtonText>
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

      </Container>

      <Container style={{ width: width, height: height * 0.92 }}>
        <ProgressSection>
        </ProgressSection>
        <><IntroSection2 style={{ width: width }}>
          <Title>양도소득세 환급대상이에요!{'\n\n'}전화번호를 남겨주시면 빠른 시간 안에 연락드릴게요!</Title>
          <SubTitle style={{ fontSize: 13 }}>세무사님께서 고객님에게 직접 연락을 드릴 예정이예요.</SubTitle>
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
                      refundApply();
                      Keyboard.dismiss();
                    }
                  }
                }}
              />
            </ModalInputContainer>
            <RefundImage style={{ marginTop: '20%', alignItems: 'center' }}>
              <RefundCall />
            </RefundImage>
          </ModalInputSection>
          <ButtonSection>
            <View
              style={{
                alignItems: 'center', // align-items를 camelCase로 변경
              }}>
              <ShadowContainer style={{
                width: '100%', marginLeft: '1%', shadowColor: 'rgba(0,0,0,0.25)',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 2,
              }}>
                <Button
                  style={{
                    backgroundColor: phone.length < 13 ? '#E8EAED' : '#2F87FF',
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
                        refundApply();
                        Keyboard.dismiss();
                      }
                    }
                  }}>
                  <ButtonText >요청하기</ButtonText>
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

      </Container>




    </ScrollView >
  );
};

export default GainTaxRefund;
