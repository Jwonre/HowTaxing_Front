// 개인정보 처리방침

import { View, TouchableOpacity, useWindowDimensions, ScrollView, BackHandler } from 'react-native';
import React, { useLayoutEffect, useState, useRef, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import CloseIcon from '../../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { WebView } from 'react-native-webview';
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


const Privacy2 = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const webviewRef = useRef(null);
  const { agreeCert, agreePrivacy, agreeLocation, agreeAge, agreeMarketing } = useSelector(
    state => state.cert.value,
  );

  
  const handleBackPress = () => {
    navigation.goBack({ tokens: props?.route?.params?.tokens ? props?.route?.params?.tokens : null, id: props?.route?.params?.id ? props?.route?.params?.id : null, password: props?.route?.params?.password ? props?.route?.params?.password : null});
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [handleBackPress])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack({ tokens: props?.route?.params?.tokens ? props?.route?.params?.tokens : null, id: props?.route?.params?.id ? props?.route?.params?.id : null, password: props?.route?.params?.password ? props?.route?.params?.password : null });
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
          source={{ uri: 'https://deep-hortensia-87c.notion.site/04-1116041b8ebc8026bfd7e32c4d1fe76f?pvs=4' }}
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
              dispatch(
                setCert({
                  agreeAge,
                  agreeLocation,
                  agreeMarketing,
                  agreeCert,
                  agreePrivacy: true,
                }),
              );
              navigation.goBack({ tokens: props?.route?.params?.tokens ? props?.route?.params?.tokens : null, id: props?.route?.params?.id ? props?.route?.params?.id : null, password: props?.route?.params?.password ? props?.route?.params?.password : null });

            }
            }>
            <ButtonText>
              {'동의하기'}
            </ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection>
    </Container>
  );
};

export default Privacy2;
