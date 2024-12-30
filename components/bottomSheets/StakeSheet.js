// 보유 주택 목록에서 공시가격 수정 선택시 뜨는 팝업

import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import numberToKorean from '../../utils/numToKorean';
import NetInfo from "@react-native-community/netinfo";
import InfoIcon from '../../assets/icons/info_tooltip_ico.svg';
import { setChatDataList } from '../../redux/chatDataListSlice';
import Slider from '@react-native-community/slider';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { acquisitionTax } from '../../data/chatData';

import { LogBox } from 'react-native';

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
  margin-bottom: 20px;
`;

const MemberIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

const StyledInput = styled.TextInput.attrs({
  placeholderTextColor: '#C1C3C5',
})`
  flex: 1;
  height: 50px;
  padding: 0 10px;
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: right;
`;

const ModalSelectButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 24%;
  height: 40px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  border: 1px solid #e8eaed;
`;

const ModalSelectButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #1b1c1f;
  line-height: 20px;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
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
  padding: 0 20px;
  border-top-width: 1px;
  border-top-color: #e8eaed;
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


const Card = styled.View`
  height: 125px;
  border-radius: 5px;
  background-color: #fff;
  justify-content: space-between;
  border-width: 1px;
  border-color: #2F87FF;
  padding: 10px;
  align-items: center;
`;

const CardTitle = styled.Text.attrs({
  numberOfLines: 2,
})`
  width: 100%;
  font-size: 14px;
  color: #1b1c1f;
  font-family: Pretendard-Bold;
  line-height: 20px;
  text-align: center;
`;

const CardSubTitle = styled.Text`
  font-size: 20px;
  color: #000;
  font-family: Pretendard-Bold;
  line-height: 20px;
`;

const StakeSheet = props => {
  LogBox.ignoreLogs(['to contain units']);
  const { handleHouseChange, data, navigation, prevSheet } = props.payload;
  const chatDataList = useSelector(state => state.chatDataList.value);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const [value, setValue] = useState(50);
  // 공시가격
  const [buyPrice, setBuyPrice] = useState(
    data?.buyPrice ? data?.buyPrice : null,
  );

  // 공시가격 선택 리스트
  const AC_STAKE_LIST = [25, 33, 50, 75];
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


  // 키보드 이벤트
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log('chatDataList', chatDataList);
  }, []);
  const nextHandler = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      const updateUserProportion = {...houseInfo, userProportion: value};
      setTimeout(() => {
        dispatch(setHouseInfo(updateUserProportion));
      }, 300)
      const chat1 = {
        id: 'stake',
        type: 'my',
        message: value + '%',
        questionId: 'apartment',
        progress: 6,
      };
      const chat2 = acquisitionTax.find(el => el.id === 'moreHouse');
      dispatch(
        setChatDataList([...chatDataList, chat1, chat2]),
      );
      actionSheetRef.current?.hide();
    }
  };

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
              const excludeIds = ['jointSystem', 'jointcount', 'stake', 'jointcavity'];
              const newChatDataList = chatDataList.filter(el => !excludeIds.includes(el.id));

              dispatch(setChatDataList(newChatDataList));
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
        height: 490,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >고객님의 지분을 알려주세요.</ModalTitle>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>

              <DropShadow
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}>
                <Card style={{ width: width * 0.37 }}>
                  <CardTitle >본인 소유 지분율</CardTitle>
                  <View style={{ width: 50, height: 50, backgroundColor: '#d0d3d8', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                    <MemberIcon source={require('../../assets/images/member.png')} />
                  </View>
                  <CardSubTitle >{value}%</CardSubTitle>
                </Card>
              </DropShadow>

              <DropShadow
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}>
                <Card style={{ width: width * 0.37, borderColor: '#FFF' }}>
                  <CardTitle >공동 소유자 지분율</CardTitle>
                  <View style={{ width: 50, height: 50, backgroundColor: '#d0d3d8', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                    <MemberIcon source={require('../../assets/images/member.png')} />
                  </View>
                  <CardSubTitle >{100 - value}%</CardSubTitle>
                </Card>
              </DropShadow>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: '#000', textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Pretendard-Bold', }}>{value}%</Text>
              <Slider
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#2f87ff"
                maximumTrackTintColor="#d0d3d8"
                step={1}
                value={value}
                onValueChange={(val) => setValue(val)}
                thumbImage={require('../../assets/images/slider.png')}
              />
              <View style={{ width: '100%' }}>
                <Text style={{ color: '#000', textAlign: 'right', fontSize: 16, fontFamily: 'Pretendard-Bold', }}>100%</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              {AC_STAKE_LIST.map((item, index) => (
                <ModalSelectButton
                  key={index}
                  onPress={() => {
                    setValue(item);
                  }}>
                  <ModalSelectButtonText >
                    {item + '%'}
                  </ModalSelectButtonText>
                </ModalSelectButton>
              ))}
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
                const excludeIds = ['jointSystem', 'jointcount', 'stake', 'jointcavity'];
                const newChatDataList = chatDataList.filter(el => !excludeIds.includes(el.id));
                dispatch(setChatDataList(newChatDataList));
                actionSheetRef.current?.hide();
              }}
              style={{
                backgroundColor: '#fff',
                borderColor: '#E8EAED',
              }}>
              <ButtonText

                style={{
                  color: '#717274',
                }}>
                이전으로
              </ButtonText>
            </Button>
          </ButtonShadow>
          <ButtonShadow>
            <Button
              onPress={() => {
                // 주택 정보 업데이트
                nextHandler();
              }}>
              <ButtonText >다음으로</ButtonText>
            </Button>
          </ButtonShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default StakeSheet;
