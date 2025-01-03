// 양도소득세 홈페이지

import {
  TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform, StatusBar,
  Dimensions, Image,
} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import { SheetManager, useScrollHandlers } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'
import TaxCard from '../../components/TaxCard';
import TaxInfoCard from '../../components/TaxInfoCard';
import TaxCard2 from '../../components/TaxCard2';
import TaxInfoCard2 from '../../components/TaxInfoCard2';
import HouseInfo from '../../components/HouseInfo';
import Bottompolygon from '../../assets/icons/bottom_polygon.svg';
import EditButtom from '../../assets/icons/edit_Reservation.svg';
import FastImage from 'react-native-fast-image';
import CloseIcon from '../../assets/icons/close_button.svg';
import StatusOffIcon from '../../assets/icons/progress_1.svg';
import StatusOnIcon from '../../assets/icons/progress_2.svg';
import StatusCancelIcon from '../../assets/icons/progress_3.svg';

import ModifyIcon from '../../assets/icons/modify.svg';
import BottomArrow from '../../assets/icons/bottom_arrow.svg';
import BottomArrowUp from '../../assets/icons/bottom_arrow_up.svg';

import ConsultingCancelConfirmAlert from '../Main/component/ConsultingCancelConfirmAlert';
import ConsultingDetailInputAlert from '../Main/component/ConsultingDetailInputAlert';
import ConsultingTaxMultiSelectAlert from '../Main/component/ConsultingTaxMultiSelectAlert';

const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;
const ButtonRowSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
  padding: 20px;
`;


const ButtonRow = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const ButtonRowText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const ButtonSection = styled.View`
margin-top: 10px;
  width: 100%;
   padding: 16px; /* 패딩 추가 */
  background-color: #fff; /* 배경색 설정 */
    position: absolute; /* 버튼을 고정 */
 bottom: 0; /* 화면 하단에 위치 */
  left: 0; /* 왼쪽 시작 */
  right: 0; /* 오른쪽 끝 */
`;
const ProfileAvatar2 = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 40px;
  height: 40px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: left;
  margin-right: 12px;
`;
const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
  disabled: !props.active, // active가 false일 때 버튼 비활성화

}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => (props.active ? '#2F87FF' : '#e5e5e5')};
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: #2F87FF;
`;

const ButtonText = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  line-height: 20px;
  color: #fff;
`;


const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  flex-direction: row;
`;
const ProgressSection = styled.View`
    flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #e8eaed; 
