// 가족 주택 전달 완료

import {TouchableOpacity, useWindowDimensions} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
//import AutoHeightImage from 'react-native-auto-height-image';
import dayjs from 'dayjs';

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
  text-align: center;
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

const DoneSendFamilyHouse = props => {
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
      title: '가족 주택 전달 완료',
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
        <Title>
          신진성님에게{'\n'}가족 보유 주택을 모두 보냈어요.
          {'\n'}설치하기를 눌러 직접 계산해보세요.
        </Title>
        <AutoHeightImage
          source={require('../../assets/images/request_family_property_img.png')}
          width={width - 50}
          style={{
            marginVertical: 24,
          }}
        />
        <SubTitle>
          {dayjs(new Date()).format('YYYY년 MM월 DD일 HH:mm:ss')}
        </SubTitle>
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
            navigation.push('DoneResisterFamilyHouse');
          }}>
          <ButtonText>설치하기</ButtonText>
        </Button>
      </DropShadow>
    </Container>
  );
};

export default DoneSendFamilyHouse;
