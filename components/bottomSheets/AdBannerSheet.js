
import { useWindowDimensions, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import DropShadow from 'react-native-drop-shadow';
import { useNavigation } from '@react-navigation/native';
import { setAdBanner } from '../../redux/adBannerSlice';
import NetInfo from '@react-native-community/netinfo';

const SheetContainer = styled.View`
  background-color: #fff;
  width: 100%;
  height: 45.4%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-bottom: 35%;
`;

const ModalContentSection = styled.View`
  width: 100%;
  height: 105%;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 20px 20px 20px 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
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

const AdBannerMainImage = styled.Image.attrs(props => ({
  resizeMode: 'stretch',
}))`
  width: 100.3%;
  height: 100%;
`;



const AdBannerSheet = props => {
  const { width, height } = useWindowDimensions();
  const addBanner = useSelector(state => state.adBanner.value);
  const dispatch = useDispatch();
  const adBannerdata = props.payload?.adBannerdata ? props.payload?.adBannerdata : null;
  const navigation = useNavigation();
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  const handleNetInfoChange = (state) => {
    return new Promise((resolve, reject) => {
      if (!state.isConnected) {

        navigation.push('NetworkAlert', navigation);
        resolve(false);
      } else if (state.isConnected) {

        if (!hasNavigatedBackRef.current) {
          setHasNavigatedBack(true);
        }
        resolve(true);
      } else {
        resolve(true);
      }
    });
  };

  const handleClose = async () => {
    await AsyncStorage.setItem('lastClosed', new Date().toString());
    dispatch(setAdBanner(false));
  };

  const toggleModal = () => {
    if (addBanner) {
      dispatch(setAdBanner(false));
    } else {
      dispatch(setAdBanner(true));
    }


  };



  return (
    <Modal isVisible={addBanner} onBackdropPress={toggleModal} backdropColor="#000" // 원하는 색으로 설정
      backdropOpacity={0.4}>
      <SheetContainer style={{ borderRadius: 8 }}>
        <ModalContentSection>
          {adBannerdata.targetUrl && <TouchableOpacity style={{ width: '100%', height: '100%' }} activeOpacity={0.8}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }} onPress={async () => {
              const state = await NetInfo.fetch();
              const canProceed = await handleNetInfoChange(state);
              if (canProceed) {
                Linking.openURL(adBannerdata.targetUrl);
              }
            }
            }>
            <AdBannerMainImage source={{ uri: adBannerdata.imageUrl }} />
          </TouchableOpacity>}
          {!adBannerdata.targetUrl &&
            <AdBannerMainImage source={{ uri: adBannerdata.imageUrl }} />
          }
        </ModalContentSection>
        <ButtonSection>
          <Button
            onPress={() => {
              handleClose();
            }}
            style={{
              width: 130,
              backgroundColor: '#fff',
              borderColor: '#E8EAED',
              marginRight: 10,
            }}>
            <ButtonText style={{ color: '#717274' }}>오늘 그만 보기</ButtonText>
          </Button>
          <DropShadow style={styles.dropShadow}>
            <Button onPress={toggleModal}>
              <ButtonText>닫기</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </Modal >
  );
};

const styles = StyleSheet.create({
  dropShadow: {
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    alignSelf: 'center',
    width: 130,
  },
});


export default AdBannerSheet;
