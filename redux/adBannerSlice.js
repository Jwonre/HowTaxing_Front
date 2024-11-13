import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: false,
};

export const adBannerSlice = createSlice({
  name: 'adBanner',
  initialState,
  reducers: {
    setAdBanner: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setAdBanner} = adBannerSlice.actions;

export default adBannerSlice.reducer;
