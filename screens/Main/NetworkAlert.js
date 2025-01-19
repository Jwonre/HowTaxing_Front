
import { useWindowDimensions, BackHandler } from 'react-native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
import getFontSize from '../../utils/getFontSize';
import NetInfo from '@react-native-community/netinfo';
import NetworkError from '../../assets/icons/network_error.svg';

const Container = styled.View`
  flex: 1;
  background-color: #FFF;
`;

const Wrapper = styled.View`
  flex: 1;
  padding: 25px;
  alignItems: 'center';
  justifyContent: 'center';
  margin-top: 80px;
`;


const IntroSection = styled.View`
  width: 100%;
  padding: 25px;
  justify-content: center;
  alignItems: 'center';
  margin-top: 130px;
  
`;

const IconView = styled.View`
  width: 100px;
  height: 100px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.Text`
  font-size: 25px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  margin-bottom: 10px;
  margin-top: 20px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 15px;
  margin-top: 6px;
`;


const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  padding: 20px;
  flex: 1;
  justify-content: space-between;
  margin-top: 140px;
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
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const NetworkAlert = props => {
  const navigation = props.navigation;
  const { width } = useWindowDimensions();
  const [isConnected, setIsConnected] = useState(true);
  const handleBackPress = () => {
    if (isConnected) {
      navigation.goBack();
    } 
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <Wrapper>
        <IntroSection>
          <IconView><NetworkError /></IconView>
          <Title >지금 네트워크가 불안정해요.</Title>
          <SubTitle >인터넷 연결상태에 어떤 문제가 있는 것 같아요.{'\n'}통신 상태를 확인하신 후, 다시 시도해주세요.</SubTitle>
        </IntroSection>
        <ButtonSection>
          <DropShadow
            style={{
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              alignSelf: 'center',
              width: width - 80,
            }}>
            <Button
              onPress={() => {
                if (isConnected) {
                  navigation.goBack();
                } 
              }}>
              <ButtonText >다시 시도하기</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </Wrapper>
    </Container>
  );
};

export default NetworkAlert;

