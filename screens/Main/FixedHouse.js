// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import SerchIcon from '../../assets/icons/search_map.svg';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import WheelPicker from 'react-native-wheely';
import NetInfo from "@react-native-community/netinfo";
import Calendar from '../../components/Calendar';
import Config from 'react-native-config'
import { setFixHouseList, editFixHouseList } from '../../redux/fixHouseListSlice';
import Bottompolygon from '../../assets/icons/blue_bottom_polygon.svg';

const Container = styled.View`
  flex: 1.0;
  background-color: #fff;
`;

const IntroSection2 = styled.View`
  width: 100%;
  padding: 20px 20px 10px 20px;
`;


const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;


const ModalInputSection1 = styled.View`
  width: 100%;
  background-color: #fff;
  padding: 0 20px;
  border-bottom-width: 1px;
  border-bottom-color: #2f87ff;
`;

const ModalInputSection3 = styled.View`
  width: 100%;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #2f87ff;
`;

const ModalInputContainer = styled.View`
  width: 100%;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
}))`
  width: 100%;
  height: 100px;
  padding: 10px;
  background-color: #fff;
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 25px;
  text-align: left;
  text-align-vertical: top;
  overflow: hidden; 

`;

const ModalAddressInputContainer = styled.View`
  width: 100%;
  height: 50px;
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-bottom-width: 1px;
  border-bottom-color: #2f87ff;
`;

const ModalAddressInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  placeholder: '주소를 검색해주세요.',
}))`
  flex: 1;
  font-size: 19px;
  font-family: Pretendard-bold;
  color: #1b1c1f;
  line-height: 23px;
`;

const ModalInputButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))`
  align-items: center;
  justify-content: center;
`;

const ModalInputSection2 = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 0 20px;
`;

const MapSearchResultItem = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: 100%;
  height: auto;
  min-height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
`;

const MapSearchResultItemTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
`;

const MapSearchResultItemAddress = styled.Text`
  width: 64%;
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-left: 4px;
`;

const AddressDetailBadge = styled.View`
  width: 55px;
  height: 22px;
  border-radius: 11px;
  border-width: 1px;
  border-color: #e8eaed;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const AddressDetailText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #a3a5a8;
  line-height: 16px;
`;

const MepSearchResultButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
}))`
  width: 55px;
  height: 22px;
  border-radius: 11px;
  border-width: 1px;
  border-color: #e8eaed;
  align-items: center;
  justify-content: center;
  align-self: right;
  background-color: #F0F3F8;
`;

const MapSearchResultButtonText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Bold;
  color: #2F87FF;
  line-height: 20px;
`;


const SelectGroup = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 70px;
  padding: 10px 20px;
`;

const SelectLabel = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
`;

const PickerContainer = styled.View`
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;


const ListFooterButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: center;
`;

const ListFooterButtonText = styled.Text`
  padding: 20px 0;
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 20px;
`;


const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: #2F87FF;
`;

const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 24px;

`;

const HoustInfoText = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
`;

const Title = styled.Text`
  font-size: 19px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  letter-spacing: -0.5px;
`;


const SubTitle2 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
`;


const ButtonSection = styled.View`
  flex: 1;
  padding: 0 20px;
  align-items: center;
  justify-content: flex-end;  
  margin-top: 10px;
  margin-Bottom: 10px;
  position: absolute;
  bottom: 10px;
  width: 100%;
