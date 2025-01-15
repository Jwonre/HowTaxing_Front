import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { useDispatch } from 'react-redux';
import { setStartPage } from '../../redux/startPageSlice.js';

export default function SplashScreen(props) {
  const dispatch = useDispatch();
  const { navigation } = props;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      // iOS에서 타이머를 사용해 상태 업데이트
      const timer = setTimeout(() => {
        console.log('Animation Finished via Timer (iOS)');
        dispatch(setStartPage(false));
      }, 2000); // 애니메이션 길이에 맞춰 설정
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    }
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animation/json/intro_logo.json')}
        autoPlay
        loop={false}
        onAnimationFinish={
          Platform.OS === 'android'
            ? () => {
                console.log('Animation Finished via onAnimationFinish (Android)');
                dispatch(setStartPage(false));
              }
            : undefined // iOS는 onAnimationFinish 사용 안 함
        }
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
