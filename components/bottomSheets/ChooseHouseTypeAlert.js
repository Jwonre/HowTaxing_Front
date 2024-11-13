// 보유 주택 목록에서 주택 유형 선택시 뜨는 팝업

import {
  View,
  useWindowDimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from "@react-native-community/netinfo"

// Icons
import BuildingIcon1 from '../../assets/icons/house/building_type1_ico.svg';
import HouseIcon from '../../assets/icons/house/house.svg';
import VillaIcon from '../../assets/icons/house/villa.svg';


const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: auto;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 32px;
  text-align: center;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;


const ModalSubtitle = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Medium;
  color: #000;
  line-height: 20px;
  text-align: left;
  margin: 20px 20px;
`;

const SelectButton = styled.Pressable`
  width: 95px;
  height: 70px;
  border-radius: 10px;
  background-color: #fff;
  border: ${props =>
    props.active ? '1px solid #2f87ff' : '1px solid #e8eaed'};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const SelectButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 15.51px;
  margin-top: 8px;
  letter-spacing: -1px;
`;





const ButtonShadow = styled(DropShadow)`
  width: 48%;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 10;
  }
  shadow-opacity: 0.25;
  shadow-radius: 4;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;




const ChooseHouseTypeAlert = props => {

  const { handleHouseChange, data, navigation, prevSheet } = props.payload;

  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const [selectedHouseType, setSelectedHouseType] = useState(data?.houseType === null ? null : data?.houseType);
  
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

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



  const HOUSE_TYPE = [
    {
      id: '1',
      name: '아파트 · 오피스텔',
      icon: <BuildingIcon1 />,
    },
    {
      id: '4',
      name: '단독주택 · 다가구',
      icon: <HouseIcon />,
    },
    {
      id: '2',
      name: '연립 · 다세대',
      icon: <VillaIcon />,
    },
  ];





  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {

              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 350,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >주택 유형을 선택해주세요.</ModalTitle>
          <ModalSubtitle >주택 유형 선택</ModalSubtitle>
          <View
            style={{
              paddingHorizontal: width / 20,
              paddingBottom: 20,
            }}>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                {HOUSE_TYPE.map((it, index) => (
                  <SelectButton
                    key={it.id}
                    active={selectedHouseType === it.id}
                    onPress={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        setSelectedHouseType(it.id);
                      } else {
                        const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                        dispatch(setChatDataList(newChatDataList));
                        actionSheetRef.current?.hide();
                      }
                    }}>
                    {it.icon}
                    <SelectButtonText >{it.name}</SelectButtonText>
                  </SelectButton>
                ))}
              </ScrollView>
            </View>
          </View>
        </ModalInputSection>
        <ButtonSection
          style={{
            borderTopWidth: 0,
          }}>
          <ButtonShadow
            style={{
              shadowColor: '#fff',
            }}>
            <Button
              onPress={() => {
                //     ////console.log('ChooseHouseType 이전으로 버튼');
                actionSheetRef.current?.hide();
              }}
              style={{
                backgroundColor: '#fff',
                borderColor: '#E8EAED',
              }}>
              <ButtonText
                style={{
                  color: '#717274',
                }} >
                이전으로
              </ButtonText>
            </Button>
          </ButtonShadow>
          <ButtonShadow>
            <Button
              onPress={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {
                  var p = data;
                  p.houseType = selectedHouseType;
                  //    ////console.log('[ChooseHouseTypeAlert] p:', p);
                  handleHouseChange(p, p?.isMoveInRight);
                  // ownHouseList가 배열이라면, map 함수를 사용하여 해당 houseId를 가진 객체만 업데이트합니다.

                  actionSheetRef.current?.hide();
                }else {
                  actionSheetRef.current?.hide();
                }
              }}>
              <ButtonText >다음으로</ButtonText>
            </Button>
          </ButtonShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default ChooseHouseTypeAlert;
