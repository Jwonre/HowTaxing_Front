import React, { useEffect, useState } from 'react';
import { View, StatusBar, Linking, Platform, StyleSheet } from 'react-native';
import AppNavigator from './navigator/AppNavigator';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './redux/store';
import dayjs from 'dayjs';
import VersionCheck from 'react-native-version-check';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import InfoCircleIcon from './assets/icons/update_circle.svg';
import 'dayjs/locale/ko';
import naverLogin from '@react-native-seoul/naver-login';

// Naver Login Configuration
const consumerKey = 'orG8AAE8iHfRSoiySAbv';
const consumerSecret = 'DEn_pJGqup';
const appName = '하우택싱';
const serviceUrlSchemeIOS = 'howtaxingrelease';

// Styled Components
const SheetContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  height: 35%;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalContentSection = styled.View`
  background-color: #fff;
  justify-content: center;
  border-radius: 10px;
`;

const FirstItem = styled.View`
  align-items: center;
  padding: 0 20px;
  margin: 10px 0;
`;

const FirstItemTitle = styled.Text`
  font-size: 15px;
  font-family: Pretendard-regular;
  color: #1b1c1f;
  line-height: 18px;
  text-align: center;
`;

const ButtonSection = styled.View`
  width: 100%;
  background-color: #fff;
  align-items: center;
  padding: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-regular;
  color: #fff;
  line-height: 20px;
`;

dayjs.locale('ko');

const App = () => {
  const [updateCheck, setUpdateCheck] = useState(false);

  // Check for app updates
  const checkForUpdate = async () => {
    try {
      const currentVersion = VersionCheck.getCurrentVersion();
      const latestVersion = await VersionCheck.getLatestVersion();
      console.log('currentVersion', currentVersion);
      console.log('latestVersion', latestVersion);
      if (latestVersion && (Number(currentVersion) < Number(latestVersion))) {
        setUpdateCheck(true);
      } else {
        setUpdateCheck(false);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      setUpdateCheck(false);
    }
  };

  // Initialize Naver Login
  useEffect(() => {
    naverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  // Check for updates on mount
  useEffect(() => {
    checkForUpdate();
  }, []);

  // Handle update button press
  const handleUpdate = () => {
    Linking.openURL(
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/idYOUR_APP_ID'
        : 'https://play.google.com/store/apps/details?id=com.xmonster.howtaxingapp'
    );
  };

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle={'dark-content'}
          translucent={true}
        />
        {Platform.OS === 'ios' || !updateCheck ? (
          <AppNavigator />
        ) : (
          <Modal isVisible={updateCheck} backdropColor="#000" backdropOpacity={0.4}>
            <SheetContainer>
              <ModalContentSection>
                <InfoCircleIcon
                  style={{
                    color: '#FF7401',
                    marginTop: 30,
                    marginBottom: 15,
                    alignSelf: 'center',
                  }}
                />
                <ModalTitle>최신 버전의 앱이 있어요.</ModalTitle>
                <FirstItem>
                  <FirstItemTitle>
                    더 편리하고 유용한 하우택싱을 이용하시려면{'\n'}최신 버전으로 앱을 업데이트해주세요.
                  </FirstItemTitle>
                </FirstItem>
                <ButtonSection>
                  <Button onPress={handleUpdate}>
                    <ButtonText>업데이트하기</ButtonText>
                  </Button>
                </ButtonSection>
              </ModalContentSection>
            </SheetContainer>
          </Modal>
        )}
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;