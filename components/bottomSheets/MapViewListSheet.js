// 챗 스크린에서 아파트 단지 선택 시 아파트 동과 호를 선택하는 시트

import {
  View,
  Text,
  useWindowDimensions,
  FlatList,
  Pressable,
  Platform,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import SerchIcon from '../../assets/icons/search_map.svg';
import WheelPicker from 'react-native-wheely';
import NaverMapView, { Marker } from 'react-native-nmap';
import DropShadow from 'react-native-drop-shadow';
import Geolocation from '@react-native-community/geolocation';
import LocationIcon from '../../assets/icons/my_location_ico.svg';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { setChatDataList } from '../../redux/chatDataListSlice';
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
`;

const ModalAddressInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  placeholder: '아파트명 혹은 지역명을 입력해주세요',
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
  height: 46px;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
  background-color: #fff;
`;

const MapSearchResultHeaderTitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 24px;
  margin-left: 10px;
  letter-spacing: -0.3px;
`;

const MapSearchResultItem = styled.View`
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
  width: 90%;
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-left: 4px;
`;

const AddressNumberBadge = styled.View`
  width: 37px;
  height: 22px;
  border-radius: 11px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e8eaed;
`;

const AddressNumberText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #a3a5a8;
  line-height: 16px;
`;

const MepSearchResultButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: 65px;
  height: 36px;
  border-radius: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const MapSearchResultButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #2f87ff;
  line-height: 16px;
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
  font-size: 16px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
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

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
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

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const MyLocationButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1;
`;

const MapViewListSheet = props => {
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const chatDataList = useSelector(state => state.chatDataList.value);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const { width, height } = useWindowDimensions();
  const scrollHandlers = useScrollHandlers('FlatList-1', actionSheetRef);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [listData, setListData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedDong, setSelectedDong] = useState('');
  const [selectedHo, setSelectedHo] = useState(null);
  const [dongList, setDongList] = useState(['']);
  const [hoList, setHoList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [zoom, setZoom] = useState(20);

  const handleBackPress = () => {
    if (currentPageIndex === 0) {
      actionSheetRef.current?.hide();
      return true;
    } else if (currentPageIndex === 1) {
      setCurrentPageIndex(0);
      return true;
    }
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
    dispatch(setChatDataList(newChatDataList));
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  }, [handleBackPress]);

  const [myPosition, setMyPosition] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });

  // 위치 권한 체크
  const checkAndGetCurrentLocation = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    let result = await check(permission);

    if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
      result = await request(permission);
    }

    if (result === RESULTS.GRANTED) {
      ////console.log('checkAndGetCurrentLocation');
    }
  };

  useEffect(() => {
    checkAndGetCurrentLocation();
  }, []);

  // 위치 권한 요청
  const requestLocationPermission = async () => {
    const permissionType =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await check(permissionType);
    if (result === RESULTS.GRANTED) {
      return true;
    }

    if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
      const response = await request(permissionType);
      return response === RESULTS.GRANTED;
    }

    return false;
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    ////console.log('getCurrentLocation');
    Geolocation.getCurrentPosition(
      info => {
        const { latitude, longitude } = info.coords;
        setMyPosition({
          latitude: Number(latitude),
          longitude: Number(longitude),
        });
        // getCurrentDistrict(longitude, latitude);
        setZoom(16);
      },
      console.error,
      {
        enableHighAccuracy: false,
        timeout: 2000,
      },
    );
  };

  // 위치 권한 요청
  useEffect(() => {
    requestLocationPermission().then(permissionGranted => {
      if (permissionGranted) {
        getCurrentLocation();
      } else {
        console.error('Location permission denied');
      }
    });
  }, []);

  // 검색 텍스트 변경 시 리스트 초기화
  useEffect(() => {
    setListData([]);
  }, [searchText]);

  // 아파트 명 검색
  const getAddress = async () => {
    const API_KEY = 'U01TX0FVVEgyMDIzMTIxNDE2MDk0NTExNDM1NzY=';
    const COUNT_PER_PAGE = 1;
    const keyword = searchText;

    const url = `https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?confmKey=${API_KEY}&currentPage=0&countPerPage=${COUNT_PER_PAGE}&keyword=${encodeURI(
      keyword,
    )}&resultType=json`;

    await axios
      .get(url)
      .then(async result => {
        const extractedData = result.data.match(/\(.*\)/s)[0];

        const parsedData = JSON.parse(
          extractedData.substring(1, extractedData.length - 1),
        );

        if (parsedData.results.common.errorCode !== '0') {
          SheetManager.show('info', {
            payload: {
              errorType: result.data.type,
              message: '주소 검색 중 오류가 발생했어요.',
              description: parsedData.results.common.errorMessage,
              type: 'error',
              buttontext: '확인하기',
            },
          });
          return;
        }

        ////console.log('111', parsedData.results.juso);

        if (!parsedData.results.juso[0]) {
          SheetManager.show('info', {
            payload: {
              errorType: result.data.type,
              message: '주소에 대한 정보가 없어요.',
              type: 'error',
              buttontext: '확인하기',
            },
          });
          return;
        }

        const location = await getAPTLocation({
          ADRES: parsedData.results.juso[0].roadAddr,
        });

        setMyPosition({
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        });

        getAddressInfo(parsedData.results.juso[0].roadAddr);
      })
      .catch(function (error) {
        ////console.log(error);
      });
  };

  const getCurrentDistrict = async (longitude, latitude) => {
    const API_KEY = 'e094e49e35c61a9da896785b6fee020a';
    const config = {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`,
      },
    }; // 헤더 설정
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}&input_coord=WGS84`;

    const address_name = await axios
      .get(url, config)
      .then(function (result) {
        return result.data.documents[0].address_name;
      })
      .catch(function (error) {
        ////console.log(error);
      });

    getAddressInfo(address_name);
  };

  // 해당 동에 속하는 아파트 정보 가져오기
  const getAddressInfo = async address => {
    const API_KEY =
      'ZWYbv%2BOs9rH3SOjqQZdcBDDXV4k6EasX9%2BswAK7H9yHd5L6U6CNyS2L1p2q0r%2BglE2sXxryzWReJ8fvRaGNgEQ%3D%3D';
    const config = {
      headers: {
        Authorization: `${API_KEY}`,
      },
    }; // 헤더 설정

    const url = `https://api.odcloud.kr/api/AptIdInfoSvc/v1/getAptInfo?page=1&perPage=50&returnType=json&cond%5BADRES%3A%3ALIKE%5D=${address}&serviceKey=${API_KEY}`;

    await axios
      .get(url, config)
      .then(async result => {
        ////console.log(result.data);
        // API호출
        // const promises = result.data.data.map(async apt_item => {
        //   return getAPTLocation(apt_item);
        // });

        // // 모든 비동기 작업이 완료될 때까지 기다립니다.
        // const locations = await Promise.all(promises);

        const locations = await Promise.all(
          result.data.data.map(async apt_item => {
            ////console.log(apt_item);
            return getAPTLocation(apt_item);
          }),
        );

        // list를 현재 위치 기준에서 가까운 순으로 정렬
        const sortedList = locations.sort((a, b) => {
          const aDistance =
            Math.pow(Number(a.latitude) - Number(myPosition.latitude), 2) +
            Math.pow(Number(a.longitude) - Number(myPosition.longitude), 2);
          const bDistance =
            Math.pow(Number(b.latitude) - Number(myPosition.latitude), 2) +
            Math.pow(Number(b.longitude) - Number(myPosition.longitude), 2);
          return aDistance - bDistance;
        });

        setListData(sortedList);
      })
      .catch(function (error) {
        ////console.log(error);
      });
  };

  const getAPTLocation = async apt_item => {
    const API_KEY = 'e094e49e35c61a9da896785b6fee020a';
    const config = {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`,
      },
    }; // 헤더 설정
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
      apt_item.ADRES,
    )}`;

    const location = await axios
      .get(url, config)
      .then(function (result) {
        // API호출

        return {
          latitude: result.data.documents[0]?.y,
          longitude: result.data.documents[0]?.x,
        };
      })
      .catch(function (error) {
        ////console.log(error);
        SheetManager.show('info', {
          payload: {
            errorType: result.data.type,
            message: '주소를 찾을 수 없어요.',
            type: 'error',
            buttontext: '확인하기',
          },
        });
      });

    return {
      ...location,
      ...apt_item,
    };
  };

  // 아파트 단지 정보 가져오기
  const getDongInfo = async id => {
    const API_KEY =
      'ZWYbv%2BOs9rH3SOjqQZdcBDDXV4k6EasX9%2BswAK7H9yHd5L6U6CNyS2L1p2q0r%2BglE2sXxryzWReJ8fvRaGNgEQ%3D%3D';
    const config = {
      headers: {
        Authorization: `${API_KEY}`,
      },
    }; // 헤더 설정

    const url = `https://api.odcloud.kr/api/AptIdInfoSvc/v1/getDongInfo?page=1&perPage=30&cond%5BCOMPLEX_PK%3A%3AEQ%5D=${id}&serviceKey=${API_KEY}`;

    await axios
      .get(url, config)
      .then(function (result) {
        // API호출
        const dongs = result.data.data.map(item => {
          return item.DONG_NM1.replace('동', '');
        });
        setDongList(dongs);
        const hos = result.data.data.map(item => {
          const list = generateApartmentNumbers(item.GRND_FLR_CNT, 5);
          return list;
        });

        setHoList(hos[0]);
      })
      .catch(function (error) {
        ////console.log(error);
      });
  };

  const generateApartmentNumbers = (totalFloors, totalLines) => {
    const apartmentNumbers = [];

    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let line = 1; line <= totalLines; line++) {
        // 호수 생성 및 배열에 추가
        const floorStr = String(floor); // 층을 두 자리 숫자로 변환
        const lineStr = String(line).padStart(2, '0'); // 라인을 두 자리 숫자로 변환
        const apartmentNumber = `${floorStr}${lineStr}`;
        apartmentNumbers.push(apartmentNumber);
      }
    }

    return apartmentNumbers;
  };
  // 아파트 단지 선택 시 상세 정보 가져오기
  /* const getHouseDetailInfo = async () => {
     const url = `${Config.APP_API_URL}house/detail`;
     const headers = {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${currentUser.accessToken}`
     };
 
     const data = await axios
       .get(url, {
         params: {
           houseId: '25',
         },
       }, { headers: headers })
       .then(function (result) {
         if (result.isError) {
           Alert.alert('검색 결과가 없습니다.');
           return;
         }
         return result.data.data;
       })
       .catch(function (error) {
         ////console.log(error);
       });
 
     return data;
   };
 */
  // 페이지 이동
  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: currentPageIndex * width,
      animated: false,
    });
  }, [currentPageIndex]);

  const MarkerComponent = React.memo(
    ({ item, onSelect }) => {
      const SIZE =
        item?.COMPLEX_NM1.length < 3
          ? 80
          : item?.COMPLEX_NM1.length * 10 + 30;

      return (
        <Marker
          key={item.COMPLEX_PK}
          coordinate={{
            latitude: item?.latitude ? Number(item?.latitude) : 0,
            longitude: item?.longitude ? Number(item?.longitude) : 0,
          }}
          anchor={{ x: 0, y: 1 }}
          minWidth={100}
          width={SIZE}
          height={80}
          onClick={onSelect}>
          <DropShadow
            style={{
              shadowColor: '#2F87FF',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              overflow: 'visible',
            }}>
            <View style={{ ...styles.marker, width: SIZE }}>
              <Text  style={styles.markerTitle}>{item.COMPLEX_NM1}</Text>
              <Text  style={styles.markerSubTitle}>{item.UNIT_CNT}세대</Text>
              <View style={styles.markerTriangle} />
            </View>
          </DropShadow>
        </Marker>
      );
    },
    [listData],
  );

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {
              const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
              dispatch(setChatDataList(newChatDataList));
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
        height: currentPageIndex === 0 ? 850 : 500,
        width: width - 40,
        overflow: 'hidden',
      }}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        scrollEventThrottle={16}
        onScroll={e => {
          const contentOffsetX = e.nativeEvent.contentOffset.x;
          const currentIndex = Math.round(contentOffsetX / width);
          setCurrentPageIndex(currentIndex);
        }}
        style={{
          width: width - 40,
        }}
        contentContainerStyle={{
          height: currentPageIndex === 0 ? 850 : 500,
        }}>
        <SheetContainer width={width}>
          <FlatList
            data={listData}
            ref={scrollViewRef}
            style={{
              zIndex: 1,
            }}
            {...scrollHandlers}
            scrollEnabled
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View
                style={{
                  zIndex: 1,
                }}>
                <ModalInputSection>
                  <ModalTitle >취득하실 아파트 단지를 선택해주세요.</ModalTitle>

                  <ModalAddressInputContainer>
                    <ModalAddressInput
                      
                      placeholder="'아파트명 혹은 지역명을 입력해주세요'"
                      value={searchText}
                      onChangeText={text => {
                        setSearchText(text.trim());
                      }}
                      onSubmitEditing={() => {
                        if (searchText) {
                          getAddress();
                        }
                      }}
                    />
                    <ModalInputButton
                      onPress={() => {
                        if (searchText) {
                          getAddress();
                        }
                      }}>
                      <SerchIcon />
                    </ModalInputButton>
                  </ModalAddressInputContainer>
                  {!myPosition.latitude || !myPosition.longitude ? (
                    <View
                      style={{
                        width: width - 40,
                        height: 350,
                        zIndex: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Pretendard-Regular',
                          fontSize: 16,
                          color: '#1B1C1F',
                          lineHeight: 24,
                        }} >
                        위치 정보를 가져오는 중입니다.
                      </Text>
                    </View>
                  ) : (
                    <NaverMapView
                      ref={mapRef}
                      style={{
                        flex: 1,
                        width: width - 40,
                        height: 350,
                        zIndex: 0,
                      }}
                      showsMyLocationButton={false}
                      center={{
                        latitude: Number(myPosition.latitude),
                        longitude: Number(myPosition.longitude),
                        zoom,
                      }}
                      zoomControl={false}
                      isHideCollidedSymbols
                      isForceShowIcon
                      isHideCollidedCaptions
                      useTextureView={true}
                      onCameraChange={e => {
                        if (e.zoom < 13) {
                          setListData([]);
                          return;
                        }

                        getCurrentDistrict(e.longitude, e.latitude);
                      }}>
                      {listData.map((item, index) => {
                        return (
                          <MarkerComponent
                            key={index}
                            item={item}
                            onSelect={() => {
                              getDongInfo(item.COMPLEX_PK);
                              setSelectedItem(item);
                              setCurrentPageIndex(1);
                            }}
                          />
                        );
                      })}
                    </NaverMapView>
                  )}
                  <DropShadow style={styles.shadow}>
                    <MyLocationButton
                      onPress={() => {
                        Geolocation.getCurrentPosition(
                          info => {
                            setMyPosition({
                              latitude: 0,
                              longitude: 0,
                            });
                            setMyPosition({
                              latitude: Number(info.coords.latitude),
                              longitude: Number(info.coords.longitude),
                            });
                          },
                          console.error,
                          {
                            enableHighAccuracy: false,
                            timeout: 20000,
                            // distanceFilter: 50
                          },
                        );
                      }}>
                      <LocationIcon />
                    </MyLocationButton>
                  </DropShadow>
                </ModalInputSection>

                <MapSearchResultHeader>
                  <MapSearchResultHeaderTitle >
                    검색 결과
                  </MapSearchResultHeaderTitle>
                </MapSearchResultHeader>
              </View>
            }
            renderItem={({ item, index }) => (
              <MapSearchResultItem>
                <View
                  style={{
                    width: '72%',
                  }}>
                  <MapSearchResultItemTitle>
                    {item.COMPLEX_NM1}
                  </MapSearchResultItemTitle>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 6,
                    }}>
                    <AddressNumberBadge>
                      <AddressNumberText >지번</AddressNumberText>
                    </AddressNumberBadge>
                    <MapSearchResultItemAddress >
                      {item?.ADRES}
                    </MapSearchResultItemAddress>
                  </View>
                </View>
                <MepSearchResultButton
                  onPress={() => {
                    getDongInfo(item?.COMPLEX_PK);
                    setSelectedItem(item);
                    setCurrentPageIndex(1);
                  }}>
                  <MapSearchResultButtonText >선택</MapSearchResultButtonText>
                </MepSearchResultButton>
              </MapSearchResultItem>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </SheetContainer>
        <SheetContainer width={width}>
          <ModalTitle
            style={{
              marginBottom: 20,
            }} >
            취득하실 아파트 동과 호를 선택해주세요.
          </ModalTitle>
          <ApartmentInfoGroup>
            <ApartmentInfoTitle >
              {selectedItem?.COMPLEX_NM1}{' '}
              {selectedDong ? selectedDong : dongList[0]}동{' '}
              {selectedHo ? selectedHo : hoList[0]}호
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
                      height: 140,
                      borderRadius: 10,
                    }}
                    itemTextStyle={{
                      fontFamily: 'Pretendard-Regular',
                      fontSize: 18,
                      color: '#1B1C1F',
                    }}
                    allowFontScaling= {false}
                    selectedIndicatorStyle={{
                      backgroundColor: 'transparent',
                    }}
                    itemHeight={40}
                    options={dongList}
                    onChange={index => {
                      setSelectedDong(dongList[index]);
                      setSelectedHo(hoList[0]);
                    }}
                  />
                )}
              </PickerContainer>
            </View>
            <View style={{ width: '48%' }}>
              <SelectLabel >호 선택</SelectLabel>

              <PickerContainer>
                {hoList[0] && hoList.length > 0 && (
                  <WheelPicker
                    
                    selectedIndex={selectedHo ? hoList.indexOf(selectedHo) : 0}
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
                    allowFontScaling= {false}
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
          <ButtonSection>
            <Button
              onPress={() => {
                setMyPosition({
                  latitude: Number(myPosition?.latitude),
                  longitude: Number(myPosition?.longitude),
                });
                setCurrentPageIndex(0);
              }}
              style={{
                width: '48%',
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

            <DropShadow
              style={{
                width: '48%',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}>
              <Button
                onPress={async () => {
                  actionSheetRef.current?.hide();

                  try {
                    const chat = {
                      id: 'apartmentAddress',
                      type: 'my',
                      message: selectedItem?.COMPLEX_NM1,
                      questionId: 'apartment',
                      progress: 3,
                    };
                    const chat1 = {
                      id: 'apartmentAddressSystem',
                      type: 'system',
                      message: '취득하실 아파트 동과 호를 선택해주세요.',
                      questionId: 'apartment',
                      progress: 3,
                    };
                    const chat2 = {
                      id: 'apartmentAddressMy',
                      type: 'my',
                      progress: 3,
                      message:
                        (selectedDong ? selectedDong : dongList[0]) +
                        '동 ' +
                        (selectedHo ? selectedHo : hoList[0]) +
                        '호',
                      questionId: 'apartment',
                    };


                    const chat3 = {
                      id: 'apartmentAddressInfoSystem',
                      type: 'system',
                      message: '취득하실 아파트 정보를 불러왔어요.',
                      questionId: 'apartment',
                      progress: 4,
                    };

                    const chatList = [chat, chat1, chat2, chat3];
                    dispatch(setChatDataList([...chatDataList, ...chatList]));
                    dispatch(setHouseInfo(
                      {
                        ...houseInfo
                        , pubLandPrice: '1200000'
                        , bdMgtSn: selectedItem?.PNU
                        , jibunAddr: ''
                        , roadAddr: selectedItem?.ADRES
                        , roadAddrRef: ''
                        , detailAdr: selectedDong ? selectedDong : dongList[0] || '동 ' || selectedHo ? selectedHo : hoList[0] || '호'
                        , houseName: selectedItem?.COMPLEX_NM1
                      }));
                  } catch (error) {
                    console.error('Error in onPress handler:', error);
                  }
                }}>
                <ButtonText >다음으로</ButtonText>
              </Button>
            </DropShadow>
          </ButtonSection>
        </SheetContainer>
      </ScrollView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  marker: {
    minWidth: 80,
    height: 45,
    backgroundColor: '#2F87FF',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  markerTitle: {
    width: '100%',
    fontFamily: 'Pretendard-Bold',
    fontSize: 10,
    color: '#fff',
  },
  markerSubTitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 8,
    color: '#fff',
  },
  markerTriangle: {
    position: 'absolute',
    left: 0,
    bottom: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: '#2F87FF',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export default MapViewListSheet;
