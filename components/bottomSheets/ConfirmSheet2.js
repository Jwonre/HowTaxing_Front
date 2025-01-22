// 양도세 정보 확인하기 시트

import { View, useWindowDimensions, Pressable } from 'react-native';
import React, { useRef } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { setChatDataList } from '../../redux/chatDataListSlice';
import { HOUSE_TYPE } from '../../constants/colors';
import numberToKorean from '../../utils/numToKorean';

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  font-size: 14px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const SubTitle = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #97989a;
  line-height: 20px;
  text-align: center;
  margin-top: 10px;
`;

const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: 14px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 5px;
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
  margin-right: 5;
  height: 20px;
  padding: 0 10px;
  border-radius: 11px;
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

const HoustInfoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100px;
  height: 32px;
  border-radius: 16px;
  background-color: #fff;
  border-width: 1px;
  border-color: #e8eaed;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const HoustInfoButtonText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
`;

const ModalButtonSection = styled.View`
  bottom: 5px;
  width: 100%;
`;

const ModalButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 48%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
`;

const ModalButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 20px;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const InfoContentSection = styled.ScrollView.attrs(props => ({
  showsVerticalScrollIndicator: false,
}))`
  width: 100%;
  height: 48%;
  background-color: #f7f8fa;
  padding: 0px 20px;
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
`;

const ConfirmSheet2 = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const houseInfo = useSelector(state => state.houseInfo.value);
  const chatDataList = useSelector(state => state.chatDataList.value);
  //console.log('[ConfirmSheet2] houseInfo', houseInfo);

  /* 
   // 양도세 계산
   const calculateTax = () => {
     const data = {
       houseId: houseInfo.houseId || '1',
       contractDate: dayjs(houseInfo.contractDate).format('YYYY-MM-DD'),
       sellDate: dayjs(houseInfo.saleDate).format('YYYY-MM-DD'),
       sellPrice: houseInfo.sellAmount || '100000000',
     };
 
     axios
       .post(`${Config.APP_API_URL}calculate/sellTax', data)
       .then(response => {
         // 성공적인 응답 처리
         const data2 = response.data.data;
 
         dispatch(setHouseInfo({ ...houseInfo, ...data2 }));
       })
       .catch(error => {
         // 오류 처리
         console.error(error);
       });
   };
 */
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
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 700,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >수집된 정보를 모두 확인해주세요.</ModalTitle>
          <SubTitle >
            누락되거나 잘못 입력된 정보가 있다면{'\n'}양도소득세가 정확하지 않게
            계산될 수 있어요.
          </SubTitle>
        </ModalInputSection>
        <DropShadow
          style={{
            width: '100%',
            shadowColor: 'rgba(0,0,0,0.25)',
            shadowOffset: {
              width: 0,
              height: 20,
            },
            shadowOpacity: 0.10,
            shadowRadius: 10,
            alignSelf: 'center',
          }}>
          <HoustInfoSection>
            <View
              style={{
                width: '60%',
              }}>
              <View style={{ width: 'auto', flexDirection: 'row' }}>
                <HoustInfoBadge
                  style={{
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === houseInfo?.houseType,
                    )?.color,
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
                  <HoustInfoBadgeText >
                    {HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)?.name}
                  </HoustInfoBadgeText>
                  {(houseInfo?.houseType !== '3' && houseInfo?.isMoveInRight) && <HoustInfoBadgeText  style={{ fontSize: 8 }}>
                    {'(입주권)'}
                  </HoustInfoBadgeText>}
                </HoustInfoBadge>
                {/*(houseInfo?.houseType !== '3' && houseInfo?.isMoveInRight) && <HoustInfoBadge
                  style={{
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === (houseInfo?.isMoveInRight ? 'isMoveInRight' : ''),
                    )?.color,
                  }}>
                  <HoustInfoBadgeText>
                    {HOUSE_TYPE.find(el => el.id === (houseInfo?.isMoveInRight ? 'isMoveInRight' : ''))?.name}
                  </HoustInfoBadgeText>
                </HoustInfoBadge>*/}
              </View>
              <HoustInfoTitle >{houseInfo?.houseName}</HoustInfoTitle>
              <HoustInfoText >{houseInfo?.detailAdr}</HoustInfoText>
            </View>
            <HoustInfoButton
              onPress={() => {
                actionSheetRef.current?.hide();
                props.payload.navigation.navigate('HouseDetail', {
                  item: houseInfo,
                  prevSheet: 'confirm2',
                  index: props.payload?.index,
                });

              }}>
              <HoustInfoButtonText >자세히 보기</HoustInfoButtonText>
            </HoustInfoButton>
          </HoustInfoSection>
        </DropShadow>
        <InfoContentSection>
          <InfoContentItem>
            <InfoContentLabel >필요경비</InfoContentLabel>
            <InfoContentText >
              {houseInfo?.necessaryExpense ? numberToKorean(Number(houseInfo?.necessaryExpense)?.toString()) + '원' : '0원'}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel >취득계약일자</InfoContentLabel>
            <InfoContentText >
              {dayjs(houseInfo?.contractDate).format('YYYY년 MM월 DD일')}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel >취득일자</InfoContentLabel>
            <InfoContentText >
              {dayjs(houseInfo?.buyDate).format('YYYY년 MM월 DD일')}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel >취득금액</InfoContentLabel>
            <InfoContentText >
              {houseInfo?.buyPrice ? numberToKorean(Number(houseInfo?.buyPrice)?.toString()) + '원' : ''}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel >양도계약일자</InfoContentLabel>
            <InfoContentText >
              {dayjs(houseInfo?.sellContractDate).format('YYYY년 MM월 DD일')}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel >양도일자</InfoContentLabel>
            <InfoContentText >
              {dayjs(houseInfo?.sellDate).format('YYYY년 MM월 DD일')}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel >양도금액</InfoContentLabel>
            <InfoContentText >
              {houseInfo?.sellAmount ? numberToKorean(Number(houseInfo?.sellAmount)?.toString()) + '원' : ''}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel >실거주기간</InfoContentLabel>
            <InfoContentText >
              {
                ((houseInfo?.livePeriodYear === undefined || houseInfo?.livePeriodYear === '0') &&
                  (houseInfo?.livePeriodMonth === undefined || houseInfo?.livePeriodMonth === '0'))
                  ? '거주기간 없음'
                  : houseInfo?.livePeriodMonth !== '0'
                    ? (houseInfo?.livePeriodYear !== '0'
                      ? houseInfo?.livePeriodYear + '년 ' + houseInfo?.livePeriodMonth + '개월'
                      : houseInfo?.livePeriodMonth + '개월')
                    : (houseInfo?.livePeriodYear !== '0'
                      ? houseInfo?.livePeriodYear + '년'
                      : '')
              }
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel  style={{ width: '90%' }}>기존 주택 보유 수(양도주택포함)</InfoContentLabel>
            <InfoContentText >{houseInfo?.ownHouseCnt ? houseInfo?.ownHouseCnt : 0}채</InfoContentText>
          </InfoContentItem>
        </InfoContentSection>
        <ModalButtonSection>
          <DropShadow
            style={{
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              alignSelf: 'center',
            }}>
            <ModalButton
              onPress={() => {
                //calculateTax();

                actionSheetRef.current?.hide();
                const chat1 = {
                  id: 'getInfoConfirmOK',
                  type: 'my',
                  message: '확인 완료',
                };

                dispatch(setChatDataList([...chatDataList, chat1]));

              }}
              style={{
                width: width - 80,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 20,
              }}>
              <ModalButtonText >확인하기</ModalButtonText>
            </ModalButton>
          </DropShadow>
        </ModalButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default React.memo(ConfirmSheet2);
