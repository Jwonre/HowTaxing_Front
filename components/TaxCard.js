// 취득세 결과에서 세금섹션

import React, { useState, useEffect } from 'react';
import {
  View
} from 'react-native';
import styled from 'styled-components';

import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import axios from 'axios';
import { setHouseInfo } from '../redux/houseInfoSlice';
import { HOUSE_TYPE } from '../constants/colors';
import { SheetManager } from 'react-native-actions-sheet';

const Card = styled(Animatable.View).attrs(props => ({
  animation: 'fadeInUp',
}))`
  width: 100%;
  height: auto;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
  margin-top: 10px;
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
  color: #1b1c1f;
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

const SubContainer = styled.View`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  margin-bottom: 10px;
`;

const Divider = styled.View`
  width: 100%;
  height: 1px;
  background-color: #e8eaed;
  margin-bottom: 10px;
`;

const Tag = styled.View`
  flex-direction: row;
  margin-right: auto;
  width: 71px;
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

const TagText2 = styled.Text`
  font-size: 12.5px;
  font-family: Pretendard-Medium;
  color: #2F87FF;
  line-height: 28px;
  font-weight: bold;
`;




const TaxCard = props => {
  //console.log('props TaxCard', props);
  const Pdata = props?.Pdata ? props?.Pdata : null;
  const listCnt = Pdata ? Pdata.listCnt : 0;




  return (
    Array.from({ length: listCnt }).map((_, index) => (

      <Card key={index}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Tag
            style={{
              backgroundColor: HOUSE_TYPE.find(
                color => color.id === '7',
              ).color,
            }}>
            <TagText >
              {
                HOUSE_TYPE.find(color => color.id === '7')
                  .name + (index + 1)
              }
            </TagText>
          </Tag>
          <TagText2 >
            지분율 : {Number(listCnt === 1 ? 100 : 50)}%
          </TagText2>
        </View>
        <InfoContentItem>
          <InfoContentLabel >취득세 합계</InfoContentLabel>
          <InfoContentText
            
            style={{
              color: '#2F87FF',
              fontFamily: 'Pretendard-Medium',
            }}>
            {Number(Pdata?.list[index]?.totalTaxPrice)?.toLocaleString()} 원
          </InfoContentText>
        </InfoContentItem>
        <InfoContentItem>
          <InfoContentLabel >취득세</InfoContentLabel>
          <InfoContentText
            
            style={{
              fontFamily: 'Pretendard-Medium',
            }}>
            {Number(Pdata?.list[index]?.buyTaxPrice)?.toLocaleString()} 원
          </InfoContentText>
        </InfoContentItem>
        <SubContainer>
          <InfoContentLabel >{listCnt === 1 ? '취득금액' : '취득금액(지분비율 50%)'}</InfoContentLabel>
          <InfoContentText
            style={{
              color: '#A3A5A8',
            }}>
            {Number(Pdata?.list[index]?.buyPrice)?.toLocaleString()} 원
          </InfoContentText>
        </SubContainer>
        <SubContainer>
          <InfoContentLabel >취득세율</InfoContentLabel>
          <InfoContentText
            
            style={{
              color: '#A3A5A8',
            }}>
            {Pdata?.list[index]?.buyTaxRate}%
          </InfoContentText>
        </SubContainer>
        <Divider />

        <InfoContentItem>
          <InfoContentLabel >지방교육세</InfoContentLabel>
          <InfoContentText >
            {Number(Pdata?.list[index]?.eduTaxPrice)?.toLocaleString()} 원
          </InfoContentText>
        </InfoContentItem>
        <SubContainer>
          <InfoContentLabel >지방교육세율</InfoContentLabel>
          <InfoContentText
            
            style={{
              color: '#A3A5A8',
            }}>
            {Pdata?.list[index]?.eduTaxRate}%
          </InfoContentText>
        </SubContainer>
        <Divider />
        <InfoContentItem>
          <InfoContentLabel >농어촌특별세</InfoContentLabel>
          <InfoContentText >
            {Number(Pdata?.list[index]?.agrTaxPrice)?.toLocaleString()} 원
          </InfoContentText>
        </InfoContentItem>
        <SubContainer>
          <InfoContentLabel >농어촌특별세율</InfoContentLabel>
          <InfoContentText
            
            style={{
              color: '#A3A5A8',
            }}>
            {Pdata?.list[index]?.agrTaxRate} %
          </InfoContentText>
        </SubContainer>
        <Divider />
      </Card>
    )));
};

export default TaxCard;
