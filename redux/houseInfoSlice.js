// 세금 계산할 주택 정보 데이터

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: null,
};

export const houseInfoSlice = createSlice({
  name: 'houseInfo',
  initialState,
  reducers: {
    setHouseInfo: (state, action) => {
      state.value = action.payload;
    },
    clearHouseInfo: (state) => {
      state.value = null; // value를 null로 초기화
    },
  },
});

// Action creators are generated for each case reducer function
export const {setHouseInfo, clearHouseInfo} = houseInfoSlice.actions;

export default houseInfoSlice.reducer;
