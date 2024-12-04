import { useWindowDimensions, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useNavigation } from '@react-navigation/native';
import InfoCircleIcon from '../../assets/icons/info_circle.svg';
import { setOwnHouseList } from '../../redux/ownHouseListSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo"
import Config from 'react-native-config'

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  width: 80%;
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
  margin-top: 20px;
`;

const ModalDescription = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 26px;
  margin-top: 10px;
  text-align: center;
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
  margin-top: 10px;
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

const InfoConsultingCancel = props => {
  const { item } = props.payload;
  const navigation = useNavigation();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const ownHouseList = useSelector(state => state.ownHouseList?.value);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser.value);
  
  // ////console.log('props', props);
  
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
              errorType: response.data.type,
              message: response.data.errMsg ? response.data.errMsg : '보유주택을 삭제하는데 문제가 발생했어요.', 
              description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
              closemodal: true,
              actionSheetRef: actionSheetRef,
              buttontext: '확인하기',
            },
          });
          return;

        } else {
          //  ////console.log('deleteHouse', response);
          //  ////console.log('item?.houseId', item?.houseId);

          const filteredList = ownHouseList.filter(el => el.houseId !== item?.houseId);
          dispatch(setOwnHouseList(filteredList));

          actionSheetRef.current?.hide();
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
      closeOnTouchBackdrop={false}
      gestureEnabled={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 300,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalContentSection>
          <InfoCircleIcon
            style={{
              color: props?.payload?.type === 'info' ? '#2F87FF' : '#FF7401',
            }}
          />
          <ModalTitle >{props?.payload?.message}</ModalTitle>
        </ModalContentSection>

        <ButtonSection>
          <Button
            onPress={() => {
              // setErrorMessage(props?.payload?.description);
              ////console.log('NO');
              actionSheetRef.current?.hide();
            }}
            style={{
              width: 130,
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
              marginRight: 10,
            }}>
            <ButtonText

              style={{
                color: '#717274',
              }}>
              아니오
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
              width: 130,
            }}>
            <Button
              onPress={() => {
                // actionSheetRef.current?.hide();
                ////console.log('YES');
                deleteHouse();

              }}>
              <ButtonText >네</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default InfoConsultingCancel;
