// 보유주택 리스트

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const addHouseListSlice = createSlice({
  name: 'addHouseList',
  initialState,
  reducers: {
    setAddHouseList: (state, action) => {
      state.value = action.payload;
    },
    editAddHouseList: (state, action) => {
      const { createAt, updateAt, houseId, userId, houseType, houseName, detailAdr, contractDate, balanceDate, buyDate, moveInDate, moveOutDate, sellDate, buyPrice, sellPrice, pubLandPrice, kbMktPrice, jibunAddr, roadAddr, roadAddrRef, bdMgtSn, admCd, rnMgtSn, area, isDestruction, isCurOwn, ownerCnt, userProportion, isMoveInRight, sourceType, complete,
      index} = action.payload;

      //  ////console.log('target HouseId HouseType:' + houseId + ':' + houseType + ':' + detailAdr + ':' + houseName);

      const houseIndex = state.value.findIndex(
        addHouse => (addHouse.index === index),
      );

      //   ////console.log('target houseIndex:' + houseIndex);

      if (houseIndex !== -1) {
        //    ////console.log('as is source houseType value:' + state.value[houseIndex].houseType);
        //    ////console.log('as is source detailAdr value:' + state.value[houseIndex].detailAdr);
        //    ////console.log('as is source houseName value:' + state.value[houseIndex].houseName);
        state.value[houseIndex].houseId = houseId;
        state.value[houseIndex].buyDate = buyDate;
        state.value[houseIndex].buyPrice = buyPrice;
        state.value[houseIndex].jibunAddr = jibunAddr;
        state.value[houseIndex].roadAddr = roadAddr;
        state.value[houseIndex].bdMgtSn = bdMgtSn;
        state.value[houseIndex].admCd = admCd;
        state.value[houseIndex].rnMgtSn = rnMgtSn;
        state.value[houseIndex].complete = complete;
        state.value[houseIndex].detailAdr = detailAdr;
        state.value[houseIndex].houseName = houseName;
        

        //   ////console.log('to be source houseType value:' + state.value[houseIndex].houseType);
        //  ////console.log('to be source detailAdr value:' + state.value[houseIndex].detailAdr);
        //   ////console.log('to be source houseName value:' + state.value[houseIndex].houseName);
      }
    },

  },
});

// Action creators are generated for each case reducer function
export const { setAddHouseList, editAddHouseList } = addHouseListSlice.actions;

export default addHouseListSlice.reducer;
