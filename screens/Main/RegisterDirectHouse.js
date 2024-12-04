// 직접 등록하기 화면

import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react';
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Switch from 'react-native-draggable-switch';
import axios from 'axios';
import getFontSize from '../../utils/getFontSize';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'
import { gainTax } from '../../data/chatData';


// Icons
import BuildingIcon1 from '../../assets/icons/house/building_type1_ico.svg';
import HouseIcon from '../../assets/icons/house/house.svg';
import VillaIcon from '../../assets/icons/house/villa.svg';
import SearchIcon from '../../assets/icons/search_ico.svg';
import KeyIcon from '../../assets/images/family_key.svg';
import { useDispatch, useSelector } from 'react-redux';
import { SheetManager } from 'react-native-actions-sheet';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { setDirectRegister } from '../../redux/directRegisterSlice';
import { setChatDataList } from '../../redux/chatDataListSlice';

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #f5f7fa;
`;

const IntroSection = styled.View`
  padding: 25px;
  height: 220px;
  width: 100%;
  background-color: #fff;
`;

const IconView = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8eaed;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  margin-bottom: 8px;
  margin-top: 20px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 25px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const InputSection = styled.View`
  flex: 1;
  background-color: #f7f8fa;
  padding: 20px;
`;

const Paper = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px 0;
  border: 1px solid #e8eaed;
`;

const Label = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 16px;
  margin-bottom: 10px;
  margin-left: 20px;
`;

const DescText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-bottom: 15px;
  margin-left: 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => (props.active ? '#2f87ff' : '#e8eaed')};
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  align-self: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#a3a5a8')};
  line-height: 20px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  width: ${props => props.width - 80}px;
  height: 45px;
  background-color: #f5f7fa;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  align-self: center;
`;

const SelectButton = styled.Pressable`
  width: 140px;
  height: 70px;
  border-radius: 10px;
  background-color: #fff;
  border: ${props =>
    props.active ? '1px solid #2f87ff' : '1px solid #e8eaed'};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const SelectButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 16px;
  margin-top: 8px;
`;

