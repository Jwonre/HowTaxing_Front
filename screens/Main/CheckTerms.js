
import { TouchableOpacity, useWindowDimensions, BackHandler } from 'react-native';
import React, { useLayoutEffect, useState, useCallback, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import styled from 'styled-components';
import HomeIcon from '../../assets/images/home_checkterms.svg';
import FastImage from 'react-native-fast-image';
import { SheetManager } from 'react-native-actions-sheet';
import DropShadow from 'react-native-drop-shadow';
import getFontSize from '../../utils/getFontSize';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { setCurrentUser } from '../../redux/currentUserSlice';
import axios from 'axios';
import { setCert } from '../../redux/certSlice';
import Config from 'react-native-config'

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const IntroSection = styled.View`
  flex: 0.6;
  width: 100%;
  padding: 25px;
  justify-content: flex-end;
`;

const Tag = styled.View`
  width: 68px;
  height: 26px;
  background-color: #fff;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  border: 1px solid #FF7401;
`;

const TagText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #FF7401;
  line-height: 16px;
  letter-spacing: -0.5px;
`;

const Title = styled.Text`
  font-size: 25px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  margin-bottom: 10px;
  margin-top: 20px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 20px;
  margin-top: 6px;
`;

const IconView = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 25px;
  border: 1px solid #e8eaed;
`;
const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
`;

const ListItemTitle = styled.Text`
  flex: 1;
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 18px;
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
const ListItemButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))``;

const ListItemButtonText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 15px;
  text-decoration-line: underline;
  text-decoration-color: #717274;
`;

const ButtonSection = styled.View`
  flex: 0.3;
  padding: 0 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 100%;
  height: 60px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  overflow: visible;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;


