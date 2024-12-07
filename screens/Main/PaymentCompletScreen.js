import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // 화면의 가로 길이를 가져옴

// 배너 이미지의 원본 비율
const BANNER_ASPECT_RATIO = 375 / 375;

const CircularProgress = ({ size, strokeWidth, progress, timer }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={styles.progressWrapper}>
      <Svg width={size} height={size}>
        {/* 백그라운드 원 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 진행 원 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#000"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // 12시 방향으로 시작
        />
      </Svg>
      <Text style={styles.timerText}>{timer}</Text>
    </View>
  );
};

const PaymentCompletScreen = props =>  {
  const [timer, setTimer] = useState(5);
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
        setProgress(prev => prev + 0.2);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      // 타이머가 0이 되었을 때 네비게이션 실행
      navigation.navigate('ConsultingReservation', {});
    }
  }, [timer,navigation]);


  useEffect(() => {
    // 완전히 헤더를 숨김
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.completeText}>결제가 완료되었어요.</Text>
        <Text style={styles.descriptionText}>
          잠시 후 상담 상세내용을 자세하게 알려주세요.
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <CircularProgress size={50} strokeWidth={5} progress={progress} timer={timer} />
      </View>

      <Image
        source={require('../../assets/images/banner_15.jpg')}
        style={styles.bannerImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'flex-start',
    marginTop: 150,
    paddingHorizontal: 20,
  },
  completeText: {
    fontSize: 25,
    fontFamily: 'Pretendard-Bold',
    color: '#1b1c1f',
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#717274',
    marginTop: 10,
  },
  progressContainer: {
    alignItems: 'flex-end',
    marginTop: 60,
    marginRight: 20,
  },
  progressWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  bannerImage: {
    width: width, // 화면 가로 길이에 맞춤
    height: width / BANNER_ASPECT_RATIO, // 가로 길이에 맞춰 비율로 높이 계산
    alignSelf: 'center',
    resizeMode: 'contain', // 비율 유지
  },
});

export default PaymentCompletScreen;
