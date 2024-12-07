// 보유 주택 목록에서 주소 선택시 뜨는 팝업
// 지도수정에 따라 반영
// 챗 스크린에서 주택 검색 시트

import {
  View,
  useWindowDimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Keyboard,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import SerchIcon from '../../assets/icons/search_map.svg';
import SelectDropdown from 'react-native-select-dropdown';
import ChevronDownIcon from '../../assets/icons/chevron_down.svg';
import WheelPicker from 'react-native-wheely';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AREA_LIST } from '../../data/areaData';
import Bottompolygon from '../../assets/icons/blue_bottom_polygon.svg';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalAddressInputContainer = styled.View`
  width: 100%;
  height: 57px;
  background-color: #f5f7fa;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
`;

const ModalAddressInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  placeholder: '주택명 혹은 지역명을 입력해주세요',
}))`
  flex: 1;
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const DetailAddressInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  placeholder: '나머지 상세주소를 입력해주세요',
}))`
  flex: 1;
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const ModalInputButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))`
  align-items: center;
  justify-content: center;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 0px;
  background-color: #fff;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const MapSearchResultHeader = styled.View`
  width: 100%;
  height: 74px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
  background-color: #fff;
`;

const SelectButtonContainer = styled.View`
  width: 47%;
  height: 36px;
`;

const SelectButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-SemiBold;
  color: #a3a5a8;
  letter-spacing: -0.3px;
  line-height: 16px;
  margin-right: 15px;
  text-align: center;
`;

const SelectItem = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 100%;
  height: 50px;
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const SelectItemText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
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
  width: 59%;
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

const ApartmentInfoGroup = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ApartmentInfoTitle = styled.Text`
  width: 80%;
  font-size: 14px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 30px;
  text-align: center;
  margin-bottom: auto;
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

const ButtonSection = styled.View`
  width: ${props => props.width - 40}px;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  margin-top: 10px;
