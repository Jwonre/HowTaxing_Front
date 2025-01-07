// 주택정보 상세 페이지

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  BackHandler,
} from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import getFontSize from '../../utils/getFontSize';
import NaverMapView, { Marker } from 'react-native-nmap';
import Switch from 'react-native-draggable-switch';
import { useDispatch, useSelector } from 'react-redux';
import { SheetManager } from 'react-native-actions-sheet';
import { HOUSE_TYPE } from '../../constants/colors';
import axios from 'axios';
import dayjs from 'dayjs';

import numberToKorean from '../../utils/numToKorean';

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
  margin-Bottom: 10px;
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
  padding: 0 20px;
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
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
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
  text-align: right;
`;

const HouseDetail = props => {
  const { item, prevSheet } = props.route.params;
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();

  // const [isMoveInRight, setIsMoveInRight] = useState(false);

  // ////console.log(item);
  const [location, setLocation] = useState({
    latitude: 37.5326,
    longitude: 127.024612,
  });

  useEffect(() => {
    // ////console.log('item', item);
    getAPTLocation(item?.roadAddr);
  }, []);

  const handleBackPress = () => {
    const { prevSheet, index } = props.route.params;
    navigation.goBack();
    if (prevSheet) {
      // 시트를 표시하고 기본 동작을 중단
      SheetManager.show(prevSheet, {
        payload: {
          navigation,
          index,
        },
      });
    }
    // 이전 화면으로 돌아가는 기본 동작 수행
    return true; // 기본 동작을 중단
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress])
  );



  const getAPTLocation = async address => {
    const API_KEY = 'e094e49e35c61a9da896785b6fee020a';
    const config = {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`,
      },
    }; // 헤더 설정
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
      address,
    )}`;

    await axios
      .get(url, config)
      .then(function (result) {
        setLocation({
          latitude: Number(result.data.documents[0].y),
          longitude: Number(result.data.documents[0].x),
        });
      })
      .catch(function (error) {
        ////console.log(error);
        SheetManager.show('info', {
          payload: {
            message: '주소를 찾을 수 없습니다.',
            type: 'error',
            buttontext: '확인하기',
          },
        });
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
            if (!props.route.params?.prevSheet) {
              return;
            } else {

              SheetManager.show(props.route.params?.prevSheet, {
                payload: {
                  navigation,
                  index: props.route.params?.index,
                },
              });
            }
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: (prevSheet === 'confirm2' || prevSheet === 'GainsTaxChat') ? '양도 주택 상세 정보' : '취득 주택 상세 정보',
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
  }, [props.route.params?.prevSheet]);

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
                      el => el.id === item?.houseType,
                    )?.color,
                  }}>
                  <HoustInfoBadgeText >
                    {HOUSE_TYPE.find(el => el.id === item?.houseType)?.name}
                  </HoustInfoBadgeText>
                  {(item?.houseType !== '3' && item?.isMoveInRight ) && <HoustInfoBadgeText style={{ fontSize: 8 }}>
                    {'(입주권)'}
                  </HoustInfoBadgeText>}
                </HoustInfoBadge>
                {/*(item?.houseType !== '3' && item?.isMoveInRight) && <HoustInfoBadge
                  style={{
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === (item?.isMoveInRight  ? 'isMoveInRight' : ''),
                    )?.color,
                  }}>
                  <HoustInfoBadgeText>
                    {HOUSE_TYPE.find(el => el.id === (item?.isMoveInRight  ? 'isMoveInRight' : ''))?.name}
                  </HoustInfoBadgeText>
                </HoustInfoBadge>*/}
              </View>
              <HoustInfoTitle >{item?.houseName}</HoustInfoTitle>
              <HoustInfoText ellipsizeMode='tail' numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>{item?.houseDetailName}</HoustInfoText>
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
                {item?.houseName ? item?.houseName : ''}
              </InfoContentText>
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
                {HOUSE_TYPE.find(color => color.id === item?.houseType).name}
              </InfoContentText>
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
              <InfoContentText ellipsizeMode='tail' numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>{item?.roadAddr}</InfoContentText>
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
              <InfoContentText ellipsizeMode='tail' numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>{item?.houseName}</InfoContentText>
            </InfoContentItem>

            {(prevSheet === 'confirm2' || prevSheet === 'GainsTaxChat') && <InfoContentItem>
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
              <InfoContentLabel >취득계약일자</InfoContentLabel>
              <InfoContentText style={{ flex: 1, textAlign: 'right' }}>{item?.contractDate ? dayjs(item?.contractDate).format(
                'YYYY년 MM월 DD일',
              ) : ''}</InfoContentText>
            </InfoContentItem>}
            {(prevSheet === 'confirm2' || prevSheet === 'GainsTaxChat') && <InfoContentItem>
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
              <InfoContentLabel >취득일자</InfoContentLabel>
              <InfoContentText style={{ flex: 1, textAlign: 'right' }} >
                {(item?.buyDate ? dayjs(item?.buyDate).format('YYYY년 MM월 DD일') : '')}
              </InfoContentText>
            </InfoContentItem>}
            {(prevSheet === 'confirm2' || prevSheet === 'GainsTaxChat') && <InfoContentItem>
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
              <InfoContentLabel >취득금액</InfoContentLabel>
              <InfoContentText >
                {(item?.buyPrice ? numberToKorean(Number(item?.buyPrice)?.toString()) + '원' : '')}
              </InfoContentText>
            </InfoContentItem>}

            { /*<InfoContentItem>
              <InfoContentLabel>동호수</InfoContentLabel>
              <InfoContentText>{item?.detailAdr}</InfoContentText>
            </InfoContentItem>*/}
            <InfoContentItem>
              <InfoContentLabel >공시가격</InfoContentLabel>
              <InfoContentText >
                {item?.pubLandPrice ? numberToKorean(Number(item?.pubLandPrice)?.toString()) + '원' : (item?.isPubLandPriceOver100Mil  ? '1억원 초과' : item?.isPubLandPriceOver100Mil === undefined ? '' : '1억원 이하')}
              </InfoContentText>
            </InfoContentItem>
            {(prevSheet === 'confirm' || prevSheet === 'AcquisitionChat') && <InfoContentItem>
              <InfoContentLabel >취득계약일자</InfoContentLabel>
              <InfoContentText style={{ flex: 1, textAlign: 'right' }}>{item?.contractDate ? dayjs(item?.contractDate).format(
                'YYYY년 MM월 DD일',
              ) : ''}</InfoContentText>
            </InfoContentItem>}
            <InfoContentItem>
              <InfoContentLabel >계약면적</InfoContentLabel>
              <View
                style={{
                  marginLeft: 'auto',
                }}>
                <InfoContentText >{item?.area ? item?.area + 'm²' : (item?.isAreaOver85  ? '국민평형(85m2) 초과' : item?.isAreaOver85 === undefined ? '' : '국민평형(85m2) 이하')}</InfoContentText>
                {item?.area !== 0 || undefined && <InfoContentText

                  style={{
                    fontSize: 10,
                    color: '#A3A5A8',
                  }}>
                  {item?.area + 'm²'}
                </InfoContentText>}
              </View>
            </InfoContentItem>
            {(prevSheet === 'confirm' || prevSheet === 'AcquisitionChat') && <InfoContentItem>
              <InfoContentLabel >취득일자</InfoContentLabel>
              <InfoContentText style={{ flex: 1, textAlign: 'right' }}>
                {(item?.buyDate ? dayjs(item?.buyDate).format('YYYY년 MM월 DD일') : '')}
              </InfoContentText>
            </InfoContentItem>}
            {(prevSheet === 'confirm' || prevSheet === 'AcquisitionChat') && <InfoContentItem>
              <InfoContentLabel >취득금액</InfoContentLabel>
              <InfoContentText >
                {(item?.acAmount ? numberToKorean(Number(item?.acAmount)?.toString()) + '원' : '')}
              </InfoContentText>
            </InfoContentItem>}
          </InfoContentSection>
          <InputSection>
            {/*<Paper>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <Label

                  style={{
                    marginBottom: 0,
                  }}>
                  소유자
                </Label>
              </View>

              <InfoContentItem>
                <InfoContentLabel
                  style={{
                    color: '#1B1C1F',
                    fontSize: 14,
                  }} >
                  본인
                </InfoContentLabel>
                <InfoContentText >
                  {Number(item?.ownerCnt) > 1 && (
                    <Text
                      style={{
                        color: '#B5283B',
                      }} >
                      공동명의{'  '}
                    </Text>
                  )}
                  {item?.userProportion}%
                </InfoContentText>
              </InfoContentItem>
              {Number(item?.ownerCnt) > 1 &&
                new Array(Number(item?.ownerCnt) - 1)
                  .fill(0)
                  .map((item, index) => (
                    <InfoContentItem key={index}>
                      <InfoContentLabel
                        style={{
                          color: '#1B1C1F',
                          fontSize: 14,
                        }} >
                        소유자{index + 1}
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
                  ))}
            </Paper>*/}
            <InfoContentItem>
              <InfoContentLabel >입주권 여부</InfoContentLabel>
              <InfoContentText >{item?.isMoveInRight  ? '여' : '부'}</InfoContentText>
            </InfoContentItem>
          </InputSection>
        </>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default HouseDetail;
