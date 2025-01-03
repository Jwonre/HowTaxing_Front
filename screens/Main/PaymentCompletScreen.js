import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import Config from 'react-native-config'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

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
const ModalContentSection = styled.View`
  width: 100%;
  height: 10%;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const AdBannerMainImage = styled.Image.attrs(props => ({
  resizeMode: 'stretch',
}))`
  width: 375px;
  height: 375px;
`;


const PaymentCompletScreen = props => {
  const [timer, setTimer] = useState(5);
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();
  const [adBannerdata, SetBannerData] = useState(null);
  const { onPaymentComplete } = props.route.params; // 전달받은 콜백 함수
  const currentUser = useSelector(state => state.currentUser.value);




  const getAdBanner = async () => {
    try {
      const url = `${Config.APP_API_URL}main/mainPopup`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`,
      };

      const response = await axios.get(url, { headers });
      const result = response.data;
      const data = result.data !== undefined ? result.data : null;

      SetBannerData(data);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAdBanner();
      //dispatch(setAdBanner(true));

    }, [])
  );
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
        setProgress(prev => prev + 0.2);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      // 타이머가 0이 되었을 때 네비게이션 실행
      // A로 돌아가면서 스택 초기화
      // A로 돌아가기

      console.log('결제 완료');
      console.log('onPaymentComplete', onPaymentComplete);
      if (props.route.params.onPaymentComplete) {
        console.log('onPaymentComplete is about to be called');
        props.route.params.onPaymentComplete(props.route.params.consultingReservationId);
        // 이전 화면으로 돌아가기
        // if(props?.route?.params?.consultingInflowPath){
        //   navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'ConsultingReservation2' }], // 'A'를 초기 화면으로 설정
        //   });
        // }else{
        //   navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'ConsultingReservation' }], // 'A'를 초기 화면으로 설정
        //   });
        // }

        navigation.goBack();
      } else {
        console.error('onPaymentComplete is not defined at this point');
      }


    }
  }, [timer, navigation]);


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
      {adBannerdata != null ? (
        <ModalContentSection>
          {adBannerdata.targetUrl && <TouchableOpacity style={{ width: '100%', height: '100%' }} activeOpacity={0.8}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }} onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                Linking.openURL(adBannerdata.targetUrl);
              }
            }
            }>
            <AdBannerMainImage source={{ uri: adBannerdata.imageUrl }} />
          </TouchableOpacity>}
          {!adBannerdata.targetUrl &&
            <AdBannerMainImage source={{ uri: adBannerdata.imageUrl }} />
          }
        </ModalContentSection>
      ) : (<Image
        source={require('../../assets/images/banner_15.jpg')}
        style={styles.bannerImage}
      />)}


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
