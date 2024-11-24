// 양도소득세 홈페이지

import { TouchableOpacity, useWindowDimensions, BackHandler, View, Text, ScrollView, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { acquisitionTax, gainTax } from '../../data/chatData';
import { LogBox } from 'react-native';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import CloseIcon from '../../assets/icons/close_button.svg';
import BackIcon from '../../assets/icons/back_button.svg';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { setFixHouseList } from '../../redux/fixHouseListSlice';
import { setAddHouseList } from '../../redux/addHouseListSlice';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import Config from 'react-native-config'

const Container = styled.View`
  flex: 1.0;
  background-color: #fff;
`;

const IntroSection = styled.View`
  flex: 0.85;
  width: 100%;
`;

const IntroSection2 = styled.View`
  width: 100%;
  padding: 20px 20px 0px 20px;
`;


const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;

const InfoContentSection = styled.ScrollView.attrs(_props => ({
  showsVerticalScrollIndicator: false,
}))`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 0px 20px;
`;


const HoustInfoSection = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  justify-content: space-between;
`;

const HoustInfoSection2 = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  justify-content: space-between;
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
  line-height: 20px;
`;

const HoustInfoBadge = styled.TouchableOpacity.attrs(_props => ({
  activeOpacity: 0.9,
}))`
  width: auto;
  margin-right: auto;
  height: 22px;
  padding: 0 10px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const HoustInfoBadgeText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
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
  margin-top: 10px;
  text-align: left;
`;


const SubTitle3 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #FF7401;
  line-height: 15px;
  margin-top: 10px;
`;

const SubTitle4 = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;


const ButtonSection = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  bottom: 10px;
  width: 100%;
`;
const Button = styled.TouchableOpacity.attrs(_props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 50px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  bottom: 0px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;


const AddHouseList = props => {
  LogBox.ignoreLogs(['to contain units']);
  const _scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const currentUser = useSelector(state => state.currentUser.value);
  const chatDataList = useSelector(state => state.chatDataList.value);
  const ownHouseList = useSelector(state => state.ownHouseList.value);
  const dispatch = useDispatch();
  const fixHouseList = useSelector(state => state.fixHouseList.value);
  const AddHouseList = useSelector(state => state.addHouseList.value);
  const [addHouseFinish, setaddHouseFinish] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedList, setSelectedList] = useState(fixHouseList);
  //const Pdata = props?.Pdata;
  //console.log('ori fixHouseList', fixHouseList);
  useEffect(() => {
    var cnt = 0;
    for (let i = 0; i < AddHouseList.length; i++) {
      if (AddHouseList[i].complete === true) {
        cnt++;
      }
    }
    if (AddHouseList.length === cnt) {
      setaddHouseFinish(true);
    } else {
      setaddHouseFinish(false);
    }
  }, [AddHouseList])

 /* useEffect(() => {
    _scrollViewRef.current?.scrollTo({
      x: (width) * currentPageIndex,
      y: 0,
      animated: true,
    });
  }, [currentPageIndex]);
*/
  const handleBackPress = () => {
    if (currentPageIndex === 0) {

      dispatch(setFixHouseList([]), setAddHouseList([]));
      navigation.navigate('GainsTaxChat');
      const newChatDataList = chatDataList.slice(0, props.route?.params.chatListindex + 1);
      dispatch(setChatDataList(newChatDataList));
    } else {
      setCurrentPageIndex(currentPageIndex - 1);
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

  const handleNetInfoChange = (state) => {
    return new Promise((resolve, _reject) => {
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



  const goAddHouse = async (index) => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      navigation.push('AddHouse', { index: index, chatListindex: props.route?.params.chatListindex });
    }
    console.log('addHouse', AddHouseList);
    console.log('index', index);
  };

  const registerDirectHouse = async () => {

    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      const accessToken = currentUser.accessToken;
      // 요청 헤더
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      };

      // 요청 바디
      //console.log('last AddHouseList', AddHouseList);
      var loadHouseList = AddHouseList ? AddHouseList.filter(house => house.complete === true) : [];
      const data = {
        calcType : '02',
        houseSaveRequestList : loadHouseList.map(({ index, complete, createAt, houseId, isCurOwn, isDestruction, kbMktPrice, moveInDate, moveOutDate, ownerCnt, sellDate, sellPrice, sourceType, updateAt, userId, userProportion, ...rest }) => rest),
      }
      console.log('request : ', data);

      axios
        .post(`${Config.APP_API_URL}house/saveAllHouse`, data, { headers: headers })
        .then(async response => {
          if (response.data.errYn === 'Y') {
            await SheetManager.show('info', {
              payload: {
                type: 'error',
                message: response.data.errMsg ? response.data.errMsg : '보유주택 수정·등록 중 오류가 발생했습니다.',
                description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
                buttontext: '확인하기',
              },
            });
            return;

          } else {
            console.log('[hypenHouseAPI] ownHouseList : ', ownHouseList);
            console.log('[hypenHouseAPI] home response.data : ', response.data.data.list);
            const returndata = response.data.data.list;
            dispatch(setOwnHouseList([
              ...returndata,
            ]));

           console.log('[hypenHouseAPI] home response.data : ', response.data.data);
            console.log('[hypenHouseAPI] ownhouse : ', ownHouseList);
          }
        })
        .catch(async error => {
          // 오류 처리
          await SheetManager.show('info', {
            payload: {
              type: 'error',
              message: '보유주택 수정·등록 중 오류가 발생했습니다.',
              buttontext: '확인하기',
            },
          });
          console.error(error);
        });
    }
  };






  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            if (currentPageIndex === 0) {
              dispatch(setFixHouseList([]), setAddHouseList([]));
              navigation.navigate('GainsTaxChat');
              const newChatDataList = chatDataList.slice(0, props.route?.params.chatListindex + 1);
              dispatch(setChatDataList(newChatDataList));
            } else {
              setCurrentPageIndex(currentPageIndex - 1);
            }

          }}>
          {currentPageIndex === 0 ? <CloseIcon /> : <BackIcon />}
        </TouchableOpacity>
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
  }, [currentPageIndex]);

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
        <><IntroSection2 style={{ width: width, marginBottom: 20 }}>
          <Title>주택 재산세 정보를 가져왔어요.</Title>
          <Title>실제 보유 중인 주택만 선택해주세요.</Title>
          <SubTitle3>매매 외의 방식으로 주택을 취득한 경우 주택 거래내역에서{'\n'}가져올 수 없기 때문에 재산세 목록을 한 번 더 확인해요.{'\n'}아래 목록에서 선택하지 않은 주택은 사라져요.</SubTitle3>
        </IntroSection2>
          <InfoContentSection overScrollMode="never" style={{ width: width, height: height - 370 }}>
            {fixHouseList?.map((item, index) => (
              <HoustInfoSection
                active={selectedList.indexOf(item) > -1}
                style={{
                  borderColor: selectedList.indexOf(item) > -1 ? '#2f87ff' : '#CFD1D5',
                }}
                onPress={() => {
                  if (selectedList.indexOf(item) > -1) {
                    setSelectedList(
                      selectedList.filter(selectedItem => selectedItem !== item),
                    );
                  } else {
                    setSelectedList([...selectedList, item]);
                  }
                }}
                key={index}>
                <View
                  style={{
                    width: '60%',
                    marginRight: '10%',
                  }}>
                  <HoustInfoTitle style={{ color: selectedList.indexOf(item) > -1 ? '#000000' : '#CFD1D5', }}>
                    {item.roadAddr !== null
                      ? item.roadAddr
                      : item.jibunAddr + ' ' + item.houseName}
                  </HoustInfoTitle>
                  {item.detailAdr !== null && (
                    <HoustInfoText style={{ color: selectedList.indexOf(item) > -1 ? '#000000' : '#CFD1D5', }}>
                      {item.detailAdr}
                    </HoustInfoText>
                  )}
                </View>
                <HoustInfoBadge
                  active={selectedList.indexOf(item) > -1}
                  onPress={() => {
                    if (selectedList.indexOf(item) > -1) {
                      setSelectedList(
                        selectedList.filter(selectedItem => selectedItem !== item),
                      );
                    } else {
                      setSelectedList([...selectedList, item]);
                    }
                  }}
                  style={{
                    height: 30,
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: selectedList.indexOf(item) > -1 ? '#2f87ff' : '#CFD1D5',
                  }}>
                  <HoustInfoBadgeText style={{ fontSize: 13, lineHeight: 30 }}>
                    {selectedList.indexOf(item) > -1 ? '선택' : '삭제'}
                  </HoustInfoBadgeText>
                </HoustInfoBadge>
              </HoustInfoSection>
            ))}
          </InfoContentSection>


          <ButtonSection width={width} style={{
            height: 90, // height 값을 문자열로 변경
            backgroundColor: '#fff', // background-color를 camelCase로 변경
            alignItems: 'center', // align-items를 camelCase로 변경
            //   flexDirection: 'row', // flex-direction을 camelCase로 변경
            //   justifyContent: 'space-between', // justify-content를 camelCase로 변경
            padding: 20,

          }}>


            <DropShadow style={styles.dropshadow}>
              <Button active={true}
                disabled={!(true)}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    if (selectedList.length === 0) {
                      const chatItem = gainTax.find(el => el.id === 'allHouse1')
                      dispatch(setChatDataList([...chatDataList, chatItem]), setFixHouseList([]), setAddHouseList([]));
                      navigation.navigate('GainsTaxChat');
                    } else {
                      //console.log('selectedList : ', selectedList);
                      let sortSelectList = [...selectedList].sort((a, b) => a.index - b.index);
                      dispatch(setAddHouseList(sortSelectList));
                      setCurrentPageIndex(1);
                    }

                  }
                }} style={{
                  width: '100%',
                  height: 50, // height 값을 숫자로 변경하고 단위 제거경하고 단위 제거
                  alignItems: 'center', // align-items를 camelCase로 변경
                  justifyContent: 'center', // justify-content를 camelCase로 변경
                  borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                  backgroundColor: '#2f87ff',
                  borderColor: '#2f87ff',
                }}>
                <ButtonText active={true} style={{
                  color: '#717274',
                  fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                  fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                  lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
                  color: '#fff'
                }}
                >다음으로</ButtonText>
              </Button>
            </DropShadow>
          </ButtonSection></>
      </Container>}

      {currentPageIndex === 1 && <Container style={{ width: width }}>
        <ProgressSection>
        </ProgressSection>
        <><IntroSection2 style={{ width: width, marginBottom: 20 }}>
          <Title>매매 외 방식으로 주택을 취득한 경우{'\n'}정보를 추가적으로 알려주세요.</Title>
          <SubTitle2>주로 상속이나 증여, 재산 분할 등으로 주택을 취득하신 경우가{'\n'}매매 외의 방식에 해당해요.</SubTitle2>
          <SubTitle3>추가정보 입력이 필요한 주택이 있을 경우 다음 단계로 넘어갈 수{'\n'}없어요. 추가 입력을 선택하신 후 필요한 정보들을 알려주세요.</SubTitle3>
        </IntroSection2>

          <InfoContentSection overScrollMode="never" style={{ width: width, height: height - 370 }}>
            {AddHouseList?.map((item, index) => (
              <HoustInfoSection2
                style={{
                  borderColor: item.complete === true ? '#CFD1D5' : '#FF7401',
                }}
                key={index}>
                <View
                  style={{
                    width: '60%',
                    marginRight: '10%',
                  }}>
                  <HoustInfoTitle style={{ color: item.complete === true ? '#CFD1D5' : '#000000', }}>
                    {item.roadAddr !== null
                      ? item.roadAddr
                      : item.jibunAddr + ' ' + item.houseName}
                  </HoustInfoTitle>
                  {item.detailAdr !== null && (
                    <HoustInfoText style={{ color: item.complete === true ? '#CFD1D5' : '#000000', }}>
                      {item.detailAdr}
                    </HoustInfoText>
                  )}
                </View>
                <HoustInfoBadge
                  disabled={item.complete === true}
                  onPress={() => goAddHouse(item.index)}
                  style={{
                    height: 30,
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: item.complete === true ? '#CFD1D5' : '#FF7401',
                  }}>
                  <HoustInfoBadgeText style={{ fontSize: 13, lineHeight: 30 }}>
                    {item.complete === true ? '완료' : '추가 입력'}
                  </HoustInfoBadgeText>
                </HoustInfoBadge>
              </HoustInfoSection2>
            ))}
          </InfoContentSection>


          <ButtonSection style={{
            width: width,
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
            <DropShadow style={{
              width: '48%',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 2,
            }}>
              <Button active={addHouseFinish}
                disabled={!(addHouseFinish)}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    await registerDirectHouse();
                    const chatItem = gainTax.find(el => el.id === 'allHouse1')
                    dispatch(setChatDataList([...chatDataList, chatItem]), setFixHouseList([]), setAddHouseList([]));
                    navigation.navigate('GainsTaxChat');
                  }
                }} style={{
                  width: '100%',
                  height: 50, // height 값을 숫자로 변경하고 단위 제거
                  borderRadius: 25, // border-radius를 camelCase로 변경하고 단위 제거
                  alignItems: 'center', // align-items를 camelCase로 변경
                  justifyContent: 'center', // justify-content를 camelCase로 변경
                  borderWidth: 1, // border-width를 camelCase로 변경하고 단위 제거
                  backgroundColor: addHouseFinish ? '#2f87ff' : '#E8EAED',
                  borderColor: addHouseFinish ? '#2f87ff' : '#E8EAED',
                }}>
                <ButtonText active={addHouseFinish} style={{
                  color: '#717274',
                  fontSize: 16, // font-size를 camelCase로 변경하고 단위 제거
                  fontFamily: 'Pretendard-Bold', // font-family를 camelCase로 변경
                  lineHeight: 20, // line-height를 camelCase로 변경하고 단위 제거
                  color: addHouseFinish ? '#fff' : '#717274'
                }}
                >다음으로</ButtonText>
              </Button>
            </DropShadow>
          </ButtonSection></>
      </Container>}

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
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});


export default AddHouseList;
