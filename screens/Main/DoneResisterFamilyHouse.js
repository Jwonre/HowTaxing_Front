// 가족 주택 등록 요청 완료 페이지

import {Alert, TouchableOpacity, useWindowDimensions} from 'react-native';
import React, {useLayoutEffect, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
//import AutoHeightImage from 'react-native-auto-height-image';
import {SheetManager} from 'react-native-actions-sheet';


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

const DoneResisterFamilyHouse = props => {
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
      title: '가족 주택 등록 요청 완료',
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

  useEffect(() => {
    const unscribe = setTimeout(() => {
      navigation.navigate(props.route.parmas.prevChat);
      SheetManager.show(props.route.parmas.prevSheet, {
        payload: {
          navigation,
        },
      });
    }, 5000);

    return () => {
      clearTimeout(unscribe);
    };
  }, []);

  return (
    <Container>
      <IntroSection>
        <Title>
          요청 받으신 분이 “가족주택 보내기”를{'\n'}완료하면, 주택 보유현황으로
          돌아가요
        </Title>
        <AutoHeightImage
          source={require('../../assets/images/request_family_property_img.png')}
          width={width - 50}
          style={{
            marginVertical: 24,
          }}
        />
        <SubTitle>
          - 요청받은 가족이 가족주택 보내기”를 잊은 것 같다면 다시 요청하기
          버튼을 통해 한 번 더 알림을 보낼 수 있어요.
        </SubTitle>
        <SubTitle>- 필요하시다면, 요청을 취소할 수도 있어요.</SubTitle>
      </IntroSection>
      <Button
        width={width}
        style={{
          bottom: 120,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E8EAED',
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <ButtonText
          style={{
            color: '#717274',
          }}>
          요청 취소하기
        </ButtonText>
      </Button>
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
            Alert.alert('API 연동 필요');
          }}>
          <ButtonText>다시 요청하기</ButtonText>
        </Button>
      </DropShadow>
    </Container>
  );
};

export default DoneResisterFamilyHouse;
