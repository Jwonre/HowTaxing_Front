// 공시가격 의미설명(?눌렀을 때)

import { View, useWindowDimensions, Pressable, BackHandler } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import { useNavigation } from '@react-navigation/native';
import MaskInput from 'react-native-mask-input';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { acquisitionTax, gainTax } from '../../data/chatData';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setCert } from '../../redux/certSlice';
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

const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
`;

const ModalDescription = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 26px;
  margin-top: 10px;
  text-align: center;
`;

const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
`;

const CheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #fff;
  border: 1px solid #cfd1d5;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const ListItemTitle = styled.Text`
  flex: 1;
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const ListItemButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))``;

const ListItemButtonText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
  text-decoration-line: underline;
  text-decoration-color: #717274;
`;

const CertLogoImage = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 28px;
  height: 20px;
  align-self: center;
  margin-bottom: 10px;
`;

const ModalInputContainer = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  padding: 0 20px;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
}))`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  margin-top: 10px;
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;

const RegisterNumberInput = styled(MaskInput).attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  placeholder: '주민등록번호를 입력해주세요',
  autoCapitalize: 'none',
  autoCorrect: false,
  keyboardType: 'number-pad',
  maxLength: 14,
}))`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  margin-top: 10px;
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
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

const AreaMeterDef = props => {
  const actionSheetRef = useRef(null);
  const cert = props.payload.data;
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const houseInfo = useSelector(state => state.houseInfo.value);

  const { certType, agreeCert, agreePrivacy, agreeThird } = useSelector(
    state => state.cert.value,
  );
  useEffect(() => {
    if (cert) {
      dispatch(
        setCert({
          certType: cert,
        }),
      );
    }
  }, [cert]);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [residentNumber, setResidentNumber] = useState('');
  const chatDataList = useSelector(state => state.chatDataList.value);
  const dispatch = useDispatch();

  const rlno_mask = [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    residentNumber[7] ? '*' : null,
    residentNumber[8] ? '*' : null,
    residentNumber[9] ? '*' : null,
    residentNumber[10] ? '*' : null,
    residentNumber[11] ? '*' : null,
    residentNumber[12] ? '*' : null,
    '*',
  ];

  const postOwnHouse = async () => {
    const url = `${Config.APP_API_URL}house/list`;

    const data = {
      certAuthor: certType === 'KB' ? '1' : certType === 'naver' ? '2' : '3',
      name,
      phone,
      id,
      password,
      rlno: residentNumber,
    };

    try {
      const response = await axios.post(url, data);

      const { list } = response.data.data.data;
      dispatch(setOwnHouseList(list));
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg,
        errorMessage: error?.errCode,
        buttontext: '확인하기',
      });
      ////console.log(error);
    }
  };

  const nextHandler = async () => {
    if (chatDataList.find(el => el.id === 'over12')) {
      // 실거주기간 가져와야함

      actionSheetRef.current?.hide();

      const chat1 = gainTax.find(el => el.id === 'real');
      const chat2 = {
        id: 'year',
        type: 'my',
        progress: 7,
        message: '2년 10개월',
      };
      const chat3 = gainTax.find(el => el.id === 'getInfoDone');
      const chat4 = gainTax.find(el => el.id === 'getInfoConfirm');

      dispatch(
        setHouseInfo({
          ...houseInfo,
          livePeriod: '2년 10개월',
        }),
      );

      dispatch(setChatDataList([...chatDataList, chat1, chat2, chat3, chat4]));

      // 인증 데이터 초기화
      dispatch({
        setCert: {
          certType: null,
          agreeCert: false,
          agreePrivacy: false,
          agreeThird: false,
        },
      });

      return;
    }

    postOwnHouse();
    actionSheetRef.current?.hide();
    const { isGainsTax } = props.payload;
    const chatItem = isGainsTax
      ? gainTax.find(el => el.id === 'allHouse1')
      : acquisitionTax.find(el => el.id === 'moment1');
   // ////console.log(chatItem);

    dispatch(setChatDataList([...chatDataList, chatItem]));
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
      statusBarTranslucent
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: currentPageIndex === 0 ? 500 : 560,
        width: width - 40,
      }}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {currentPageIndex === 0 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <ModalTitle>본인인증을 진행해주세요</ModalTitle>
              <ModalDescription>
                전자증명서 이용을 위해{'\n'}서비스 약관에 동의해주세요
              </ModalDescription>
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    if (agreeCert && agreePrivacy && agreeThird) {
                      dispatch(
                        setCert({
                          certType,
                          agreeCert: false,
                          agreePrivacy: false,
                          agreeThird: false,
                        }),
                      );
                    } else {
                      dispatch(
                        setCert({
                          certType,
                          agreeCert: true,
                          agreePrivacy: true,
                          agreeThird: true,
                        }),
                      );
                    }
                  }}>
                  {agreeCert && agreePrivacy && agreeThird && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle
                  style={{
                    fontSize: 15,
                    fontFamily: 'Pretendard-Medium',
                  }}>
                  전체 동의하기
                </ListItemTitle>
              </ListItem>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#E8EAED',
                  marginTop: 20,
                }}
              />
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        certType,
                        agreePrivacy,
                        agreeThird,
                        agreeCert: !agreeCert,
                      }),
                    );
                  }}>
                  {agreeCert && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle>
                  [필수] 전자증명서 서비스 이용 약관
                </ListItemTitle>
                <ListItemButton
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    navigation.navigate('Cert', {
                      cert: certType,
                      isGainsTax: props.payload.isGainsTax,
                    });
                  }}>
                  <ListItemButtonText>보기</ListItemButtonText>
                </ListItemButton>
              </ListItem>
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        certType,
                        agreeCert,
                        agreeThird,
                        agreePrivacy: !agreePrivacy,
                      }),
                    );
                  }}>
                  {agreePrivacy && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle>[필수] 개인정보 수집 및 이용 동의</ListItemTitle>
                <ListItemButton
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    navigation.navigate('Privacy', {
                      cert: certType,
                      isGainsTax: props.payload.isGainsTax,
                    });
                  }}>
                  <ListItemButtonText>보기</ListItemButtonText>
                </ListItemButton>
              </ListItem>
              <ListItem style={{ marginTop: 20 }}>
                <CheckCircle
                  onPress={() => {
                    dispatch(
                      setCert({
                        certType,
                        agreeCert,
                        agreePrivacy,
                        agreeThird: !agreeThird,
                      }),
                    );
                  }}>
                  {agreeThird && <CheckOnIcon />}
                </CheckCircle>
                <ListItemTitle>
                  [필수]{' '}
                  {certType === 'KB'
                    ? 'KB'
                    : certType === 'naver'
                      ? '네이버'
                      : '토스'}{' '}
                  개인정보 제3자 제공 동의
                </ListItemTitle>
                <ListItemButton
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    navigation.navigate('Third', {
                      cert: certType,
                      isGainsTax: props.payload.isGainsTax,
                    });
                  }}>
                  <ListItemButtonText>보기</ListItemButtonText>
                </ListItemButton>
              </ListItem>
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
                  disabled={!(agreeCert && agreePrivacy && agreeThird)}
                  onPress={() => {
                    if (certType === 'KB') {
                      setCurrentPageIndex(1);
                    } else if (certType === 'naver') {
                      setCurrentPageIndex(2);
                    } else {
                      setCurrentPageIndex(3);
                    }
                  }}
                  style={{
                    width: width - 80,
                    alignSelf: 'center',
                    marginTop: 20,
                    marginBottom: 50,
                    backgroundColor:
                      agreeCert && agreePrivacy && agreeThird
                        ? '#2F87FF'
                        : '#E8EAED',
                  }}>
                  <ModalButtonText
                    style={{
                      color:
                        agreeCert && agreePrivacy && agreeThird
                          ? '#fff'
                          : '#717274',
                    }}>
                    동의 후 인증하기
                  </ModalButtonText>
                </ModalButton>
              </DropShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 1 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/kb_logo.png')}
              />
              <ModalTitle>KB 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput
                  placeholder="이름"
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  autoFoucs
                  autoCompleteType="name"
                  autoCapitalize="none"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked) => {
                    setResidentNumber(masked);
                  }}
                  mask={rlno_mask}
                />
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler}>
                  <ButtonText>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 2 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/naver_logo.png')}
              />
              <ModalTitle>네이버 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>아이디</ModalLabel>
                <ModalInput
                  placeholder="아이디"
                  value={id}
                  autoFoucs
                  onChangeText={setId}
                  maxLength={30}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>비밀번호</ModalLabel>
                <ModalInput
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  maxLength={40}
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked) => {
                    setResidentNumber(masked);
                  }}
                  mask={rlno_mask}
                />
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler}>
                  <ButtonText>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
        {currentPageIndex === 3 && (
          <SheetContainer width={width}>
            <ModalInputSection>
              <CertLogoImage
                source={require('../../assets/images/certLogo/toss_logo.png')}
              />
              <ModalTitle>토스 간편 인증 정보 입력</ModalTitle>
              <ModalDescription
                style={{
                  lineHeight: 20,
                }}>
                인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
                입력해주세요
              </ModalDescription>
              <ModalInputContainer>
                <ModalLabel>이름</ModalLabel>
                <ModalInput placeholder="이름" />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>휴대폰 번호</ModalLabel>
                <ModalInput
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  keyboardType="number-pad"
                  autoCompleteType="tel"
                />
              </ModalInputContainer>
              <ModalInputContainer>
                <ModalLabel>주민등록번호</ModalLabel>
                <RegisterNumberInput
                  value={residentNumber}
                  onChangeText={(masked, unmasked) => {
                    setResidentNumber(masked);
                  }}
                  mask={rlno_mask}
                />
              </ModalInputContainer>
            </ModalInputSection>

            <ButtonSection>
              <ButtonShadow
                style={{
                  shadowColor: '#fff',
                }}>
                <Button
                  onPress={() => {
                    setCurrentPageIndex(0);
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
                <Button onPress={nextHandler}>
                  <ButtonText>다음으로</ButtonText>
                </Button>
              </ButtonShadow>
            </ButtonSection>
          </SheetContainer>
        )}
      </KeyboardAwareScrollView>
    </ActionSheet>
  );
};

export default AreaMeterDef;
