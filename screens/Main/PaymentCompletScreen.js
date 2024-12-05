

// import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');


// 타이머 & 프로그래스바 관련 컴포넌트
const TimerContainer = styled.View`
  position: absolute;
  bottom: 20px;
  right: 20px;
  align-items: center;
`;

const TimerCircle = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 5;
`;

const ProgressBar = styled.View`
  width: ${props => props.progress * 100}%;
  height: 5px;
  background-color: #2f87ff;
  border-radius: 2.5px;
  margin-top: 10px;
`;

const PaymentCompletScreen = props => {
  const [timer, setTimer] = useState(5); // 5초 타이머
  const [progress, setProgress] = useState(1); // 초기 프로그래스바 100%

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
        setProgress(prev => prev - 0.2); // 프로그래스바 감소
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <View style={styles.container}>
      {/* 상단 완료 메시지 */}
      <View style={styles.topSection}>
        <Text style={styles.completeText}>결제가 완료되었어요.</Text>
        <Text style={styles.descriptionText}>
          잠시 후 상담 상세내용을 자세하게 알려주세요.
        </Text>
      </View>

      {/* 배너 섹션 */}
      <Image
        source={{ uri: 'https://via.placeholder.com/468x120' }} // 배너 이미지 URL
        style={styles.bannerImage}
      />
      <Text style={styles.bannerDescription}>
        AI 세금 계산기로 직접 계산 후 주택 전문 세무사와 무료 상담까지 한 번에 경험하세요.
      </Text>

      {/* 타이머 & 프로그래스바 */}
      <TimerContainer>
        <TimerCircle>
          <Text style={styles.timerText}>{timer}</Text>
        </TimerCircle>
        <ProgressBar progress={progress} />
      </TimerContainer>
    </View>
  );
};

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  completeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b1c1f',
  },
  descriptionText: {
    fontSize: 13,
    color: '#717274',
    marginTop: 8,
  },
  bannerImage: {
    width: width - 40,
    height: 120,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 10,
  },
  bannerDescription: {
    fontSize: 12,
    color: '#717274',
    textAlign: 'center',
    marginTop: 10,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});



export default PaymentCompletScreen;
