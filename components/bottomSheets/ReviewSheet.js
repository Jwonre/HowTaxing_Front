// 리뷰 작성 시트

import { useWindowDimensions, Pressable, Keyboard, ScrollView } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
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

const StarSection = styled.View`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
`;

const StarButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f9cc26;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  border-width: 1px;
  border-color: #f9cc26;
`;

const ReviewItem = styled.View`
  width: 100%;
  height: auto;
  align-items: right;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
`;  // 세미콜론 추가

const ReviewInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  verticalAlign: 'top',
}))`
  width: ${props => props.width - 80}px;  
  height: 120px;
  border-radius: 10px;
  background-color: #f5f7fa;
  padding: 15px; 
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
  align-self: center;
  text-align-vertical: top;
  overflow: hidden; 
`;


const TextLength = styled.Text`
  font-size: 9px;
  font-family: Pretendard-Bold;
  color: #717274;
  text-align: right;
  margin-right: 10px;
`;


const ReviewSheet = props => {
  const navigation = useNavigation();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [score, setScore] = useState(5);
  const [text, setText] = useState('');
  const [keyboardShow, setKeyboardShow] = useState(false);
  const currentUser = useSelector(state => state.currentUser.value);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


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

  const uploadReview = async () => {
    /*
   console.log('props?.payload?.prevSheet', props?.payload?.prevSheet);
   console.log('score', score);
   console.log('text', text);
   console.log(`${Config.APP_API_URL}review/registReview`);
   console.log('currentUser.accessToken',currentUser.accessToken);
  
   [필수] reviewType | String | 리뷰유형(COMMON:공통, BUY:취득세 계산, SELL:양도소득세 계산, CONSULT:상담)
   [필수] score | Integer | 주택명
   [선택] reviewContents | String | 상담내용(1000바이트 까지 입력 가능)
*/

    try {
      const url = `${Config.APP_API_URL}review/registReview`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`
      };
      //console.log('url', url);
      //console.log('headers', headers);
      const param = {
        reviewType: props?.payload?.prevSheet === 'AcquisitionChat' ? 'BUY' : 'SELL',
        score: score,
        reviewContents: text,
      };
      //console.log('[additionalQuestion] additionalQuestion param:', param);
      const response = await axios.post(url, param, { headers });
      //console.log('response.data', response.data);
      if (response.data.errYn == 'Y') {
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            message: response.data.errMsg ? response.data.errMsg : '리뷰를 저장하는 도중 문제가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            buttontext: '확인하기',
          },
        });
      } else {
        actionSheetRef.current?.hide();
        //  console.log('[additionalQuestion] additionalQuestion retrieved:', detaildata);
        //    console.log('[additionalQuestion] detaildata?.houseType:', detaildata?.houseType);
        //   console.log('[additionalQuestion] additionalQuestion houseInfo:', houseInfo);
      }
    } catch (error) {
      ////console.log(error ? error : 'error');
      await SheetManager.show('info', {
        payload: {
          message: '리뷰를 저장하는데\n알수없는 오류가 발생했습니다.',
          type: 'error',
          buttontext: '확인하기',
        },
      });

    }
  };


  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {
              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      closeOnTouchBackdrop={false}
      gestureEnabled={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: keyboardShow ? 500 : 470,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >
            전반적인 서비스 사용 경험에 대한{'\n'}만족도를 평점으로 남겨주세요
          </ModalTitle>
          <StarSection>
            {new Array(5).fill(0).map((_, index) => (
              <StarButton
                key={index}
                onPress={() => {
                  setScore(index + 1);
                }}
                style={{
                  backgroundColor: score >= index + 1 ? '#F9CC26' : '#fff',
                }}
              />
            ))}
          </StarSection>
          <ReviewItem>
    
              <ReviewInput
                
                multiline={true}
                width={width}
                placeholder="리뷰를 작성해주세요"
                onChangeText={(input) => {
                  let byteCount = encodeURI(input).split(/%..|./).length - 1;
                  if (byteCount <= 1000) {
                    setText(input);
                  }
                }}
                blurOnSubmit={true}
                value={text.slice(0, 1000)}
              />
              <TextLength >{encodeURI(text).split(/%..|./).length - 1}/1000</TextLength>
  
          </ReviewItem>
        </ModalInputSection>

        <ButtonSection>
          <Button
            onPress={() => {
              actionSheetRef.current?.hide();
              navigation.navigate('Home');
            }}
            style={{
              width: '49%',
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
            }}>
            <ButtonText
              style={{
                color: '#717274',
              }} >
              다음에
            </ButtonText>
          </Button>
          <DropShadow
            style={{
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              alignSelf: 'center',
              width: '49%',
            }}>
            <Button
              onPress={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {
                  uploadReview();
                  setTimeout(() => {
                    navigation.navigate('Home');
                  }, 200);
                } else {
                  actionSheetRef.current?.hide();
                }
              }}>
              <ButtonText >제출하기</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

export default ReviewSheet;
