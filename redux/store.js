import {configureStore} from '@reduxjs/toolkit';
import addHouseListSlice from './addHouseListSlice';
import fixHouseListSlice from './fixHouseListSlice';
import currentUserSlice from './currentUserSlice';
import houseInfoSlice from './houseInfoSlice';
import chatDataListSlice from './chatDataListSlice';
import ownHouseListSlice from './ownHouseListSlice';
import certSlice from './certSlice';
import directRegisterSlice from './directRegisterSlice';
import resendSlice from './resendSlice';
import adBannerSlice from './adBannerSlice';

export const store = configureStore({
  reducer: {
    addHouseList: addHouseListSlice,
    fixHouseList: fixHouseListSlice,
    currentUser: currentUserSlice,
    houseInfo: houseInfoSlice,
    chatDataList: chatDataListSlice,
    ownHouseList: ownHouseListSlice,
    cert: certSlice,
    directRegister: directRegisterSlice,
    resend: resendSlice,
    adBanner: adBannerSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
