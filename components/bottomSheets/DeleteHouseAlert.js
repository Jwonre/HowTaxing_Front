// 보유 주택 목록에서 주택 삭제 시 뜨는 시트

import { useWindowDimensions, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
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
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 32px;
  text-align: center;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
`;

const ModalButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 48%;
  height: 50px;
  border-radius: 25px;
  background-color: #ff7401;
  align-items: center;
  justify-content: center;
  margin: 0 3px;
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

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

const DeleteHouseAlert = props => {
  const { item, navigation, prevSheet } = props.payload;
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const ownHouseList = useSelector(state => state.ownHouseList.value);
  const currentUser = useSelector(state => state.currentUser.value);
  
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

  // 주택 삭제
  const deleteHouse = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      const url = `${Config.APP_API_URL}house/delete`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.accessToken}`
      };
      const data = {
        houseId: item?.houseId === undefined ? '' : item?.houseId,
      };

      try {
        const response = await axios.delete(url, { headers: headers, data: data });
        if (response.data.errYn === 'Y') {

          SheetManager.show('info', {
            payload: {
              type: 'error',
              message: response.data.errMsg ? response.data.errMsg : '보유주택을 삭제하는데 문제가 발생했어요.', 
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              closemodal: true,
              actionSheetRef: actionSheetRef,
              buttontext: '확인하기',
            },
          });
          return;

        } else {
          const result = response.data;
          //  ////console.log('deleteHouse', response);
          //  ////console.log('item?.houseId', item?.houseId);

          const filteredList = ownHouseList.filter(el => el.houseId !== item?.houseId);
          dispatch(setOwnHouseList(filteredList));

          actionSheetRef.current?.hide();
          navigation.goBack();

          setTimeout(() => {
            SheetManager.show(prevSheet, {
              payload: {
                item: item,
                navigation: navigation,
                index: props?.payload?.index,
                data: props?.payload?.data,
                chungYackYn: props?.payload?.chungYackYn
              },
            });
          }, 300);
        }


      } catch (error) {
        SheetManager.show('info', {
          payload: {
            type: 'error',
            message: '보유주택 삭제 중 오류가 발생했습니다.',
            closemodal: true,
            actionSheetRef: actionSheetRef,
            buttontext: '확인하기',
          },
        });
        console.error(error);
      }
    } else {
      actionSheetRef.current?.hide();
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
      gestureEnabled={false}
      statusBarTranslucent
      closeOnTouchBackdrop={false}
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 250,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle >
            선택하신 주택을 주택 목록에서{'\n'}정말로 삭제하실 건가요?
          </ModalTitle>
        </ModalInputSection>
        <ButtonSection
          style={{
            justifyContent: 'center',
          }}>
          <ModalButton
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#E8EAED',
            }}
            onPress={() => {
              actionSheetRef.current?.hide();
            }}>
            <ModalButtonText
              style={{
                color: '#717274',
              }} >
              아니오
            </ModalButtonText>
          </ModalButton>
          <DropShadow
            style={{
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              alignSelf: 'center',
            }}>
            <ModalButton
              style={{
                width: (width - 80) / 2,
              }}
              onPress={() => {
                deleteHouse();
              }}>
              <ModalButtonText >네</ModalButtonText>
            </ModalButton>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default DeleteHouseAlert;
