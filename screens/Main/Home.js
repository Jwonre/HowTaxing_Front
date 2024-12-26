// 홈 페이지

import { useWindowDimensions, StatusBar, StyleSheet, BackHandler, Linking, AppState } from 'react-native';
import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import HomeIcon from '../../assets/images/home_home.svg';
import SignTagIcon from '../../assets/images/home_signtag.svg';
import ConSultingIcon from '../../assets/images/home_consulting.svg';
import getFontSize from '../../utils/getFontSize';
import { SheetManager } from 'react-native-actions-sheet';
import ChanelTalkIcon from '../../assets/icons/chaneltalk.svg';
import AppInformationIcon from '../../assets/icons/appinformaion_circle.svg'
import { ChannelIO } from 'react-native-channel-plugin';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { setCert } from '../../redux/certSlice';
import { setCurrentUser } from '../../redux/currentUserSlice';
import Config from 'react-native-config'
import { setResend } from '../../redux/resendSlice';
import axios from 'axios';
import { setAddHouseList } from '../../redux/addHouseListSlice';
import { setFixHouseList } from '../../redux/fixHouseListSlice';
import { setAdBanner } from '../../redux/adBannerSlice';
import { setStartPage } from '../../redux/startPageSlice.js';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const HelloSection = styled.View`
  flex: 0.5;
  padding: 25px 25px 0px 25px;
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 50px;
`;

const HelloText = styled.Text`
  font-size: 19px;
  font-family: Pretendard-Bold;
  color: #222;
  letter-spacing: -0.5px;
  line-height: 30px;
`;

const MessageTitle = styled.Text`
  font-size: 22px;
  font-family: Pretendard-Bold;
  color: #222;
  letter-spacing: -0.5px;
  line-height: 34px;
`;

const Card = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: ${props => props.width - 40}px;
  height: auto;
  background-color: #fff;
  border-radius: 12px;
  margin: 8px;
  padding: 25px;
  justify-content: center;
  align-self: center;
`;

const Tag = styled.View`
  width: 57px;
  height: 22px;
  padding: 0 10px;
  background-color: #2f87ff;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
`;

const TagText = styled.Text`
  font-size: 9px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;

const CardTitle = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 8px;
  margin-top: 10px;
`;

const HashTagGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
`;

const HashTagText = styled.Text`
  font-size: 11px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-right: 9px;
  margin-top: 5px;
`;

const IconView = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 25px;
  right: 25px;
  border: 1px solid #e8eaed;
`;

const AppInformationIconFloatContainer = styled.View`
  position: absolute;
  bottom: 25px;
  right: 25px;

`;


const AppInformationIconFloatButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 55px;
  height: 55px;
  border-radius: 30px;
  
`;


const ChanelTalkIconFloatContainer = styled.View`
  position: absolute;
  bottom: 25px;
  right: 100px;

`;

const ChanelTalkIconFloatButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 55px;
  height: 55px;
  border-radius: 30px;
  
`;




const ShadowContainer = styled(DropShadow)`
  shadow-color: #ececef;
  shadow-offset: 0px 9px;
  shadow-opacity: 1;
  shadow-radius: 6px;
