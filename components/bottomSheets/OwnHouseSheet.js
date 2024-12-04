// 취득세 보유 주택 목록 시트

import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import AddCircleIcon from '../../assets/icons/add_circle.svg';
import AddHouseCircleIcon from '../../assets/icons/add_house_circle.svg';
import DeleteIcon from '../../assets/icons/deleteBox.svg';
import { useDispatch, useSelector } from 'react-redux';
import { HOUSE_TYPE } from '../../constants/colors';
import { setChatDataList } from '../../redux/chatDataListSlice';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import { setHouseInfo } from '../../redux/houseInfoSlice';
import { setCert } from '../../redux/certSlice';
import NetInfo from "@react-native-community/netinfo";
import { acquisitionTax } from '../../data/chatData';
import axios from 'axios';
import dayjs from 'dayjs';
import Config from 'react-native-config'
dayjs.locale('ko');

const SheetContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})`
  background-color: #fff;
  width: ${props => props.width}px;
  height: 100%;
`;

const TitleSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 5px 10px 10px 20px;
`;

const SubTitle = styled.Text`
  font-size: 11px;
  font-family: Pretendard-Medium;
  color: #97989a;
  line-height: 20px;
  margin-top: 10px;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: ${props => props.width - 40}px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => (props.active ? '#2F87FF' : '#E8EAED')};
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${props => (props.active ? '#2F87FF' : '#E8EAED')};
  align-self: center;
  margin-top: 15px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#717274')};
  line-height: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 32px;
  margin-bottom: 7px;
  margin-top: 4px;
`;

const InfoMessage = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #ff7401;
  line-height: 20px;
  margin-top: 10px;
`;

const HouseSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #f7f8fa;
`;

const Card = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 180px;
  height: 180px;
  border-radius: 10px;
  background-color: #fff;
  justify-content: space-between;
  margin-right: 22px;
  border-width: 1px;
  border-color: ${props => (props.active ? '#2F87FF' : '#fff')};
  padding: 15px;
`;

const Tag = styled.View`
  flex-direction: row;
  margin-right: auto;
  width: auto;
  height: 22px;
  background-color: #1fc9a8;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  padding: 0 10px;
  margin-bottom: 10px;
  align-self: flex-start;
`;

const TagText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 20px;
`;

const CardTitle = styled.Text.attrs({
  numberOfLines: 2,
})`
  width: 100%;
  font-size: 15px;
  color: #1b1c1f;
  font-family: Pretendard-Bold;
  line-height: 20px;
  flex: 1;
`;

const CardSubTitle = styled.Text`
  font-size: 13px;
  color: #717274;
  font-family: Pretendard-Regular;
  line-height: 20px;
`;

const CardButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 35px;
  border-radius: 17.5px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8eaed;
  margin-top: 10px;
`;

const CardButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #717274;
  line-height: 20px;
  text-align: center;
`;

const AddButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 285px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8eaed;
  align-self: center;
  margin: 0 5px 20px 5px;
`;

const AddButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #717274;
  line-height: 20px;
  text-align: center;
  margin-left: 4px;
`;

const DeleteCircleButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))`
  width: 22px;
  height: 22px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const EmptyCard = styled.View`
  width: 335px;
  height: 180px;
  border-radius: 10px;
  background-color: #fff;
  border-color: #fff;
  padding: 15px;
  margin: 40px 20px;
  align-items: center;
  justify-content: center;
`;

const EmptyTitle = styled.Text`
  font-size: 13px;
  color: #717274;
  font-family: Pretendard-SemiBold;
  line-height: 20px;
  margin: 3px;
`;

const ListItem = styled.View`
  flex-direction: row; 
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const ListItemTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 18px;
`;


const CheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
    width: 20px;
    height: 20px;
    border-radius: 5px;  
    background-color: #fff;
    border: 2px solid #BAC7D5;  
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;



