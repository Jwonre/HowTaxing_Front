// 직접 등록 시 주소 임시 저장

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: {
    address: '',
    addressDetail: '',
  },
};

export const directRegisterSlice = createSlice({
  name: 'directRegister',
  initialState,
  reducers: {
    setDirectRegister: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setDirectRegister} = directRegisterSlice.actions;

export default directRegisterSlice.reducer;
