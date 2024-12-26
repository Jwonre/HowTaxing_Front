import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: true,
};

export const startPageSlice = createSlice({
  name: 'startPage',
  initialState,
  reducers: {
    setStartPage: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setStartPage} = startPageSlice.actions;

export default startPageSlice.reducer;
