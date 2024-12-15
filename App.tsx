import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StatusBar, Alert, Linking, Platform ,StyleSheet } from 'react-native';
import AppNavigator from './navigator/AppNavigator';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './redux/store';
import dayjs from 'dayjs';
import VersionCheck from 'react-native-version-check';
import styled from 'styled-components/native';
import DropShadow from 'react-native-drop-shadow';
import Modal from 'react-native-modal';
import InfoCircleIcon from './assets/icons/update_circle.svg';
import 'dayjs/locale/ko';
import naverLogin from '@react-native-seoul/naver-login';
import { NativeModules } from 'react-native';

const { KeyHashModule } = NativeModules;


const SheetContainer = styled.View`
  background-color: #fff;


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
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  bottom: 0px;
`;

const Button = styled.TouchableOpacity.attrs((props: any) => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 40px;
  border-radius: 25px;
  background-color: #2F87FF;
  align-items: center;
  justify-content: center;
  border-color: #2F87FF;
  align-self: center;
  border-width: 1px;

`;


const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-regular;
  color: #fff;
  line-height: 20px;
`;

dayjs.locale('ko');
/** Fill your keys */
const consumerKey = 'orG8AAE8iHfRSoiySAbv';
const consumerSecret = 'DEn_pJGqup';
const appName = '하우택싱';

/** This key is setup in iOS. So don't touch it */
const serviceUrlSchemeIOS = 'howtaxingrelease';

const App = () => {
  const [UpdateCheck, setUpdateCheck] = useState(false);

  const checkForUpdate = async () => {
    const currentVersion = VersionCheck.getCurrentVersion();
    const latestVersion = await VersionCheck.getLatestVersion();

    console.log('currentVersion', currentVersion);
    console.log('latestVersion', latestVersion);
    if (currentVersion < latestVersion) {
      setUpdateCheck(false);
    } else {
      setUpdateCheck(false);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);
  console.log('NativeModules:', NativeModules); // 모든 네이티브 모듈 출력


  KeyHashModule.getKeyHash()
  .then((hash: any) => console.log('Hash Key:', hash))
  .catch((err: any) => console.error('Error fetching Key Hash:', err));

  useEffect(() => {
    naverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  return (
    <><Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 , backgroundColor :'#fff'}}>
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle={'dark-content'}
          translucent={true} />
        {!UpdateCheck ? (<AppNavigator />) : (
          <Modal isVisible={UpdateCheck} backdropColor="#000" // 원하는 색으로 설정
            backdropOpacity={0.4}>
            <SheetContainer style={{ borderRadius: 10, height: '35%' }}>
              <ModalContentSection>
                <InfoCircleIcon
                  style={{
                    color: '#FF7401',
                    marginTop: 30,
                    marginBottom: 15,
                    alignSelf: 'center'
                  }} />
                <ModalTitle>최신 버전의 앱이 있어요.</ModalTitle>

                <FirstItem style={{ marginTop: 10, marginBottom: 10 }}>
                  <FirstItemTitle>더 편리하고 유용한 하우택싱을 이용하시려면{'\n'}최신 버전으로 앱을 업데이트해주세요.</FirstItemTitle>
                </FirstItem>
                <ButtonSection style={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingRight: 20,
                  paddingLeft: 20
                }}>
                  <Button
                    onPress={() => {
                      Linking.openURL(Platform.OS === 'ios'
                        ? 'https://apps.apple.com/app/idYOUR_APP_ID'
                        : 'https://play.google.com/store/apps/details?id=com.xmonster.howtaxingapp'
                      );
                    }}>
                    <ButtonText>업데이트하기</ButtonText>
                  </Button>
                </ButtonSection>
              </ModalContentSection>
            </SheetContainer>
          </Modal>)}
      </GestureHandlerRootView>
    </Provider>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFFFFF', // 원하는 색상
  },
});
export default App;