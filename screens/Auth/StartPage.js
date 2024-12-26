import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setStartPage } from '../../redux/startPageSlice.js';

export default function SplashScreen(props) {
  const dispatch = useDispatch();
  const { navigation } = props;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animation/json/intro_logo.json')}
        autoPlay
        loop={false}
        onAnimationFinish={() => {
          dispatch(setStartPage(false));
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});