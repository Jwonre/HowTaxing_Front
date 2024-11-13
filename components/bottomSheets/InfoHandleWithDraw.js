// 정보 또는 경고 알림창 컴포넌트

import { useWindowDimensions, Pressable, View } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionSheet, { SheetManager, useScrollHandlers } from 'react-native-actions-sheet';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import InfoCircleIcon from '../../assets/icons/info_circle.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../redux/currentUserSlice';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo"
import Config from 'react-native-config'

const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: auto;
`;

const ModalTitle = styled.Text`
  width: 100%;
  font-size: 17px;
  font-family: Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
  margin-bottom: 20px;
`;


const BoldText = styled.Text`
  font-family: Pretendard-Bold;
`;

const ModalDescription = styled.Text`
  font-size: 14px;
  font-family: Bold;
  width:100%;
  color: #1b1c1f;
  line-height: 22px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
`;

const Modaldetail = styled.Text`
  width: 100%;
  font-size: 12px;
  font-family: Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-top: 15px;
  text-align: left;
  margin-bottom: 10px;
`;

const ModalContentSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
  align-items: center; 
  justify-content: center;
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
  justify-content: center;
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

const InfoHandleWithDraw = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = props.payload?.navigation;
  const currentUser = useSelector(state => state.currentUser.value);
  const { width, height } = useWindowDimensions();
  // ////console.log('[InfoSimple] props', props);

  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

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

  const handleWithDraw = (accessToken) => {
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // 요청 바디

    axios
      .delete(`${Config.APP_API_URL}user/withdraw`, { headers: headers })
      .then(async response => {
        if (response.data.errYn === 'Y') {
          actionSheetRef.current?.hide();
          setTimeout(async() => {
            await SheetManager.show('info', {
              payload: {
                type: 'error',
                message: response.data.errMsg ? response.data.errMsg : '회원탈퇴에 문제가 발생했어요.',
                description: response.data.errMsgDtl ? response.data.errMsgDtl : null,
                buttontext: '확인하기',
              },
            });
            return;
          }, 300)
        } else {
          actionSheetRef.current?.hide();
          setTimeout(async () => {
            await SheetManager.show('info', {
              payload: {
                type: 'info',
                message: '회원탈퇴에 성공했어요.',
                buttontext: '확인하기',
              },
            });
            dispatch(setCurrentUser(null));
          }, 300)

          // 성공적인 응답 처리
          // const { id } = response.data;
          //    ////console.log("1111111", response);
        }
      })
      .catch(error => {
        actionSheetRef.current?.hide();
        // 오류 처리
        setTimeout(() => {
          SheetManager.show('info', {
            payload: {
              message: '회원탈퇴에 실패했어요.',
              description: error?.message,
              type: 'error',
              buttontext: '확인하기',
            }
          });
          return;
        }, 300)
      });
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
        height: 290,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalContentSection>
          <InfoCircleIcon
            style={{
              color: '#FF7401',
              marginBottom: 20,
            }}
          />
          <ModalTitle >
            <BoldText>회원탈퇴를 하시겠어요?</BoldText>
          </ModalTitle>
        </ModalContentSection>

        <ButtonSection>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center'
            }}
          >
            <DropShadow
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                shadowColor: 'rgba(0,0,0,0.25)',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0,
                shadowRadius: 2,
                alignSelf: 'center',
                width: 130,
                marginRight: 10,

              }}>
              <Button
                onPress={() => {
                  // ////console.log(modalList);
                  actionSheetRef.current?.hide();
                }}
                style={{ backgroundColor: '#fff', borderColor: '#E8EAED' }}>
                <ButtonText style={{ color: '#717274' }}>아니오</ButtonText>
              </Button>
            </DropShadow>
            <DropShadow
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                shadowColor: 'rgba(0,0,0,0.25)',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                alignSelf: 'center',
                width: 130,

              }}>
              <Button
                onPress={() => {
                  handleWithDraw(currentUser.accessToken);
                }}>
                <ButtonText >네</ButtonText>
              </Button>
            </DropShadow>
          </View>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default InfoHandleWithDraw;
