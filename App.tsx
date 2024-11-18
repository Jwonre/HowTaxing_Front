import React , {useEffect} from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './navigator/AppNavigator';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './redux/store';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import naverLogin from '@react-native-seoul/naver-login';
import { NativeModules } from 'react-native';

const { KeyHashModule } = NativeModules;

dayjs.locale('ko');

/** Fill your keys */
const consumerKey = 'orG8AAE8iHfRSoiySAbv';
const consumerSecret = 'DEn_pJGqup';
const appName = '하우택싱';

/** This key is setup in iOS. So don't touch it */
const serviceUrlSchemeIOS = 'howtaxingrelease';

const App = () => { 
  console.log('NativeModules:', NativeModules); // 모든 네이티브 모듈 출력

  
  KeyHashModule.getKeyHash()
  .then((hash) => console.log('Hash Key:', hash))
  .catch((err) => console.error('Error fetching Key Hash:', err));

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
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle={'dark-content'}
          translucent={true}
        />
        <AppNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
}; 

export default App;