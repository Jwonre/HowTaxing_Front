// 취득세 결과애에서 CTA 섹션

import { Linking } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import NetInfo from "@react-native-community/netinfo";

const Card = styled(Animatable.View).attrs(props => ({
  animation: 'fadeInUp',
}))`
  width: 100%;
  height: auto;
  padding: 20px 25px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
`;

const ProfileAvatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: center;
  margin: 15px 0;
`;

const ProfileName = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 10px;
`;

const CardSubTitle = styled.Text`
  font-size: 14px;
  font-family: Bold;
  color: #a3a5a8;
  line-height: 20px;
  text-align: center;
`;

const ProfileEmail = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
  margin-top: 5px;
  text-align: center;
`;

const KakaoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2F87FF;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const KakaoButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-bold;
  color: #fff;
  line-height: 20px;
`;

const SocialButtonIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 22px;
  height: 20px;
  margin-right: 16px;
`;



const CTACard = props => {
  
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();
  
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
    console.log('props', props);
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      navigation.push('ConsultingReservation2', {
        IsGainTax: props?.IsGainTax,
        houseInfo: props?.houseInfo,
        Pdata: props?.Pdata,
      });
    }
  };

  return (
    <Card>
      <CardTitle
        style={{
          textAlign: 'center',
        }} >
        부동산 전문 세무사에게 상담 받아보세요!
      </CardTitle>
      <CardSubTitle
        style={{
          fontSize: 14,
          textAlign: 'center',
          fontFamily: 'Pretendard-Regular',
          color: '#A3A5A8',
        }} >
        여러분의 세금 절감에 많은 도움이 될거에요.
      </CardSubTitle>
      <ProfileAvatar
        source={require('../assets/images/Minjungum_Lee.png')}
      />
      <ProfileName >이민정음 세무사</ProfileName>
      <KakaoButton onPress={() => openKakaoLink()}>
        <KakaoButtonText >상담 예약하기</KakaoButtonText>
      </KakaoButton>
    </Card>
  );
};

export default CTACard;
