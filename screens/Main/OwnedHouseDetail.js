/* eslint-disable prettier/prettier */
// 보유 주택 상세 정보 페이지

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  BackHandler,
} from 'react-native';
import Switch from 'react-native-draggable-switch';
import React, { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import EditGreyIcon from '../../assets/icons/edit_grey.svg';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import getFontSize from '../../utils/getFontSize';
import NaverMapView, { Marker } from 'react-native-nmap';
import { SheetManager } from 'react-native-actions-sheet';
import { HOUSE_TYPE } from '../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { editOwnHouseList } from '../../redux/ownHouseListSlice';
import dayjs from 'dayjs';
import InfoIcon from '../../assets/icons/info_tooltip_ico.svg';
import NetInfo from "@react-native-community/netinfo";
import numberToKorean from '../../utils/numToKorean';
import Config from 'react-native-config'

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #f5f7fa;
`;

const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
`;

const MapContainer = styled.View`
  width: 100%;
  height: 150px;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
`;

const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 24px;
  margin-bottom: 7px;
  margin-top: 4px;
`;

const HoustInfoText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
`;

const HoustInfoBadge = styled.View`
  width: auto;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-right: 5;
  margin-bottom: 10px;
`;

const HoustInfoBadgeText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;

const NecessaryInfoBadge = styled.View`
  width: auto;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-right: 10px;
`;

const NecessaryInfoBadgeText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;

const InputSection = styled.View`
  flex: 1;
  background-color: #f7f8fa;
  padding: 0px 20px;
`;

const Paper = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px;
  border: 1px solid #e8eaed;
`;

const Label = styled.Text`
font-size: 12px;
font-family: Pretendard-Regular;
color: #97989a;
  line-height: 16px;
  margin-bottom: 10px;
`;

const HouseSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 20px;
`;

const InfoContentSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #f7f8fa;
  padding: 10px 20px 0;
`;
const InfoContentItem = styled.View`
  width: 100%;
  height: 56px;
  background-color: #fff;
  border-radius: 6px;
  padding: 0 18px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: #e8eaed;
`;

const InfoContentLabel = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #97989a;
  line-height: 20px;
  letter-spacing: -0.3px;
`;

const InfoContentText = styled.Text`
  font-size: 14px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  margin-left: auto;
  margin-right: 20px;
  text-align: right;

`;


const OwnedHouseDetail = props => {
  const { item, prevSheet } = props.route.params;
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const currentUser = useSelector(state => state.currentUser.value);

  const [location, setLocation] = useState({
    latitude: 37.5326,
    longitude: 127.024612,
  });
  const [pData, setpData] = useState(item);
  const [data, setData] = useState(null);
  const ownHouseList = useSelector(state => state.ownHouseList.value);
  const dispatch = useDispatch();
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);



  useEffect(() => {
    //console.log('props?.payload?.prevSheet', prevSheet)
    /*if (item?.houseId !== '222') {*/
    if (prevSheet) {
      getHouseDetailInfo();
    }


    /* } else {
       getHouseDirectDetailInfo();
 
     }*/

  }, []);

  /* useEffect(() => {
     ////console.log('초기 data', data);
   }, [data]);
  //  useEffect(() => {
  //  }, [movingInRight]);


  const onAddressSelect = async (detailAddress2) => {
    console.log('detailAddress2', detailAddress2);
    return detailAddress2;
  };


*/
  const handleHouseChange = async (target, newMoveInRight) => {
    //////console.log('[OwnedHouseDetail]onValueChange Yn', newMoveInRight);
    //////console.log('[OwnedHouseDetail]handleHouseChange tempMovingInRight:', tempMovingInRight);
    //const MIR = (newMoveInRight === null ? tempMovingInRight : newMoveInRight);
    //tempMovingInRight = MIR;
    //setMovingInRight(MIR);

    //////console.log('[OwnedHouseDetail]handleHouseChange tempMovingInRight:', MIR);
    //////console.log('[OwnedHouseDetail]handleHouseChange MIR:', tempMovingInRight);
    //////console.log('[OwnedHouseDetail]handleHouseChange data:', data);
    //////console.log('[OwnedHouseDetail]handleHouseChange target:', target);
    /* if (
       data.area !== target.area ||
       data.balanceDate !== target.balanceDate ||
       data.bdMgtSn !== target.bdMgtSn ||
       data.buyDate !== target.buyDate ||
       data.buyPrice !== target.buyPrice ||
       data.contractDate !== target.contractDate ||
       data.destruction !== target.destruction ||
       data.detailAdr !== target.detailAdr ||
       data.houseId !== target.houseId ||
       data.houseName !== target.houseName ||
       data.houseType !== target.houseType ||
       data.jibunAddr !== target.jibunAddr ||
       data.kbMktPrice !== target.kbMktPrice ||
       data.moveInRight !== MIR ||
       data.ownerCnt !== target.ownerCnt ||
       data.pubLandPrice !== target.pubLandPrice ||
       data.roadAddr !== target.roadAddr ||
       data.roadAddrRef !== target.roadAddrRef ||
       data.userProportion !== target.userProportion
     ) {*/
    dispatch(editOwnHouseList(target));
    // ////console.log('edit own house list', ownHouseList);
    //////console.log('MIR', MIR);
    //target.isMoveInRight = MIR;
    //////console.log('target', target);
    setData(target);
    //await 
    /* if (data?.houseId !== '222') {      }*/
    putHouseDetailInfoUpdate(newMoveInRight);

    //부모창의 정보와 자식창의 정보를 맞춰주는 코드(API 반영시 제거)
    // setpData({ 'houseDetailName': target.houseDetailName, 'houseId': pData.houseId, 'houseName': target.houseName, 'houseType': target.houseType, 'userId': pData.userId });

    //API CALL: 상세정보 update
    //putHouseDetailInfoUpdate();



    //   }


  };
  const putHouseDetailInfoUpdate = async (newMoveInRight) => {

    // houseId | Long | 주택ID
    // houseType | String | 주택유형
    // houseName | String | 주택명
    // detailAdr | String | 상세주소
    // contractDate | LocalDate | 계약일자
    // balanceDate | LocalDate | 잔금지급일자
    // buyDate | LocalDate | 취득일자
    // moveInDate | LocalDate | 전입일자
    // moveOutDate | LocalDate | 전출일자
    // buyPrice | Long | 취득금액
    // pubLandPrice | Long | 공시가격
    // kbMktPrice | Long | KB시세
    // jibunAddr | String | 지번주소
    // roadAddr | String | 도로명주소
    // roadAddrRef | String | 도로명주소참고항목
    // bdMgtSn | String | 건물관리번호
    // admCd | String | 행정구역코드
    // rnMgtSn | String | 도로명코드
    // area | String | 전용면적
    // isDestruction | boolean | 멸실여부
    // ownerCnt | Integer | 소유자수
    // userProportion | Integer | 본인지분비율
    // moveInRight | boolean | 입주권여부

    const url = `${Config.APP_API_URL}house/modify`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };

    const param = {
      houseId: data?.houseId === undefined ? '' : data?.houseId,
      houseType: data?.houseType === undefined ? '' : data?.houseType,
      houseName: data?.houseName === undefined ? '' : data?.houseName,
      detailAdr: data?.detailAdr === undefined ? '' : data?.detailAdr,
      contractDate: data?.contractDate === undefined ? '' : data?.contractDate,
      balanceDate: data?.balanceDate === undefined ? '' : data?.balanceDate,
      buyDate: data?.buyDate === undefined ? '' : data?.buyDate,
      moveInDate: data?.moveInDate === undefined ? '' : data?.moveInDate,
      moveOutDate: data?.moveOutDate === undefined ? '' : data?.moveOutDate,
      buyPrice: data?.buyPrice === undefined ? '' : data?.buyPrice,
      pubLandPrice: data?.pubLandPrice === undefined ? '' : data?.pubLandPrice,
      kbMktPrice: data?.kbMktPrice === undefined ? '' : data?.kbMktPrice,
      jibunAddr: data?.jibunAddr === undefined ? '' : data?.jibunAddr,
      roadAddr: data?.roadAddr === undefined ? '' : data?.roadAddr,
      roadAddrRef: data?.roadAddrRef === undefined ? '' : data?.roadAddrRef,
      bdMgtSn: data?.bdMgtSn === undefined ? '' : data?.bdMgtSn,
      admCd: data?.admCd === undefined ? '' : data?.admCd,
      rnMgtSn: data?.rnMgtSn === undefined ? '' : data?.rnMgtSn,
      area: (data?.area === undefined || data?.area === null) ? '' : data?.area,
      isDestruction: data?.destruction === undefined ? '' : data?.destruction,
      ownerCnt: (data?.ownerCnt === undefined || data?.ownerCnt === null) ? 1 : data?.ownerCnt,
      userProportion: (data?.userProportion === undefined || data?.userProportion === null) ? 100 : data?.userProportion,
      isMoveInRight: newMoveInRight === undefined ? '' : newMoveInRight,
    };

    //console.log('[OwnedHouseDetail]headers:', headers);
    //console.log('[OwnedHouseDetail]param:', param);
    try {
      //console.log('before data', data);
      const response = await axios.put(url, param, { headers: headers });
      //  ////console.log('[OwnedHouseDetail]update response:', response);
      //  ////console.log('[OwnedHouseDetail]update response.data:', response.data);
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '보유주택 수정 중 오류가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            buttontext: '확인하기',
          },
        });
        return;
      } else {
        const p = param;
        //////console.log('after data', param)
        setData(null);
        setData(p);
      }
    } catch (e) {
      // 오류 처리
      SheetManager.show('info', {
        payload: {
          message: '보유주택 수정 중 오류가 발생했습니다.',
          description: e?.message,
          type: 'error',
          buttontext: '확인하기',
        },
      });
      ////console.log('에러', e);
    }


  };


  /*const getHouseDirectDetailInfo = async () => {
    ////console.log('[OwnedHouseDetail] direct item', item)
    await getAPTLocation(item?.roadAddr);
    setData(item);
    tempMovingInRight = item?.moveInRight;
    setMovingInRight(tempMovingInRight);

  };*/

  const getHouseDetailInfo = async () => {
    try {
      const url = `${Config.APP_API_URL}house/detail?houseId=${pData?.houseId}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`,
      };

      //console.log('[OwnedHouseDetail] getHouseDetailInfo pData:', pData);

      const response = await axios.get(url, { headers });
      //console.log('[OwnedHouseDetail] response :', response);
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '보유주택 상세조회 중 오류가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            buttontext: '확인하기',
          },
        });
        return;

      } else {
        const houseDetails = response.data.data;
        //console.log('houseDetails', houseDetails);
        await getAPTLocation(houseDetails.roadAddr);
        setData(houseDetails);
        //const tempMovingInRight = houseDetails.isMoveInRight;
        //setMovingInRight(tempMovingInRight);

        //////console.log('[OwnedHouseDetail] getHouseDetailInfo tempMovingInRight:', tempMovingInRight);
        //////console.log('[OwnedHouseDetail] getHouseDetailInfo movingInRight:', movingInRight);
      }

    } catch (error) {
      // console.error('[OwnedHouseDetail] getHouseDetailInfo Error:', error);
      SheetManager.show('info', {
        payload: {
          message: '보유주택 상세조회 중 오류가 발생했습니다.',
          description: error?.message,
          type: 'error',
          buttontext: '확인하기',
        },
      });
    }
  };

  const getAPTLocation = async (address) => {
    try {
      const API_KEY = 'e094e49e35c61a9da896785b6fee020a';
      const config = {
        headers: {
          Authorization: `KakaoAK ${API_KEY}`,
        },
      };
      const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        address
      )}`;

      const response = await axios.get(url, config);
      const firstDocument = response.data.documents[0];
      setLocation({
        latitude: Number(firstDocument.y),
        longitude: Number(firstDocument.x),
      });
    } catch (error) {
      console.error(error);
      SheetManager.show('info', {
        payload: {
          message: '주소를 찾을 수 없습니다.',
          description: error?.message,
          type: 'error',
          buttontext: '확인하기',
        },
      });
    }
  };

  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
      if (!state.isConnected) {

        navigation.push('NetworkAlert', navigation);
        resolve(false);
      } else if (state.isConnected) {

        if (!hasNavigatedBackRef.current) {
          setHasNavigatedBack(true);
        }
        resolve(true);
      } else {
        resolve(true);
      }
    });
  };


  const updateHouseName = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      await SheetManager.show('updateHouseNameAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
    }
  };

  const updateHouseType = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      await SheetManager.show('chooseHouseTypeAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
    }

  };

  const updateAddress = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      var DongHo;
      await SheetManager.show('updateAddressAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
          getAPTLocation,
          onAddressSelect: (detailAddress2) => {
            //console.log('detailAddress2', detailAddress2);
            DongHo = detailAddress2;
          }
        },
      });
      //console.log('DongHo',DongHo);
      await updateHouseDetailName(DongHo);
    }
  };


  const updateHouseDetailName = async (DongHo) => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      await SheetManager.show('updateHouseDetailNameAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          DongHo,
          handleHouseChange,
        },
      });
    }

  };

  const updateContractDate = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      await SheetManager.show('updateContractDateAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
    }

  };

  const updateBuyDate = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      await SheetManager.show('updateBuyDateAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
    }

  };
  const updateBuyPrice = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      await SheetManager.show('updateBuyPriceAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
    }

  };


  /*
    const updateBalanceDate = async () => {
      await SheetManager.show('updateBalanceDateAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
  
  
    };
  
    const updateMoveInDate = async () => {
      await SheetManager.show('updateMoveInDateAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
  
    };
  
    const updateMoveOutDate = async () => {
      await SheetManager.show('updateMoveOutDateAlert', {
        payload: {
          navigation,
          data,
          prevSheet,
          handleHouseChange,
        },
      });
    };
  
  */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            //  ////console.log('초기 data', data)
            if ((data?.houseType === '' || data?.houseType === null || data?.houseType === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '주택유형을 입력해 주세요.',
                  buttontext: '확인하기',

                },
              }); return;
            }
            else if ((data?.roadAddr === '' || data?.roadAddr === null || data?.roadAddr === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '주소를 검색해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            else if ((data?.detailAdr === '' || data?.detailAdr === null || data?.detailAdr === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '상세주소를 입력해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            else if ((data?.jibunAddr === '' || data?.jibunAddr === null || data?.jibunAddr === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '지번주소가 없어요.\n주소를 다시 검색해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            else if ((data?.roadAddr === '' || data?.roadAddr === null || data?.roadAddr === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '도로명주소가 없어요.\n주소를 다시 검색해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            else if ((data?.bdMgtSn === '' || data?.bdMgtSn === null || data?.bdMgtSn === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '건물관리번호가 없어요.\n주소를 다시 검색해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            else if ((props.route.params?.prevSheet == 'own2') && (data?.contractDate === '' || data?.contractDate === null || data?.contractDate === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '취득계약일자를 입력해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            else if ((props.route.params?.prevSheet == 'own2') && (data?.buyDate === '' || data?.buyDate === null || data?.buyDate === undefined)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '취득일자를 입력해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            else if ((props.route.params?.prevSheet == 'own2') && (data?.buyPrice === '' || data?.buyPrice === null || data?.buyPrice === undefined || data?.buyPrice === undefined || data?.buyPrice === 0)) {
              SheetManager.show('info', {
                payload: {
                  type: 'info',
                  message: '취득금액을 입력해 주세요.',
                  buttontext: '확인하기',
                },
              }); return;
            }
            if (ownHouseList?.find(item => item.houseId === data?.houseId)) {
              dispatch(editOwnHouseList({ ...item, houseName: data?.houseName, detailAdr: data?.detailAdr, houseType: data?.houseType, isMoveInRight: data?.isMoveInRight, isRequiredDataMissing: false }));
            }


            navigation.goBack();
            if (!props.route.params?.prevSheet) return;
            //////console.log(props.route.params?.prevSheet);

            SheetManager.show(props.route.params?.prevSheet, {
              payload: {
                navigation,
                index: props?.route?.params?.index,
                data: props?.route?.params?.data,
                chungYackYn: props?.route?.params?.chungYackYn
              },
            });
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            SheetManager.show('delete', {
              payload: {
                title: '주택 삭제',
                navigation,
                content: '주택을 삭제하시겠습니까?',
                confirmText: '삭제',
                cancelText: '취소',
                item: item,
                prevSheet,
                index: props?.route?.params?.index,
                data: props?.route?.params?.data,
                chungYackYn: props?.route?.params?.chungYackYn
              },
            });

          }}>
          <Text

            style={{
              fontFamily: 'Pretendard-Regular',
              fontSize: 13,
              color: '#FF7401',
              letterSpacing: -0.3,
            }}>
            주택 삭제
          </Text>
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '보유 주택 상세 정보',
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
  }, [props.route.params?.prevSheet, data]);


  // 하드웨어 백 버튼 핸들러 정의
  const handleBackPress = () => {
    if ((data?.houseType === '' || data?.houseType === null || data?.houseType === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '주택유형을 입력해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((data?.roadAddr === '' || data?.roadAddr === null || data?.roadAddr === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '주소를 검색해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((data?.detailAdr === '' || data?.detailAdr === null || data?.detailAdr === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '상세주소를 입력해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((data?.jibunAddr === '' || data?.jibunAddr === null || data?.jibunAddr === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '지번주소가 없어요.\n주소를 다시 검색해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((data?.roadAddr === '' || data?.roadAddr === null || data?.roadAddr === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '도로명주소가 없어요.\n주소를 다시 검색해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((data?.bdMgtSn === '' || data?.bdMgtSn === null || data?.bdMgtSn === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '건물관리번호가 없어요.\n주소를 다시 검색해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((props.route.params?.prevSheet == 'own2') && (data?.contractDate === '' || data?.contractDate === null || data?.contractDate === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '취득계약일자를 입력해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((props.route.params?.prevSheet == 'own2') && (data?.buyDate === '' || data?.buyDate === null || data?.buyDate === undefined)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '취득일자를 입력해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }
    else if ((props.route.params?.prevSheet == 'own2') && (data?.buyPrice === '' || data?.buyPrice === null || data?.buyPrice === undefined || data?.buyPrice === undefined || data?.buyPrice === 0)) {
      SheetManager.show('info', {
        payload: {
          type: 'info',
          message: '취득금액을 입력해 주세요.',
          buttontext: '확인하기',
        },
      }); return true;
    }

    if (ownHouseList?.find(item => item.houseId === data?.houseId)) {
      dispatch(editOwnHouseList({ ...item, houseName: data?.houseName, detailAdr: data?.detailAdr, houseType: data?.houseType, isMoveInRight: data?.isMoveInRight, isRequiredDataMissing: false }));
    }
    navigation.goBack();
    if (!props.route.params?.prevSheet) return true;
    //////console.log(props.route.params?.prevSheet);
    SheetManager.show(props.route.params?.prevSheet, {
      payload: {
        navigation,
        index: props?.route?.params?.index,
        data: props?.route?.params?.data,
        chungYackYn: props?.route?.params?.chungYackYn
      },
    });
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      // 이벤트 리스너 추가
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])); // 의존성 배열에 navigation과 params 추가





  return (
    <Container>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='always'
        enableAutomaticScroll={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}>
        <>
          <HouseSection>
            <HoustInfoSection>
              <View style={{ width: 'auto', flexDirection: 'row' }}>
                <HoustInfoBadge

                  style={{
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === data?.houseType,
                    )?.color,
                  }}>
                  <HoustInfoBadgeText >
                    {HOUSE_TYPE.find(el => el.id === data?.houseType)?.name}
                  </HoustInfoBadgeText>
                  {(data?.houseType !== '3' && data?.isMoveInRight ) && <HoustInfoBadgeText style={{ fontSize: 8 }}>
                    {'(입주권)'}
                  </HoustInfoBadgeText>}
                </HoustInfoBadge>
                {/*(data?.houseType !== '3' && data?.isMoveInRight) && <HoustInfoBadge
                  style={{
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === (data?.isMoveInRight  ? 'isMoveInRight' : ''),
                    )?.color,
                  }}>
                  <HoustInfoBadgeText>
                    {HOUSE_TYPE.find(el => el.id === (data?.isMoveInRight  ? 'isMoveInRight' : ''))?.name}
                  </HoustInfoBadgeText>
                </HoustInfoBadge>*/}
              </View>
              <HoustInfoTitle >{data?.houseName}</HoustInfoTitle>
              <HoustInfoText ellipsizeMode='tail' numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>{data?.detailAdr}</HoustInfoText>
            </HoustInfoSection>
            <MapContainer>
              <NaverMapView
                style={{
                  flex: 1,
                  width: width - 40,
                  height: 150,
                  borderRadius: 20,
                }}
                showsMyLocationButton={false}
                center={{ ...location, zoom: 16 }}
                zoomControl={false}
                rotateGesturesEnabled={false}
                closeOnPressBack={false}
                scrollGesturesEnabled={false}
                pitchEnabled={false}
                zoomEnabled={false}
                isHideCollidedSymbols
                isForceShowIcon
                isHideCollidedCaptions>
                <Marker
                  coordinate={location}
                  width={50}
                  height={50}
                  onClick={() => console.warn('onClick! p2')}>
                  <View>
                    <DropShadow
                      style={{
                        shadowColor: 'rgba(0,0,0,0.25)',
                        shadowOffset: {
                          width: 0,
                          height: 4,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                      }}>
                      <Image
                        source={require('../../assets/images/map_area_ico.png')}
                        style={{
                          width: 50,
                          height: 50,
                        }}
                      />
                    </DropShadow>
                  </View>
                </Marker>
              </NaverMapView>
            </MapContainer>
          </HouseSection>
          <InfoContentSection>
            <InfoContentItem>
              <InfoContentLabel >주택명</InfoContentLabel>
              <InfoContentText >
                {data?.houseName ? data?.houseName : ''}
              </InfoContentText>
              <TouchableOpacity
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  updateHouseName();
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>
            <InfoContentItem>
              <NecessaryInfoBadge
                style={{
                  backgroundColor: HOUSE_TYPE.find(
                    color => color.id === '8',
                  ).color,
                }}>
                <NecessaryInfoBadgeText >
                  {HOUSE_TYPE.find(color => color.id === '8').name}
                </NecessaryInfoBadgeText>
              </NecessaryInfoBadge>
              <InfoContentLabel >주택유형</InfoContentLabel>
              <InfoContentText >
                {HOUSE_TYPE.find(color => color.id === (data?.houseType === undefined ? pData?.houseType : data?.houseType)).name}
              </InfoContentText>
              <TouchableOpacity
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  updateHouseType();
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>
            <InfoContentItem>
              <NecessaryInfoBadge

                style={{
                  backgroundColor: HOUSE_TYPE.find(
                    color => color.id === '8',
                  ).color,
                }}>
                <NecessaryInfoBadgeText >
                  {HOUSE_TYPE.find(color => color.id === '8').name}
                </NecessaryInfoBadgeText>
              </NecessaryInfoBadge>
              <InfoContentLabel >주소      </InfoContentLabel>
              <InfoContentText ellipsizeMode='tail' numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>{data?.roadAddr}</InfoContentText>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  updateAddress();
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>
            <InfoContentItem>
              <NecessaryInfoBadge

                style={{
                  backgroundColor: HOUSE_TYPE.find(
                    color => color.id === '8',
                  ).color,
                }}>
                <NecessaryInfoBadgeText >
                  {HOUSE_TYPE.find(color => color.id === '8').name}
                </NecessaryInfoBadgeText>
              </NecessaryInfoBadge>
              <InfoContentLabel >상세주소</InfoContentLabel>
              <InfoContentText ellipsizeMode='tail' numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>{data?.detailAdr}</InfoContentText>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  updateHouseDetailName();
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>

            {(prevSheet === 'own') && <InfoContentItem>
              <InfoContentLabel >공시가격</InfoContentLabel>
              <InfoContentText >
                {data?.pubLandPrice ? numberToKorean(Number(data?.pubLandPrice)?.toString()) + '원' : (data?.isPubLandPriceOver100Mil  ? '1억원 초과' : data?.isPubLandPriceOver100Mil === undefined ? '' : '1억원 이하')}
              </InfoContentText>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  SheetManager.show('updatePubLandPriceAlert', {
                    payload: {
                      navigation,
                      data,
                      prevSheet,
                      handleHouseChange,
                    },
                  });
                  // ////console.log('after data', data);
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>}

            <InfoContentItem>
              {(prevSheet === 'own2') && <NecessaryInfoBadge

                style={{
                  backgroundColor: HOUSE_TYPE.find(
                    color => color.id === '8',
                  ).color,
                }}>
                <NecessaryInfoBadgeText >
                  {HOUSE_TYPE.find(color => color.id === '8').name}
                </NecessaryInfoBadgeText>
              </NecessaryInfoBadge>}
              <InfoContentLabel >취득계약일자</InfoContentLabel>
              <InfoContentText style={{ flex: 1, textAlign: 'right' }}>{data?.contractDate ? dayjs(data?.contractDate).format(
                'YYYY년 MM월 DD일',
              ) : ''}</InfoContentText>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  updateContractDate();
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>

            {(prevSheet === 'own') && <InfoContentItem>
              <InfoContentLabel >계약면적</InfoContentLabel>
              <View
                style={{
                  marginLeft: 'auto',
                }}>
                <InfoContentText >
                  {data?.area ? data?.area + 'm²' : (data?.isAreaOver85  ? '국민평형(85m2) 초과' : data?.isAreaOver85 === undefined ? '' : '국민평형(85m2) 이하')}
                </InfoContentText>
              </View>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    SheetManager.show('updateAreaMeterAlert', {
                      payload: {
                        navigation,
                        data,
                        prevSheet,
                        handleHouseChange,
                      },
                    });
                  }
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>}


            <InfoContentItem>
              {(prevSheet === 'own2') && <NecessaryInfoBadge

                style={{
                  backgroundColor: HOUSE_TYPE.find(
                    color => color.id === '8',
                  ).color,
                }}>
                <NecessaryInfoBadgeText >
                  {HOUSE_TYPE.find(color => color.id === '8').name}
                </NecessaryInfoBadgeText>
              </NecessaryInfoBadge>}
              <InfoContentLabel >취득일자</InfoContentLabel>
              <InfoContentText style={{ flex: 1, textAlign: 'right' }}>{data?.buyDate ? dayjs(data?.buyDate).format(
                'YYYY년 MM월 DD일',
              ) : ''}</InfoContentText>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  updateBuyDate();
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>
            <InfoContentItem>
              {(prevSheet === 'own2') && <NecessaryInfoBadge

                style={{
                  backgroundColor: HOUSE_TYPE.find(
                    color => color.id === '8',
                  ).color,
                }}>
                <NecessaryInfoBadgeText >
                  {HOUSE_TYPE.find(color => color.id === '8').name}
                </NecessaryInfoBadgeText>
              </NecessaryInfoBadge>}
              <InfoContentLabel style={{ marginRight: 5 }}>취득금액</InfoContentLabel>
              {/* <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <InfoIcon
                  onPress={() => {
                    SheetManager.show('infoExpense', {
                      payload: {
                        Title: "취득금액",
                        Description: "2006년 이전에 취득한 주택의 계약서를\n분실하여 취득금액이 기억나지 않으신다면\n 먼저 부동산전문세무사와 상담해보세요.",
                        height: 300,
                      },
                    });
                  }}
                />
              </TouchableOpacity>*/}
              <InfoContentText >
                {data?.buyPrice ? numberToKorean(Number(data?.buyPrice)?.toString()) + '원' : ''}
              </InfoContentText>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  updateBuyPrice();
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>

            {(prevSheet === 'own2') && <InfoContentItem>
              <InfoContentLabel >공시가격</InfoContentLabel>
              <InfoContentText >
                {data?.pubLandPrice ? numberToKorean(Number(data?.pubLandPrice)?.toString()) + '원' : (data?.isPubLandPriceOver100Mil  ? '1억원 초과' : data?.isPubLandPriceOver100Mil === undefined ? '' : '1억원 이하')}
              </InfoContentText>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  SheetManager.show('updatePubLandPriceAlert', {
                    payload: {
                      navigation,
                      data,
                      prevSheet,
                      handleHouseChange,
                    },
                  });
                  // ////console.log('after data', data);
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>}

            {(prevSheet === 'own2') && <InfoContentItem>
              <InfoContentLabel >계약면적</InfoContentLabel>
              <View
                style={{
                  marginLeft: 'auto',
                }}>
                <InfoContentText >
                  {data?.area ? data?.area + 'm²' : (data?.isAreaOver85  ? '국민평형(85m2) 초과' : data?.isAreaOver85 === undefined ? '' : '국민평형(85m2) 이하')}
                </InfoContentText>
              </View>
              <TouchableOpacity activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    SheetManager.show('updateAreaMeterAlert', {
                      payload: {
                        navigation,
                        data,
                        prevSheet,
                        handleHouseChange,
                      },
                    });
                  }
                }}>
                <EditGreyIcon></EditGreyIcon>
              </TouchableOpacity>
            </InfoContentItem>}

          </InfoContentSection>
          <InputSection>
            {/*<Paper>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                  justifyContent: 'space-between',
                }}>
                <Label
                  style={{
                    marginBottom: 0,
                  }} >
                  소유자
                </Label>
                <TouchableOpacity activeOpacity={0.6}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={async () => {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      SheetManager.show('updateUserProportionAlert', {
                        payload: {
                          navigation,
                          data,
                          prevSheet,
                          handleHouseChange,
                        },
                      });
                    }
                  }}>
                  <EditGreyIcon></EditGreyIcon>
                </TouchableOpacity>
              </View>
              <InfoContentItem>
                <InfoContentLabel
                  style={{
                    color: '#1B1C1F',
                    fontSize: 13,
                  }} >
                  소유자1
                </InfoContentLabel>
                <InfoContentText >
                  {Number(data?.ownerCnt) > 1 && (
                    <Text

                      style={{
                        color: '#B5283B',
                      }}>
                      공동명의{'  '}
                    </Text>
                  )}
                  {data?.userProportion === null ? 100 : data?.userProportion}%
                </InfoContentText>
              </InfoContentItem>
              {Number(data?.ownerCnt) > 1 &&
                new Array(Number(data?.ownerCnt) - 1)
                  .fill(0)
                  .map((data, index) => (
                    <View key={index}>
                      <InfoContentItem>
                        <InfoContentLabel
                          style={{
                            color: '#1B1C1F',
                            fontSize: 13,
                          }} >
                          소유자{(index + 1) + 1}
                        </InfoContentLabel>
                        <InfoContentText >
                          <Text
                            style={{
                              color: '#B5283B',
                            }} >
                            공동명의{'  '}
                          </Text>
                          {50}%
                        </InfoContentText>
                      </InfoContentItem>
                      <InfoContentItem style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{
                          color: '#A3A5A8',
                          fontSize: 13,
                        }} >최대 2명까지만 등록이 가능해요</Text>
                      </InfoContentItem>
                    </View>
                  ))
              }
            </Paper>*/}
            <InfoContentItem>
              <InfoContentLabel >입주권 여부</InfoContentLabel>
              <Switch

                width={50}
                height={28}
                value={data?.isMoveInRight}
                circleStyle={{
                  width: 20,
                  height: 20,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                }}

                onValueChange={async (Yn) => {
                  if (Yn === undefined) {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      await handleHouseChange(data, data?.isMoveInRight);
                    }
                  } else {
                    const state = await NetInfo.fetch();
                    const canProceed = await handleNetInfoChange(state);
                    if (canProceed) {
                      await handleHouseChange(data, Yn);
                    }
                  }
                }}

                activeColor="#2F87FF"
                disabledColor="#E8EAED"

              />
            </InfoContentItem>
          </InputSection>
        </>
      </KeyboardAwareScrollView>
    </Container >
  );
};

export default React.memo(OwnedHouseDetail);