`;


const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 50px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  position: absolute;
  bottom: 0px;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const FixedHouse = props => {
  const _scrollViewRef = useRef(null);
  const scrollViewRef = useRef(null);
  const _scrollViewRef2 = useRef(null);
  const actionSheetRef = useRef(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const scrollHandlers = useScrollHandlers('FlatList-1', actionSheetRef);
  const [isLastPage, setIsLastPage] = useState(false);
  const [listData, setListData] = useState([]);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const input1 = useRef(null);
  const input2 = useRef(0);
  const [falutaddress, setfalutAddress] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [detailAddress3, setDetailAddress3] = useState('');
  const [dongList, setDongList] = useState([]);
  const [initItem, setInitItem] = useState({});
  const [hoList, setHoList] = useState([]);
  const [selectedDong, setSelectedDong] = useState('');
  const [selectedHo, setSelectedHo] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [searchText, setSearchText] = useState('');
  const [buyprice, setBuyPrice] = useState(0);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const morningTimes = [];
  const afternoonTimes = [];
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser.value);
  const fixHouseList = useSelector(state => state.fixHouseList.value);
  const [directacquisitionDate, setDirectAcquisitionDate] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  for (let i = 9; i <= 11; i++) {
    morningTimes.push(`${i}:00`);
    morningTimes.push(`${i}:30`);
  }
  for (let i = 12; i <= 18; i++) {
    afternoonTimes.push(`${i}:00`);
    if (i < 18) afternoonTimes.push(`${i}:30`);
  }

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };



  const handleBackPress = () => {
    foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
    if (currentPageIndex === 0) {
      dispatch(editFixHouseList({
        ...foundItem,
        houseId: foundItem.houseId,
        jibunAddr: initItem.jibunAddr,
        roadAddr: initItem.roadAddr,
        bdMgtSn: initItem.bdMgtSn,
        admCd: initItem.admCd,
        rnMgtSn: initItem.rnMgtSn,
        buyDate: initItem.buyDate,
        buyPrice: initItem.buyPrice,
        complete: false,
        detailAdr: initItem.detailAdr,
        houseName: initItem.houseName
      }));
      navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
    } else {
      if (currentPageIndex === 1) {
        setCurrentPageIndex(0);
        setSelectedDong('');
        setSelectedHo('');
        setHoList([]);
        setDongList([]);
        setDetailAddress3('');

      } else if (currentPageIndex === 2) {
        setCurrentPageIndex(0);
        setSelectedDong('');
        setSelectedHo('');
        setHoList([]);
        setDongList([]);
        setDetailAddress3('');
      } else if (currentPageIndex === 3) {
        if (foundItem.admCd) {
          if (foundItem.detailAdr) {
            if (selectedHo) {
              setCurrentPageIndex(1);
            } else {
              if (searchText !== '') {
                setCurrentPageIndex(2);
              } else {
                navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
              }
            }
          } else {
            setCurrentPageIndex(0);
            setSelectedDong('');
            setSelectedHo('');
            setHoList([]);
            setDongList([]);
            setDetailAddress3('');
          }
        } else {
          setCurrentPageIndex(0);
          setSelectedDong('');
          setSelectedHo('');
          setHoList([]);
          setDongList([]);
          setDetailAddress3('');
        }


      } else {
        if (directacquisitionDate) {
          if (foundItem.admCd) {
            if (foundItem.detailAdr) {
              if (selectedHo) {
                setCurrentPageIndex(1);
              } else {
                if (searchText !== '') {
                  setCurrentPageIndex(2);
                } else {
                  navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                }
              }
            } else {
              setCurrentPageIndex(0);
              setSelectedDong('');
              setSelectedHo('');
              setHoList([]);
              setDongList([]);
              setDetailAddress3('');
            }
          } else {
            setCurrentPageIndex(0);
            setSelectedDong('');
            setSelectedHo('');
            setHoList([]);
            setDongList([]);
            setDetailAddress3('');
          }
        } else {
          setCurrentPageIndex(3);
        }
      }
    }
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])
  );

  const [isConnected, setIsConnected] = useState(true);

  /*useEffect(() => {
    _scrollViewRef.current?.scrollTo({
      x: (width) * currentPageIndex,
      y: 0,
      animated: true,
    });
  }, [currentPageIndex]);
*/
  /*useEffect(() => {
    _scrollViewRef2.current?.scrollTo({
      x: (width) * currentPageIndex2,
      y: 0,
      animated: true,
    });
  }, [currentPageIndex2]);
*/
  useEffect(() => {
    var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
    setInitItem(foundItem);
    setAddress(foundItem.roadAddr ? foundItem.roadAddr + '\n' + (foundItem.houseName ? foundItem.houseName : '') : foundItem.jibunAddr ? foundItem.jibunAddr + '\n' + (foundItem.houseName ? foundItem.houseName : '') : '');
    setfalutAddress(foundItem.roadAddr ? foundItem.roadAddr + '\n' + (foundItem.houseName ? foundItem.houseName : '') : foundItem.jibunAddr ? foundItem.jibunAddr + '\n' + (foundItem.houseName ? foundItem.houseName : '') : '');
    if (!(foundItem.admCd)) {
      setCurrentPageIndex(0);
    } else if (!foundItem.buyDate) {
      if (foundItem.detailAdr) {
        setCurrentPageIndex(3);
      } else {
        setCurrentPageIndex(0);
      }
    } else if (!foundItem.buyPrice) {
      if (foundItem.detailAdr) {
        setCurrentPageIndex(4);
      } else {
        setCurrentPageIndex(0);
      }
    }
  }, []);

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

  const getAddress = async (searchtext) => {

    const accessToken = currentUser.accessToken;
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // 요청 바디
    const data = {
      //  [선택] currentPage | Integer | 현재 페이지 번호 (기본 값 : 1)
      //  [선택] countPerPage | Integer | 페이지 당 출력할 결과 row 수 (기본 값 : 5)
      //  [선택] sido | String | 시도
      //  [선택] sigungu | String | 시군구
      //  [필수] keyword | String | 주소 검색어
      currentPage: 1,
      countPerPage: 4,
      keyword: searchtext.trim()

    };
    //console.log('data', data)
    axios
      .post(`${Config.APP_API_URL}house/roadAddr`, data, { headers: headers })
      .then(async response => {
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '주소 검색 중 오류가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              closemodal: true,
              actionSheetRef: actionSheetRef,
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          // 성공적인 응답 처리 
          const list = response.data.data.jusoList;
          //console.log('response', response.data.data)
          if (list.length === 0) {
            SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: 1,
                message: '검색 결과가 없어요.',
                buttontext: '확인하기',
              },
            });
          } else if (list.length < 4) {
            setIsLastPage(true);
          } else if (list.length >= 4) {
            setIsLastPage(false);
          }
          setListData([...list]);
        }

      })
      .catch(error => {
        // 오류 처리
        SheetManager.show('info', {
          type: 'error',
          message: error?.errMsg ? error?.errMsg : '주소를 불러오지 못했어요.',
          errorMessage: error?.errCode ? error?.errCode : 'error',
          closemodal: true,
          actionSheetRef: actionSheetRef,
          buttontext: '확인하기',
        });
        console.error(error ? error : 'error');
      });
  };

  const getMoreAddress = async (searchtext) => {
    const accessToken = currentUser.accessToken;
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // 요청 바디
    const data = {
      //  [선택] currentPage | Integer | 현재 페이지 번호 (기본 값 : 1)
      //  [선택] countPerPage | Integer | 페이지 당 출력할 결과 row 수 (기본 값 : 5)
      //  [선택] sido | String | 시도
      //  [선택] sigungu | String | 시군구
      //  [필수] keyword | String | 주소 검색어
      currentPage: listData.length / 4 + 1,
      countPerPage: 4,
      keyword: searchtext.trim()

    };
    axios
      .post(`${Config.APP_API_URL}house/roadAddr`, data, { headers: headers })
      .then(async response => {
        if (response.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '주소 검색 중 오류가 발생했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              closemodal: true,
              actionSheetRef: actionSheetRef,
              buttontext: '확인하기',
            },
          });
          return;
        } else {
          // 성공적인 응답 처리 
          const list = response.data.data.jusoList;
          //  ////console.log('response', response.data.data)
          if (list.length === 0) {
            SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: 1,
                message: '검색 결과가 없어요.',
                buttontext: '확인하기',
              },
            });
          } else if (list.length < 4) {
            setIsLastPage(true);
          } else if (list.length >= 4) {
            setIsLastPage(false);
          }

          setListData([...listData, ...list]);
        }


      })
      .catch(function (error) {
        SheetManager.show('info', {
          type: 'error',
          message: error?.errMsg ? error?.errMsg : '주소를 불러오지 못했어요.',
          errorMessage: error?.errCode ? error?.errCode : 'error',
          closemodal: true,
          actionSheetRef: actionSheetRef,
          buttontext: '확인하기',
        });
        ////console.log(error ? error : 'error');

      });
  };


  const fetchData = async (address, searchType, dongNm = '') => {
    const url = `${Config.APP_API_URL}house/roadAddrDetail`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };

    const data = {
      admCd: address?.admCd ?? '',
      rnMgtSn: address?.rnMgtSn ?? '',
      udrtYn: address?.udrtYn ?? '',
      buldMnnm: address?.buldMnnm ?? '',
      buldSlno: address?.buldSlno ?? '',
      searchType,
      dongNm
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ?? '데이터를 불러오는데 문제가 발생했습니다.',
        errorMessage: error?.errCode ?? 'error',
        closemodal: true,
        actionSheetRef: actionSheetRef,
        buttontext: '확인하기',
      });
      return null;
    }
  };

  const getHoData = async (address, dongNm, type) => {
    const response = await fetchData(address, '2', dongNm);
    if (!response) return;

    if (response.errYn === 'Y') {
      SheetManager.show('info', {
        payload: {
          type: 'error',
          errorType: response.data.type,
          message: response.errMsg ?? '주택의 호수를 불러오는데 문제가 발생했어요.',
          description: response.errMsgDtl ?? null,
          closemodal: true,
          actionSheetRef: actionSheetRef,
          buttontext: '확인하기',
        },
      });
      return type === 'init' ? 0 : undefined;
    } else {
      const holist = response.data.dongHoList;
      setHoList(holist);
      setSelectedHo(holist[0]);
      return type === 'init' ? holist.length : undefined;
    }
  };

  const getDongData = async (address) => {
    const response = await fetchData(address, '1');
    if (!response) return 'dongerror';

    if (response.errYn === 'Y') {
      SheetManager.show('info', {
        payload: {
          type: 'error',
          errorType: response.data.type,
          message: response.errMsg ?? '주택의 동 목록을 불러오는데 문제가 발생했어요.',
          description: response.errMsgDtl ?? null,
          closemodal: true,
          actionSheetRef: actionSheetRef,
          buttontext: '확인하기',
        },
      });
      return 'dongerror';
    } else {
      const donglist = response.data.dongHoList;
      setDongList(donglist);
      return donglist[0];
    }
  };



  const getHouseInfo = async () => {

    const foundItem = fixHouseList?.find(item => item.index === props?.route.params.index);
    const url = `${Config.APP_API_URL}house/getHouseInfo`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    const params = {
      roadAddress: selectedItem?.roadAddr ? `${selectedItem.roadAddr} ${selectedDong ? selectedDong + '동 ' : dongList[0] + '동 '}${selectedHo ? selectedHo + '호' : hoList[0] + '호'}` : '',
      jibunAddress: selectedItem?.jibunAddr ? `${selectedItem.jibunAddr} ${selectedDong ? selectedDong + '동 ' : dongList[0] + '동 '}${selectedHo ? selectedHo + '호' : hoList[0] + '호'}` : '',
      area: foundItem ? foundItem?.area : 0,
    };
    try {
      console.log('params', params);
      const response = await axios.post(url, params, { headers: headers });
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '청약홈 주택데이터를 불러오는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            buttontext: '확인하기',
          },
        });
        return { acquisitionDate: null };
      } else {
        const result = response.data;
        if (result.data?.property?.acquisitionDate) {
          if (result.data?.property?.acquisitionDate !== null && result.data?.property?.acquisitionDate !== undefined) {
            const acquisitionDate = result.data.property.acquisitionDate;
            const year = acquisitionDate.substring(0, 4);
            const month = acquisitionDate.substring(4, 6) - 1; // 월은 0부터 시작하므로 1을 빼줍니다.
            const day = acquisitionDate.substring(6, 8);
            setBuyPrice(result.data?.buillding?.publishedPrice ? result.data?.buillding?.publishedPrice : 0);
            setDirectAcquisitionDate(true);
            return { acquisitionDate: new Date(year, month, day) };
          } else {
            setBuyPrice(result.data?.buillding?.publishedPrice ? result.data?.buillding?.publishedPrice : 0);
            setDirectAcquisitionDate(false);
            return { acquisitionDate: null };
          }
        } else {
          setBuyPrice(result.data?.buillding?.publishedPrice ? result.data?.buillding?.publishedPrice : 0);
          setDirectAcquisitionDate(false);
          return { acquisitionDate: null };
        }



      }
    } catch (error) {
      console.log(error);
      SheetManager.show('info', {
        payload: {
          message: '청약홈 주택데이터를 불러오는데 문제가 발생했어요.',
          description: error.message ? error.message : '오류가 발생했습니다.',
          type: 'error',
          buttontext: '확인하기',
        }
      });
      return { acquisitionDate: null };
    }
  };


  useEffect(() => {
    setListData([]);
    setIsLastPage(false);
  }, [searchText]);

  useEffect(() => {
    var beforebuyprice = fixHouseList.find(el => el.index === props?.route.params.index)?.buyPrice;
    setBuyPrice(beforebuyprice);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
            //console.log('currentPageIndex', currentPageIndex);
            if (currentPageIndex === 0) {
              dispatch(editFixHouseList({
                ...foundItem,
                houseId: foundItem.houseId,
                jibunAddr: initItem.jibunAddr,
                roadAddr: initItem.roadAddr,
                bdMgtSn: initItem.bdMgtSn,
                admCd: initItem.admCd,
                rnMgtSn: initItem.rnMgtSn,
                buyDate: initItem.buyDate,
                buyPrice: initItem.buyPrice,
                complete: false,
                detailAdr: initItem.detailAdr,
                houseName: initItem.houseName
              }));
              navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });

            } else {
              if (currentPageIndex === 1) {
                setCurrentPageIndex(0);
                setSelectedDong('');
                setSelectedHo('');
                setHoList([]);
                setDongList([]);
                setDetailAddress3('');

              } else if (currentPageIndex === 2) {
                setCurrentPageIndex(0);
                setSelectedDong('');
                setSelectedHo('');
                setHoList([]);
                setDongList([]);
                setDetailAddress3('');
              } else if (currentPageIndex === 3) {
                if (foundItem.admCd) {
                  if (foundItem.detailAdr) {
                    if (selectedHo) {
                      setCurrentPageIndex(1);
                    } else {
                      if (searchText !== '') {
                        setCurrentPageIndex(2);
                      } else {
                        navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                      }
                    }
                  } else {
                    setCurrentPageIndex(0);
                    setSelectedDong('');
                    setSelectedHo('');
                    setHoList([]);
                    setDongList([]);
                    setDetailAddress3('');
                  }
                } else {
                  setCurrentPageIndex(0);
                  setSelectedDong('');
                  setSelectedHo('');
                  setHoList([]);
                  setDongList([]);
                  setDetailAddress3('');
                }


              } else {
                if (directacquisitionDate) {
                  if (foundItem.admCd) {
                    if (foundItem.detailAdr) {
                      if (selectedHo) {
                        setCurrentPageIndex(1);
                      } else {
                        if (searchText !== '') {
                          setCurrentPageIndex(2);
                        } else {
                          navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                        }
                      }
                    } else {
                      setCurrentPageIndex(0);
                      setSelectedDong('');
                      setSelectedHo('');
                      setHoList([]);
                      setDongList([]);
                      setDetailAddress3('');
                    }
                  } else {
                    setCurrentPageIndex(0);
                    setSelectedDong('');
                    setSelectedHo('');
                    setHoList([]);
                    setDongList([]);
                    setDetailAddress3('');
                  }
                } else {
                  setCurrentPageIndex(3);
                }
              }
            }
          }} >
          <BackIcon />
        </TouchableOpacity >
      ),
      headerTitleAlign: 'center',
      title: '보유 주택 현황',
      headerShadowVisible: false,
      contentStyle: {
        borderTopColor: '#F7F7F7',
        borderTopWidth: 1,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
      },
    });
  }, [currentPageIndex, initItem, directacquisitionDate, searchText, fixHouseList, selectedHo]);

  return (
    <ScrollView
      keyboardShouldPersistTaps='always'
      overScrollMode="never"
      ref={_scrollViewRef}
      pagingEnabled
      style={{
        width: width,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      scrollEventThrottle={16}>

      {currentPageIndex === 0 && <Container style={{ width: width }}>
        <ProgressSection>
        </ProgressSection>


        <><IntroSection2 style={{ width: width }}>
          <Title>주택 거래내역의 주소가 정확하지 않아요.</Title>
          <SubTitle2>해당 주택의 주소를 정확히 입력하여 조회해주세요.</SubTitle2>
          <HoustInfoSection
            style={{ borderColor: '#FF7401' }}>
              <View
                style={{
                  width: '100%',
                }}>
                <HoustInfoTitle>{/*selectedItem.houseName*/falutaddress.replace(/\n/g, " ")}</HoustInfoTitle>
                {detailAddress && (<HoustInfoText >{/*selectedItem.houseDetailName*/detailAddress}</HoustInfoText>)}
              </View>
          </HoustInfoSection>
        </IntroSection2>

        <ScrollView
          keyboardShouldPersistTaps='always'
          overScrollMode="never"
          ref={_scrollViewRef2}
          pagingEnabled
          style={{
            width: width,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          scrollEventThrottle={16}>

          <Container width={width}>
            <FlatList
              stickyHeaderIndices={[0]}
              data={listData}
              ref={scrollViewRef}
              style={{
                zIndex: 1,
              }}
              {...scrollHandlers}
              scrollEnabled
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 10,
              }}
              overScrollMode="never" // 이 줄을 추가하세요
              ListHeaderComponent={
                <View
                  style={{
                    zIndex: 10,
                  }}>
                  <ModalInputSection2>
                    <ModalAddressInputContainer>
                      <ModalAddressInput
                        placeholder="주소를 검색해주세요."
                        value={searchText}
                        onChangeText={(text) => { setSearchText(text.replace(/\n/g, '')); }}
                        onSubmitEditing={async () => {
                          const state = await NetInfo.fetch();
                          const canProceed = await handleNetInfoChange(state);
                          if (canProceed) {
                            if (searchText === '') {
                            } else {
                              getAddress(searchText);
                            }
                          }
                        }
                        }
                      />
                      <ModalInputButton
                        onPress={async () => {
                          const state = await NetInfo.fetch();
                          const canProceed = await handleNetInfoChange(state);
                          if (canProceed) {
                            if (searchText === '') {
                            } else {
                              getAddress(searchText);
                            }
                          }
                        }}>
                        <SerchIcon />
                      </ModalInputButton>
                    </ModalAddressInputContainer>
                  </ModalInputSection2>
                </View>
              }
              ListFooterComponent={
                listData.length > 0 &&
                !isLastPage && (
                  <ListFooterButton
                    onPress={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        if (searchText === '') {
                        } else {
                          getMoreAddress(searchText);
                        }
                      }
                    }}>
                    <ListFooterButtonText >더 보기</ListFooterButtonText>
                  </ListFooterButton>
                )
              }
              renderItem={({ item, index }) => {
                const sortedList = item?.detBdNmList ? item.detBdNmList.split(",").map(name => name.trim()).sort((a, b) => a.localeCompare(b)) : [];
                return (
                  <MapSearchResultItem
                    onPress={async () => {
                      //console.log('item', item);
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        setAddress(item.roadAddr);
                        setSelectedItem(item);
                        var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                        dispatch(editFixHouseList({
                          ...foundItem,
                          houseId: foundItem.houseId,
                          jibunAddr: item.jibunAddr,
                          roadAddr: item.roadAddr,
                          bdMgtSn: item.bdMgtSn,
                          admCd: item.admCd,
                          rnMgtSn: item.rnMgtSn,
                          buyDate: foundItem.buyDate,
                          buyPrice: foundItem.buyPrice,
                          complete: false,
                          detailAdr: foundItem.detailAdr,
                          houseName: item.bdNm
                        }));
                        const firstDong = await getDongData(item);
                        if (firstDong !== 'dongerror') {
                          const Hodata = await getHoData(item, firstDong, 'init');
                          if (Hodata > 0) {
                            setCurrentPageIndex(1);
                          } else {
                            setCurrentPageIndex(2);
                          }
                        } else {
                          setSelectedItem(item);
                          setCurrentPageIndex(2);
                        }
                      }
                    }}>
                    <View
                      style={{
                        width: '100%',
                      }}>
                      <MapSearchResultItemTitle>
                        {item?.roadAddr}
                      </MapSearchResultItemTitle>
                      {sortedList.length > 0 && <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 6,
                        }}>
                        <AddressDetailBadge>
                          <AddressDetailText>상세주소</AddressDetailText>
                        </AddressDetailBadge>
                        {!expandedItems[index] ? (
                          <MapSearchResultItemAddress style={{ width: sortedList.length > 6 ? '64%' : '76%' }} ellipsizeMode='tail' numberOfLines={1}>
                            {sortedList.join(',')}
                          </MapSearchResultItemAddress>
                        ) : (
                          <MapSearchResultItemAddress>
                            {sortedList.join(',')}
                          </MapSearchResultItemAddress>
                        )}
                        {sortedList.length > 6 && <MepSearchResultButton onPress={() => { toggleExpand(index) }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            {!expandedItems[index] ? (
                              <Bottompolygon style={{ marginTop: 1, color: '#2F87FF' }} />
                            ) : (
                              <Bottompolygon style={{
                                marginTop: 1,
                                transform: [{ rotate: '180deg' }],
                                color: '#2F87FF',
                              }} />
                            )}
                            <MapSearchResultButtonText>{expandedItems[index] ? '접기' : '펼치기'}</MapSearchResultButtonText>
                          </View>
                        </MepSearchResultButton>}
                      </View>}
                    </View>
                  </MapSearchResultItem>
                )
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </Container>

        </ScrollView></>
      </Container>}

{
  currentPageIndex === 1 && <Container style={{ width: width }}>
    <ProgressSection>
    </ProgressSection>
    <><IntroSection2 style={{ width: width }}>
      <Title>상세 주소를 입력해주세요.</Title>
      <SubTitle2>해당 주택의 상세 주소를 정확히 입력해주세요.</SubTitle2>
      <HoustInfoSection>
        <View
          style={{
            width: '100%',
          }}>
          <HoustInfoTitle>{/*selectedItem.houseName*/address.replace(/\n/g, " ")}</HoustInfoTitle>
          {detailAddress && (<HoustInfoText >{/*selectedItem.houseDetailName*/detailAddress}</HoustInfoText>)}
        </View>
      </HoustInfoSection>
    </IntroSection2>
      <View style={{
        marginTop: 20
      }}></View>


      {/*<Button
            onPress={() => {
              setCurrentPageIndex(2);
            }}
            style={{
              width: width - 80,
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <ButtonText
              style={{
                color: '#717274',
              }}>
              직접 입력하기
            </ButtonText>
          </Button> 직접입력하기 삭제*/}
      <View>
        <SelectGroup>
          <View style={{ width: '48%' }}>
            <SelectLabel >동 선택</SelectLabel>
            <PickerContainer>
              {dongList[0] && (
                <WheelPicker
                  key={dongList}
                  selectedIndex={
                    selectedDong ? dongList.indexOf(selectedDong) : 0
                  }
                  containerStyle={{
                    width: 120,
                    height: 180,
                    borderRadius: 10,
                  }}
                  itemTextStyle={{
                    fontFamily: 'Pretendard-Regular',
                    fontSize: 18,
                    color: '#1B1C1F',
                  }}
                  allowFontScaling={false}
                  selectedIndicatorStyle={{
                    backgroundColor: 'transparent',
                  }}
                  itemHeight={40}
                  options={dongList}
                  onChange={index => {
                    setSelectedDong(dongList[index]);
                    setHoList([]);
                    getHoData(selectedItem, dongList[index], 'change');
                  }}
                />
              )}
            </PickerContainer>
          </View>
          <View style={{ width: '48%' }}>
            <SelectLabel >호 선택</SelectLabel>

            <PickerContainer>
              {hoList?.length > 0 && (
                <WheelPicker
                  key={hoList}
                  selectedIndex={
                    hoList.indexOf(selectedHo) >= 0
                      ? hoList.indexOf(selectedHo)
                      : 0
                  }
                  containerStyle={{
                    width: 120,
                    height: 180,
                    borderRadius: 10,
                  }}
                  itemTextStyle={{
                    fontFamily: 'Pretendard-Regular',
                    fontSize: 18,
                    color: '#1B1C1F',

                  }}
                  selectedIndicatorStyle={{
                    backgroundColor: 'transparent',
                  }}
                  itemHeight={40}
                  options={hoList}
                  onChange={index => {
                    setSelectedHo(hoList[index]);

                  }}
                />
              )}
            </PickerContainer>
          </View>
        </SelectGroup>

      </View>

      <ButtonSection width={width} style={{
        marginTop: 10,
        height: 'auto', // height 값을 문자열로 변경
        backgroundColor: '#fff', // background-color를 camelCase로 변경
        alignItems: 'center', // align-items를 camelCase로 변경
        flexDirection: 'row', // flex-direction을 camelCase로 변경
        justifyContent: 'space-between', // justify-content를 camelCase로 변경
        padding: 20,
      }}>


        <DropShadow
          style={{
            width: '48%',
            shadowColor: '#fff',
          }}>
          <Button
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                setCurrentPageIndex(0);
                setSelectedDong('');
                setSelectedHo('');
                setDongList([]);
                setHoList([]);
                setDetailAddress3('');
              }
            }}
            style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              backgroundColor: '#fff',
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              borderColor: '#E8EAED',
            }}>
            <ButtonText

              style={{
                color: '#717274',
                fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                color: '#717274', // color 값을 중복 제거
                lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              }}>
              이전으로
            </ButtonText>
          </Button>
        </DropShadow>
        <DropShadow style={styles.dropshadow}>
          <Button active={selectedHo}
            disabled={selectedHo === ''}
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                var detailAddress2 = (selectedDong ? selectedDong + '동 ' : dongList[0] ? dongList[0] + '동 ' : '') + (selectedHo ? selectedHo + '호' : hoList[0] ? hoList[0] + '호' : '');;
                //console.log('detailAddress2', detailAddress2);
                const fixHouseInfo = await getHouseInfo();

                var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                if (!fixHouseInfo.acquisitionDate && foundItem.buyPrice === null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress2,
                    houseName: foundItem.houseName
                  }));
                  setCurrentPageIndex(3);
                } else if (!fixHouseInfo.acquisitionDate && foundItem.buyPrice !== null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress2,
                    houseName: foundItem.houseName
                  }));
                  setCurrentPageIndex(3);
                } else if (fixHouseInfo.acquisitionDate && foundItem.buyPrice === null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress2,
                    houseName: foundItem.houseName
                  }));
                  setCurrentPageIndex(4);
                } else if (fixHouseInfo.acquisitionDate && foundItem.buyPrice !== null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: true,
                    detailAdr: detailAddress2,
                    houseName: foundItem.houseName
                  }));
                  navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                }


              }
            }} style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              backgroundColor: selectedHo ? '#2f87ff' : '#E8EAED',
              borderColor: selectedHo ? '#2f87ff' : '#E8EAED',
            }}>
            <ButtonText active={selectedHo} style={{
              color: '#717274',
              fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
              fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
              lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              color: selectedHo ? '#fff' : '#717274'
            }}
            >다음으로</ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection></>
  </Container>
}
{
  currentPageIndex === 2 && <Container style={{ width: width }}>
    <ProgressSection>
    </ProgressSection>
    <><IntroSection2 style={{ width: width }}>
      <Title>상세 주소를 입력해주세요.</Title>
      <SubTitle2>해당 주택의 상세 주소를 정확히 입력해주세요.</SubTitle2>
      <ModalInputSection3 style={{ marginBottom: 20 }}>
        <ModalInputContainer style={{
          flexDirection: 'row', // flex-direction을 camelCase로 변경
          justifyContent: 'space-between', // justify-content를 camelCase로 변경 
          padding: 0,
        }}>
          <ModalInput
            ref={input1}
            //  onSubmitEditing={() => input2.current.focus()}
            style={{ width: width, height: 50, fontSize: 19 }}
            value={detailAddress3 ? detailAddress3 : ''}
            onChangeText={(text) => setDetailAddress3(text)}
            maxLength={17}
            onSubmitEditing={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                //console.log('detailAddress2', detailAddress2);
                const fixHouseInfo = await getHouseInfo();
                console.log('fixHouseInfo', fixHouseInfo);
                console.log('fixHouseInfo.acquisitionDate', fixHouseInfo.acquisitionDate);
                var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                if (!fixHouseInfo.acquisitionDate && foundItem.buyPrice === null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress3,
                    houseName: selectedItem.bdNm
                  }));
                  setCurrentPageIndex(3);
                } else if (!fixHouseInfo.acquisitionDate && foundItem.buyPrice !== null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress3,
                    houseName: selectedItem.bdNm
                  }));
                  setCurrentPageIndex(3);
                } else if (fixHouseInfo.acquisitionDate && foundItem.buyPrice === null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress3,
                    houseName: selectedItem.bdNm
                  }));
                  setCurrentPageIndex(4);
                } else if (fixHouseInfo.acquisitionDate && foundItem.buyPrice !== null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: true,
                    detailAdr: detailAddress3,
                    houseName: selectedItem.bdNm
                  }));
                  navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                }
              }
            }}
            placeholderTextColor="black"
            textAlignVertical="left"
            textAlign="left"
          />
        </ModalInputContainer>
      </ModalInputSection3>
      <HoustInfoSection>
        <View
          style={{
            width: '100%',
          }}>
          <HoustInfoTitle>{/*selectedItem.houseName*/address.replace(/\n/g, " ")}</HoustInfoTitle>
          {detailAddress && (<HoustInfoText >{/*selectedItem.houseDetailName*/detailAddress}</HoustInfoText>)}
        </View>
      </HoustInfoSection>
    </IntroSection2>
      <View style={{
        marginTop: 20
      }}></View>


      {/*<Button
            onPress={() => {
              setCurrentPageIndex(2);
            }}
            style={{
              width: width - 80,
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <ButtonText
              style={{
                color: '#717274',
              }}>
              직접 입력하기
            </ButtonText>
          </Button> 직접입력하기 삭제*/}



      <ButtonSection width={width} style={{
        marginTop: 10,
        height: 'auto', // height 값을 문자열로 변경
        backgroundColor: '#fff', // background-color를 camelCase로 변경
        alignItems: 'center', // align-items를 camelCase로 변경
        flexDirection: 'row', // flex-direction을 camelCase로 변경
        justifyContent: 'space-between', // justify-content를 camelCase로 변경
        padding: 20,
      }}>


        <DropShadow
          style={{
            width: '48%',
            shadowColor: '#fff',
          }}>
          <Button
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                setCurrentPageIndex(0);
                setSelectedDong('');
                setSelectedHo('');
                setDongList([]);
                setHoList([]);
                setDetailAddress3('');
              }
            }}
            style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              backgroundColor: '#fff',
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              borderColor: '#E8EAED',
            }}>
            <ButtonText

              style={{
                color: '#717274',
                fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                color: '#717274', // color 값을 중복 제거
                lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              }}>
              이전으로
            </ButtonText>
          </Button>
        </DropShadow>
        <DropShadow style={styles.dropshadow}>
          <Button active={selectedDate}
            disabled={!(selectedDate)}
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                var detailAddress2 = (selectedDong ? selectedDong + '동 ' : dongList[0] ? dongList[0] + '동 ' : '') + (selectedHo ? selectedHo + '호' : hoList[0] ? hoList[0] + '호' : '');;
                //console.log('detailAddress2', detailAddress2);
                const fixHouseInfo = await getHouseInfo();
                console.log('fixHouseInfo', fixHouseInfo);
                console.log('fixHouseInfo.acquisitionDate', fixHouseInfo.acquisitionDate);
                var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                if (!fixHouseInfo.acquisitionDate && foundItem.buyPrice === null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress2,
                    houseName: selectedItem.bdNm
                  }));
                  setCurrentPageIndex(3);
                } else if (!fixHouseInfo.acquisitionDate && foundItem.buyPrice !== null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress2,
                    houseName: selectedItem.bdNm
                  }));
                  setCurrentPageIndex(3);
                } else if (fixHouseInfo.acquisitionDate && foundItem.buyPrice === null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: detailAddress2,
                    houseName: selectedItem.bdNm
                  }));
                  setCurrentPageIndex(4);
                } else if (fixHouseInfo.acquisitionDate && foundItem.buyPrice !== null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: selectedItem.jibunAddr,
                    roadAddr: selectedItem.roadAddr,
                    bdMgtSn: selectedItem.bdMgtSn,
                    admCd: selectedItem.admCd,
                    rnMgtSn: selectedItem.rnMgtSn,
                    buyDate: fixHouseInfo.acquisitionDate ? fixHouseInfo.acquisitionDate : foundItem.buyDate,
                    buyPrice: foundItem.buyPrice,
                    complete: true,
                    detailAdr: detailAddress2,
                    houseName: selectedItem.bdNm
                  }));
                  navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                }
              }
            }} style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              backgroundColor: selectedDate ? '#2f87ff' : '#E8EAED',
              borderColor: selectedDate ? '#2f87ff' : '#E8EAED',
            }}>
            <ButtonText active={selectedDate} style={{
              color: '#717274',
              fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
              fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
              lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              color: selectedDate ? '#fff' : '#717274'
            }}
            >다음으로</ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection></>
  </Container>
}
{
  currentPageIndex === 3 && <Container style={{ width: width }}>
    <ProgressSection>
    </ProgressSection>
    <><IntroSection2 style={{ width: width }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <Title>취득일자를 입력해주세요.</Title>
        {/*<TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <InfoIcon
                onPress={() => {
                  SheetManager.show('InfoBuyDate');
                }}
              />
            </TouchableOpacity>*/}
      </View>
      <SubTitle2>해당 주택의 취득일자를 정확히 입력해주세요.</SubTitle2>
      <HoustInfoSection>
        <View
          style={{
            width: '100%',
          }}>
          <HoustInfoTitle>{/*selectedItem.houseName*/address.replace(/\n/g, " ")}</HoustInfoTitle>
          {detailAddress && (<HoustInfoText >{/*selectedItem.houseDetailName*/detailAddress}</HoustInfoText>)}
        </View>
      </HoustInfoSection>
    </IntroSection2>
      <View style={{
        marginTop: 20
      }}></View>
      <View
        style={{
          width: '100%',
          height: 350,
        }}>
        <Calendar
          ReservationYn='N'
          currentPageIndex={1}
          //      minDate={new Date(new Date('2024-05-02').setHours(0, 0, 0, 0))}
          setSelectedDate={setSelectedDate}
          selectedDate={new Date(selectedDate ? selectedDate : new Date().setHours(0, 0, 0, 0))}
          currentDate={new Date(selectedDate ? selectedDate : new Date().setHours(0, 0, 0, 0))}
        //      maxDate={new Date(new Date('2025-12-10').setHours(0, 0, 0, 0))}
        />
      </View>
      <ButtonSection width={width} style={{
        marginTop: 10,
        height: 'auto', // height 값을 문자열로 변경
        backgroundColor: '#fff', // background-color를 camelCase로 변경
        alignItems: 'center', // align-items를 camelCase로 변경
        flexDirection: 'row', // flex-direction을 camelCase로 변경
        justifyContent: 'space-between', // justify-content를 camelCase로 변경
        padding: 20,
      }}>
        <DropShadow
          style={{
            width: '48%',
            shadowColor: '#fff',
          }}>
          <Button
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                console.log('foundItem', foundItem);
                if (foundItem.admCd) {
                  if (foundItem.detailAdr) {
                    if (selectedHo) {
                      setCurrentPageIndex(1);
                    } else {
                      if (searchText !== '') {
                        setCurrentPageIndex(2);
                      } else {
                        navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                      }
                    }
                  } else {
                    setCurrentPageIndex(0);
                    setSelectedDong('');
                    setSelectedHo('');
                    setHoList([]);
                    setDongList([]);
                    setDetailAddress3('');
                  }
                } else {
                  setCurrentPageIndex(0);
                  setSelectedDong('');
                  setSelectedHo('');
                  setHoList([]);
                  setDongList([]);
                  setDetailAddress3('');
                }
              }
            }}
            style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              backgroundColor: '#fff',
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              borderColor: '#E8EAED',
            }}>
            <ButtonText

              style={{
                color: '#717274',
                fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                color: '#717274', // color 값을 중복 제거
                lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              }}>
              이전으로
            </ButtonText>
          </Button>
        </DropShadow>
        <DropShadow style={styles.dropshadow}>
          <Button active={selectedDate}
            disabled={!(selectedDate)}
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                if (foundItem.buyPrice === null) {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: foundItem.jibunAddr,
                    roadAddr: foundItem.roadAddr,
                    bdMgtSn: foundItem.bdMgtSn,
                    admCd: foundItem.admCd,
                    rnMgtSn: foundItem.rnMgtSn,
                    buyDate: selectedDate,
                    buyPrice: foundItem.buyPrice,
                    complete: false,
                    detailAdr: foundItem.detailAdr,
                    houseName: foundItem.houseName
                  }));
                  setCurrentPageIndex(4);
                } else {
                  dispatch(editFixHouseList({
                    ...foundItem,
                    houseId: foundItem.houseId,
                    jibunAddr: foundItem.jibunAddr,
                    roadAddr: foundItem.roadAddr,
                    bdMgtSn: foundItem.bdMgtSn,
                    admCd: foundItem.admCd,
                    rnMgtSn: foundItem.rnMgtSn,
                    buyDate: selectedDate,
                    buyPrice: foundItem.buyPrice,
                    complete: true,
                    detailAdr: foundItem.detailAdr,
                    houseName: foundItem.houseName
                  }));
                  navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                }
                //console.log('fixHouseList', fixHouseList);
              }
            }} style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              backgroundColor: selectedDate ? '#2f87ff' : '#E8EAED',
              borderColor: selectedDate ? '#2f87ff' : '#E8EAED',
            }}>
            <ButtonText active={selectedDate} style={{
              color: '#717274',
              fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
              fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
              lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              color: selectedDate ? '#fff' : '#717274'
            }}
            >다음으로</ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection></>
  </Container>
}

{
  currentPageIndex === 4 && <Container style={{ width: width }}>
    <ProgressSection>
    </ProgressSection>
    <><IntroSection2 style={{ width: width }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <Title>취득금액을 입력해주세요.</Title>
        {/*<TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <InfoIcon
                onPress={() => {
                  SheetManager.show('InfoBuyPrice');
                }}
              />
            </TouchableOpacity>*/}
      </View>
      <SubTitle2>해당 주택의 취득할 당시의 취득금액을 정확히 입력해주세요.</SubTitle2>
    </IntroSection2>

      <ModalInputSection1>
        <ModalInputContainer style={{
          flexDirection: 'row', // flex-direction을 camelCase로 변경
          justifyContent: 'space-between', // justify-content를 camelCase로 변경 
        }}>
          <ModalInput
            ref={input2}
            //  onSubmitEditing={() => input2.current.focus()}
            style={{ width: '92%', height: 50, fontSize: 19 }}
            value={buyprice ? buyprice.toLocaleString() : 0}
            onChangeText={(text) => setBuyPrice(Number(text.replace(/[^0-9]/g, '')))}
            maxLength={20}
            keyboardType="number-pad"
            autoCompleteType="price"
            onSubmitEditing={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                dispatch(editFixHouseList({
                  ...foundItem,
                  houseId: foundItem.houseId,
                  jibunAddr: foundItem.jibunAddr,
                  roadAddr: foundItem.roadAddr,
                  bdMgtSn: foundItem.bdMgtSn,
                  admCd: foundItem.admCd,
                  rnMgtSn: foundItem.rnMgtSn,
                  buyDate: foundItem.buyDate,
                  buyPrice: buyprice,
                  complete: true,
                  detailAdr: foundItem.detailAdr,
                  houseName: foundItem.houseName
                }));
                //console.log('fixHouseList', fixHouseList);
                navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
              }
            }}
            placeholderTextColor="black"
            textAlignVertical="center"
            textAlign="right"
          /><Text style={{ padding: 10, fontSize: 19, color: 'black' }}>원</Text>
        </ModalInputContainer>
      </ModalInputSection1>
      <ButtonSection width={width} style={{
        marginTop: 10,
        height: 'auto', // height 값을 문자열로 변경
        backgroundColor: '#fff', // background-color를 camelCase로 변경
        alignItems: 'center', // align-items를 camelCase로 변경
        flexDirection: 'row', // flex-direction을 camelCase로 변경
        justifyContent: 'space-between', // justify-content를 camelCase로 변경
        padding: 20,
      }}>
        <DropShadow
          style={{
            width: '48%',
            shadowColor: '#fff',
          }}>
          <Button
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                var foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                if (directacquisitionDate) {
                  if (foundItem.admCd) {
                    if (foundItem.detailAdr) {
                      if (selectedHo) {
                        setCurrentPageIndex(1);
                      } else {
                        if (searchText !== '') {
                          setCurrentPageIndex(2);
                        } else {
                          navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
                        }
                      }
                    } else {
                      setCurrentPageIndex(0);
                      setSelectedDong('');
                      setSelectedHo('');
                      setHoList([]);
                      setDongList([]);
                      setDetailAddress3('');
                    }
                  } else {
                    setCurrentPageIndex(0);
                    setSelectedDong('');
                    setSelectedHo('');
                    setHoList([]);
                    setDongList([]);
                    setDetailAddress3('');
                  }
                } else {
                  setCurrentPageIndex(3);
                }

              }
            }}
            style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              backgroundColor: '#fff',
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              borderColor: '#E8EAED',
            }}>
            <ButtonText

              style={{
                color: '#717274',
                fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              }}>
              이전으로
            </ButtonText>
          </Button>
        </DropShadow>
        <DropShadow style={styles.dropshadow}>
          <Button active={buyprice}
            disabled={!(buyprice)}
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {

                foundItem = fixHouseList?.find((el) => el.index === props?.route.params.index);
                dispatch(editFixHouseList({
                  ...foundItem,
                  houseId: foundItem.houseId,
                  jibunAddr: foundItem.jibunAddr,
                  roadAddr: foundItem.roadAddr,
                  bdMgtSn: foundItem.bdMgtSn,
                  admCd: foundItem.admCd,
                  rnMgtSn: foundItem.rnMgtSn,
                  buyDate: foundItem.buyDate,
                  buyPrice: buyprice,
                  complete: true,
                  detailAdr: foundItem.detailAdr,
                  houseName: foundItem.houseName
                }));
                navigation.navigate('FixedHouseList', { chatListindex: props.route.params.chatListindex });
              }
            }} style={{
              width: '100%',
              height: 50, // height 값을 숫자로 변경하고 단위 제거
              borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
              alignItems: 'center', // align-items를 camelCase로 변경
              justifyContent: 'center', // justify-content를 camelCase로 변경
              borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
              backgroundColor: buyprice ? '#2f87ff' : '#E8EAED',
              borderColor: buyprice ? '#2f87ff' : '#E8EAED',
            }}>
            <ButtonText active={buyprice} style={{
              color: '#717274',
              fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
              fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
              lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
              color: buyprice ? '#fff' : '#717274'
            }}
            >다음으로</ButtonText>
          </Button>
        </DropShadow>
      </ButtonSection></>
  </Container>
}



    </ScrollView >
  )
};

const styles = StyleSheet.create({
  dropdownStyle: {
    width: '37%',
    height: 300,
    borderRadius: 10,
    marginTop: -20,
  },
  buttonStyle: {
    width: '100%',
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EAED',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#A3A5A8',
    letterSpacing: -0.3,
    lineHeight: 16,
    marginRight: 15,
  },
  rowStyle: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0,
    borderBottomColor: '#E8EAED',
  },
  rowTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1C1F',
    letterSpacing: -0.3,
    lineHeight: 16,
  },
  dropshadow: {
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});


export default FixedHouse;
