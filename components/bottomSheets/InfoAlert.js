// 정보 또는 경고 알림창 컴포넌트

import { useWindowDimensions, Pressable, ActivityIndicator, ScrollView, Linking } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import InfoCircleIcon from '../../assets/icons/info_circle.svg';
import { setCurrentUser } from '../../redux/currentUserSlice';
import { View } from 'react-native-animatable';



const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  width: 80%;
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
  margin-top: 20px;
  margin-Bottom: 15px;
`;

const ModalDescription = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 15px;
  text-align: left;
  padding: 20px;
  background-color: #F5F7FA;
  border-radius: 5px;
  border-color: #F5F7FA;
  border-width: 60px;

`;

const ModalContentSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const KakaoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #fbe54d;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const KakaoButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #3b1f1e;
  line-height: 20px;
`;

const SocialButtonIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 22px;
  height: 20px;
  margin-right: 16px;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  paddingLeft: 5%;
  paddingRight: 5%;
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


const InfoAlert = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonText, setButtonText] = useState('자세히');

  //////console.log('[InfoAlert] props', props);

  const toggleText = () => {
    if (buttonText === '자세히') {
      setButtonText('간단히');
      setErrorMessage(props?.payload?.description); // 에러 메시지 설정
    } else {
      setButtonText('자세히');
      setErrorMessage(''); // 에러 메시지 제거
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
              if (props?.payload?.closemodal === true) {
                props?.payload?.actionSheetRef.current?.hide();
              } else if (props?.payload?.closeSheet === true) {
                props?.payload?.navigation.goBack();
              }


            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnPressBack={true}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: errorMessage ? props.payload?.prevSheet !== 'Login_ID' ? 490 : 420 : props?.payload?.type === 'error' ? props.payload?.prevSheet !== 'Login_ID' ? 370 : 300 : 270,
        width: width - 40
      }}>
      <SheetContainer width={width}>
        <ModalContentSection>
          <InfoCircleIcon
            style={{
              color: props?.payload?.type === 'error' ? '#FF7401' : '#2F87FF',
            }}
          />
          <ModalTitle >{props?.payload?.message}</ModalTitle>
          {errorMessage && <ScrollView style={{ marginHorizontal: 20, maxHeight: 120 }}
            showsVerticalScrollIndicator={false}><ModalDescription >{errorMessage}</ModalDescription></ScrollView>}
        </ModalContentSection>


        <ButtonSection>
          {(props?.payload?.type == 'info' || props?.payload?.type == 'error') && (<View
            style={{
              width: '100%',
              flexDirection: 'column',
              alignContent: 'center'
            }}
          >
            {(props?.payload?.type == 'error' && props.payload?.prevSheet !== 'Login_ID') &&
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <KakaoButton
                  onPress={() => Linking.openURL('http://pf.kakao.com/_sxdxdxgG')}>
                  <SocialButtonIcon
                    source={require('../../assets/images/socialIcon/kakao_ico.png')}
                  />
                  <KakaoButtonText >카카오톡으로 문의하기</KakaoButtonText>
                </KakaoButton>
              </View>}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: 10,
              }}
            >
              {(props?.payload?.type === 'error' && props?.payload?.description) && (
                <Button
                  onPress={() => {
                    toggleText();
                  }}
                  style={{
                    width: '49%',
                    backgroundColor: '#fff',
                    borderColor: '#E8EAED',
                    marginRight: '2%'
                  }}
                >
                  <ButtonText

                    style={{
                      color: '#717274',
                    }}
                  >
                    {buttonText}
                  </ButtonText>
                </Button>

              )}



              <DropShadow
                style={{
                  shadowColor: 'rgba(0,0,0,0.25)',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                  alignSelf: 'center',
                  width: props?.payload?.type === 'error' && props?.payload?.description ? '49%' : '100%',
                }}>
                <Button
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    if (props?.payload?.closemodal === true) {
                      props?.payload?.actionSheetRef.current?.hide();
                    } else if (props?.payload?.closeSheet === true) {
                      props?.payload?.navigation.goBack();
                    }
                  }}>
                  <ButtonText >{props?.payload?.buttontext ? props?.payload?.buttontext : '확인하기'}</ButtonText>
                </Button>
              </DropShadow>

            </View>

          </View>)}
          {(props?.payload?.type == 'backHome') &&
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center'
              }}
            >
              <DropShadow
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignSelf: 'center',
                  width: 130,
                  marginRight: 10,

                }}>
                <Button
                  onPress={() => {
                    // ////console.log(modalList);
                    actionSheetRef.current?.hide();

                  }}
                  style={{ backgroundColor: '#fff', borderColor: '#E8EAED' }}>
                  <ButtonText style={{ color: '#717274' }}>아니오</ButtonText>
                </Button>
              </DropShadow>
              <DropShadow
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  shadowColor: 'rgba(0,0,0,0.25)',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                  alignSelf: 'center',
                  width: 130,

                }}>
                <Button
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    props?.payload?.navigation.navigate('Home');
                  }}>
                  <ButtonText >네</ButtonText>
                </Button>
              </DropShadow>
            </View>}
        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default InfoAlert;
