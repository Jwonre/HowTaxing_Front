import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './navigator/AppNavigator';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './redux/store';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';


dayjs.locale('ko');

const App = () => { 
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