const InfoContentItem = styled.View`
  width: 100%;
  height: 56px;
  background-color: #fff;
  border-radius: 5px;
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




const RegisterDirectHouse = props => {
  //console.log("RDH props", props);
  const navigation = props.navigation ? props.navigation : useNavigation();
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const addressInputRef = useRef(null);
  const addressDetailInputRef = useRef(null);
  const [selectedHouseType, setSelectedHouseType] = useState('1');
  const [isMoveInRight, setIsMoveInRight] = useState(false);

  const currentUser = useSelector(state => state.currentUser.value);
  const [prevChat, setPrevChat] = useState(null);
  const [prevSheet, setPrevSheet] = useState(null);

  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const directRegister = useSelector(
    state => state.directRegister.value,
  );
  const chatDataList = useSelector(state => state.chatDataList.value);

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

  const getOwnlist = async () => {
    var prevSheetNum = '';
    if (prevSheet === 'own2') {
      prevSheetNum = '02';
    } else {
      prevSheetNum = '01';
    }
    ////console.log('prevSheet', prevSheet);
    const url = `${Config.APP_API_URL}house/list?calcType=${prevSheetNum}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.accessToken}`
    };
    await axios
      .get(url, { headers: headers })
      .then(response => {
        const result = response.data;
        const list = result.data.list === undefined ? null : result.data.list;
        if (result.isError) {
          Alert.alert('검색 결과가 없습니다.');
          return;
        }
        dispatch(
          setOwnHouseList([
            ...list,
          ]),
        );
      })
      .catch(function (error) {
        ////console.log(error);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();
            /*         if (props.route.params?.prevSheet) {
                       SheetManager.show(props.route.params.prevSheet, {
                         payload: {
                           navigation,
                           index: props.route.params.index
                         },
                       });
                     }*/
            dispatch(
              setDirectRegister({
                houseName: '',
                address: '',
                addressDetail: '',
                bdMgtSn: '',
              }),
            );
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '직접 등록하기',
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

  useEffect(() => {
    if (props.route.params?.prevChat) {
      setPrevChat(props.route.params?.prevChat);
    }
    if (props.route.params?.prevSheet) {
      setPrevSheet(props.route.params?.prevSheet);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // 하드웨어 백 버튼 핸들러 정의
      const handleBackPress = () => {
        navigation.goBack();
        /*    if (props.route.params?.prevSheet) {
              SheetManager.show(props.route.params.prevSheet, {
                payload: {
                  navigation,
                  index: props.route.params.index
                },
              });
            }*/
        dispatch(
          setDirectRegister({
            houseName: '',
            address: '',
            addressDetail: '',
            bdMgtSn: '',
          }),
        );
        return true;
      };

      // 이벤트 리스너 추가
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [navigation, props.route.params])); // 의존성 배열에 navigation과 params 추가

  const HOUSE_TYPE = [
    {
      id: '1',
      name: '아파트 · 오피스텔',
      icon: <BuildingIcon1 />,
    },
    {
      id: '4',
      name: '단독주택 · 다가구',
      icon: <HouseIcon />,
    },
    {
      id: '2',
      name: '연립 · 다세대',
      icon: <VillaIcon />,
    },
  ];

  const successRegister = async () => {
    if (props.route.params?.certError) {
      await getOwnlist();
      navigation.goBack();
      navigation.goBack();
      let el = gainTax.find(el => el.id === 'allHouse2');
      if (el) {
        dispatch(
          setChatDataList([
            ...chatDataList,
            el,
          ]),
        );
      }
    } else {
      await getOwnlist();
      navigation.navigate(prevChat);
      setTimeout(() => {

        SheetManager.show(
          prevSheet ? prevSheet : props.route.params?.prevSheet,
          {
            payload: {
              navigation,
              index: props.route.params?.index,
              data: props?.route?.params?.data,
              chungYackYn: props?.route?.params?.chungYackYn
            },
          },
        );
      }, 300);
    }

    dispatch(
      setDirectRegister({
        houseName: '',
        address: '',
        addressDetail: '',
        bdMgtSn: '',
      }),
    );
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
      const data = {
        // houseType | String | 주택유형
        // houseName | String | 주택명
        // detailAdr | String | 상세주소
        // jibunAddr | String | 지번주소
        // roadAddr | String | 도로명주소
        // roadAddrRef | String | 도로명주소참고항목
        // bdMgtSn | String | 건물관리번호
        // admCd | String | 행정구역코드
        // rnMgtSn | String | 도로명코드
        houseType: HOUSE_TYPE.find(
          el => el.id === selectedHouseType,
        ).id,
        houseName: directRegister.houseName,
        detailAdr: directRegister.addressDetail,
        jibunAddr: directRegister.jibunAddr,
        roadAddr: directRegister.address,
        roadAddrRef: '',
        bdMgtSn: directRegister.bdMgtSn,
        admCd: directRegister.admCd,
        rnMgtSn: directRegister.rnMgtSn,

        //입주권여부
        isMoveInRight: isMoveInRight,
      };
      //successRegister();
      //console.log('data : ', data);
      axios
        .post(`${Config.APP_API_URL}house/regist`, data, { headers: headers })
        .then(async response => {
          if (response.data.errYn === 'Y') {
            SheetManager.show('info', {
              payload: {
                type: 'error',
                errorType: response.data.type,
                message: response.data.errMsg ? response.data.errMsg : '주택 등록 중 오류가 발생했습니다.',
                description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
                buttontext: '확인하기',
              },
            });
            return;

          } else {
            await successRegister();
          }
          // 성공적인 응답 처리
          // const { id } = response.data;


        })
        .catch(error => {
          // 오류 처리
          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: '보유주택 등록 중 오류가 발생했습니다.',
              buttontext: '확인하기',
            },
          });
          console.error(error);
        });
    }
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='always'
        enableAutomaticScroll={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}>
        <View>
          <InputSection>
            <IconView>
              <KeyIcon />
            </IconView>
            <Title >
              일부 주택은 불러오지 못할 수도 있어요{'\n'}빠진 주택이 있으시다면
              직접 등록해주세요
            </Title>
            <SubTitle >
              등록하실 주택이 아파트인지, 그 외 주택 형태인지 선택해주세요.
            </SubTitle>
            <Paper>
              <Label >주택 형태</Label>
              <DescText >
                등록하실 주택이 아파트인지, 그 외 주택 형태인지 선택해주세요.
              </DescText>
              <ScrollView
                keyboardShouldPersistTaps='always'
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                }}>
                {HOUSE_TYPE.map((item, index) => (
                  <SelectButton

                    key={item.id}
                    active={selectedHouseType === item.id}
                    onPress={() => {
                      setSelectedHouseType(item.id);
                    }}>
                    {item.icon}
                    <SelectButtonText >{item.name}</SelectButtonText>
                  </SelectButton>
                ))}
              </ScrollView>
            </Paper>
            <Paper
              style={{
                paddingHorizontal: 20,
              }}>
              <Label >주소 정보</Label>
              <DescText >
                등록하려는 주택의 주소를 검색하여 선택해주세요.
              </DescText>
              <InputContainer width={width}>
                <TextInput

                  ref={addressInputRef}
                  placeholder="주소를 검색해주세요"
                  placeholderTextColor={'#A3A5A8'}
                  style={{
                    width: '90%',
                    height: '100%',
                    fontFamily: 'Pretendard-Regular',
                    fontSize: 13,
                    color: '#1B1C1F',
                  }}
                  value={directRegister.address}
                  onChangeText={text => {
                    dispatch(
                      setDirectRegister({
                        ...directRegister,
                        houseName: directRegister.houseName,
                        address: text,
                        addressDetail: directRegister.addressDetail,
                      }),
                    );
                  }}
                  underlineColorAndroid={'transparent'}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    addressDetailInputRef.current.focus();
                  }}
                  onFocus={async () => {
                    {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        //  ////console.log('focus', selectedHouseType);
                        SheetManager.show('searchHouse2', {
                          payload: {
                            prevScreen: 'RegisterDirectHouse',
                            prevChat: props.route.params?.prevChat,
                            prevSheet: props.route.params?.prevSheet,
                            navigation: navigation,
                            index: props.route.params?.index,
                            selectedHouseType: selectedHouseType,
                          },
                        });
                      }
                    }
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  hitSlop={{
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20,
                  }}
                  onPress={async () => {
                    /*if (selectedHouseType === '1') {
                      SheetManager.show('mapViewList2', {
                        payload: {
                          prevScreen: 'RegisterDirectHouse',
                          prevChat: props.route.params?.prevChat,
                          prevSheet: props.route.params?.prevSheet,
                          navigation: navigation,
                        },
                      });
                    } else */
                    {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        //  ////console.log('focus', selectedHouseType);
                        SheetManager.show('searchHouse2', {
                          payload: {
                            prevScreen: 'RegisterDirectHouse',
                            prevChat: props.route.params?.prevChat,
                            prevSheet: props.route.params?.prevSheet,
                            navigation: navigation,
                            index: props.route.params?.index,
                            selectedHouseType: selectedHouseType,
                          },
                        });
                      }
                    }
                  }}>
                  <SearchIcon />
                </TouchableOpacity>
              </InputContainer>
              <InputContainer
                width={width}
                style={{
                  marginTop: 10,
                }}>
                <TextInput

                  ref={addressDetailInputRef}
                  placeholderTextColor={'#A3A5A8'}
                  placeholder="상세주소"
                  style={{
                    width: '100%',
                    height: '100%',
                    fontFamily: 'Pretendard-Regular',
                    fontSize: 13,
                    color: '#1B1C1F',
                  }}
                  value={directRegister.addressDetail}
                  onChangeText={text => {
                    dispatch(
                      setDirectRegister({
                        ...directRegister,
                        houseName: directRegister.houseName,
                        address: directRegister.address,
                        addressDetail: text,
                      }),
                    );
                  }}
                  underlineColorAndroid={'transparent'}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </InputContainer>
            </Paper>
            <InfoContentItem>
              <InfoContentLabel >입주권 여부</InfoContentLabel>

              <Switch
                width={50}
                height={28}
                value={isMoveInRight}
                circleStyle={{
                  width: 20,
                  height: 20,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                }}
                onValueChange={isSwitchOn => {
                  setIsMoveInRight(isSwitchOn);
                  // ////console.log('directRegister', directRegister);
                }}
                activeColor="#2F87FF"
                disabledColor="#E8EAED"
              />
            </InfoContentItem>
          </InputSection>
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
            <Button
              disabled={!selectedHouseType || !directRegister.address || !directRegister.addressDetail}
              active={selectedHouseType && directRegister.address && directRegister.addressDetail}
              width={width}
              onPress={registerDirectHouse}>
              <ButtonText

                disabled={!selectedHouseType || !directRegister.address || !directRegister.addressDetail}
                active={selectedHouseType && directRegister.address && directRegister.addressDetail}>
                등록하기
              </ButtonText>
            </Button>
          </DropShadow>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default RegisterDirectHouse;
