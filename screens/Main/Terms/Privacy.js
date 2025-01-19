// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  BackHandler
} from 'react-native';
import React, { useLayoutEffect, useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import CloseIcon from '../../../assets/icons/close_button.svg';
import { WebView } from 'react-native-webview';
import DropShadow from 'react-native-drop-shadow';
import { SheetManager } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { setCert } from '../../../redux/certSlice';

const Container = styled.View`
  flex: 1;
  background-color: #FFF;
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

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;



const Cert = props => {
  const navigation = props.navigation;
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const webviewRef = useRef(null);
  const { certType, agreeCert, agreePrivacy } = useSelector(
    state => state.cert.value,
  );

  const handleBackPress = () => {

    setTimeout(() => {
      SheetManager.show('cert', {
        payload: {
          index: props.route.params.index,
          navigation: navigation,
        },
      });
    }, 300);
    navigation.goBack();
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

            setTimeout(() => {
              SheetManager.show('cert', {
                payload: {
                  index: props.route.params.index,
                  navigation: navigation,
                },
              });
            }, 300);
            navigation.goBack();
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
          source={{ uri: 'https://www.applyhome.co.kr/co/coz/selectIndvdlinfoPolicyView.do' }}
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
                  agreePrivacy: true,
                  agreeCert,
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
            }
            }>
            <ButtonText>{'동의하기'}</ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection>
    </Container>
  );
};

export default Cert;
