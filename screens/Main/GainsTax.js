// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import HomeIcon from '../../assets/images/home_home_lg.svg';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import NetInfo from "@react-native-community/netinfo";
import { setAdBanner } from '../../redux/adBannerSlice';


const Container = styled.View`
  flex: 1;
  background-color: #FFF;
`;

const IntroSection = styled.View`
  flex: 0.5;
  width: 100%;
  padding: 25px;
  justify-content: flex-end;
`;

const Tag = styled.View`
  width: 68px;
  height: 26px;
  background-color: #fff;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  border: 1px solid #2f87ff;
`;

const TagText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #2f87ff;
  line-height: 16px;
  letter-spacing: -0.5px;
`;

const Title = styled.Text`
  font-size: 25px;
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
  line-height: 16px;
  margin-top: 10px;
`;

const HashTagGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`;

const HashTag = styled.View`
  width: auto;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border: 1px solid #e8eaed;
  padding: 0 10px;
`;

const HashTagText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
`;

const IconView = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 25px;
  right: 25px;
  border: 1px solid #e8eaed;
`;

const ChatSection = styled.View`
  flex: 1;
`;

const ChatItem = styled.View`
  width: 100%;
  height: auto;
  padding: 25px;
`;

const Avatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  background-color: '#F0F3F8';
`;

const ChatBubble = styled.View`
  width: 90%;   
  height: auto;
  border-radius: 10px;
  background-color: #f0f3f8;
  align-items: flex-start;
  justify-content: center;
  padding: 15px 25px;
  margin-bottom: 10px;
  margin-top: 8px;
`;

const ChatBubbleText = styled.Text`
  font-size: 14px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 25px;
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


const GainsTax = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }

    }, [handleBackPress]));

  const GAIN_HASHTAG_LIST = [
    '양도소득세 계산',
    '다주택자 세금 컨설팅',
    '일시적 2 주택',
  ];

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

  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      title: '',
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
    dispatch(setAdBanner(false));
  }, []);

  return (
    <Container>
      <IconView>
        <HomeIcon />
      </IconView>
      <IntroSection>
        <Tag>
          <TagText >주택 양도</TagText>
        </Tag>
        <Title >양도소득세 계산하기</Title>

        <SubTitle >
          주택을 양도할 예정인데, 양도소득세가 얼마나 나올까요?
        </SubTitle>
        <HashTagGroup>
          {GAIN_HASHTAG_LIST.map((item, index) => (
            <HashTag key={index}>
              <HashTagText >#{item}</HashTagText>
            </HashTag>
          ))}
        </HashTagGroup>
      </IntroSection>
      <ChatSection>
        <ChatItem>
          <Avatar
            source={
              require('../../assets/images/manAvatar.png')
            }
          />
          <ChatBubble>
            <ChatBubbleText >
              안녕하세요!{'\n'}지금부터 양도소득세를{'\n'}쉽고 정확하게
              계산해드릴 거에요.{'\n'}저만 믿고 끝까지 잘 따라와 주세요!
            </ChatBubbleText>
          </ChatBubble>
        </ChatItem>
      </ChatSection>
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
          onPress={async () => {
            const state = await NetInfo.fetch();
            const canProceed = await handleNetInfoChange(state);
            if (canProceed) {
              navigation.replace('GainsTaxChat');
            }
          }}>
          <ButtonText >시작하기</ButtonText>
        </Button>
      </DropShadow>
    </Container>
  );
};

export default GainsTax;