`;

const SelectGroup = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
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
  height: 187px;
  background-color: #f5f7fa;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const UpdateAddressAlert = props => {
  const { handleHouseChange, data, getAPTLocation } = props.payload;
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const selectRef2 = useRef(null);
  const selectRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const scrollHandlers = useScrollHandlers('FlatList-1', actionSheetRef);
  const [isLastPage, setIsLastPage] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [listData, setListData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedArea2, setSelectedArea2] = useState('');
  const [dongList, setDongList] = useState([]);
  const [hoList, setHoList] = useState([]);
  const [selectedDong, setSelectedDong] = useState('');
  const [selectedHo, setSelectedHo] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = props.payload?.navigation;
  const currentUser = useSelector(state => state.currentUser.value);
  const [expandedItems, setExpandedItems] = useState({});

  // console.log('data', data);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [isConnected, setIsConnected] = useState(true);

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

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  // 주소 검색
  const getAddress = async (Area, Area2, searchtext) => {
    /*   const API_KEY = 'U01TX0FVVEgyMDIzMTIxNDE2MDk0NTExNDM1NzY=';
       const COUNT_PER_PAGE = 5;
       const CURRENT_PAGE = 0;
       const keyword = searchText.trim();
   
       const url = `https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?confmKey=${API_KEY}&currentPage=${CURRENT_PAGE}&countPerPage=${COUNT_PER_PAGE}&keyword=${encodeURI(
         selectedArea + ' ' + selectedArea2 + ' ' + keyword,
       )}&resultType=json`;
   
       await axios
         .get(url)
         .then(function (result) {
           const extractedData = result.data.match(/\(.*\)/s)[0];
   
           const parsedData = JSON.parse(
             extractedData.substring(1, extractedData.length - 1),
           );
           if (parsedData.results.common.errorCode !== '0') {
             SheetManager.show('info', {
               payload: {
                 type: 'error',
                 errorType: response.data.type,
                 message: '주소 검색 중 오류가 발생했어요.',
                 description: parsedData.results.common.errorMessage,
               },
             });
             return;
           }
   
           const list = parsedData.results.juso;
   
           if (list.length === 0) {
             SheetManager.show('info', {
               payload: {
                 type: 'error',
                  errorType: result.data.type,
                 message: '검색 결과가 없어요.'
               },
             });
           } else {
             list.length < 5 && setIsLastPage(true);
           }
   
           setListData([...list]);
         })
         .catch(function (error) {
           SheetManager.show('info', {
             type: 'error',
             message: error?.errMsg,
             errorMessage: error?.errCode,
           });
           ////console.log(error);
         });
     };
   */
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
      countPerPage: 5,
      sido: Area,
      sigungu: Area2,
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
          // ////console.log('response', response.data.data)
          if (list.length === 0) {
            SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: response.data.type,
                message: '검색 결과가 없어요.',
                buttontext: '확인하기',
              },
            });
          } else {
            list.length < 5 && setIsLastPage(true);
          }
          setListData([...list]);
        }

      })
      .catch(error => {
        // 오류 처리
        SheetManager.show('info', {
          type: 'error',
          message: error?.errMsg,
          errorMessage: error?.errCode,
          closemodal: true,
          actionSheetRef: actionSheetRef,
          buttontext: '확인하기',
        });
        console.error(error);
      });
  };

  // 주소 검색
  const getMoreAddress = async (Area, Area2, searchtext) => {
    /* const API_KEY = 'U01TX0FVVEgyMDIzMTIxNDE2MDk0NTExNDM1NzY=';
     const COUNT_PER_PAGE = 5;
     const CURRENT_PAGE = listData.length / COUNT_PER_PAGE + 1;
     const keyword = searchText;
 
     const url = `https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?confmKey=${API_KEY}&currentPage=${CURRENT_PAGE}&countPerPage=${COUNT_PER_PAGE}&keyword=${encodeURI(
       selectedArea + ' ' + selectedArea2 + ' ' + keyword,
     )}&resultType=json`;
 
     // 데이터의 마지막 페이지인지 확인
     if (listData.length % COUNT_PER_PAGE !== 0) {
       setIsLastPage(true);
       return;
     }
 
     await axios
       .get(url)
       .then(function (result) {
         const extractedData = result.data.match(/\(.*\)/s)[0];
 
         const parsedData = JSON.parse(
           extractedData.substring(1, extractedData.length - 1),
         );
         if (parsedData.results.common.errorCode !== '0') {
           SheetManager.show('info', {
             payload: {
               type: 'error',
               errorType: result.data.type,
               message: '주소 검색 중 오류가 발생했어요.',
               description: parsedData.results.common.errorMessage,
             },
           });
           return;
         }
 
         const list = parsedData.results.juso;
 
         if (list.length === 0) {
           SheetManager.show('info', {
             payload: {
               type: 'error',
               errorType: result.data.type,
               message: '검색 결과가 없어요.',
             },
           });
         } else if (list.length < 5) {
           setIsLastPage(true);
         }
 
         setListData([...listData, ...list]);
       })
       .catch(function (error) {
         SheetManager.show('info', {
           type: 'error',
           message: error?.errMsg,
           errorMessage: error?.errCode,
         });
         ////console.log(error);
       });*/
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
      currentPage: listData.length / 5 + 1,
      countPerPage: 5,
      sido: Area,
      sigungu: Area2,
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
          //////console.log('response', response.data.data)
          if (list.length === 0) {
            SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: response.data.type,
                message: '검색 결과가 없어요.',
                buttontext: '확인하기',
              },
            });
          } else if (list.length < 5) {
            setIsLastPage(true);
          }

          setListData([...listData, ...list]);
        }


      })
      .catch(function (error) {
        SheetManager.show('info', {
          type: 'error',
          message: error?.errMsg,
          errorMessage: error?.errCode,
          closemodal: true,
          actionSheetRef: actionSheetRef,
          buttontext: '확인하기',
        });
        ////console.log(error);
      });

  };



  // 주택 호 정보 가져오기
  const getHoData = async (address, dongNm, type) => {
    const url = `${Config.APP_API_URL}house/roadAddrDetail`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };

    const data = {
      admCd: address?.admCd === undefined ? '' : address?.admCd,
      rnMgtSn: address?.rnMgtSn === undefined ? '' : address?.rnMgtSn,
      udrtYn: address?.udrtYn === undefined ? '' : address?.udrtYn,
      buldMnnm: address?.buldMnnm === undefined ? '' : address?.buldMnnm,
      buldSlno: address?.buldSlno === undefined ? '' : address?.buldSlno,
      searchType: '2',
      dongNm: dongNm === undefined ? '' : dongNm,
    };

    try {
      const response = await axios.post(url, data, { headers: headers });
      //////console.log('Holist response :', response.data.data.dongHoList);
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '주택의 호수를 불러오는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            closemodal: true,
            actionSheetRef: actionSheetRef,
            buttontext: '확인하기',
          },
        });
        const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
        dispatch(setChatDataList(newChatDataList));
        if (type === 'init') {
          return 0;
        } else {
          return;
        }
      } else {
        const holist = response.data.data.dongHoList;
        setHoList(holist);
        setSelectedHo(holist[0]);
        if (type === 'init') {
          return holist.length;
        } else {
          return;
        }
      }

    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ? error?.errMsg : '주택의 호수를 불러오는데 문제가 발생했습니다.',
        errorMessage: error?.errCode ? error?.errCode : 'error',
        closemodal: true,
        actionSheetRef: actionSheetRef,
        buttontext: '확인하기',
      });
      ////console.log(error ? error : 'error');
    }
  };

  const getDongData = async (address) => {
    const url = `${Config.APP_API_URL}house/roadAddrDetail`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };

    const data = {
      admCd: address?.admCd === undefined ? '' : address?.admCd,
      rnMgtSn: address?.rnMgtSn === undefined ? '' : address?.rnMgtSn,
      udrtYn: address?.udrtYn === undefined ? '' : address?.udrtYn,
      buldMnnm: address?.buldMnnm === undefined ? '' : address?.buldMnnm,
      buldSlno: address?.buldSlno === undefined ? '' : address?.buldSlno,
      searchType: '1',
    };

    try {
      const response = await axios.post(url, data, { headers: headers });
      //////console.log('Donglist response :', response.data);
      if (response.data.errYn === 'Y') {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '주택의 동 목록을 불러오는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            closemodal: true,
            actionSheetRef: actionSheetRef,
            buttontext: '확인하기',
          },
        });
        const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
        dispatch(setChatDataList(newChatDataList));
        return 'dongerror';

      } else {
        // ////console.log('donglist response :', response.data.data.dongHoList);
        const donglist = response.data.data.dongHoList;
        setDongList(donglist);
        return donglist[0];

      }
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ? error?.errMsg : '주택의 동 목록을 불러오는데 문제가 발생했습니다.',
        errorMessage: error?.errCode ? error?.errCode : 'dongerror',
        closemodal: true,
        actionSheetRef: actionSheetRef,
        buttontext: '확인하기',
      });
      ////console.log(error ? error : 'error');
      return 'dongerror';
    }
  };


  useEffect(() => {
    setListData([]);
    setIsLastPage(false);
  }, [searchText]);

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {

              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: currentPageIndex === 0 ? 850 : 480,
        width: width - 40,
      }}>
      {currentPageIndex === 0 && (<SheetContainer width={width}>
        <FlatList
          keyboardShouldPersistTaps='always'
          data={listData}
          ref={scrollViewRef}
          style={{
            zIndex: 1,
          }}
          id="FlatList-1"
          {...scrollHandlers}
          scrollEnabled
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 80,
          }}
          ListHeaderComponent={
            <View
              style={{
                zIndex: 10,
              }}>
              <ModalInputSection>
                <ModalTitle >주택을 검색해주세요.</ModalTitle>
                <ModalAddressInputContainer>
                  <ModalAddressInput

                    placeholder="동(읍/면/리)명 또는 도로명주소를 입력해주세요"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        if (searchText === '') {
                          if (selectedArea !== '전체' && selectedArea !== '') {
                            if (selectedArea2 !== '전체' && selectedArea2 !== '') {
                              getAddress(selectedArea, selectedArea2, '');
                            }
                          } else {
                            return
                          }
                        } else {
                          if (selectedArea === '전체' || selectedArea === '') {
                            if (selectedArea2 === '전체' || selectedArea2 === '') {
                              getAddress('', '', searchText);
                            } else {
                              getAddress('', selectedArea2, searchText);
                            }

                          } else {
                            if (selectedArea2 === '전체' || selectedArea2 === '') {
                              getAddress(selectedArea, '', searchText);
                            } else {
                              getAddress(selectedArea, selectedArea2, searchText);
                            }
                          }

                        }
                      }
                    }}
                  />
                  <ModalInputButton
                    onPress={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        if (searchText === '') {
                          if (selectedArea !== '전체' && selectedArea !== '') {
                            if (selectedArea2 !== '전체' && selectedArea2 !== '') {
                              getAddress(selectedArea, selectedArea2, '');
                            }
                          } else {
                            return
                          }
                        } else {
                          if (selectedArea === '전체' || selectedArea === '') {
                            if (selectedArea2 === '전체' || selectedArea2 === '') {
                              getAddress('', '', searchText);
                            } else {
                              getAddress('', selectedArea2, searchText);
                            }

                          } else {
                            if (selectedArea2 === '전체' || selectedArea2 === '') {
                              getAddress(selectedArea, '', searchText);
                            } else {
                              getAddress(selectedArea, selectedArea2, searchText);
                            }
                          }
                        }
                      }
                    }
                    }>
                    <SerchIcon />
                  </ModalInputButton>
                </ModalAddressInputContainer>
              </ModalInputSection>

              <MapSearchResultHeader>
                <SelectButtonContainer>
                  <SelectDropdown
                    ref={selectRef}
                    data={AREA_LIST}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <SelectButtonText >
                            {selectedArea ? selectedArea : '시/도'}
                          </SelectButtonText>
                          <ChevronDownIcon />
                        </View>
                      );
                    }}
                    defaultButtonText="시/도"
                    dropdownStyle={styles.dropdownStyle}
                    buttonStyle={styles.buttonStyle}
                    buttonTextStyle={styles.buttonTextStyle}
                    rowStyle={styles.rowStyle}
                    rowTextStyle={styles.rowTextStyle}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <SelectItem
                          onPress={() => {
                            setSelectedArea(item.name);
                            setSelectedAreaIndex(index);
                            if (index === 0) {
                              setSelectedArea2('전체');
                            } else {
                              setSelectedArea2('');
                            }
                            selectRef.current?.closeDropdown();
                          }}>
                          <SelectItemText >{item.name}</SelectItemText>
                        </SelectItem>
                      );
                    }}
                  />
                </SelectButtonContainer>
                <SelectButtonContainer>
                  <SelectDropdown
                    ref={selectRef2}
                    data={
                      selectedArea ? AREA_LIST[selectedAreaIndex].list : []
                    }
                    /*onSelect={(selectedItem, index) => {
                      ////console.log(selectedItem, index);
                    }}*/
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <SelectButtonText >
                            {selectedArea2 ? selectedArea2 : '시/군/구'}
                          </SelectButtonText>
                          <ChevronDownIcon />
                        </View>
                      );
                    }}
                    defaultButtonText="시/군/구"
                    dropdownStyle={styles.dropdownStyle}
                    buttonStyle={styles.buttonStyle}
                    buttonTextStyle={styles.buttonTextStyle}
                    rowStyle={styles.rowStyle}
                    rowTextStyle={styles.rowTextStyle}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <SelectItem
                          onPress={() => {
                            // ////console.log('item',item);
                            setSelectedArea2(item);
                            selectRef2.current?.closeDropdown();
                          }}>
                          <SelectItemText >{item}</SelectItemText>
                        </SelectItem>
                      );
                    }}
                  />
                </SelectButtonContainer>
              </MapSearchResultHeader>
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
                      if (selectedArea !== '전체' && selectedArea !== '') {
                        if (selectedArea2 !== '전체' && selectedArea2 !== '') {
                          getAddress(selectedArea, selectedArea2, '');
                        }
                      } else {
                        return
                      }
                    } else {
                      if (selectedArea === '전체' || selectedArea === '') {
                        if (selectedArea2 === '전체' || selectedArea2 === '') {
                          getMoreAddress('', '', searchText);
                        } else {
                          getMoreAddress('', selectedArea2, searchText);
                        }

                      } else {
                        if (selectedArea2 === '전체' || selectedArea2 === '') {
                          getMoreAddress(selectedArea, '', searchText);
                        } else {
                          getMoreAddress(selectedArea, selectedArea2, searchText);
                        }
                      }
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
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    //////console.log('[UpdateAddressAlert]onPress item:', item);
                    setAddress(item?.roadAddr);
                    setSelectedItem(item);
                    /*         if (item?.detBdNmList !== '') {
                               const list = item?.detBdNmList?.split(', ').map(dong => {
                                 return dong.replace('동', '');
                               });
                               setDongList(list);
                               getHoData(item, list[0] + '동');
                             } else {
                               getHoData(item);
                             }*/
                    if (data?.houseType === '2' || data?.houseType === '1') {
                      const firstDong = await getDongData(item);
                      console.log('firstDong', firstDong);
                      if (firstDong !== 'dongerror') {
                        const Hodata = await getHoData(item, firstDong, 'init');
                        console.log('Hodata', Hodata);
                        if (Hodata > 0) {
                          setSelectedItem(item);
                          var p = data;
                          p.houseName = item.bdNm;
                          p.jibunAddr = item.jibunAddr;
                          p.bdMgtSn = item.bdMgtSn;
                          p.roadAddr = item.roadAddrPart1;
                          p.roadAddrRef = item.roadAddrPart2;
                          //////console.log('[UpdateAddressAlert]onPress p:', p);
                          handleHouseChange(p, p?.isMoveInRight);
                          getAPTLocation(item?.roadAddr);
                          setCurrentPageIndex(1);
                        } else {
                          //setCurrentPageIndex(2);
                          setSelectedItem(item);
                          var p = data;
                          p.houseName = item.bdNm;
                          p.jibunAddr = item.jibunAddr;
                          p.bdMgtSn = item.bdMgtSn;
                          p.roadAddr = item.roadAddrPart1;
                          p.roadAddrRef = item.roadAddrPart2;
                          //////console.log('[UpdateAddressAlert]onPress p:', p);
                          handleHouseChange(p, p?.isMoveInRight);
                          getAPTLocation(item?.roadAddr);
                          actionSheetRef.current?.hide();
                          return null;
                        }
                      } else {
                        setSelectedItem(item);
                        //setCurrentPageIndex(2);
                        var p = data;
                        p.houseName = item.bdNm;
                        p.jibunAddr = item.jibunAddr;
                        p.bdMgtSn = item.bdMgtSn;
                        p.roadAddr = item.roadAddrPart1;
                        p.roadAddrRef = item.roadAddrPart2;
                        //////console.log('[UpdateAddressAlert]onPress p:', p);
                        handleHouseChange(p, p?.isMoveInRight);
                        getAPTLocation(item?.roadAddr);
                        actionSheetRef.current?.hide();
                        return null;
                      }
                    } else {
                      setSelectedItem(item);
                      //////console.log('item', item);
                      //setCurrentPageIndex(2);
                      var p = data;
                      p.houseName = item.bdNm;
                      p.jibunAddr = item.jibunAddr;
                      p.bdMgtSn = item.bdMgtSn;
                      p.roadAddr = item.roadAddrPart1;
                      p.roadAddrRef = item.roadAddrPart2;
                      //////console.log('[UpdateAddressAlert]onPress p:', p);
                      handleHouseChange(p, p?.isMoveInRight);
                      getAPTLocation(item?.roadAddr);
                      actionSheetRef.current?.hide();
                      return null;
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
                        <MapSearchResultItemAddress style={{ width: sortedList.length > 5 ? '59%' : '70%' }} numberOfLines={1} ellipsizeMode='tail' >
                          {sortedList.join(',')}
                        </MapSearchResultItemAddress>
                      ) : (
                        <MapSearchResultItemAddress>
                          {sortedList.join(',')}
                        </MapSearchResultItemAddress>
                      )}
                      {sortedList.length > 5 && <MepSearchResultButton onPress={() => { toggleExpand(index) }}>
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

            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />


      </SheetContainer>
      )}
      {currentPageIndex === 1 && (
        <SheetContainer>
          <ModalTitle
            style={{
              marginBottom: 20,
            }} >
            {data?.houseType !== '1' ? '취득하실 주택 동과 호를 선택해주세요.' : '취득하실 아파트 동과 호를 선택해주세요.'}
          </ModalTitle>
          <ApartmentInfoGroup>
            <ApartmentInfoTitle >
              {selectedItem?.bdNm}  {selectedDong ? selectedDong + '동 ' : dongList[0] ? dongList[0] + '동 ' : ''}
              {selectedHo ? selectedHo + '호' : hoList[0] ? hoList[0] + '호' : ''}
            </ApartmentInfoTitle>
          </ApartmentInfoGroup>
          <SelectGroup>
            <View style={{ width: '48%' }}>
              <SelectLabel >동 선택</SelectLabel>
              <PickerContainer>
                {dongList[0] && (
                  <WheelPicker
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
                    allowFontScaling={false}
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
          <ButtonSection
            style={{
              marginTop: 0,
            }}>
            <DropShadow
              style={{
                shadowColor: '#fff',
                width: '48%',
              }}>
              <Button
                onPress={() => {
                  setCurrentPageIndex(0);
                  setSelectedDong('');
                  setSelectedHo('');
                  setHoList([]);
                  setDongList([]);
                }}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#E8EAED',
                }}>
                <ButtonText
                  style={{
                    color: '#717274',
                  }} >
                  이전으로
                </ButtonText>
              </Button>
            </DropShadow>

            <DropShadow style={styles.dropshadow}>
              <Button onPress={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {
                  var detailAddress2 = (selectedDong ? selectedDong + '동 ' : dongList[0] ? dongList[0] + '동 ' : '') + (selectedHo ? selectedHo + '호' : hoList[0] ? hoList[0] + '호' : '');
                  console.log('detailAddress2', detailAddress2);
                  props?.payload.onAddressSelect(detailAddress2); // 콜백 함수 호출
                  actionSheetRef.current?.hide();
                }
              }}>
                <ButtonText>다음으로</ButtonText>
              </Button>
            </DropShadow>
          </ButtonSection>
        </SheetContainer>
      )
      }
    </ActionSheet >
  );
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


export default UpdateAddressAlert;