const OwnHouseSheet = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const houseInfo = useSelector(state => state.houseInfo.value);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedList, setSelectedList] = useState(props.payload?.selectedList ? props.payload?.selectedList : []);
  const ownHouseList = useSelector(state => state.ownHouseList?.value);
  const chatDataList = useSelector(state => state.chatDataList?.value);
  const navigation = props.payload?.navigation;
  const currentUser = useSelector(state => state.currentUser.value);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const CARD_WIDTH = 180 + 22;
  const { agreePrivacy } = useSelector(
    state => state.cert.value,
  );
  console.log('ownHouseList.length', ownHouseList.length);
  useEffect(() => {
    if (ownHouseList.length > 0 && props.payload.isGainsTax === false) {
      SheetManager.show('InfoOwnHouse', {
        payload: {
          message: '주택을 불러오기 전 유의사항이 있어요.',
          description: '부동산 계약 시 거래 신고된  데이터 기준으로 하기 때문에, 계약내용 변경 등의 사유로 정확하지 않을 수 있으니 \'자세히보기\'를 통해 확인 및 수정해주세요.',
          buttontext: '확인하기',
          height: 370,
          isGainsTax: false,
        },
      })
    }
  }, [])



  const getadditionalQuestion = async (questionId, answerValue, houseId, buyDate, buyPrice) => {
    /*
    [필수] calcType | String | 계산유형(01:취득세, 02:양도소득세)
    [선택] questionId | String | 질의ID
    [선택] answerValue | String | 응답값
    [선택] sellHouseId | Long | 양도주택ID (  양도소득세 계산 시 세팅)
    [선택] sellDate | LocalDate | 양도일자 (양도소득세 계산 시 세팅)
    [선택] sellPrice | Long | 양도가액 (양도소득세 계산 시 세팅)
    [선택] ownHouseCnt | Long | 보유주택수 (취득세 계산 시 세팅)
    [선택] buyDate | LocalDate | 취득일자 (취득세 계산 시 세팅)
    [선택] jibunAddr | String | 지번주소 (취득세 계산 시 세팅)
*/

    try {
      const url = `${Config.APP_API_URL}question/additionalQuestion`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`
      };

      const param = {
        calcType: '01',
        questionId: questionId,
        answerValue: answerValue ? answerValue : '',
        sellHouseId: houseId ? houseId : '',
        buyDate: buyDate ? dayjs(buyDate).format('YYYY-MM-DD') : null,
        buyPrice: buyPrice ? buyPrice : 0,
        ownHouseCnt: selectedList?.length ? selectedList?.length : 0,
        buyDate: houseInfo?.buyDate ? dayjs(houseInfo?.buyDate).format('YYYY-MM-DD') : null,
        jibunAddr: houseInfo?.jibunAddr ? houseInfo?.jibunAddr : '',
      };
      //console.log('[additionalQuestion] additionalQuestion param:', param);
      const response = await axios.post(url, param, { headers });
      const detaildata = response.data.data;
      //console.log('response.data', response.data);
      if (response.data.errYn == 'Y') {
        setTimeout(() => {

          
          SheetManager.show('info', {
            payload: {
              type: 'error',
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '추가질의를 가져오지 못했어요.',
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              buttontext: '확인하기',
            },
          });
        }, 500)
        return {
          returndata: false
        };
      } else {
        //('[additionalQuestion] additionalQuestion retrieved:', detaildata);
        // console.log('[additionalQuestion] detaildata?.houseType:', detaildata?.houseType);
        //console.log('[additionalQuestion] additionalQuestion houseInfo:', houseInfo);
        return {
          detaildata: detaildata,
          returndata: true
        }
      }
    } catch (error) {
      setTimeout(() => {
        ////console.log(error ? error : 'error');
        SheetManager.show('info', {
          payload: {
            message: '추가질의를 가져오는데\n알수없는 오류가 발생했습니다.',
            type: 'error',
            buttontext: '확인하기',
          },
        });
      }, 500)
      return {
        returndata: false
      };
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


  useEffect(() => {
    if (ownHouseList?.length > 0) {
      setSelectedList(ownHouseList);
    }

  }, []);

  useEffect(() => {
    dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: [] }));
  }, []);

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
              dispatch(
                setCert({
                  agreePrivacy: false,
                }),
              );
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
      closeOnPressBack={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: ownHouseList.length === 0 && ((props.payload?.data === 'ok' && !props.payload?.chungYackYn) || (props.payload?.data === undefined)) ? 720 : 700,
        width: width,
      }}>
      <SheetContainer width={width}>
        <TitleSection>
          {ownHouseList.length !== 0 && (<Title >
            보유하신 주택을 모두 불러왔어요.
          </Title>)}
          {ownHouseList.length === 0 && props.payload?.data === 'ok' && props.payload?.chungYackYn && (<Title >
            청약통장을 가지고 있지 않다면{'\n'}보유주택을 직접 등록해주세요.
          </Title>)}
          {ownHouseList.length === 0 && ((props.payload?.data === 'ok' && !props.payload?.chungYackYn) || (props.payload?.data === undefined)) && (<Title >
            주택을 불러오지 못했어요.{'\n'}보유주택이 있다면 직접 등록해주세요.
          </Title>)}

          <InfoMessage >
            주택을 취득하기 이전에 기존 보유 주택의 매도 계획이 있다면,{'\n'}매도할 주택은
            반드시 삭제해주세요.
          </InfoMessage>
        </TitleSection>

        {ownHouseList?.length > 0 ?
          <HouseSection>
            <ScrollView
              onScroll={e => {
                const contentOffset = e.nativeEvent.contentOffset;
                const pageNum = Math.floor((contentOffset.x / CARD_WIDTH) * 2);
                setCurrentIndex(pageNum);
              }}
              horizontal
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 30,
                paddingHorizontal: 20,
                marginTop: 20,
              }}>
              {ownHouseList?.map((item, index) => (
                <DropShadow
                  key={'own' + index}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                  }}>
                  <Card
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
                  >
                    <DeleteCircleButton
                      onPress={() => {
                        SheetManager.show('InfoDeleteHouse', {
                          payload: {
                            type: 'info',
                            message: '정말로 선택하신 주택을 삭제하시겠어요?',
                            item: item,
                          },
                        });
                      }}>
                      <DeleteIcon />
                    </DeleteCircleButton>
                    <Tag
                      style={{
                        backgroundColor: HOUSE_TYPE.find(
                          color => color.id === item.houseType,
                        ).color,
                        flexDirection: 'row',
                        alignContent: 'center',
                      }}>
                      <TagText >
                        {HOUSE_TYPE.find(color => color.id === item.houseType).name}
                      </TagText>
                      {(item?.houseType !== '3' && item?.isMoveInRight) && <TagText style={{ fontSize: 8 }}>
                        {'(입주권)'}
                      </TagText>}
                    </Tag>
                    {/*(item.houseType !== '3' && item?.isMoveInRight) && <Tag
                      style={{
                        backgroundColor: HOUSE_TYPE.find(
                          el => el.id === item.isMoveInRight ? 'isMoveInRight' : '',
                        ).color,
                      }}>
                      <TagText>
                        {HOUSE_TYPE.find(color => color.id === item.isMoveInRight ? 'isMoveInRight' : '').name}
                      </TagText>
                    </Tag>*/}
                    <CardTitle >{item.houseName}</CardTitle>
                    <CardSubTitle >{item.detailAdr}</CardSubTitle>
                    <CardButton
                      onPress={async () => {
                        const state = await NetInfo.fetch();
                        const canProceed = await handleNetInfoChange(state);
                        if (canProceed) {
                          actionSheetRef.current?.hide();

                          props.payload.navigation.push(
                            'OwnedHouseDetail',
                            {
                              item: item, prevSheet: 'own',
                              index: props.payload.index,
                              data: props?.payload?.data,
                              chungYackYn: props?.payload?.chungYackYn
                            },
                          );
                          //////console.log('detail item', item);
                        } else {
                          const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                          dispatch(setChatDataList(newChatDataList));
                          actionSheetRef.current?.hide();
                        }
                      }}>
                      <CardButtonText >자세히 보기</CardButtonText>
                    </CardButton>
                  </Card>
                </DropShadow>
              ))}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: 20,
                zIndex: 2,
              }}>
              {ownHouseList?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCurrentIndex(index - 1);
                  }}
                  activeOpacity={0.6}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      currentIndex === index ? '#E8EAED' : 'transparent',
                    borderWidth: 1,
                    borderColor: '#E8EAED',
                    marginRight: 10,
                  }}
                />
              ))}
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <AddButton
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    actionSheetRef.current?.hide();

                    props.payload.navigation.push('DirectRegister', {
                      prevChat: 'AcquisitionChat',
                      prevSheet: 'own',
                      index: props.payload?.index,
                      //  chatDataList: chatDataList,
                      //    actionSheetRef: actionSheetRef,
                      data: props?.payload?.data,
                      chungYackYn: props?.payload?.chungYackYn,
                      certError: false,
                    });
                  } else {
                    const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                    dispatch(setChatDataList(newChatDataList));
                    actionSheetRef.current?.hide();
                  }
                }}>
                <AddCircleIcon />
                <AddButtonText >직접 등록하기</AddButtonText>
              </AddButton>

            </View>
            <SubTitle
              style={{
                color: '#2F87FF',
                paddingHorizontal: 20,
                paddingBottom: 20,
              }} >
              보유 중인 추가 주택이 있으신 경우, 직접 등록해주세요.{'\n'}
              보유하지 않은 주택이 있으신 경우, 삭제해주세요.{'\n'}
              기준시가 1억원 이하 주택은 체크 해제 해 주세요.
            </SubTitle>
          </HouseSection>
          :
          <HouseSection>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <DropShadow
                key={'emptyOwnHouse'}
                style={{
                  shadowColor: 'rgba(0,0,0,0.1)',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                }}>
                <EmptyCard>
                  <AddHouseCircleIcon
                    onPress={async () => {
                      const state = await NetInfo.fetch();
                      const canProceed = await handleNetInfoChange(state);
                      if (canProceed) {
                        actionSheetRef.current?.hide();

                        props.payload.navigation.push('DirectRegister', {
                          prevChat: 'AcquisitionChat',
                          prevSheet: 'own',
                          index: props.payload?.index,
                          data: props?.payload?.data,
                          chungYackYn: props?.payload?.chungYackYn,
                          certError: false,
                        });
                      } else {
                        const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                        dispatch(setChatDataList(newChatDataList));
                        actionSheetRef.current?.hide();
                      }
                    }} style={{ margin: 20 }}></AddHouseCircleIcon>
                  <EmptyTitle >
                    {'보유하신 주택이 없으시거나 불러오지 못했어요.'}
                  </EmptyTitle>
                  <EmptyTitle >
                    {'보유하신 주택이 있으시다면, 직접 등록해주세요.'}
                  </EmptyTitle>
                </EmptyCard>
              </DropShadow>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <AddButton
                width={width}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const canProceed = await handleNetInfoChange(state);
                  if (canProceed) {
                    actionSheetRef.current?.hide();

                    props.payload.navigation.push('DirectRegister', {
                      prevChat: 'AcquisitionChat',
                      prevSheet: 'own',
                      index: props.payload?.index,
                      data: props?.payload?.data,
                      chungYackYn: props?.payload?.chungYackYn,
                      certError: false,
                    });
                  } else {
                    const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                    dispatch(setChatDataList(newChatDataList));
                    actionSheetRef.current?.hide();
                  }
                }}>
                <AddCircleIcon />
                <AddButtonText >직접 등록하기</AddButtonText>
              </AddButton>

            </View>
            <SubTitle
              style={{
                color: '#2F87FF',
                paddingHorizontal: 20,
                paddingBottom: 20,
              }} >
              주거용 오피스텔을 소유하고 계실 경우, 반드시 직접 등록해주세요.{'\n'}
              불러오지 못한 주택이 있을 경우, 정확한 세금계산이 어려워요.
            </SubTitle>
          </HouseSection>
        }

        <ListItem style={{ marginTop: 10, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={async () => {
                await actionSheetRef.current?.hide();
                navigation.navigate('OwnHousePrivacy', {
                  navigation: navigation,
                  prevChat: 'AcquisitionChat',
                  prevSheet: 'own',
                  index: props.payload?.index,
                  data: props.payload?.data,
                  chungYackYn: props.payload?.chungYackYn,
                  selectedList: selectedList,
                });
              }}>
              <ListItemTitle style={{ color: '#2F87FF', textDecorationLine: 'underline' }}>개인정보 수집 및 이용</ListItemTitle>
            </TouchableOpacity>
            <ListItemTitle>에 대하여 동의하시나요?</ListItemTitle>
          </View>
          <CheckCircle
            onPress={() => {
              dispatch(
                setCert({
                  agreePrivacy: !agreePrivacy,
                }),
              );
            }}>
            {agreePrivacy && <CheckOnIcon />}
          </CheckCircle>
        </ListItem>



        <DropShadow
          style={{
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          }}>
          <Button
            disabled={selectedList.length === 0 || !agreePrivacy}
            width={width}
            active={selectedList.length > 0 && agreePrivacy}
            onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                actionSheetRef.current?.hide();

                const chatItem = {
                  id: 'ownConfirmOK',
                  type: 'my',
                  message: '확인 완료',
                };

                /*   const chat2 = {
                     id: 'palnSale',
                     type: 'system',
                     progress: 6,
                     questionId: 'Q_0007',
                     message:
                       '종전주택 양도 계획에 따라취득세가 다르게 산출될 수 있어요.\n종전주택 양도 계획이 있나요?',
                     select: [
                       {
                         id: 'planSaleYes',
                         name: '3년 이내 양도 계획',
                         select: ['getInfoDone', 'getInfoConfirm'],
                         answer: '01'
                       },
                       {
                         id: 'planSaleNo',
                         name: '양도 계획 없음',
                         select: ['getInfoDone', 'getInfoConfirm'],
                         answer: '02'
                       },
                     ],
                   };
   */



                const chat4 = acquisitionTax.find(el => el.id === 'getInfoDone');
                const chat5 = acquisitionTax.find(el => el.id === 'getInfoConfirm');
                const additionalQuestion = await getadditionalQuestion('', '', houseInfo?.houseId, houseInfo?.buyDate, houseInfo?.acAmount);
                let tempadditionalAnswerList = houseInfo?.additionalAnswerList;
                //console.log('additionalQuestion', additionalQuestion);
                let chat3;
                if (additionalQuestion.returndata) {
                  if (additionalQuestion.detaildata?.hasNextQuestion) {
                    if (additionalQuestion.detaildata?.nextQuestionId === 'Q_0007') {
                      let chatIndex = acquisitionTax.findIndex(el => el.id === 'additionalQuestion');
                      if (chatIndex !== -1) {
                        chat3 = {
                          ...acquisitionTax[chatIndex],
                          message: additionalQuestion.detaildata?.nextQuestionContent,
                          questionId: additionalQuestion.detaildata?.nextQuestionId,
                          select: acquisitionTax[chatIndex].select.map(item => ({
                            ...item,
                            name: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0].answerContent : additionalQuestion?.detaildata?.answerSelectList[1].answerContent,
                            answer: item.id === 'additionalQuestionY' ? additionalQuestion?.detaildata?.answerSelectList[0].answerValue : additionalQuestion?.detaildata?.answerSelectList[1].answerValue,
                            //    select: ['getInfoDone', 'getInfoConfirm'],
                          }))
                        };
                        setTimeout(() => {
                          dispatch(
                            setHouseInfo({ ...houseInfo, ownHouseCnt: selectedList?.length, isOwnHouseCntRegist: true })
                          );
                        }, 300)
                      }
                      dispatch(
                        setChatDataList([
                          ...chatDataList,
                          chatItem,
                          chat3
                        ])
                      );
                    }

                  } else {
                    if (additionalQuestion.detaildata?.answerSelectList === null && additionalQuestion.detaildata?.nextQuestionContent === null) {

                      //console.log('additionalQuestion.detaildata?.answerSelectList' , additionalQuestion.detaildata?.answerSelectList, 'tempadditionalAnswerList', tempadditionalAnswerList);
                      //console.log('additionalQuestion.detaildata?.nextQuestionContent' , additionalQuestion.detaildata?.nextQuestionContent, 'tempadditionalAnswerList', tempadditionalAnswerList);
                      setTimeout(() => {
                        dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: [], ownHouseCnt: selectedList?.length, isOwnHouseCntRegist: true }));
                      }, 300);
                    }
                    dispatch(
                      setChatDataList([
                        ...chatDataList,
                        chatItem,
                        chat4,
                        chat5
                      ])
                    );

                  }

                } else {
                  setTimeout(() => {
                    dispatch(setHouseInfo({ ...houseInfo, additionalAnswerList: [], ownHouseCnt: selectedList?.length, isOwnHouseCntRegist: true }));
                  }, 300);
                }




                // dispatch(setChatDataList([...chatDataList, chatItem, chat2]));


              } else {
                const newChatDataList = chatDataList.slice(0, props.payload?.index + 1);
                dispatch(setChatDataList(newChatDataList));
                dispatch(
                  setCert({
                    agreePrivacy: false,
                  }),
                );
                actionSheetRef.current?.hide();
              }
              //console.log('houseInfo', houseInfo);
            }}>
            <ButtonText active={selectedList.length > 0 && agreePrivacy}>확인하기</ButtonText>
          </Button>
        </DropShadow>
      </SheetContainer>
    </ActionSheet>
  );
};

export default OwnHouseSheet;
