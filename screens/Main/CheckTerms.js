
import { TouchableOpacity, useWindowDimensions, BackHandler, View,  StatusBar
} from 'react-native';
import React, { useLayoutEffect, useState, useCallback, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import styled from 'styled-components';
import HomeIcon from '../../assets/images/home_checkterms.svg';
import { SheetManager } from 'react-native-actions-sheet';
import DropShadow from 'react-native-drop-shadow';
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
  flex: 0.8;
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
  font-family: Pretendard-Bold;
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
   margin-top: 50px;
`;
const ListItem = styled.View`
  flex-direction: row; 
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
`;

const ListItemTitle = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 18px;
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
    margin-right: 10px;
`;

const ButtonSection = styled.View`
  padding: 0 20px;
  padding-top: 20px;
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
const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;


const CheckTerms = props => {
  const navigation = useNavigation()
  const { width, height } = useWindowDimensions()
  const dispatch = useDispatch();
  const { agreeAge, agreeCert, agreePrivacy, agreeMarketing } = useSelector(
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
    if (props?.route?.params?.LoginAcessType === 'SOCIAL') {
      dispatch(
        setCert({
          agreeCert: false,
          agreePrivacy: false,
          agreeThird: false,
          agreeAge: false,
          agreeLocation: false,
          agreeMarketing: false,
          agreeCopyright: false,
          agreeGov24: false
        }),
      );
      navigation.navigate('Login');

    } else {
      dispatch(
        setCert({
          agreeCert: false,
          agreePrivacy: false,
          agreeThird: false,
          agreeAge: false,
          agreeLocation: false,
          agreeMarketing: false,
          agreeCopyright: false,
          agreeGov24: false
        }),
      );
      navigation.goBack();

    }
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



  const handleSignUp = async (accessToken, agreeMarketing) => {
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // 요청 바디
    const data = {
      joinType: props?.route?.params?.LoginAcessType === 'SOCIAL' ? 'SOCIAL' : 'IDPASS',
      id: props?.route?.params?.LoginAcessType === 'SOCIAL' ? null : props?.route?.params?.id,
      password: props?.route?.params?.LoginAcessType === 'SOCIAL' ? null : props?.route?.params?.password,
      mktAgr: agreeMarketing,
    };
    console.log('data', data);
    try {
      const response = await axios.post(`${Config.APP_API_URL}user/signUp`, data, { headers: props?.route?.params?.LoginAcessType === 'SOCIAL' ? headers : null });
      console.log('response', response);
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
      // 상태 표시줄 설정 (전역 설정)
      StatusBar.setBarStyle('dark-content', true); // 아이콘 색상: 어두운 색
      StatusBar.setBackgroundColor('#ffffff'); // 배경색: 흰색 (안드로이드 전용)
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            if (props?.route?.params?.LoginAcessType === 'SOCIAL') {
              dispatch(
                setCert({
                  agreeCert: false,
                  agreePrivacy: false,
                  agreeThird: false,
                  agreeAge: false,
                  agreeLocation: false,
                  agreeMarketing: false,
                  agreeCopyright: false,
                  agreeGov24: false
                }),
              );
              navigation.navigate('Login');
            } else {
              dispatch(
                setCert({
                  agreeCert: false,
                  agreePrivacy: false,
                  agreeThird: false,
                  agreeAge: false,
                  agreeLocation: false,
                  agreeMarketing: false,
                  agreeCopyright: false,
                  agreeGov24: false
                }),
              );
              navigation.goBack();
            }

          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      title: '약관 확인하기',
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
       <ProgressSection>
       </ProgressSection>
      <IconView>
      <HomeIcon />
      </IconView>
      <IntroSection>
        <Title >약관을 확인해주세요.</Title>

        <SubTitle >원활한 하우택싱 서비스 이용을 위해 약관에 동의해주세요.</SubTitle>
      </IntroSection>
      {/* <TouchableOpacity
        style={{
          width: '100%',
          height: 1,
          backgroundColor: '#E8EAED',
          marginBottom: 20,
        }}
      /> */}

      {/* <ListItem>

        <ListItemTitle
          style={{
            fontSize: 16,
          }} >
          전체 동의하기
        </ListItemTitle>

        <CheckCircle onPress={() => {
          if (agreeAge && agreeCert && agreePrivacy && agreeMarketing) {
            dispatch(
              setCert({
                agreeAge: false,
                agreeCert: false,
                agreePrivacy: false,
                agreeMarketing: false,
              }),
            );
          } else {
            dispatch(
              setCert({
                agreeAge: true,
                agreeCert: true,
                agreePrivacy: true,
                agreeMarketing: true,
              }),
            );
          }
        }}>
          {agreeAge && agreeCert && agreePrivacy && agreeMarketing && <CheckOnIcon />}
        </CheckCircle>
      </ListItem>

      <TouchableOpacity
        style={{
          width: '100%',
          height: 1,
          backgroundColor: '#E8EAED',
          marginTop: 20,
        }}
      /> */}
      <ListItem style={{ marginTop: 0 }}>
        <ListItemTitle >
          [필수] 14세 이상입니다.
        </ListItemTitle>
        <CheckCircle
          onPress={() => {
            dispatch(
              setCert({
                agreeAge: !agreeAge,
                agreeCert,
                agreePrivacy,
                agreeMarketing,
              }),
            );
          }}>
          {agreeAge && <CheckOnIcon />}
        </CheckCircle>
      </ListItem>

      <ListItem style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <ListItemTitle>[필수] </ListItemTitle>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cert2', { agreeCert: agreeCert, navigation: navigation, tokens: props?.route?.params?.tokens ? props?.route?.params?.tokens : null, id: props?.route?.params?.id ? props?.route?.params?.id : null, password: props?.route?.params?.password ? props?.route?.params?.password : null });
            }} >
            <ListItemTitle style={{ color: '#2F87FF', textDecorationLine: 'underline' }}>하우택싱 서비스 이용약관</ListItemTitle>
          </TouchableOpacity>
          <ListItemTitle>에 대하여 동의하시나요?</ListItemTitle>
        </View>
        <CheckCircle
          onPress={() => {
            dispatch(
              setCert({
                agreeAge,
                agreeCert: !agreeCert,
                agreePrivacy,
                agreeMarketing,
              }),
            );
          }}>
          {agreeCert && <CheckOnIcon />}
        </CheckCircle>
      </ListItem>

      <ListItem style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <ListItemTitle>[필수] </ListItemTitle>
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
            dispatch(
              setCert({
                agreeAge,
                agreeCert,
                agreePrivacy: !agreePrivacy,
                agreeMarketing,
              }),
            );
          }}>
          {agreePrivacy && <CheckOnIcon />}
        </CheckCircle>
      </ListItem>

      {/*<ListItem style={{ marginTop: 10 }}>
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
      </ListItem>*/}

      <ListItem style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <ListItemTitle>[선택] </ListItemTitle>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Marketing2', { agreeMarketing: agreeMarketing, navigation: navigation, tokens: props?.route?.params?.tokens ? props?.route?.params?.tokens : null, id: props?.route?.params?.id ? props?.route?.params?.id : null, password: props?.route?.params?.password ? props?.route?.params?.password : null });
            }} >
            <ListItemTitle style={{ color: '#2F87FF', textDecorationLine: 'underline' }}>마케팅 정보 수신</ListItemTitle>
          </TouchableOpacity>
          <ListItemTitle>에 대하여 동의하시나요?</ListItemTitle>
        </View>
        <CheckCircle
          onPress={() => {
            dispatch(
              setCert({
                agreeAge,
                agreeCert,
                agreePrivacy,
                agreeMarketing: !agreeMarketing,
              }),
            );
          }}>
          {agreeMarketing && <CheckOnIcon />}
        </CheckCircle>
      </ListItem>

      <ButtonSection style={{ marginTop: 20 }}>
      <Button
            width={width}
            disabled={!(agreeCert && agreeAge && agreePrivacy)}
            onPress={async () => {
              navigation.push('PhoneAuthConfirmScreen', { prevSheet: 'CheckTerms', agreeMarketing: agreeMarketing,
                id: props?.route?.params?.id ? props?.route?.params?.id : null,
                password : props?.route?.params?.password ? props?.route?.params?.password : null,
                 accessToken: props?.route?.params?.accessToken ? props?.route?.params?.accessToken : null , authType : 'JOIN',
                 LoginAcessType : props?.route?.params?.LoginAcessType });

              // const state = await NetInfo.fetch();
              // const canProceed = await handleNetInfoChange(state);
              // if (canProceed) {
              //   console.log('props?.route?.params', props?.route?.params);
              //   if (props?.route?.params?.LoginAcessType === 'SOCIAL') {
              //     const Sighupresult = await handleSignUp(props?.route?.params?.tokens[0] ? props?.route?.params?.tokens[0] : null, agreeMarketing);
              //     console.log('Sighupresult', Sighupresult);
              //     if (Sighupresult) {

              //       const tokenObject = { 'accessToken': props?.route?.params?.tokens[0], 'refreshToken': props?.route?.params?.tokens[1] };
              //       //  console.log('Login tokenObject:', tokenObject);
              //       dispatch(setCurrentUser(tokenObject));
              //     }
              //   } else {
              //     const Sighupresult = await handleSignUp(null, agreeMarketing);
              //     console.log('Sighupresult', Sighupresult);
              //     if (Sighupresult) {

              //       navigation.navigate('PhoneAuthConfirmScreen', { prevSheet: 'CheckTerms', id: props?.route?.params?.id ? props?.route?.params?.id : null, password: props?.route?.params?.password ? props?.route?.params?.password : null });
              //     }
              //   }
              // }
            }
            }

            style={{
              width: width - 40,
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 50,
              backgroundColor:
                agreeCert && agreeAge && agreePrivacy
                  ? '#2F87FF'
                  : '#E8EAED',
            }}>
            <ButtonText >시작하기</ButtonText>
          </Button>
      </ButtonSection>
    </Container>
  );
};

export default CheckTerms;