`;


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const Home = () => {
  const currentUser = useSelector(state => state.currentUser.value);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [backPressCount, setBackPressCount] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [hasExited, setHasExited] = useState(false);
  const startLaunch = useSelector(state => state.startPage.value);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const checkExitFlag = async () => {
      console.log('appState', appState);
      const exitFlag = await AsyncStorage.getItem('exitFlag');
      console.log('exitFlag', exitFlag);
      if (exitFlag === 'true') {
        setHasExited(true);
        await AsyncStorage.removeItem('exitFlag');
      }
    };
    checkExitFlag();
    console.log('startLaunch', startLaunch);
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [appState]);

  const handleAppStateChange = async (nextAppState) => {
    console.log('hasExited', hasExited);
    console.log('nextAppState', nextAppState);
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (hasExited) {
        console.log('앱이 exitApp() 후 다시 실행되었습니다.');
        dispatch(setStartPage(true));
        setHasExited(false);
      }
      else {
        console.log('앱이 백그라운드에서 다시 불러와졌습니다.');
        dispatch(setStartPage(false));

      }
    }
    setAppState(nextAppState);

  };


  const handleBackPress = async () => {
    if (toastVisible) { // 토스트가 떠 있을 때는 앱 종료 
      Toast.hide(toast);
      setToast(null); // 상태 초기화 
      setToastVisible(false);
      setHasExited(true);
      await AsyncStorage.setItem('exitFlag', 'true');
      BackHandler.exitApp();
    } else {
      // 토스트가 떠 있지 않을 때는 토스트 메시지 표시 
      const newtoast = Toast.show('뒤로가기 버튼을 한번 더 누르시면\n앱이 종료됩니다.',
        {
          duration: Toast.durations.LONG,
          position: height * 0.72,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      setToast(newtoast); // 토스트 인스턴스 저장 
      setToastVisible(true);
      setTimeout(() => {
        Toast.hide(newtoast);
        setToastVisible(false);
      }, 2000);


    } return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }

  }, [toastVisible]);



  useFocusEffect(
    useCallback(() => {
      const checkModalStatus = async () => {
        const adBannerdata = await getAdBanner();
        console.log('adBannerdata', adBannerdata);
        if (adBannerdata) {
          const lastClosed = await AsyncStorage.getItem('lastClosed');
          if (!lastClosed) {
            if (adBannerdata.isPost && adBannerdata.imageUrl !== null) {
              dispatch(setAdBanner(true));
            } else {
              dispatch(setAdBanner(false));
            }
          } else {
            const now = new Date();
            const lastClosedDate = new Date(lastClosed);
            const hoursDifference = Math.abs(now - lastClosedDate) / 36e5;
            console.log('hoursDifference', hoursDifference);
            if (hoursDifference >= 24) {
              if (adBannerdata.isPost && adBannerdata.imageUrl !== null) {
                dispatch(setAdBanner(true));
              } else {
                dispatch(setAdBanner(false));
              }
            } else {
              dispatch(setAdBanner(false));
            }
          }

          SheetManager.show('AdBanner', {
            payload: {
              adBannerdata: adBannerdata,
            },
          });
        } else {
          dispatch(setAdBanner(false));
        }

      };
      checkModalStatus();
      //dispatch(setAdBanner(true));

    }, [])
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { width, height } = useWindowDimensions();

  useLayoutEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#fff');
    StatusBar.setTranslucent(false);
  }, [navigation]);

  useEffect(() => {
    // 채널톡 초기화
    const settings = {
      pluginKey: 'fbfbfeaa-8f4c-41ef-af7a-7521ae67e9f6',
    };

    ChannelIO.boot(settings).then(result => {
      console.log('ChannelIO.boot', result);
    });

    // 기본 채널톡 버튼 숨기기
    ChannelIO.hideChannelButton();

    return () => {
      ChannelIO.shutdown();
    };
  }, []);

  useEffect(() => {
    // onBadgeChanged 이벤트 리스너 등록
    const badgeListener = ChannelIO.onBadgeChanged((count) => {
      setUnreadCount(count);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      //   badgeListener.remove();
    };
  }, []);

  const getAdBanner = async () => {
    try {
      const url = `${Config.APP_API_URL}main/mainPopup`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`,
      };

      const response = await axios.get(url, { headers });
      const result = response.data;
      const data = result.data !== undefined ? result.data : null;

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  const handleWithLogout = async (accessToken) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    try {
      const response = await axios.get(`${Config.APP_API_URL}user/logout`, { headers });
      console.log('accessToken', accessToken);
      console.log('response.data', response.data);

      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '로그아웃에 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            buttontext: '확인하기',
          },
        });
        return false;
      } else {
        return true;
      }
    } catch (error) {
      SheetManager.show('info', {
        payload: {
          message: '로그아웃에 실패했어요.',
          description: error?.message,
          type: 'error',
          buttontext: '확인하기',
        },
      });
      console.error(error);
      return false;
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      dispatch(setChatDataList([]));
      dispatch(setHouseInfo(null));
      dispatch(setOwnHouseList([]));
      dispatch(setFixHouseList([]));
      dispatch(setAddHouseList([]));
      dispatch(setResend(false));
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
      // 화면이 포커스를 얻을 때 실행됩니다.
      return () => { };
    }, [])
  );
  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
      if (!state.isConnected) {

        navigation.push('NetworkAlert', navigation);
        resolve(false);
      } else if (state.isConnected) {

        if (!hasNavigatedBackRef.current) {
          setHasNavigatedBack(true);
        }
        resolve(true);
      } else {
        resolve(true);
      }
    });
  };

  const AC_HASHTAG_LIST = [
    '취득세 계산',
    '주택 매수',
    '조정 지역',
    '입주권',
    '분양권',
  ];

  const GAIN_HASHTAG_LIST = [
    '양도소득세 계산',
    '일시적 2주택',
    '다주택자',
    '조정지역',
    '장기보유특별공제',
  ];


  const CONSULTING_HASHTAG_LIST = [
    '상속세',
    '증여세',
    '재산세',
    '다주택자',
    '양도소득세 컨설팅',
    '기타 주택세금',
  ];

  const goAcquisigion = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      Toast.hide(toast); // 토스트 인스턴스를 사용하여 숨김 처리 
      setToast(null); // 상태 초기화 
      setToastVisible(false);
      navigation.navigate('Acquisition');
    }
  };

  const goGainsTax = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      if (toast) {
        Toast.hide(toast); // 토스트 인스턴스를 사용하여 숨김 처리 
        setToast(null); // 상태 초기화 
        setToastVisible(false);
      }
      navigation.navigate('GainsTax');
    }
  };

  const goConSulting = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      if (toast) {
        Toast.hide(toast); // 토스트 인스턴스를 사용하여 숨김 처리 
        setToast(null); // 상태 초기화 
        setToastVisible(false);
      }
      navigation.navigate('CounselorList');
      // SheetManager.show('Consulting', { payload: { navigation } });
    }
  };

  const goAppInformation = () => {
    // SheetManager.show('InfoAppinformation');
    if (toast) {
      Toast.hide(toast); // 토스트 인스턴스를 사용하여 숨김 처리 
      setToast(null); // 상태 초기화 
      setToastVisible(false);
    }
    navigation.navigate('Information');
    return;
  };

  return (
    <Container>
      <HelloSection>
        <HelloText >안녕하세요.</HelloText>
        <MessageTitle>어떤 서비스를 이용하시겠어요?</MessageTitle>
      </HelloSection>
      <ShadowContainer>
        <Card width={width} onPress={goAcquisigion}>
          <Tag>
            <TagText >주택 매수</TagText>
          </Tag>
          <CardTitle >취득세 계산하기</CardTitle>
          <HashTagGroup
            style={{
              width: '70%',
            }}>
            {AC_HASHTAG_LIST.map((item, index) => (
              <HashTagText key={index} >#{item}</HashTagText>
            ))}
          </HashTagGroup>
          <IconView>
            <HomeIcon />
          </IconView>
        </Card>
      </ShadowContainer>
      <ShadowContainer>
        <Card width={width} onPress={goGainsTax}>
          <Tag>
            <TagText >주택 양도</TagText>
          </Tag>
          <CardTitle >양도소득세 계산하기</CardTitle>
          <HashTagGroup>
            {GAIN_HASHTAG_LIST.map((item, index) => (
              <HashTagText key={index} >#{item}</HashTagText>
            ))}
          </HashTagGroup>
          <IconView>
            <SignTagIcon />
          </IconView>
        </Card>
      </ShadowContainer>

      <ShadowContainer>
        <Card width={width} onPress={goConSulting}>
          <Tag>
            <TagText >세금 상담</TagText>
          </Tag>
          <CardTitle >세금 상담받기</CardTitle>
          <HashTagGroup
            style={{
              width: '80%',
            }}>
            {CONSULTING_HASHTAG_LIST.map((item, index) => (
              <HashTagText key={index} >#{item}</HashTagText>
            ))}
          </HashTagGroup>
          <IconView>
            <ConSultingIcon />
          </IconView>
        </Card>
      </ShadowContainer>


      <ChanelTalkIconFloatContainer>
        <DropShadow
          style={{
            shadowColor: '#2F87FF',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.8,
            shadowRadius: 10,
          }}>
          <ChanelTalkIconFloatButton
            onPress={() => {
              if (toast) {
                Toast.hide(toast); // 토스트 인스턴스를 사용하여 숨김 처리 
                setToast(null); // 상태 초기화 
                setToastVisible(false);
              }
              Linking.openURL('http://pf.kakao.com/_sxdxdxgG')
            }}>
            <ChanelTalkIcon />
          </ChanelTalkIconFloatButton>
        </DropShadow>
      </ChanelTalkIconFloatContainer>

      {/*<LogOutIconFloatContainer>
        <DropShadow
          style={{
            shadowColor: '#A3A3A3',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.80,
            shadowRadius: 10,
          }}>

          <LogOutIconFloatButton
            onPress={() => {
              ////console.log('LogOut!');
              goLogout();
            }}>
            <LogOutIcon style={style.LogOutIcon} />
          </LogOutIconFloatButton>
        </DropShadow>
      </LogOutIconFloatContainer>
*/}
      <AppInformationIconFloatContainer>
        <DropShadow
          style={{
            shadowColor: '#2F87FF',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.80,
            shadowRadius: 10,
          }}>

          <AppInformationIconFloatButton
            onPress={() => {
              ////console.log('AppInformation');
              goAppInformation();
            }}>
            <AppInformationIcon />
          </AppInformationIconFloatButton>
        </DropShadow>
      </AppInformationIconFloatContainer>
    </Container >
  );
};

export default Home;