const CheckTerms = props => {
  const navigation = useNavigation()
  const { width, height } = useWindowDimensions()
  const dispatch = useDispatch();
  const { agreeAge, agreeCert, agreePrivacy, agreeMarketing, agreeLocation } = useSelector(
    state => state.cert.value,
  );
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
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



  const handleBackPress = () => {
    navigation.navigate('Login');
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [handleBackPress])
  );



  const handleSignUp = async (accessToken, handleSignUpagreeMarketing) => {
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // 요청 바디
    const data = {
      mktAgr: handleSignUpagreeMarketing,
    };

    try {

      const response = await axios.post(`${Config.APP_API_URL}user/signUp`, data, { headers: headers });

      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            message: response.data.errMsg ? response.data.errMsg : '회원가입 도중에 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            buttontext: '확인하기',
          },
        });
        return false;
      } else {
        /* SheetManager.show('info', {
           payload: {
             type: 'info',
             message: '회원가입에 성공했습니다.',
           },
         });*/
        // 성공적인 응답 처리
        // const { id } = response.data;
        //    ////console.log("1111111", response);
        return true;
      }
    } catch (error) {
      // 오류 처리
      SheetManager.show('info', {
        payload: {
          message: '회원가입에 실패했습니다.',
          description: error?.message,
          type: 'error',
          buttontext: '확인하기',
        }
      });
      console.error(error);
      return false;
    }
  };






  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      title: '',
      headerShadowVisible: false,
      contentStyle: {
        borderTopWidth: 0,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
      },
    });
  }, []);

  return (
    <Container>
      <IconView>
        <HomeIcon />
      </IconView>
      <IntroSection>
        <Tag>
          <TagText >하우택싱</TagText>
        </Tag>
        <Title >약관을 확인해주세요.</Title>

        <SubTitle >원활한 하우택싱 서비스 이용을 위해{'\n'}약관에 동의해주세요.</SubTitle>
      </IntroSection>
      <ListItem>
        <CheckCircle onPress={() => {
          if (agreeAge && agreeCert && agreePrivacy && agreeLocation && agreeMarketing) {
            dispatch(
              setCert({
                agreeAge: false,
                agreeCert: false,
                agreePrivacy: false,
                agreeLocation: false,
                agreeMarketing: false,
              }),
            );
          } else {
            dispatch(
              setCert({
                agreeAge: true,
                agreeCert: true,
                agreePrivacy: true,
                agreeLocation: true,
                agreeMarketing: true,
              }),
            );
          }
        }}>
          {agreeAge && agreeCert && agreePrivacy && agreeLocation && agreeMarketing && <CheckOnIcon />}
        </CheckCircle>
        <ListItemTitle
          style={{
            fontSize: 15,
            fontFamily: 'Pretendard-Medium',
          }} >
          전체 동의하기
        </ListItemTitle>
      </ListItem>
      <TouchableOpacity
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
                agreeAge: !agreeAge,
                agreeCert,
                agreePrivacy,
                agreeLocation,
                agreeMarketing,
              }),
            );
          }}>
          {agreeAge && <CheckOnIcon />}
        </CheckCircle>
        <ListItemTitle >
          [필수] 14세 이상입니다.
        </ListItemTitle>
      </ListItem>

      <ListItem style={{ marginTop: 10 }}>
        <CheckCircle
          onPress={() => {
            dispatch(
              setCert({
                agreeAge,
                agreeCert: !agreeCert,
                agreePrivacy,
                agreeLocation,
                agreeMarketing,
              }),
            );
          }}>
          {agreeCert && <CheckOnIcon />}
        </CheckCircle>
        <ListItemTitle >
          [필수] 하우택싱 서비스 이용약관
        </ListItemTitle>
        <ListItemButton
          onPress={() => {
            //    ////console.log('agreeCert', agreeCert)
            navigation.navigate('Cert2', { agreeCert: agreeCert, navigation: navigation, tokens: props?.route?.params?.tokens },);
          }}>
          <ListItemButtonText >보기</ListItemButtonText>
        </ListItemButton>
      </ListItem>

      <ListItem style={{ marginTop: 10 }}>
        <CheckCircle
          onPress={() => {
            dispatch(
              setCert({
                agreeAge,
                agreeCert,
                agreePrivacy: !agreePrivacy,
                agreeLocation,
                agreeMarketing,
              }),
            );
          }}>
          {agreePrivacy && <CheckOnIcon />}
        </CheckCircle>
        <ListItemTitle >
          [필수] 개인정보 수집 및 이용 동의 
        </ListItemTitle>
        <ListItemButton
          onPress={() => {
            navigation.navigate('Privacy2', { agreePrivacy: agreePrivacy, navigation: navigation, tokens: props?.route?.params?.tokens });
          }}>
          <ListItemButtonText >보기</ListItemButtonText>
        </ListItemButton>
      </ListItem>

      <ListItem style={{ marginTop: 10 }}>
        <CheckCircle
          onPress={() => {
            dispatch(
              setCert({
                agreeAge,
                agreeCert,
                agreePrivacy,
                agreeLocation: !agreeLocation,
                agreeMarketing,
              }),
            );
          }}>
          {agreeLocation && <CheckOnIcon />}
        </CheckCircle>
        <ListItemTitle >
          [필수] 위치정보 이용약관
        </ListItemTitle>
        <ListItemButton
          onPress={() => {
            navigation.navigate('Location2', { agreeLocation: agreeLocation, navigation: navigation, tokens: props?.route?.params?.tokens });

          }}>
          <ListItemButtonText >보기</ListItemButtonText>
        </ListItemButton>
      </ListItem>

      <ListItem style={{ marginTop: 10 }}>
        <CheckCircle
          onPress={() => {
            dispatch(
              setCert({
                agreeAge,
                agreeCert,
                agreePrivacy,
                agreeLocation,
                agreeMarketing: !agreeMarketing,
              }),
            );
          }}>
          {agreeMarketing && <CheckOnIcon />}
        </CheckCircle>
        <ListItemTitle >
          [선택] 마케팅 및 프로모션 수신동의
        </ListItemTitle>

      </ListItem>
      <ListItem style={{ marginTop: 50 }}>

      </ListItem>
      <ButtonSection style={{ marginTop: 20 }}>
        <ShadowContainer>
          <Button
            width={width}
            disabled={!(agreeCert && agreeAge && agreePrivacy && agreeLocation)}
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
               // console.log('props.tokens', props?.route?.params?.tokens);
                const Sighupresult = await handleSignUp(props?.route?.params?.tokens[0], agreeMarketing);
                if (Sighupresult) {
                  const tokenObject = { 'accessToken': props?.route?.params?.[tokens0], 'refreshToken': props?.route?.params?.tokens[1] };
                //  console.log('Login tokenObject:', tokenObject);
                  dispatch(setCurrentUser(tokenObject));

                } else {
                  SheetManager.show('info', {
                    payload: {
                      message: '로그인에 실패했습니다.',
                      type: 'error',
                      buttontext: '확인하기',
                    }
                  });
                }
              }
            }
            }

            style={{
              width: width - 40,
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 50,
              backgroundColor:
                agreeCert && agreeAge && agreePrivacy && agreeLocation
                  ? '#2F87FF'
                  : '#E8EAED',
            }}>
            <ButtonText >시작하기</ButtonText>
          </Button>
        </ShadowContainer>
      </ButtonSection>
    </Container>
  );
};

export default CheckTerms;