`;

const ReservationDetail = props => {

  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [reservationDetail, setReservationDetail] = useState({});
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser.value);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isModalCancelTypeVisible, setIsModalCancelTypeVisible] = useState(false); // 팝업 상태 관리
  const [isModalTaxVisible, setIsModalTaxVisible] = useState(false); // 팝업 상태 관리
  const [isModalConsultingInputVisible, setIsModalConsultingInputVisible] = useState(false); // 팝업 상태 관리

  const [progressStatus, setProgressStatus] = useState(0);
  const [isTaxResultVisible, setIsTaxResultVisible] = useState(false); // 팝업 상태 관리



  const openCancelTypeModal = () => {
    setIsModalCancelTypeVisible(true); // 팝업 열기
  };

  const closeCancelTypeModal = () => {
    setIsModalCancelTypeVisible(false); // 팝업 닫기
  };

  const openTaxModal = () => {
    setIsModalTaxVisible(true); // 팝업 열기
  };

  const closeTaxModal = () => {
    setIsModalTaxVisible(false); // 팝업 닫기
  };
  const openDetailInputModal = () => {
    setIsModalConsultingInputVisible(true); // 팝업 열기
  };

  const closeDetailInputModal = () => {
    setIsModalConsultingInputVisible(false); // 팝업 닫기
  };


  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleBackPress = () => {
    navigation.goBack();
    return true;
  }
  const consultingTypeMap = {
    '01': '취득세',
    '02': '양도소득세',
    '03': '상속세',
    '04': '증여세'
  };
  const consultingStatusTypeMap = {
    'WAITING': '상담대기',
    'CANCEL': '상담취소',
    'PROGRESS': '상담중',
    'FINISH': '상담완료',
    'PAYMENT_COMPLETED': '결제완료'

  };

  const consultingStatusTypeColorMap = {
    'WAITING': '#A2C62B',
    'CANCEL': '#FF2C65',
    'PROGRESS': '#FF7401',
    'FINISH': '#A82BC6',
    'PAYMENT_COMPLETED': '#A2C62B'

  };
  const consultingStatusTypeIndexMap = {
    'WAITING': 1,
    'CANCEL': 4,
    'PROGRESS': 2,
    'FINISH': 3,
    'PAYMENT_COMPLETED': 0,

  };
  const handleHouseChange1 = async (Date, Time) => {
    setReservationDetail(prevDetail => ({
      ...prevDetail,
      reservationDate: Date,
      reservationStartTime: Time,
    }));
  };

  const handleHouseChange2 = async (Content, Type) => {
    setReservationDetail(prevDetail => ({
      ...prevDetail,
      consultingType: Type,
      consultingRequestContent: Content,
    }));
  };


  const handleCancelRequest = async (selectedType, cancelReason) => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      setConsultingCancel(reservationDetail.consultingReservationId,cancelReason);
      closeCancelTypeModal();
    }

  };

  const handleMultiSelectTaxRequest = async (consultingType) => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    console.log('log_03',canProceed+ ' consultingType :' + consultingType + ' -id : ' + reservationDetail.consultingReservationId);
    if (canProceed) {
      reservationModify(reservationDetail.consultingReservationId,consultingType,null);
      closeTaxModal();
    }

  };
  const handleInputRequest = async (content) => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      reservationModify(reservationDetail.consultingReservationId,null,content);
      closeDetailInputModal();
    }

  };
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])
  );

  console.log('log_id 1', props.route?.params?.consultingReservationId);


  const consultingReservationId = props.route?.params?.consultingReservationId || null;
  useFocusEffect(

    useCallback(() => {
      const id = props.route?.params?.consultingReservationId;
      console.log('log_id 2', id);
      console.log('log_id 4', consultingReservationId);
      if (id) {
        getReservationDetail(consultingReservationId);
      } else {
        console.warn('consultingReservationId 값이 없습니다.');
      }
    }, [props.route?.params?.consultingReservationId])
  );



  const reservationModify = async (consultingReservationId,consultingType,text) => {
    const accessToken = currentUser.accessToken;
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    console.log('log_5 data', consultingReservationId);
    console.log('log_5 data', consultingType);


    // 요청 바디
    const data = text
    ? {
        consultingReservationId: consultingReservationId ?? props.route?.params?.consultingReservationId ?? '',
        consultingRequestContent: text ?? '',
      }
    : {
        consultingReservationId: consultingReservationId ?? props.route?.params?.consultingReservationId ?? '',
        consultingType: consultingType ?? '',
      };
    
     
    console.log('log_5 data', data);
    console.log('headers', headers);
    try {
      const response = await axios.post(`${Config.APP_API_URL}consulting/reservationModify`, data, { headers: headers });
      console.log('log_5  response.data 1', response.data);
      if (response.data.errYn === 'Y') {
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '상담 내용 변경 중 오류가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            buttontext: '확인하기',
          },
        });
      } else {
        console.log('log_5 data', data);
        const consultingReservationId = props.route?.params?.consultingReservationId;
        getReservationDetail(consultingReservationId);
      }
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ? error?.errMsg : '상담 내용 변경 중 오류가 발생했어요.',
        errorMessage: error?.errCode ? error?.errCode : 'error',
        buttontext: '확인하기',
      });
      console.error(error ? error : 'error');
    }
  };

  // 버튼 클릭 핸들러
  const getReservationDetail = async (consultingReservationId) => {
    const url = `${Config.APP_API_URL}consulting/reservationDetail?consultingReservationId=${(consultingReservationId ?? props.route?.params?.consultingReservationId ?? '')}`;
    //const url = `https://devapp.how-taxing.com/consulting/availableSchedule?consultantId=${consultantId}&searchType="${searchType}"`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    /*
    const params = {
      consultantId: consultantId,
      searchType: searchType,
    }*/
    console.log('url', url);
    // console.log('params', params);
    console.log('headers', headers);
    await axios
      .get(url,
        { headers: headers }
      )
      .then(response => {
        console.log('response.data', response.data);
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        } else {
          console.log('response.data', response.data.data);
          const result = response === undefined ? [] : response.data.data;
          if (result) {
            console.log('result:', result);
            //console.log('new Date(list[0]):', new Date(list[0]));
            setReservationDetail({ ...result });

            setProgressStatus(consultingStatusTypeIndexMap[response.data.data.consultingStatus])

          }
        }

      })
      .catch(function (error) {
        SheetManager.show('info', {
          payload: {
            message: '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
            description: error?.message ? error?.message : '오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          }
        });
        ////console.log(error ? error : 'error');
      });
  };


  const setConsultingCancel = async (consultingReservationId,cancelReason) => {
    // const url = `${Config.APP_API_URL}consulting/reservationCancel?consultingReservationId=${consultingReservationId}&cancelReason=${cancelReason}`;
    //const url = `https://devapp.how-taxing.com/consulting/availableSchedule?consultantId=${consultantId}&searchType="${searchType}"`;
   
    /*
    const params = {
      consultantId: consultantId,
      searchType: searchType,
    }*/
  

    const data = {
      consultingReservationId,
      cancelReason,
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };

    // console.log('params', params);
    console.log('headers', headers);
    console.log("log_Request Data: ", data);
    try {
      const response = await axios.post(`${Config.APP_API_URL}consulting/reservationCancel`,data, { headers: headers });
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            buttontext: '확인하기',
          },
        });
        return null; // 실패 시 null 반환
      }
      console.log('response.data', response.data.data);
      const result = response === undefined ? [] : response.data.data;
      if (result) {
        console.log('result:', result);
        //console.log('new Date(list[0]):', new Date(list[0]));
        const consultingReservationId = props.route?.params?.consultingReservationId;
       getReservationDetail(consultingReservationId);

      }
    } catch (error) {
      console.error("Error in setPaymentTemp:", error);
      SheetManager.show('info', {
        payload: {
          message: '상담 예약 상세 내역을 불러오는데 문제가 발생했어요.',
          description: error?.message ? error?.message : '오류가 발생했습니다.',
          type: 'error',
          buttontext: '확인하기',
        }
      });
      return false; // 예외 발생 시 null 반환
    }
     
  };

  const temp = (accessToken, refreshToken) => {
    return [accessToken, refreshToken];
  }


  /**
   * This function is a callback function for NetInfo's
   * event listener. It returns a promise that resolves
   * to true if the internet is connected and false if
   * it is not. It also navigates to the NetworkAlert
   * screen if the internet is not connected.
   *
   * @param {Object} state - The state of the internet
   *   connection.
   *
   * @return {Promise<Boolean>} - A promise that resolves
   *   to true if the internet is connected and false if
   *   it is not.
   */
  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
      if (!state.isConnected && isConnected) {
        setIsConnected(false);
        navigation.push('NetworkAlert', navigation);
        resolve(false);
      } else if (state.isConnected && !isConnected) {
        setIsConnected(true);
        if (!hasNavigatedBackRef.current) {
          setHasNavigatedBack(true);
        }
        resolve(true);
      } else {
        resolve(true);
      }
    });
  };


  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [handleBackPress])
  );



  useLayoutEffect(() => {
    // 상태 표시줄 설정 (전역 설정)
    StatusBar.setBarStyle('dark-content', true); // 아이콘 색상: 어두운 색
    StatusBar.setBackgroundColor('#ffffff'); // 배경색: 흰색 (안드로이드 전용)
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();
            // dispatch(clearHouseInfo());
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),

      headerTitleAlign: 'center',
      title: '상담 예약 상세 정보',
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
    <View style={styles.rootContainer}>
      {/* 파란색 라인 */}
      <ProgressSection>
      </ProgressSection>

      {/* 스크롤 뷰 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* Label */}
          <HoustInfoSection style={{ paddingTop: 10, paddingBottom: 10 }}>
          <ProfileAvatar2 source={reservationDetail?.profileImageUrl ?? require('../../assets/images/Minjungum_Lee_consulting.png')} />
          <Text style={styles.contentPayment}>
              {'#' + `${reservationDetail.consultingReservationId}`}
            </Text>
            <Text style={styles.namePayment}>{reservationDetail?.consultantName ?? ''}</Text>

            <View
              style={{
                marginTop: 5,
                marginStart: 10,
                borderRadius: 50,
                paddingHorizontal: 7,
                justifyContent: 'center', // 수직 가운데 정렬
                alignItems: 'center', // 수평 가운데 정렬
                height: 22,
                backgroundColor:
                  progressStatus === 0
                    ? '#A2C62B' // 상태 0
                    : progressStatus === 1
                      ? '#A2C62B' // 상태 1
                      : progressStatus === 2
                        ? '#FF7401' // 상태 2
                        : progressStatus === 3
                          ? '#A82BC6' // 상태 3
                          : '#FF2C65', // 기본값 또는 기타 상태
              }}
            >

              <Text style={[styles.statusText2, {}]}>
                {progressStatus === 4
                  ? '상담 취소'
                  : progressStatus === 3
                    ? '상담 종료'
                    : progressStatus === 2
                      ? '상담 시작'
                      : progressStatus === 1
                        ? '상담 대기'
                        : '결제 완료'}
              </Text>
            </View>

          </HoustInfoSection>

          <View style={styles.Line1} />

          <Text style={styles.subTitleLabel}>진행 상태 </Text>

          <View style={progressStatus == 4 ? styles.progressStatusCanCel : styles.progressStatus}>

            {/* 세로 라인 */}
            <View style={progressStatus == 4 ? styles.verticalCanCelLine : styles.verticalLine} />
            {/* 상태 아이콘 리스트 */}

            <View style={styles.progressContainer}>
              {Array(progressStatus === 4 ? 2 : 4)
                .fill(0) // 5개의 `View`를 생성
                .map((_, index) => (
                  <View key={index} style={styles.rowInfoProgress}>
                    {/* 아이콘 */}
                    <View
                      style={{
                        position: 'relative',
                        left: progressStatus === 4
                          ? (index + 1 === 1 ? 9: 0) // progressStatus가 4일 때 분기 처리
                          : ((index + 1 === progressStatus + 1) ? 0 : 9), // progressStatus가 4가 아닐 때 기존 로직
                        zIndex: 1,
                      }}
                    >
                      {progressStatus === 4 ? (
                        index +1 === 1 ? (
                          <StatusOffIcon /> // 비활성화 상태
                        ) : (
                          <StatusCancelIcon /> // 활성화 상태
                        )
                      ) : (
                        index + 1 === progressStatus + 1 ? (
                          <StatusOnIcon /> // 활성화 상태
                        ) : (
                          <StatusOffIcon /> // 비활성화 상태
                        )
                      )}
                    </View>

                    {/* 텍스트 */}
                    <Text style={[styles.statusText, { marginStart: (index + 1 === progressStatus + 1) ? 20 : 40 }]}>
                      {progressStatus === 4 // 결제 취소 상태일 때 텍스트 변경
                        ? index === 0
                          ? '결제 완료'
                          : index === 1
                            ? '상담 취소'
                            : ''
                        : index === 0
                          ? '결제 완료'
                          : index === 1
                            ? '상담 대기'
                            : index === 2
                              ? '상담 시작'
                              : '상담 종료'}
                    </Text>
                    <Text style={styles.progressDate}>
                      {(() => {
                        if (!reservationDetail.reservationDate) return ''; // 날짜가 없으면 빈 문자열 반환

                        const formattedDate =
                          reservationDetail.reservationDate.replace(/-/g, '.') + ' ' + reservationDetail.reservationStartTime;

                        if (progressStatus === 4) {
                          // 취소 상태
                          return index === 0 || index === 1 ? formattedDate : '';
                        }

                        if (index <= progressStatus) {
                          // progressStatus에 따라 표시
                          return formattedDate;
                        }

                        return ''; // 조건에 맞지 않으면 빈 문자열 반환
                      })()}
                    </Text>
                  </View>
                ))}

            </View>

          </View>

          <View style={[styles.Line1,{marginBottom : 0}]} />

          {progressStatus === 0 && (
            <ConsultingWating data={reservationDetail} setInTaxSelectDialog={(value) => {
              openTaxModal();
              console.log('log_03', 'value' + value)
            }} setInConsultingInputDialog={(value) => {
              openDetailInputModal();
              console.log('log_03', 'value' + value)
            }} />
          )}
          {progressStatus === 1 && (
            <ConsultingWating data={reservationDetail} setInTaxSelectDialog={(value) => {
              openTaxModal();
              console.log('log_03', 'value' + value)
            }} setInConsultingInputDialog={(value) => {
              openDetailInputModal();
              console.log('log_03', 'value' + value)
            }} />
          )}
          {progressStatus === 2 && (
            <ConsultingStart data={reservationDetail} />
          )}

          {progressStatus === 3 && (
            <ConsultingEnd data={reservationDetail} />
          )}
          {progressStatus === 4 && (
            <CounsultingCancel data={reservationDetail}  />
          )}

          {(reservationDetail.calculationBuyResultResponse != null ||
            reservationDetail.calculationSellResultResponse != null) && (
              <TaxResultMore data={reservationDetail} isTaxResultVisible={isTaxResultVisible} 
              setIsTaxResultVisible={setIsTaxResultVisible} navigation = {navigation} />
            )}
              {(reservationDetail.calculationBuyResultResponse === null ||
            reservationDetail.calculationSellResultResponse === null) && (
              <View style={[{marginBottom : 30}]} />
            )}
          {/* 만료 메시지 */}
          {/* 만료 메시지와 재전송 버튼 */}
        
        </View>


      </ScrollView >

      {progressStatus === 4 || progressStatus === 2 || progressStatus === 3 ? (
        // 두 번째 ButtonSection 렌더링
        <ButtonSection>
          <ShadowContainer>
            <Button
              style={{ backgroundColor: '#2F87FF' }}
              width={width}
              active={true}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <ButtonText style={{ color: '#fff' }}>돌아가기</ButtonText>
            </Button>
          </ShadowContainer>
        </ButtonSection>
      ) : (

        // 첫 번째 ButtonSection 렌더링
        <ButtonRowSection>

          <ButtonRow
          active={true}
            onPress={() => {
              console.log('팝업 먼저 띄워야함');
              // setConsultingCancel(reservationDetail.consultingReservationId);
              openCancelTypeModal();
            }}
            style={{
              width: '48%',
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
              marginRight: 10,
            }}
          >
            <ButtonRowText
              style={{
                color: '#717274',
              }}
            >
              취소하기
            </ButtonRowText>
          </ButtonRow>
          <ButtonRow
                    active={true}

            onPress={() => {
              navigation.goBack();
            }}
            style={{
              width: '48%',

            }}
          >
            <ButtonRowText>돌아가기</ButtonRowText>
          </ButtonRow>
        </ButtonRowSection>
      )}


      <ConsultingCancelConfirmAlert visible={isModalCancelTypeVisible} onClose={closeCancelTypeModal} onCancelRequest={handleCancelRequest} />
      <ConsultingDetailInputAlert visible={isModalConsultingInputVisible} onClose={closeDetailInputModal} onInputCallback={handleInputRequest} />
      <ConsultingTaxMultiSelectAlert consultingType = {reservationDetail.consultingType??""} visible={isModalTaxVisible} onClose={closeTaxModal} onTaxMultiSelect={handleMultiSelectTaxRequest} />

      {/* 모달 */}
    </View >

  );
};
function ConsultingWating({ data, setInTaxSelectDialog, setInConsultingInputDialog }) {
  const consultingTypeMap = {
    '01': '취득세',
    '02': '양도소득세',
    '03': '상속세',
    '04': '증여세'
  };

  const default_date = data?.reservationDate ?? '0000-00-00';
  const type = data?.consultingType ?? '';
  const date = new Date(default_date);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const dayOfWeek = dayNames[date.getDay()];

  const time = data.reservationStartTime ?? '0:0';
  const [hours, minutes] = time.split(':').map(Number); // 시간과 분 분리
  const isPM = hours >= 12; // 12 이상이면 오후
  const formattedHours = isPM ? hours - 12 || 12 : hours || 12; // 12시간제로 변환
  const period = isPM ? '오후' : '오전'; // 오전/오후 결정

  const [year, month, day] = default_date.split('-');
  const dateInfo = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  const timeInfo = `(${period} ${formattedHours}시)`;
  const consultingTypeList = type.split(',');
  const consultingTypes = type.split(',').map(type => consultingTypeMap[type]).join(', ');


  const payment = data?.paymentPrice ?? '0'; // data.paymentPrice가 없으면 기본값 '0'
  return <>
    <View style={styles.inputSection}>
      <Text style={styles.subTitleLabel}>상세 정보</Text>

      <View style={styles.infoBox}>
        {/* 고객명 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약일자</Text>
          <Text style={styles.valueIfno}>{dateInfo}</Text>
        </View>

        {/* 할인 금액 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약시간</Text>
          <View style={{ flexDirection: 'row' ,alignItems: 'center',justifyContent: 'center'}}>
            <Text style={styles.valueIfno}>{data.reservationStartTime}</Text>
            <Text style={styles.valueIfno2}>{timeInfo}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <Text style={styles.labelInfo}>결제 금액</Text>
          <Text style={styles.totalValue}>{payment + '원'} </Text>
        </View>

        {/* 구분선 */}
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={[styles.labelInfo, { marginRight: 5 }]}>세금 종류</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('log_03', 'sdfsdfsdfd');
                setInTaxSelectDialog(true);
              }}
            >
              <ShadowContainer>
                <ModifyIcon width={16} height={16} />
              </ShadowContainer>


            </TouchableOpacity>

          </View>
          <Text style={styles.valueIfno}>{type.trim().length > 0 ? consultingTypes : '상담하실 세금 종류를 선택해주세요.'}</Text>
        </View>

        <View style={styles.separator} />
        <View style={[styles.rowInfo2, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={[styles.labelInfo, { marginRight: 5 }]}>상세 내용</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('log_03', 'setInConsultingInputDialog');

                setInConsultingInputDialog(true);
              }}
            >
              <ShadowContainer>
                <ModifyIcon width={16} height={16} />
              </ShadowContainer>

            </TouchableOpacity>
          </View>
          <Text style={[styles.valueIfno, { marginTop: 10 }]}>{data?.consultingRequestContent ?? '상담하실 세금 내용을 입력해주세요.'}</Text>
        </View>
      </View>
    </View></>
}
function CounsultingCancel({ data }) {
  const consultingTypeMap = {
    '01': '취득세',
    '02': '양도소득세',
    '03': '상속세',
    '04': '증여세'
  };

  const default_date = data?.reservationDate ?? '0000-00-00';
  const type = data?.consultingType ?? '';
  const date = new Date(default_date);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const dayOfWeek = dayNames[date.getDay()];

  const time = data.reservationStartTime ?? '0:0';
  const [hours, minutes] = time.split(':').map(Number); // 시간과 분 분리
  const isPM = hours >= 12; // 12 이상이면 오후
  const formattedHours = isPM ? hours - 12 || 12 : hours || 12; // 12시간제로 변환
  const period = isPM ? '오후' : '오전'; // 오전/오후 결정

  const [year, month, day] = default_date.split('-');
  const dateInfo = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  const timeInfo = `(${period} ${formattedHours}시)`;
  const consultingTypeList = type.split(',');
  const consultingTypes = type.split(',').map(type => consultingTypeMap[type]).join(', ');


  const payment = data?.paymentPrice ?? '0'; // data.paymentPrice가 없으면 기본값 '0'
  return <>
    <View style={styles.inputSection}>
      <Text style={styles.subTitleLabel}>취소 정보</Text>

      <View style={styles.infoBox}>
        {/* 고객명 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>취소 일시</Text>
          <Text style={styles.valueIfno}>{default_date + ' ' + time}</Text>
        </View>


        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>취소 금액</Text>
          <Text style={styles.totalValue}>{payment + '원'} </Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>취소 사유</Text>
          <Text style={styles.valueIfno}>{default_date + ' ' + time}</Text>
        </View>

      </View>
    </View>

    <View style={styles.inputSection}>
      <Text style={styles.subTitleLabel}>상세 정보</Text>

      <View style={styles.infoBox}>
        {/* 고객명 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약일자</Text>
          <Text style={styles.valueIfno}>{dateInfo}</Text>
        </View>

        {/* 할인 금액 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약시간</Text>
          <View style={{ flexDirection: 'row',alignItems: 'center',justifyContent: 'center' }}>
            <Text style={styles.valueIfno}>{data.reservationStartTime}</Text>
            <Text style={styles.valueIfno2}>{timeInfo}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <Text style={styles.labelInfo}>결제 금액</Text>
          <Text style={styles.totalValue}>{payment + '원'} </Text>
        </View>

        {/* 구분선 */}
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <Text style={styles.labelInfo}>세금 종류</Text>
          <Text style={styles.valueIfno}>{consultingTypes}</Text>
        </View>

        <View style={styles.separator} />
        <View style={[styles.rowInfo2, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <Text style={[styles.labelInfo, { marginBottom: 10 }]}>상세 내용</Text>
          <Text style={[styles.valueIfno, {}]}>{data.consultingRequestContent}</Text>
        </View>
      </View>
    </View></>
}

function ConsultingStart({ data }) {
  const consultingTypeMap = {
    '01': '취득세',
    '02': '양도소득세',
    '03': '상속세',
    '04': '증여세'
  };

  const default_date = data?.reservationDate ?? '0000-00-00';
  const type = data?.consultingType ?? '';
  const date = new Date(default_date);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const dayOfWeek = dayNames[date.getDay()];

  const time = data.reservationStartTime ?? '0:0';
  const [hours, minutes] = time.split(':').map(Number); // 시간과 분 분리
  const isPM = hours >= 12; // 12 이상이면 오후
  const formattedHours = isPM ? hours - 12 || 12 : hours || 12; // 12시간제로 변환
  const period = isPM ? '오후' : '오전'; // 오전/오후 결정

  const [year, month, day] = default_date.split('-');
  const dateInfo = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  const timeInfo = `(${period} ${formattedHours}시)`;
  const consultingTypeList = type.split(',');
  const consultingTypes = type.split(',').map(type => consultingTypeMap[type]).join(', ');


  const payment = data?.paymentPrice ?? '0'; // data.paymentPrice가 없으면 기본값 '0'
  return <>
    <View style={styles.inputSection}>
      <Text style={styles.subTitleLabel}>상세 정보</Text>

      <View style={styles.infoBox}>
        {/* 고객명 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약일자</Text>
          <Text style={styles.valueIfno}>{dateInfo}</Text>
        </View>

        {/* 할인 금액 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약시간</Text>
          <View style={{ flexDirection: 'row' ,alignItems: 'center',justifyContent: 'center'}}>
            <Text style={styles.valueIfno}>{data.reservationStartTime}</Text>
            <Text style={styles.valueIfno2}>{timeInfo}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <Text style={styles.labelInfo}>결제 금액</Text>
          <Text style={styles.totalValue}>{payment + '원'} </Text>
        </View>

        {/* 구분선 */}
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <Text style={styles.labelInfo}>세금 종류</Text>
          <Text style={styles.valueIfno}>{consultingTypes}</Text>
        </View>

        <View style={styles.separator} />
        <View style={[styles.rowInfo2, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <Text style={[styles.labelInfo, { marginBottom: 10 }]}>상세 내용</Text>
          <Text style={[styles.valueIfno, {}]}>{data.consultingRequestContent}</Text>
        </View>
      </View>
    </View></>
}
function ConsultingEnd({ data }) {
  const consultingTypeMap = {
    '01': '취득세',
    '02': '양도소득세',
    '03': '상속세',
    '04': '증여세'
  };

  const default_date = data?.reservationDate ?? '0000-00-00';
  const type = data?.consultingType ?? '';
  const date = new Date(default_date);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const dayOfWeek = dayNames[date.getDay()];

  const time = data.reservationStartTime ?? '0:0';
  const [hours, minutes] = time.split(':').map(Number); // 시간과 분 분리
  const isPM = hours >= 12; // 12 이상이면 오후
  const formattedHours = isPM ? hours - 12 || 12 : hours || 12; // 12시간제로 변환
  const period = isPM ? '오후' : '오전'; // 오전/오후 결정

  const [year, month, day] = default_date.split('-');
  const dateInfo = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  const timeInfo = `(${period} ${formattedHours}시)`;
  const consultingTypeList = type.split(',');
  const consultingTypes = type.split(',').map(type => consultingTypeMap[type]).join(', ');


  const payment = data?.paymentPrice ?? '0'; // data.paymentPrice가 없으면 기본값 '0'
  return <>
    <View style={styles.inputSection}>
      <Text style={styles.subTitleLabel}>상세 정보</Text>

      <View style={styles.infoBox}>
        {/* 고객명 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약일자</Text>
          <Text style={styles.valueIfno}>{dateInfo}</Text>
        </View>

        {/* 할인 금액 */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelInfo}>예약시간</Text>
          <View style={{ flexDirection: 'row' ,alignItems: 'center',justifyContent: 'center'}}>
            <Text style={styles.valueIfno}>{data.reservationStartTime}</Text>
            <Text style={styles.valueIfno2}>{timeInfo}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <Text style={styles.labelInfo}>결제 금액</Text>
          <Text style={styles.totalValue}>{payment + '원'} </Text>
        </View>

        {/* 구분선 */}
        <View style={styles.separator} />
        <View style={styles.rowInfo2}>
          <Text style={styles.labelInfo}>세금 종류</Text>
          <Text style={styles.valueIfno}>{consultingTypes}</Text>
        </View>

        <View style={styles.separator} />
        <View style={[styles.rowInfo2, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <Text style={[styles.labelInfo, { marginBottom: 10 }]}>상세 내용</Text>
          <Text style={[styles.valueIfno, {}]}>{data.consultingRequestContent}</Text>
        </View>
      </View>
    </View></>
}
function TaxResultMore({ data, isTaxResultVisible, setIsTaxResultVisible ,navigation}) {
  return <>

    <View style={[styles.inputSection, { marginBottom: 20 }]}>
      <View style={[styles.separator, { marginTop: 20, marginBottom: 20 }]} />

      <View style={[styles.rowInfo, { height: 36 }]}>
        <Text style={{
          fontSize: 16,
          color: '#1b1C1F',
          fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
          lineHeight: 24,

        }}>세금 계산 결과</Text>
        <ButtonRow
          onPress={() => {
            console.log('팝업 먼저 띄워야함');
            // setConsultingCancel(reservationDetail.consultingReservationId);
            setIsTaxResultVisible(!isTaxResultVisible);
          }}
          style={{
            flexDirection: 'row',
            width: 90,
            height: 36,
            backgroundColor: '#fff',
            borderColor: '#E8EAED',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              color: '#717274',
              fontSize: 13,
              fontFamily: 'Pretendard-Medium'
            }}
          >
            {isTaxResultVisible ? '접기' : ' 펼치기'}
          </Text>
          {isTaxResultVisible ? <BottomArrowUp /> : <BottomArrow />}

        </ButtonRow>
      </View>


      {(isTaxResultVisible && data.calculationBuyResultResponse != null) && (

        <InfoCalculationBuyResult data={data.calculationBuyResultResponse}  houseInfo = {data.calculationBuyHouseResponse}  navigation = {navigation}/>
      )}

      {(isTaxResultVisible && data.calculationSellResultResponse != null) && (
        <InfoCalculationSelResult data={data.calculationSellResultResponse} houseInfo = {data.calculationSellHouseResponse} navigation = {navigation} />

      )}
    </View></>
}

function InfoCalculationBuyResult({ data ,houseInfo,navigation}) {
  const HOUSE_TYPE = [
    {
      id: '1',
      name: '아파트',
      color: '#1FC9A8'
    },
    {
      id: '2',
      name: '연립,다가구',
      color: '#A82BC6'

    },
    {
      id: '3',
      name: '입주권',
      color: '#FF2C65'

    },
    {
      id: '4',
      name: '단독주택,다세대',
      color: '#A2C62B'

    },
    {
      id: '5',
      name: '분양권(주택)',
      color: '#FF2C65'

    },
    {
      id: '6',
      name: '주택',
      color: '#FF7401'

    },
  ];
  console.log('log_04', data);
  const renderItem = ({ item, index }) => {
    {/* 소유자 1 */ }
    console.log('log_04', item);

    return (
      <View style={[styles.infoBox, { marginBottom: 10 }]}>
        <View style={[styles.rowInfo, { marginBottom: 10 }]}>
          <View
            style={{
              width: 71,
              marginBottom: 14,
              borderRadius: 50,
              paddingHorizontal: 10,
              justifyContent: 'center', // 수직 가운데 정렬
              alignItems: 'center', // 수평 가운데 정렬
              height: 22,
              backgroundColor:
                '#2F87FF'
            }}
          >

            <Text style={[styles.statusText2, {}]}>
              {'소유자' + (index + 1)}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Bold',
            color: '#2F87FF',
          }]}>
            {'지분율:' + (Number(item?.userProportion ?? '0') * 100).toFixed(2) + '%'}
          </Text>
        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'총 납부세액'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#2F87FF',
            }]}>
              {Number(item?.totalTaxPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
          </View>

        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'취득세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {Number(item?.buyTaxPrice ?? '0')?.toLocaleString() + '원'}

            </Text>
          </View>

        </View>

        <View style={[styles.rowInfo, { marginBottom: 13, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'취득금액 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지분비율 ' + (Number(item?.userProportion ?? '0') * 100).toFixed(2) + '%'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.buyPrice ?? '0')?.toLocaleString() + '원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'취득세율'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.buyTaxRate ?? '0') + '%'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 10 }]} />

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지방교육세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {Number(item?.eduTaxPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
          </View>

        </View>
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'지방교육세율'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.eduTaxRate ?? '0') + '%'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 10 }]} />

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'농어촌특별세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {Number(item?.agrTaxPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
          </View>

        </View>
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'농어촌특별세율율'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.agrTaxRate ?? '0') + '%'}
          </Text>
        </View>
        <View style={[styles.separator, { marginBottom: 10 }]} />

      </View>
    );
  }
  return <>
    <View style={[styles.inputSection]}>
      <View style={[styles.infoBox, { marginBottom: 20, }]}>
        {/* 고객명 */}
        <View style={styles.rowInfo}>
          <View style={
            {
              flexDirection: 'column',
            }
          }>
            <View
              style={{
                width: 47,
                marginBottom: 14,
                borderRadius: 50,
                paddingHorizontal: 10,
                justifyContent: 'center', // 수직 가운데 정렬
                alignItems: 'center', // 수평 가운데 정렬
                height: 22,
                backgroundColor:
                HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)
                ?.color
              }}
            >

              <Text style={[styles.statusText2, {}]}>
              { HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)
                                        ?.name}
              </Text>
            </View>
            <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: 20, color: '#1b1c1f', marginBottom: 10 }}>{houseInfo?.houseName??''}</Text>
            <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: 13, color: '#717274' }}>{houseInfo?.detailAdr??''}</Text>
          </View>
          <ButtonRow
            onPress={() => {
              console.log('팝업 먼저 띄워야함');
              navigation.navigate(
                'HouseDetail',
                {
                  prevSheet: 'ReservationDetail',
                  item:houseInfo,
                },
                'HouseDetail',
              );
              // setConsultingCancel(reservationDetail.consultingReservationId);
              // setIsTaxResultVisible(!isTaxResultVisible);
            }}
            style={{
              flexDirection: 'row',
              width: 90,
              height: 36,
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                color: '#717274',
                fontSize: 13,
                fontFamily: 'Pretendard-Medium'
              }}
            >
              자세히 보기
            </Text>

          </ButtonRow>
        </View>

      </View>


      <FlatList
        data={data?.list ?? []} // 서버에서 받은 list 데이터
        renderItem={renderItem} // 함수 자체를 전달
        keyExtractor={(item, index) => index.toString()} // 고유 키 설정
        scrollEnabled={false} // FlatList 스크롤 비활성화
      />


      {/* 소유자 2 */}
      {/* <View style={styles.infoBox}>
        <View style={[styles.rowInfo, { marginBottom: 10 }]}>
          <View
            style={{
              width: 71,
              marginBottom: 14,
              borderRadius: 50,
              paddingHorizontal: 10,
              justifyContent: 'center', // 수직 가운데 정렬
              alignItems: 'center', // 수평 가운데 정렬
              height: 22,
              backgroundColor:
                '#2F87FF'
            }}
          >

            <Text style={[styles.statusText2, {}]}>
              {'소유자2'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Bold',
            color: '#2F87FF',
          }]}>
            {'지분율:50%'}
          </Text>
        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'총 납부세액'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#2F87FF',
            }]}>
              {'0 원'}
            </Text>
          </View>

        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'취득세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {'0 원'}
            </Text>
          </View>

        </View>

        <View style={[styles.rowInfo, { marginBottom: 13, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'취득금액 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지분비율 50%'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'취득세율'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 10 }]} />

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지방교육세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {'0 원'}
            </Text>
          </View>

        </View>
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'지방교육세율'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 10 }]} />

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'농어촌특별세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {'0 원'}
            </Text>
          </View>

        </View>
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'농어촌특별세율'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>
        <View style={[styles.separator, { marginBottom: 10 }]} />

      </View> */}
    </View >
  </>
}
function InfoCalculationSelResult({ data,houseInfo,navigation }) {
   const HOUSE_TYPE = [
      {
        id: '1',
        name: '아파트',
        color: '#1FC9A8'
      },
      {
        id: '2',
        name: '연립,다가구',
        color: '#A82BC6'

      },
      {
        id: '3',
        name: '입주권',
        color: '#FF2C65'

      },
      {
        id: '4',
        name: '단독주택,다세대',
        color: '#A2C62B'

      },
      {
        id: '5',
        name: '분양권(주택)',
        color: '#FF2C65'

      },
      {
        id: '6',
        name: '주택',
        color: '#FF7401'

      },
    ];
  const renderItem = ({ item, index }) => {
    {/* 소유자 1 */ }
    console.log('log_04', item);

    return (
      <View style={[styles.infoBox, { marginBottom: 10 }]}>
        <View style={[styles.rowInfo, { marginBottom: 10 }]}>
          <View
            style={{
              width: 71,
              marginBottom: 14,
              borderRadius: 50,
              paddingHorizontal: 10,
              justifyContent: 'center', // 수직 가운데 정렬
              alignItems: 'center', // 수평 가운데 정렬
              height: 22,
              backgroundColor:
                '#2F87FF'
            }}
          >

            <Text style={[styles.statusText2, {}]}>
              {'소유자' + (index + 1)}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Bold',
            color: '#2F87FF',
          }]}>
            {'지분비율 ' + (Number(item?.userProportion ?? '0') * 100).toFixed(2) + '%'}
          </Text>
        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'총 납부세액'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#2F87FF',
            }]}>
              {Number(item?.totalTaxPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
          </View>

        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'양도소득세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {Number(item?.sellTaxPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
          </View>

        </View>
        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지방소득세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {Number(item?.localTaxPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
          </View>

        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'양도금액 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지분비율 ' + (Number(item?.userProportion ?? '0') * 100).toFixed(2) + '%'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.sellPrice ?? '0')?.toLocaleString() + '원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'취득금액 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지분비율 ' + (Number(item?.userProportion ?? '0') * 100).toFixed(2) + '%'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.buyPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'필요경비'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.necExpensePrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 12 }]} />

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'양도차익 '}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.sellProfitPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'비과세 대상 양도차익 '}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.nonTaxablePrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'과세 대상 양도차익'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.taxablePrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 12 }]} />

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'장기보유특별공제제 '}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.longDeductionPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'양도소득금액'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.sellIncomePrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 12 }]} />
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'기본공제 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'(납세의무자별)'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.basicDeductionPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'과세표준'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.taxableStdPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'세율'}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.sellTaxRate ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'누진공제'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {Number(item?.progDeductionPrice ?? '0')?.toLocaleString() + '원'}
            </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 10 }]} />

      </View>
    );
  }

  return <>
    <View style={[styles.inputSection]}>
      <View style={[styles.infoBox, { marginBottom: 20, }]}>
        {/* 고객명 */}
        <View style={styles.rowInfo}>
          <View style={
            {
              flexDirection: 'column',
            }
          }>
            <View
              style={{
                width: 47,
                marginBottom: 14,
                borderRadius: 50,
                paddingHorizontal: 10,
                justifyContent: 'center', // 수직 가운데 정렬
                alignItems: 'center', // 수평 가운데 정렬
                height: 22,
                backgroundColor:
                HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)
                ?.color
              }}
            >

              <Text style={[styles.statusText2, {}]}>
                { HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)
                                        ?.name}
              </Text>
            </View>
            <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: 20, color: '#1b1c1f', marginBottom: 10 }}>{houseInfo?.houseName??''}</Text>
            <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: 13, color: '#717274' }}>{houseInfo?.detailAdr??''}</Text>
          </View>
          <ButtonRow
            onPress={() => {
              console.log('팝업 먼저 띄워야함');
              // setConsultingCancel(reservationDetail.consultingReservationId);
              // setIsTaxResultVisible(!isTaxResultVisible);

              navigation.navigate(
                'HouseDetail',
                {
                  prevSheet: 'ReservationDetail',
                  item:houseInfo,
                },
                'HouseDetail',
              );
            }}
            style={{
              flexDirection: 'row',
              width: 90,
              height: 36,
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                color: '#717274',
                fontSize: 13,
                fontFamily: 'Pretendard-Medium'
              }}
            >
              자세히 보기
            </Text>

          </ButtonRow>
        </View>

      </View>


      <FlatList
        data={data?.list ?? []} // 서버에서 받은 list 데이터
        renderItem={renderItem} // 함수 자체를 전달
        keyExtractor={(item, index) => index.toString()} // 고유 키 설정
        scrollEnabled={false} // FlatList 스크롤 비활성화
      />



      {/* 소유자 2 */}
      {/* <View style={[styles.infoBox, { marginBottom: 10 }]}>
        <View style={[styles.rowInfo, { marginBottom: 10 }]}>
          <View
            style={{
              width: 71,
              marginBottom: 14,
              borderRadius: 50,
              paddingHorizontal: 10,
              justifyContent: 'center', // 수직 가운데 정렬
              alignItems: 'center', // 수평 가운데 정렬
              height: 22,
              backgroundColor:
                '#2F87FF'
            }}
          >

            <Text style={[styles.statusText2, {}]}>
              {'소유자2'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Bold',
            color: '#2F87FF',
          }]}>
            {'지분율:50%'}
          </Text>
        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'총 납부세액'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#2F87FF',
            }]}>
              {'0 원'}
            </Text>
          </View>

        </View>

        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'양도소득세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {'0 원'}
            </Text>
          </View>

        </View>
        <View style={[styles.infoBox, { marginBottom: 10 }]}>
          <View style={[styles.rowInfo, { paddingVertical: 10, alignItems: 'center' }]}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지방소득세'}
            </Text>

            <Text style={[styles.statusText2, {
              fontSize: 13,
              fontFamily: 'Pretendard-Bold',
              color: '#1b1c1f',
            }]}>
              {'0 원'}
            </Text>
          </View>

        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'양도금액 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지분비율 50%'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'취득금액 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'지분비율 50%'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'필요경비'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 12 }]} />

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'양도차익 '}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'비과세 대상 양도차익 '}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'과세 대상 양도차익'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 12 }]} />

        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'장기보유특별공제제 '}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'양도소득금액'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 12 }]} />
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'기본공제 '}
            </Text>
            <Text style={[styles.statusText2, {
              fontSize: 10,
              fontFamily: 'Pretendard-Medium',
              color: '#1b1c1f',
            }]}>
              {'(납세의무자별)'}
            </Text>
          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'과세표준'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>
        <View style={[styles.rowInfo, { marginBottom: 10, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={[styles.statusText2, {
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: '#1b1c1f',
            }]}>
              {'세유'}
            </Text>

          </View>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.rowInfo, { marginBottom: 12, alignItems: 'center' }]}>
          <Text style={[styles.statusText2, {
            fontSize: 12,
            fontFamily: 'Pretendard-Medium',
            color: '#1b1c1f',
          }]}>
            {'누진공제'}
          </Text>

          <Text style={[styles.statusText2, {
            fontSize: 13,
            fontFamily: 'Pretendard-Medium',
            color: '#a3a5a8',
          }]}>
            {'0 원'}
          </Text>
        </View>

        <View style={[styles.separator, { marginBottom: 10 }]} />

      </View> */}
    </View >
  </>
}
const styles = StyleSheet.create({
  timerText: {
    fontSize: 13,
    color: '#FF7401', // 빨간색 텍스트
    marginRight: 10,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blueLine: {
    height: 5, // 라인 두께
    backgroundColor: '#2f87ff', // 파란색
  },
  bigTitle: {
    fontSize: 20,
    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    lineHeight: 24,
  },

  subTitleLabel: {
    fontSize: 17,

    color: '#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리

    marginBottom: 20,
  },
  progressStatus: {
    height: 150,
    flexDirection: 'row',
  },

  progressStatusCanCel: {
    height: 60,
    flexDirection: 'row',
  },
  verticalCanCelLine: {
    position: 'absolute',
    left: 13, // 라인의 위치
    top: 0,
    width: 2,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    // height:180,
    backgroundColor: '#BDBDBD',
  },
  verticalLine: {
    position: 'absolute',
    left: 13, // 라인의 위치
    top: 0,
    width: 2,
    height: 130,
    marginTop: 10,
    marginBottom: 10,
    // height:180,
    backgroundColor: '#BDBDBD',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // 아이콘을 라인 위에 겹치도록 설정
  },
  progressContainer: {
    flex: 1,

  },
  rowInfoProgress: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20, // 각 행 간 간격
  },
  iconAndTextContainer: {
    flexDirection: 'row', // 아이콘과 텍스트를 수평으로 배치
    // alignItems: 'center', // 세로축 중앙 정렬
  },
  statusText2: {
    fontSize: 10,
    fontFamily: 'Pretendard-Medium',
    color: '#fff',
    // marginLeft: 10, // 아이콘과 텍스트 간 간격
  },
  statusText: {
    fontFamily: 'Pretendard-Bold',

    fontSize: 13,
    color: '#000',
    // marginLeft: 10, // 아이콘과 텍스트 간 간격
  },
  progressDate: {
    fontSize: 10,
    fontFamily: 'Pretendard-Bold',

    color: '#717274',
    marginLeft: 10, // 아이콘과 텍스트 간 간격
  },
  iconContainer: {
    position: 'relative', // 아이콘을 라인 위에 배치
    left: 0, // 라인의 위치와 맞춤
    zIndex: 1, // 라인 위에 배치
  },
  infoBox: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d9d9d9', // 연한 테두리
    alignSelf: 'center',
  },

  textContainer: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  // statusText: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  dateText: {
    fontSize: 14,
    color: '#757575',
  },

  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // 각 행 간 간격
  },
  rowInfo2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10, // 각 행 간 간격
    marginBottom: 10, // 각 행 간 간격
  },

  labelInfo: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#717274', // 회색 텍스트
  },
  valueIfno: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    color: '#a3a5a8', // 회색 텍스트
  },
  valueIfno2: {
    fontSize: 10,
    marginStart: 2,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    color: '#a3a5a8', // 회색 텍스트
  },
  totalValue: {
    fontSize: 13,
    color: '#2F87FF', // 파란 텍스트
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
  },
  separator: {
    height: 1,
    backgroundColor: '#E8EAED', // 구분선 색상
  },
  content: {
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    marginBottom: 30,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 80, // 버튼 공간 확보
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  secondContent: {
    marginTop: 20,
  },
  inputSection: {
    marginTop: 22,
  },
  Line1: {
    height: 1, // 라인 두께
    backgroundColor: '#E8EaEd', // 파란색
    marginBottom: 20,
    marginTop: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
  },
  timeText: {
    marginTop: 5,
  },
  timeHighlight: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#1B1C1F',
  },
  timeSubtext: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
    color: '#1B1C1F',
  },
  titleText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
    color: '#717274',
    marginBottom: 4,
  },



  contentPayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    marginStart: 10,

    color: '#1b1c1f',
  },

  namePayment: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    marginStart: 10,
    color: '#717274',
  },
});



export default ReservationDetail;
