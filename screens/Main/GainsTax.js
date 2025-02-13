// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, View, BackHandler } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import HomeIcon from '../../assets/images/home_Gain_lg.svg';
import CloseIcon from '../../assets/icons/close_button.svg';
import WhiteCloseIcon from '../../assets/icons/close_button_white.svg';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import NetInfo from "@react-native-community/netinfo";
import { setAdBanner } from '../../redux/adBannerSlice';


const Container = styled.View`
  flex: 1;
  background-color: #FFF;
`;

const IntroSection = styled.View`
  width: 100%;
  padding: 20px;
  justify-content: flex-end;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;


const Tag = styled.View`
  width: 68px;
  height: 26px;
  background-color: #2f87ff;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  border: 1px solid #2f87ff;
`;

const TagText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 16px;
  letter-spacing: -0.5px;
`;

const Title = styled.Text`
  font-size: 25px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 25px;
  margin-bottom: 8px;
  margin-top: 20px;
  letter-spacing: -0.5px;
`;


const IconView = styled.View`
  bottom: 10;
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
  width: 95%;
  height: auto;
  border-radius: 10px;
  background-color: #f0f3f8;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;

`;

const ChatBubbleText = styled.Text`
  font-size: 14px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 25px;
`;

const ButtonSection = styled.View`
  flex: 0.5;
  padding: 0 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 100%;
  height: 60px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  overflow: visible;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;

const ChatBubbleText2 = styled.Text`
  font-size: 16px;
  color: #fff;
  font-family: Pretendard-Regular;
  margin-bottom: 5px;
`;

const ChatBubble2 = styled.View`
  background-color: #FF7401;
  border-radius: 10px;
  padding: 5px 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
`;

const ChatItem2 = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
`;

const ChatSection2 = styled.View`
  padding: 20px;
  background-color: #F0F3F8;
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();

          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: 'AI 양도소득세 계산기',
      headerShadowVisible: false,
      contentStyle: {
        borderTopColor: '#F7F7F7',
        borderTopWidth: 1,
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
      <ProgressSection>
      </ProgressSection>
      <IntroSection>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Tag>
              <TagText >주택 양도</TagText>
            </Tag>
            <Title >AI 양도소득세 계산기</Title>
          </View>
          <IconView>
            <HomeIcon />
          </IconView>
        </View>
      </IntroSection>
      <ChatSection2>
        <ChatItem2 style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <ChatBubble2>
            <ChatBubbleText2>
              지금 팔면 양도소득세가 얼마지?
            </ChatBubbleText2>
            <View style={{ paddingLeft: 10, paddingBottom: 3 }}>
              <WhiteCloseIcon />
            </View>
          </ChatBubble2>
        </ChatItem2>
        <ChatItem2>
          <ChatBubble2>
            <ChatBubbleText2>
              매도하려는 주택의 정보를 불러올 수 없을까?
            </ChatBubbleText2>
            <View style={{ paddingLeft: 10, paddingBottom: 3 }}>
              <WhiteCloseIcon />
            </View>
          </ChatBubble2>
        </ChatItem2>
        <ChatItem2>
          <ChatBubble2>
            <ChatBubbleText2>
              조정지역에 취득했으면 세법이 어떻게 되지?
            </ChatBubbleText2>
            <View style={{ paddingLeft: 10, paddingBottom: 3 }}>
              <WhiteCloseIcon />
            </View>
          </ChatBubble2>
        </ChatItem2>
        <ChatItem2 style={{ marginBottom: 0 }}>
          <ChatBubble2>
            <ChatBubbleText2>
              언제 팔아야 세금을 줄일 수 있지?
            </ChatBubbleText2>
            <View style={{ paddingLeft: 10, paddingBottom: 3 }}>
              <WhiteCloseIcon />
            </View>
          </ChatBubble2>
        </ChatItem2>
      </ChatSection2>
      <ChatSection>
        <ChatItem>
          <ChatBubble>
            <ChatBubbleText >
              고민하지 않으셔도 똑똑한 하우택싱 AI계산기가{'\n'}
              분석하여 알려드릴 거에요.{'\n'}지금부터 시작해볼까요?
            </ChatBubbleText>
          </ChatBubble>
        </ChatItem>
      </ChatSection>
      <ButtonSection>
        <ShadowContainer>
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
        </ShadowContainer>
      </ButtonSection>
    </Container>
  );
};

export default GainsTax;
