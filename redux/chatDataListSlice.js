// 채팅 데이터

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const chatDataListSlice = createSlice({
  name: 'chatDataList',
  initialState,
  reducers: {
    setChatDataList: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setChatDataList} = chatDataListSlice.actions;

export default chatDataListSlice.reducer;
