// 개인정보 처리방침

import { View, TouchableOpacity, useWindowDimensions, ScrollView, BackHandler } from 'react-native';
import React, { useLayoutEffect, useState, useRef, useCallback } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import CloseIcon from '../../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { setCert } from '../../../redux/certSlice';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
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

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;


const OwnHousePrivacy = props => {
  const navigation = useNavigation();
  console.log('props', props);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const webviewRef = useRef(null);
  const { agreePrivacy } = useSelector(
    state => state.cert.value,
  );
  console.log('OwnHousePrivacy  pㄴrops.route?.params?.selectedList', props.route?.params?.selectedList);
  const handleBackPress = () => {
    navigation.goBack();
    SheetManager.show(props.route?.params?.prevSheet === 'own2' ? 'own2' : 'own', {
      payload: {
        navigation: navigation,
        prevChat: props.route?.params?.prevChat,
        prevSheet: props.route?.params?.prevSheet,
        index: props.route?.params?.index,
        data: props.route?.params?.data,
        chungYackYn: props.route?.params?.chungYackYn,
        selectedList: props.route?.params?.selectedList,

      },
    });
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
            navigation.goBack();
            SheetManager.show(props.route?.params?.prevSheet === 'own2' ? 'own2' : 'own', {
              payload: {
                navigation: navigation,
                prevChat: props.route?.params?.prevChat,
                prevSheet: props.route?.params?.prevSheet,
                index: props.route?.params?.index,
                data: props.route?.params?.data,
                chungYackYn: props.route?.params?.chungYackYn,
                selectedList: props.route?.params?.selectedList,
              },
            });
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
          source={{ uri: 'https://deep-hortensia-87c.notion.site/06-1366041b8ebc80828db6dcf7cafa3b52?pvs=4' }}
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
            active={agreePrivacy}
            onPress={() => {
              dispatch(
                setCert({
                  agreePrivacy: true,
                }),
              );
              navigation.goBack();
              SheetManager.show(props.route?.params?.prevSheet === 'own2' ? 'own2' : 'own', {
                payload: {
                  navigation: navigation,
                  prevChat: props.route?.params?.prevChat,
                  prevSheet: props.route?.params?.prevSheet,
                  index: props.route?.params?.index,
                  data: props.route?.params?.data,
                  chungYackYn: props.route?.params?.chungYackYn,
                  selectedList: props.route?.params?.selectedList,
                },
              });
            }
            }>
            <ButtonText active={agreePrivacy}>
              {'동의하기'}
            </ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection>
    </Container>
  );
};

export default OwnHousePrivacy;
