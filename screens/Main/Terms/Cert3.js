// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import styled from 'styled-components';
import CloseIcon from '../../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { SheetManager } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { setCert } from '../../../redux/certSlice';

const Container = styled.View`
  flex: 1;
  background-color: #FFF;
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
  background-color: #2F87FF;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  align-self: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const Cert3 = props => {
  const navigation = props.navigation;
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const webviewRef = useRef(null);
  const { certType, agreeCert, agreePrivacy, agreeLocation, agreeAge, agreeMarketing, agreeCopyright, agreeGov24 } = useSelector(
    state => state.cert.value,
  );

  const handleBackPress = () => {
    navigation.goBack();
    setTimeout(() => {
      SheetManager.show('cert2', {
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
              SheetManager.show('cert2', {
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
            onPress={() => {
              // 동의하기 버튼 클릭 시 redux에 저장
              dispatch(
                setCert({
                  certType,
                  agreePrivacy,
                  agreeCopyright,
                  agreeGov24,
                  agreeCert: true,
                }),
              );

              // 채팅방으로 이동
              navigation.goBack();
              // ////console.log('props.route.params.certType', props.route.params.cert);
              setTimeout(() => {
                SheetManager.show('cert2', {
                  payload: {
                    index: props.route.params.index,
                    navigation: props.navigation,
                  },
                });
              }, 300);


            }
            }>
            <ButtonText>{'동의하기'}</ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection>
    </Container>
  );
};

export default Cert3;
