// 인증 관련 데이터 저장

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: false,
};

export const resendSlice = createSlice({
  name: 'resend',
  initialState,
  reducers: {
    setResend: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setResend} = resendSlice.actions;

export default resendSlice.reducer;
