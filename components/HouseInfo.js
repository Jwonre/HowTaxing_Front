// 결과에서 주택 정보 섹션 

import { View, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { HOUSE_TYPE } from '../constants/colors';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';

const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: #e8eaed;
`;

const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 24px;
  margin-bottom: 5px;
  margin-top: 4px;
`;

const HoustInfoText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
`;

const HoustInfoBadge = styled.View`
  width: auto;
  margin-right: auto;
  margin-Bottom: 10px;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: #1fc9a8;
`;

const HoustInfoBadgeText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;

const HoustInfoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100px;
  height: 32px;
  border-radius: 16px;
  background-color: #fff;
  border-width: 1px;
  border-color: #e8eaed;
  align-items: center;
  justify-content: center;
`;

const HoustInfoButtonText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
`;

const HouseInfo = props => {
  
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(true);
  
  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
      if (!state.isConnected && isConnected) {
        setIsConnected(false);
        navigation.push('NetworkAlert', navigation);
        resolve(false);
      } else if (state.isConnected && !isConnected) {
        setIsConnected(true);
        if (!hasNavigatedBackRef.current) {
          setHasNavigatedBack(true);
        }
        resolve(true);
      } else {
        resolve(true);
      }
    });
  };

  //////console.log(props);
  return (
    <HoustInfoSection>
      <View
        style={{
          width: '60%',
        }}>
        <HoustInfoBadge
          style={{
            backgroundColor: HOUSE_TYPE.find(
              item => item.id === props.item?.houseType,
            )?.color,
            flexDirection: 'row',
            alignContent: 'center',
          }}>
          <HoustInfoBadgeText >
            {HOUSE_TYPE.find(item => item.id === props.item?.houseType)?.name}
          </HoustInfoBadgeText>
          {(props.item?.houseType !== '3' && props.item?.isMoveInRight) && <HoustInfoBadgeText  style={{fontSize: 8}}>
            {'(입주권)'}
          </HoustInfoBadgeText>}
        </HoustInfoBadge>
        <HoustInfoTitle >{props.item?.houseName}</HoustInfoTitle>
        <HoustInfoText >{props.item?.detailAdr}</HoustInfoText>
      </View>
      {props.reservationYn === 'N' && <HoustInfoButton
        onPress={async () => {
          const state = await NetInfo.fetch();
          const canProceed = await handleNetInfoChange(state);
          if (canProceed) {
            props.navigation.push('HouseDetail', {
              item: props.item,
              navigation: props.navigation,
              prevSheet: props.ChatType,

            });
            ////console.log('navigation', navigation);
            // ////console.log('houseinfo.js houseinfo', props.item);
          }
        }
        }>
        <HoustInfoButtonText >자세히 보기</HoustInfoButtonText>
      </HoustInfoButton>}
    </HoustInfoSection>
  );
};

export default HouseInfo;
