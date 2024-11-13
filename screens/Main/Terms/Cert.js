// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import CloseIcon from '../../../assets/icons/close_button.svg';
import getFontSize from '../../../utils/getFontSize';
import DropShadow from 'react-native-drop-shadow';
import { SheetManager } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { setCert } from '../../../redux/certSlice';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;


const ButtonSection = styled.View`
  bottom: 10px;
  width: 100%;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => (props.active ? '#2F87FF' : '#e5e5e5')};
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  align-self: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#a3a5a8')};
  line-height: 20px;
`;

const ContentText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 25px;
  margin-top: 20px;
`;

const Cert = props => {
  const navigation = props.navigation;
  const webviewRef = useRef(null);
  ////console.log('navigation2', navigation);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [activeButton, setActiveButton] = useState(true);
  const { certType, agreeCert, agreePrivacy, agreeThird } = useSelector(
    state => state.cert.value,
  );
  //console.log('buttonText === 끝으로 이동하기? false : true || agreeCert', (buttonText === '끝으로 이동하기'? false : true) || agreeCert);
  //console.log('agreeCert', agreeCert);
  const handleBackPress = () => {
    navigation.goBack();
    setTimeout(() => {
      SheetManager.show('cert', {
        payload: {
          index: props.route.params.index,
          navigation: navigation,
        },
      });
    }, 300);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();
            setTimeout(() => {
              SheetManager.show('cert', {
                payload: {
                  index: props.route.params.index,
                  navigation: navigation,
                },
              });
            }, 300);
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '약관 조회하기',
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
      <ProgressSection>
      </ProgressSection>
      <View style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          source={{ uri: 'https://deep-hortensia-87c.notion.site/1116041b8ebc8065a0b3c3b1f67cd1d7' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
          mixedContentMode="always"
        />

      </View>
      <ButtonSection>
        <DropShadow
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,
          }}>
          <Button
            width={width}
            active={agreeCert}
            onPress={() => {
              dispatch(
                setCert({
                  certType,
                  agreePrivacy,
                  agreeCert: true,
                }),
              );

              // 채팅방으로 이동
              navigation.goBack();

              // 전자증명서 서비스 이용약관 동의 후 인증 화면으로 이동
              setTimeout(() => {
                SheetManager.show('cert', {
                  payload: {
                    index: props.route.params.index,
                    navigation: navigation,
                  },
                });
              }, 300);
            }}>
            <ButtonText active={activeButton || agreeCert}>{'동의하기'}</ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection>

    </Container>
  );
};

export default Cert;
