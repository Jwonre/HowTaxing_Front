// 보유주택 리스트

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const ownHouseListSlice = createSlice({
  name: 'ownHouseList',
  initialState,
  reducers: {
    setOwnHouseList: (state, action) => {
      state.value = action.payload;
    },
    editOwnHouseList: (state, action) => {
      const { houseId, houseType, houseName, detailAdr, isRequiredDataMissing, isMoveInRight } = action.payload;

    //  ////console.log('target HouseId HouseType:' + houseId + ':' + houseType + ':' + detailAdr + ':' + houseName);

      const houseIndex = state.value.findIndex(
        ownHouse => (ownHouse.houseId === houseId),
      );

  //   ////console.log('target houseIndex:' + houseIndex);

      if (houseIndex !== -1) {
    //    ////console.log('as is source houseType value:' + state.value[houseIndex].houseType);
    //    ////console.log('as is source detailAdr value:' + state.value[houseIndex].detailAdr);
    //    ////console.log('as is source houseName value:' + state.value[houseIndex].houseName);

        state.value[houseIndex].houseType = houseType;
        state.value[houseIndex].detailAdr = detailAdr;
        state.value[houseIndex].houseName = houseName;
        state.value[houseIndex].isRequiredDataMissing = isRequiredDataMissing;
        state.value[houseIndex].isMoveInRight = isMoveInRight;

     //   ////console.log('to be source houseType value:' + state.value[houseIndex].houseType);
      //  ////console.log('to be source detailAdr value:' + state.value[houseIndex].detailAdr);
     //   ////console.log('to be source houseName value:' + state.value[houseIndex].houseName);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOwnHouseList, editOwnHouseList } = ownHouseListSlice.actions;

export default ownHouseListSlice.reducer;
