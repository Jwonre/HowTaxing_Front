// 양도세 정보 입력 시트

import {
  View,
  useWindowDimensions,
  Pressable,
  ScrollView,
  Linking,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from "@react-native-community/netinfo"
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
  margin-top: 10px;
`;


const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;


const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;



const InfoMessage = styled.Text`
  font-size: 15px;
  font-family: Bold;
  color: #A3A5A8;
  line-height: 17px;
  margin-top: 20px;
  text-align: center;
`;

const ProfileAvatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: center;
  margin-Top: 20px;
  margin-Bottom: 10px;
`;

const ProfileName = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
`;

const KakaoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 85%;
  height: 50px;
  border-radius: 25px;
  background-color: #fbe54d;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const KakaoButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #3b1f1e;
  line-height: 20px;
`;

const SocialButtonIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 22px;
  height: 20px;
  margin-right: 16px;
  
`;


const ConsultingSheet = props => {
  const actionSheetRef = useRef(null);
  const _scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  // 필요경비금액
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const navigation = props.payload?.navigation;

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

  const openKakaoLink = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      Linking.openURL('http://pf.kakao.com/_sxdxdxgG');
    } else {
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
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 430,
        width: width - 40,
      }}>
      <ScrollView
        ref={_scrollViewRef}
        pagingEnabled
        style={{
          width: width - 40,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        scrollEventThrottle={16}>
        <SheetContainer width={width}>
          <ModalInputSection>
            <ModalTitle >부동산 전문 세무사에게 상담 받아보세요!</ModalTitle>
            <View styled={{ height: 'auto', minHeight: 40 }}>
              <InfoMessage >
                취득세/양도소득세/증여세/상속세 등{'\n'}여러분의 세금을 확 줄여드릴게요.
              </InfoMessage>
            </View>
            <ProfileAvatar
              source={require('../../assets/images/Minjungum_Lee.png')}
            />
            <ProfileName >이민정음 세무사</ProfileName>
            <KakaoButton
              onPress={() => openKakaoLink()}>
              <SocialButtonIcon
                source={require('../../assets/images/socialIcon/kakao_ico.png')}
              />
              <KakaoButtonText >카카오톡으로 상담하기</KakaoButtonText>
            </KakaoButton>

          </ModalInputSection>
        </SheetContainer>
      </ScrollView>
    </ActionSheet>
  );
};

export default ConsultingSheet;
