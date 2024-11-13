// 가족 보유 주택 안내 페이지

import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import FamilyIcon from '../../assets/images/family_users.svg';
import DropShadow from 'react-native-drop-shadow';
import AddCircleIcon from '../../assets/icons/add_circle.svg';

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #fff;
`;

const IntroSection = styled.View`
  padding: 25px;
  height: auto;
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
  font-family: Pretendard-SemiBold;
  color: #b5283b;
  line-height: 25px;
  margin-top: 10px;
`;

const InputSection = styled.View`
  flex: 1;
  background-color: #f7f8fa;
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

const DescText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-bottom: 15px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  align-self: center;
  position: absolute;
  bottom: 50px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;
const Card = styled.View`
  width: 180px;
  height: 180px;
  border-radius: 10px;
  background-color: #fff;
  justify-content: space-between;
  margin-right: 22px;
  border: 1px solid #2f87ff;
  padding: 15px;
`;

const Tag = styled.View`
  width: 46px;
  height: 22px;
  background-color: #1fc9a8;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  padding: 0 10px;
  margin-bottom: 10px;
`;

const TagText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 20px;
`;

const CardTitle = styled.Text`
  flex: 1;
  width: 120px;
  font-size: 15px;
  color: #1b1c1f;
  font-family: Pretendard-Bold;
  line-height: 20px;
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
  width: 286px;
  height: 50px;
  border-radius: 25px;
  background-color: #f5f7fa;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8eaed;
  align-self: center;
  margin-bottom: 20px;
`;

const AddButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #717274;
  line-height: 20px;
  text-align: center;
  margin-left: 10px;
`;

const OwnedFamilyHouse = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARD_WIDTH = 180;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      title: '가족 보유 주택',
      headerTitleAlign: 'center',
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

  const dummyData = [
    {
      id: 1,
      type: '아파트',
      title: '반포래미안원베일리 아파트',
      subTitle: '118동 1403호',
    },
    {
      id: 2,
      type: '다세대',
      title: '트러스테이 빌라',
      subTitle: '105동 1701호',
    },
    {
      id: 3,
      type: '아파트',
      title: '반포래미안원베일리 아파트',
      subTitle: '118동 1403호',
    },
    {
      id: 4,
      type: '다세대',
      title: '트러스테이 빌라',
      subTitle: '105동 1701호',
    },
  ];

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 160,
        }}>
        <IntroSection>
          <IconView>
            <FamilyIcon />
          </IconView>
          <Title>
            보유하신 주택을 모두 불러왔어요.{'\n'}불러온 주택들을 가족에게
            보내주세요.
          </Title>
          <SubTitle>
            주택 양도와 매수를 동시에 거래하신다면,{'\n'}양도 예정되어 있는
            주택은 반드시 체크 해제해주세요.
          </SubTitle>
        </IntroSection>

        <InputSection>
          <ScrollView
            onScroll={e => {
              const contentOffset = e.nativeEvent.contentOffset;
              const pageNum = Math.floor((contentOffset.x / CARD_WIDTH) * 2);
              setCurrentIndex(pageNum);
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingHorizontal: 20,
              marginVertical: 20,
            }}>
            {dummyData.map((item, index) => (
              <DropShadow
                style={{
                  shadowColor: 'rgba(0,0,0,0.1)',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}>
                <Card>
                  <Tag>
                    <TagText>{item.type}</TagText>
                  </Tag>
                  <CardTitle>{item.title}</CardTitle>
                  <CardSubTitle>{item.subTitle}</CardSubTitle>
                  <CardButton>
                    <CardButtonText>자세히 보기</CardButtonText>
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
            {dummyData.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentIndex(index - 1);
                }}
                activeOpacity={0.6}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
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
          <AddButton width={width}>
            <AddCircleIcon />
            <AddButtonText>직접 등록하기</AddButtonText>
          </AddButton>

          <SubTitle
            style={{
              color: '#2F87FF',
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            이미 오피스텔을 소유하고 계실 경우, 반드시 직접 등록해주세요.{'\n'}
            불러오지 못한 주택이 있을 경우, 정확한 세금계산이 어려워요.
          </SubTitle>
        </InputSection>
      </ScrollView>

      <DropShadow
        style={{
          shadowColor: 'rgba(0,0,0,0.25)',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 1,
          shadowRadius: 4,
        }}>
        <Button
          width={width}
          onPress={() => {
            navigation.push('DoneSendFamilyHouse');
          }}>
          <ButtonText>보내기</ButtonText>
        </Button>
      </DropShadow>
    </Container>
  );
};

export default OwnedFamilyHouse;
