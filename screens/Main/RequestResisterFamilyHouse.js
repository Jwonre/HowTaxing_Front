// Note: 가족 주택 등록 요청 화면

import {TouchableOpacity, useWindowDimensions} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
//import AutoHeightImage from 'react-native-auto-height-image';

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #f5f7fa;
`;

const IntroSection = styled.View`
  flex: 1;
  padding: 0 25px;
  height: 220px;
  width: 100%;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  margin-bottom: 8px;
  margin-top: 20px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 18px;
  margin-top: 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  align-self: center;
  position: absolute;
  bottom: 50px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const RequestResisterFamilyHouse = props => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '가족 주택 등록 요청',
      headerShadowVisible: false,
      contentStyle: {
        borderTopWidth: 0,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
      },
    });
  }, []);

  return (
    <Container>
      <IntroSection>
        <Title>신진성님으로부터{'\n'}가족 주택 등록 요청이 도착했어요.</Title>
        <AutoHeightImage
          source={require('../../assets/images/request_family_property_img.png')}
          width={width - 50}
          style={{
            marginVertical: 24,
          }}
        />
        <SubTitle>- 보유주택 공유를 위해 본인 인증을 부탁드려요</SubTitle>
        <SubTitle>- 아래에 인증하기 버튼을 눌러서 시작해 주세요</SubTitle>
      </IntroSection>

      <DropShadow
        style={{
          shadowColor: 'rgba(0,0,0,0.25)',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 1,
          shadowRadius: 4,
        }}>
        <Button
          width={width}
          onPress={() => {
            navigation.push('DoneResisterFamilyHouse', {});
          }}>
          <ButtonText>인증하기</ButtonText>
        </Button>
      </DropShadow>
    </Container>
  );
};

export default RequestResisterFamilyHouse;
