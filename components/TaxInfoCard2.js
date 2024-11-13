// 양도세 결과에서 설명 섹션

import { View } from 'react-native';
import React from 'react';
import styled from 'styled-components';

import * as Animatable from 'react-native-animatable';
import ChatBubbleIcon from '../assets/icons/chat_bubble.svg';

const Card = styled(Animatable.View).attrs(props => ({
  animation: 'fadeInUp',
}))`
  width: 100%;
  height: auto;
  padding: 20px 25px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
  margin-top: 10px;
`;

const CardHeader = styled.View`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 14px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-left: 10px;
`;

const InfoContainer = styled.View`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 10px;
`;

const InfoNum = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #2f87ff;
  line-height: 20px;
  margin-right: 6px;
`;

const InfoText = styled.Text`
  flex: 1;
  font-size: 12px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const Divider = styled.View`
  width: 100%;
  height: 1px;
  background-color: #e8eaed;
  margin-top: 10px;
`;

const TaxInfoCard2 = props => {
  //console.log('props', props);
  const Pdata = props?.Pdata;
  const commentaryListCnt = Pdata ? Pdata.commentaryListCnt : 0;
  return (
    <Card>
      <CardHeader>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: '#e8eaed',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ChatBubbleIcon />
        </View>
        <Title>계산된 양도소득세에 대해 설명드릴게요</Title>
      </CardHeader>
      {Array.from({ length: commentaryListCnt }).map((_, index) => (
        <React.Fragment key={index}>
          <InfoContainer>
            <InfoNum >{index + 1}.</InfoNum>
            <InfoText >
              {Pdata?.commentaryList[index]}
            </InfoText>
          </InfoContainer>
          {(index !== commentaryListCnt - 1) && <Divider />}
        </React.Fragment>
      ))}
    </Card>
  )
};
export default TaxInfoCard2;
