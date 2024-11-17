// 보유 주택 목록에서 주소 선택시 뜨는 팝업
// 지도수정에 따라 반영
// 챗 스크린에서 주택 검색 시트

import {
  View,
  useWindowDimensions,
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
import DropShadow from 'react-native-drop-shadow';
import WheelPicker from 'react-native-wheely';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import NetInfo from "@react-native-community/netinfo"
import dayjs from 'dayjs';
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


const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
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



const ChooseHouseDongHoAlert = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [isLastPage, setIsLastPage] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [listData, setListData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dongList, setDongList] = useState([]);
  const [hoList, setHoList] = useState([]);
  const [selectedDong, setSelectedDong] = useState('');
  const [selectedHo, setSelectedHo] = useState('');
  const [selectedItem, setSelectedItem] = useState(props.payload.currentPageIndex.selectedItem);
  const chatDataList = useSelector(state => state.chatDataList.value);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const currentUser = useSelector(state => state.currentUser.value);
  const navigation = props.payload?.navigation;
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const questionId = props.payload?.currentPageIndex.questionId;
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


  useEffect(() => {
    // ////console.log('props.payload?.item', props.payload.currentPageIndex.selectedItem);
    // ////console.log('props.payload?.dongList', props.payload.currentPageIndex.dongList);
    //  ////console.log('props.payload?.hoList', props.payload.currentPageIndex.hoList);
    // ////console.log('props.payload?.currentPageIndex', props.payload);
    setDongList(props.payload?.currentPageIndex.dongList);
    setHoList(props.payload?.currentPageIndex.hoList);

  }, []);


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


  // 주택 호 정보 가져오기
  const getHoData = async (address, dongNm) => {
    /*const API_KEY = 'devU01TX0FVVEgyMDI0MDQwMjIzMzI1NzExNDY1NTc=';
    //const API_KEY = 'devU01TX0FVVEgyMDI0MDEwOTIzMDQ0MjExNDQxOTY=';

    const url = 'https://business.juso.go.kr/addrlink/addrDetailApi.do';

    await axios
      .get(url, {
        params: {
          confmKey: API_KEY,
          admCd: address.admCd,
          rnMgtSn: address.rnMgtSn,
          udrtYn: address.udrtYn,
          buldMnnm: address.buldMnnm,
          buldSlno: address.buldSlno,
          searchType: 'floorho',
          dongNm: dongNm,
          resultType: 'json',
        },
      })
      .then(function (result) {
        if (result.data.errYn === 'Y') {
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg,
              description: response.data.errMsgDtl,
            },
          });
          return;
        } else {
          const ilst = result.data.results.juso.map(ho => {
            return ho.hoNm.replace('호', '');
          });
          setHoList(ilst);
          setSelectedHo(ilst[0]);
        }

      })
      .catch(function (error) {
        ////console.log(error);
      });*/
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
            message: response.data.errMsg ? response.data.errMsg : '상세주소를 가져오는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            closemodal: true,
            actionSheetRef: actionSheetRef,
            buttontext: '확인하기',
          },
        });
        return;

      } else {
        const holist = response.data.data.dongHoList;
        setHoList(holist);
        setSelectedHo(holist[0]);
      }

    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg,
        errorMessage: error?.errCode,
        closemodal: true,
        actionSheetRef: actionSheetRef,
        buttontext: '확인하기',
      });
      ////console.log(error);
    }
  };


  const getGongSiData = async (item, dong1, dong2, ho1, ho2, detail2) => {


    try {
      const accessToken = currentUser.accessToken;
      // 요청 헤더
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      };

      // 요청 바디
      const param = {
        //[필수] legalDstCode | String | 법정동코드
        //[필수] roadAddr | String | 도로명주소
        //[선택] siDo | String | 시도
        //[선택] siGunGu | String | 시군구
        //[선택] complexName | String | 단지명
        //[필수] dongName | String | 동명
        //[선택] hoName | String | 호
        legalDstCode: item.admCd,
        roadAddr: item.roadAddrPart1,
        siDo: '',
        siGunGu: '',
        dongName: dong1 ? dong1 : dong2 ? dong2 : '',
        hoName: ho1 ? ho1 : ho2 ? ho2 : '',
        complexName: item.bdNm,

      };
      /*    ////console.log('gongsiParams', {
            bdKdcd: item?.bdKdcd,
            pnu: item?.pnu,
            dongNm: dong1 ? dong1 : dong2 ? dong2 : '',
            hoNm: ho1 ? ho1 : ho2 ? ho2 : '',
            detailAdr: detail ? detail : '',
            numOfRows: 5,
            pageNo: 1,
          })*/
      const response = await axios.post(`${Config.APP_API_URL}house/pubLandPriceAndAreaAtDB`, param, { headers: headers });
      const data = response.data.data;
      //    ////console.log('gongsiData return', data);
      if (response.data.errYn === 'Y') {
       /* SheetManager.show('info', {
          payload: {
            type: 'error',
            message: response.data.errMsg ? response.data.errMsg : '공시가격과 전용면적을 가져오는데 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            buttontext: '확인하기',
          },
        });*/


        dispatch(
          setHouseInfo({
            ...houseInfo,
            detailAdr: detail2,
          }));
        return {
          isPubLandPriceOver100Mil: undefined,
          isAreaOver85: undefined,
          result: true
        };
      } else {
        const successresult = await successResponse(data, detail2);
        //   ////console.log('successresult', successresult);
        return {
          isPubLandPriceOver100Mil: successresult.isPubLandPriceOver100Mil,
          isAreaOver85: successresult.isAreaOver85,
          result: true
        };
      }
    } catch (error) {        // 오류 처리
      console.error(error);
     /* SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg,
        errorMessage: error?.errCode,
        closemodal: true,
        actionSheetRef: actionSheetRef,
        buttontext: '확인하기',
      });*/
      return {
        isPubLandPriceOver100Mil: undefined,
        isAreaOver85: undefined,
        result: false
      };
    }
  };

  const successResponse = async (data, detail2) => {
    if (data?.pubLandPrice) {
      if (data?.pubLandPrice > 100000000) {
        if (data?.area) {
          if (data?.area > 85) {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                hasPubLandPrice: true,
                pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
                hasArea: true,
                area: data?.area ? data?.area : 0,
                stdrYear: data?.stdrYear,
                detailAdr: detail2,
                isAreaOver85: true,
                isPubLandPriceOver100Mil: true
              }),
            );
            return { isAreaOver85: true, isPubLandPriceOver100Mil: true };
          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                hasPubLandPrice: true,
                pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
                hasArea: true,
                area: data?.area ? data?.area : 0,
                stdrYear: data?.stdrYear,
                detailAdr: detail2,
                isAreaOver85: false,
                isPubLandPriceOver100Mil: true
              }),
            );
            return { isAreaOver85: false, isPubLandPriceOver100Mil: true };
          }
        } else {
          dispatch(
            setHouseInfo({
              ...houseInfo,
              hasPubLandPrice: true,
              pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
              hasArea: false,
              area: data?.area ? data?.area : 0,
              stdrYear: data?.stdrYear,
              detailAdr: detail2,
              isPubLandPriceOver100Mil: true
            }),
          );
          return { isPubLandPriceOver100Mil: true };
        }
      } else {
        if (data?.area) {
          if (data?.area > 85) {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                hasPubLandPrice: true,
                pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
                hasArea: true,
                area: data?.area ? data?.area : 0,
                stdrYear: data?.stdrYear,
                detailAdr: detail2,
                isAreaOver85: true,
                isPubLandPriceOver100Mil: false
              }),
            );
            return { isAreaOver85: true, isPubLandPriceOver100Mil: false };
          } else {
            dispatch(
              setHouseInfo({
                ...houseInfo,
                hasPubLandPrice: true,
                pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
                hasArea: true,
                area: data?.area ? data?.area : 0,
                stdrYear: data?.stdrYear,
                detailAdr: detail2,
                isAreaOver85: false,
                isPubLandPriceOver100Mil: false
              }),
            );
            return { isAreaOver85: false, isPubLandPriceOver100Mil: false };
          }
        } else {
          dispatch(
            setHouseInfo({
              ...houseInfo,
              hasPubLandPrice: true,
              pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
              hasArea: false,
              area: data?.area ? data?.area : 0,
              stdrYear: data?.stdrYear,
              detailAdr: detail2,
              isPubLandPriceOver100Mil: false
            }),
          );
          return { isPubLandPriceOver100Mil: false };
        }
      }
    } else {
      if (data?.area) {
        if (data?.area > 85) {
          dispatch(
            setHouseInfo({
              ...houseInfo,
              hasPubLandPrice: false,
              pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
              hasArea: true,
              area: data?.area ? data?.area : 0,
              stdrYear: data?.stdrYear,
              detailAdr: detail2,
              isAreaOver85: true,
            }),
          );
          return { isAreaOver85: true };
        } else {
          dispatch(
            setHouseInfo({
              ...houseInfo,
              hasPubLandPrice: false,
              pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
              hasArea: true,
              area: data?.area ? data?.area : 0,
              stdrYear: data?.stdrYear,
              detailAdr: detail2,
              isAreaOver85: false,
            }),
          );
          return { isAreaOver85: false };
        }
      } else {
        dispatch(
          setHouseInfo({
            ...houseInfo,
            hasPubLandPrice: false,
            pubLandPrice: data?.pubLandPrice ? data?.pubLandPrice : 0,
            hasArea: false,
            area: data?.area ? data?.area : 0,
            stdrYear: data?.stdrYear,
            detailAdr: detail2,
          }),
        );
        return {};
      }
    }


  };


  const nextHandler = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      actionSheetRef.current?.hide();
      var detailAddress2 = (selectedDong ? selectedDong + '동 ' : dongList[0] ? dongList[0] + '동 ' : '') + (selectedHo ? selectedHo + '호' : hoList[0] ? hoList[0] + '호' : '');
      const chat3 = {
        id: 'apartmentAddressInfoSystem',
        type: 'system',
        message: '취득하실 주택 정보를 불러왔어요.',
        questionId: 'apartment',
        progress: 2,
      };

      const chat5 = {
        id: 'apartmentAddressMy',
        type: 'my',
        message: detailAddress2,
        questionId: 'apartment',
      };



      const chatpubLandPrice = {
        id: 'pubLandPrice',
        type: 'system',
        message: '공시가격을 제대로 불러오지 못했어요.\n공시가격이 1억원을 초과하나요?',
        progress: 1,
        select: [
          {
            id: 'yes',
            name: '네',
            select: ['area'],
          },
          {
            id: 'no',
            name: '아니요',
            select: ['area'],
          },
        ]

      }

      const chatarea = {
        id: 'area',
        type: 'system',
        message: '전용면적을 제대로 불러오지 못했어요.\n전용면적이 85㎡을 초과하나요?.',
        progress: 1,
        select: [
          {
            id: 'yes',
            name: '네',
            select: ['apartmentAddressInfoSystem'],


          },
          {
            id: 'no',
            name: '아니오',
            select: ['apartmentAddressInfoSystem'],


          },
        ]

      }

      //리스트 초기화부분
      ////console.log('selectedItem',selectedItem);
      const gongsireturn = await getGongSiData(selectedItem, selectedDong, dongList[0], selectedHo, hoList[0], detailAddress2);
      if (gongsireturn?.result) {
        const chatList =
          (gongsireturn?.isPubLandPriceOver100Mil !== undefined ? (gongsireturn?.isAreaOver85 !== undefined ? [chat5, chat3] : [chat5, chatarea]) : [chat5, chatpubLandPrice]);
        dispatch(setChatDataList([...chatDataList, ...chatList]));

      } else {

      }
    } else {
      const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
      dispatch(setChatDataList(newChatDataList));
      actionSheetRef.current?.hide();
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
        height: 500,
        width: width - 40,
      }}>

      <SheetContainer>
        <ModalTitle
          style={{
            marginBottom: 20,
          }}>
          {questionId === 'villa' ? '취득하실 주택 동과 호를 선택해주세요.' : '취득하실 아파트 동과 호를 선택해주세요.'}
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
                  allowFontScaling= {false}
                  selectedIndicatorStyle={{
                    backgroundColor: 'transparent',
                  }}
                  itemHeight={40}
                  options={dongList}
                  onChange={index => {
                    setSelectedDong(dongList[index]);
                    setHoList([]);
                    getHoData(selectedItem, dongList[index]);
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
                const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                dispatch(setChatDataList(newChatDataList));
                actionSheetRef.current?.hide();
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
            <Button onPress={nextHandler}>
              <ButtonText >다음으로</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
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


export default ChooseHouseDongHoAlert;
