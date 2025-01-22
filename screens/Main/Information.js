import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useCallback, useRef, useState } from 'react';
import BackIcon from '../../assets/icons/back_button.svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components';
import InformationIcon from '../../assets/images/Information.svg';
import getFontSize from '../../utils/getFontSize';
import { SheetManager } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../redux/currentUserSlice';
import { setAdBanner } from '../../redux/adBannerSlice';
import VersionCheck from 'react-native-version-check';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Config from 'react-native-config'
const Container = styled.View`
  flex: 1;
  background-color: #FFF;
`;

const IconView = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 25px;
  border: 1px solid #e8eaed;
  margin-top: 0px;
`;
const ListItem = styled.View`
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  padding: 0 25px;
  margin-top: 40px;
`;



const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;



const Option = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`

    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const OptionText = styled.Text`
    font-size: 17px;
    font-family: Pretendard-Bold;
    color: #A3A5A8;
    line-height: 20px;
`;

const OptionDetailText = styled.Text`
    font-size: 17px;
    font-family: Pretendard-Regular;
    color: #A3A5A8;
    line-height: 20px;
`;

const Divider = styled.View`
  width: 100%;
  height: 1px;
  background-color: #e8eaed;
  margin-top: 12px;
  margin-bottom:12px;
`;

const BottomSection = styled.View` 
  bottom: 0px;
  position: absolute;
  width: 100%; 
  height: 98px; 
  background-color: #D9D9D9; 

`;

const Bottom = styled.View` 
  padding: 15px 20px 15px 20px;
`;

const BottomIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 67px;
  height: 15px;
`;

const BottomText = styled.Text`
  font-size: 10.5px;
  font-family: Pretendard-Regular;
  color: #fff;
  line-height: 12px;
  margin-top: 7px;
`;


const Information = props => {
  const navigation = useNavigation()
  const currentUser = useSelector(state => state.currentUser.value);
  const dispatch = useDispatch();
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const [isConnected, setIsConnected] = useState(true);
  const currentVersion = VersionCheck.getCurrentVersion();

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  }
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [handleBackPress])
  );


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '앱 정보',
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
  }, []);


  const handleWithLogout = async (accessToken) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    try {
      const response = await axios.get(`${Config.APP_API_URL}user/logout`, { headers });
      console.log('accessToken', accessToken);
      console.log('response.data', response.data);

      if (response.data.errYn === 'Y') {
        console.log('response.data.errMsgDtl', response.data.errMsgDtl);
        SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '로그아웃에 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
            buttontext: '확인하기',
          },
        });
        return false;
      } else {
        return true;
      }
    } catch (error) {
      SheetManager.show('info', {
        payload: {
          message: '로그아웃에 실패했어요.',
          description: error?.message,
          type: 'error',
          buttontext: '확인하기',
        },
      });
      console.error(error);
      return false;
    }
  };


  const goLogout = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      SheetManager.show('logout', {
        payload: {
          type: 'error',
          message: '로그아웃을 하시겠어요?',
          onPress: { handlePress },
        },
      });
      return;
    }
    ``
  };

  const handlePress = async buttonIndex => {
    if (buttonIndex === 'YES') {
      const logout = await handleWithLogout(currentUser.accessToken);
      if (logout) {
        dispatch(setCurrentUser(null));
      }
    }
  };

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
    dispatch(setAdBanner(false));
  }, []);

  return (
    <Container>
      <ProgressSection>
      </ProgressSection>
      <ListItem>
        <Option>
          <OptionText>공지사항</OptionText>
        </Option>
        <Divider />
        <Option>
          <OptionText onPress={async () => {
            const state = await NetInfo.fetch();
            const canProceed = await handleNetInfoChange(state);
            if (canProceed) { 
              navigation.navigate('ReservationList') 
            }
          }}>마이페이지</OptionText>
        </Option>
        <Divider />
        <Option style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <OptionText >버전정보</OptionText>
          <OptionDetailText >v1.0.{Number(currentVersion)}</OptionDetailText>
        </Option>
        <Divider />
        {/*<Option style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <OptionText >법인명(단체명)</OptionText>
          <OptionText >JS 세무회계</OptionText>
        </Option>
        <Divider />*/}
        <Option style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <OptionText >사업자등록번호</OptionText>
          <OptionDetailText >416-18-30801</OptionDetailText>
        </Option>
        <Divider />
        <Option onPress={async () => {
          const state = await NetInfo.fetch();
          const canProceed = await handleNetInfoChange(state);
          if (canProceed) { navigation.navigate('InfoCert') }
        }}>
          <OptionText >서비스 이용약관</OptionText>
        </Option>
        <Divider />
        <Option onPress={async () => {
          const state = await NetInfo.fetch();
          const canProceed = await handleNetInfoChange(state);
          if (canProceed) { navigation.navigate('InfoPrivacy') }
        }}>
          <OptionText >개인정보처리방침</OptionText>
        </Option>
        <Divider />
        {/*<Option onPress={async () => {
          const state = await NetInfo.fetch();
          const canProceed = await handleNetInfoChange(state);
          if (canProceed) { navigation.navigate('InfoLocation') }
        }}>
          <OptionText >마케팅정보 이용약관</OptionText>
        </Option>
        <Divider />*/}
        <Option onPress={async () => {
          const state = await NetInfo.fetch();
          const canProceed = await handleNetInfoChange(state);
          if (canProceed) { }
        }}>
          <OptionText >비밀번호 변경</OptionText>
        </Option>
        <Divider />
        <Option onPress={goLogout}>
          <OptionText >로그아웃</OptionText>
        </Option>
        <Divider />
        <Option onPress={async () => {
          const state = await NetInfo.fetch();
          const canProceed = await handleNetInfoChange(state);
          if (canProceed) {
            SheetManager.show('InfoHandleWithDraw', {
              payload: {
                navigation: navigation,
              },
            });
          }
        }
        }>
          <OptionText >회원 탈퇴</OptionText>
        </Option>
      </ListItem>
      <BottomSection>
        <Bottom>
          <BottomIcon
            source={require('../../assets/images/informationlogo.png')}
          />
          <BottomText>JS세무회계 | 서울특별시 송파구 올림픽로35길 112, 2동 2층 249호</BottomText>
          <BottomText>사업자등록번호 : 416-18-30801 | 통신판매신고번호 : 2025-서울송파-0161</BottomText>
          <BottomText>대표자명 : 윤준수 | 대표번호 : 010-8478-1689</BottomText>
        </Bottom>
      </BottomSection>
    </Container>
  );
};

export default Information;