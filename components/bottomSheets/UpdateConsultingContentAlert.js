// 보유 주택 목록에서 공시가격 수정 선택시 뜨는 팝업

import {
  View,
  useWindowDimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Keyboard,
  Animated,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SheetContainer = styled.View`
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: 100%;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalAddressInputContainer = styled.View`
  width: 100%;
  height: 120px;
  background-color: #f5f7fa;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
`;


const DetailAddressInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  verticalAlign: 'top',
}))`
  flex: 1;
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
  text-align-vertical: top;
`;


const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;


const ApartmentInfoGroup = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ApartmentInfoTitle = styled.Text`
  width: 80%;
  font-size: 16px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 30px;
  text-align: center;
`;


const SubTitle2 = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Bold;
  color: #a3a5a8;
  line-height: 20px;
  text-align: center;
  margin-top: 10px;
`;


const Tag = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 57px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  border-width: 1px;
  border-color: #CFD1D5;
  margin-top: 20px;
  margin-bottom: 20px;
  align-self: flex-start;
`;

const TagText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Bold;
  color: #CFD1D5;
  line-height: 20px;
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


const UpdateConsultingContentAlert = props => {


  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);
  const { consultingType, handleHouseChange2, consultingReservationId, navigation, prevSheet } = props.payload;
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const currentUser = useSelector(state => state.currentUser.value);
  const [selectedList, setSelectedList] = useState([]);
  const ConsultingList = ['취득세', '양도소득세', '상속세', '증여세'];

  const [text, setText] = useState(props.payload.consultingRequestContent ? props.payload.consultingRequestContent : '');
  const [taxTypeList, setTaxTypeList] = useState([]);

  useEffect(() => {
    const consultingTypeMap = {
      '01': '취득세',
      '02': '양도소득세',
      '03': '상속세',
      '04': '증여세'
    };
    const consultingTypes = consultingType?.split(',').map(type => consultingTypeMap[type]);
    if (consultingType) {
      setTaxTypeList(consultingTypes);
    } else {
      setTaxTypeList([]);
    }
  }, []);



  const reservationModify = async () => {
    const accessToken = currentUser.accessToken;
    // 요청 헤더
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    var NumTaxTypeList = taxTypeList.map(taxType => {
      switch (taxType) {
        case "취득세":
          return "01";
        case "양도소득세":
          return "02";
        case "상속세":
          return "03";
        case "증여세":
          return "04";
        default:
          return "";
      }
    });

    // 요청 바디
    const data = {
      consultingReservationId: consultingReservationId ? consultingReservationId : '',
      consultingRequestContent: text ? text : '',
      consultingType: NumTaxTypeList ? NumTaxTypeList.sort().join(",") : '',
    };
    console.log('data', data);
    console.log('headers', headers);
    try {
      const response = await axios.post(`${Config.APP_API_URL}consulting/reservationModify`, data, { headers: headers });
      console.log('response.data', response.data);
      if (response.data.errYn === 'Y') {
        await SheetManager.show('info', {
          payload: {
            type: 'error',
            errorType: response.data.type,
            message: response.data.errMsg ? response.data.errMsg : '상담 내용 변경 중 오류가 발생했어요.',
            description: response.data.errMsgDtl ? response.data.errMsgDtl : '',
            buttontext: '확인하기',
          },
        });
      } else {
        await handleHouseChange2(text, NumTaxTypeList.sort().join(","));
      }
    } catch (error) {
      SheetManager.show('info', {
        type: 'error',
        message: error?.errMsg ? error?.errMsg : '상담 내용 변경 중 오류가 발생했어요.',
        errorMessage: error?.errCode ? error?.errCode : 'error',
        buttontext: '확인하기',
      });
      console.error(error ? error : 'error');
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

  // 키보드 이벤트
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const nextHandler = async () => {
    const state = await NetInfo.fetch();
    const canProceed = await handleNetInfoChange(state);
    if (canProceed) {
      await reservationModify();
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
        width: width - 40,
        height: isKeyboardVisible ? 100 : 450,
      }}>
      <SheetContainer>
        <ModalTitle>
          상담 내용을 알려주세요.
        </ModalTitle>
        <ApartmentInfoGroup>
          <SubTitle2>정확한 상담을 위해{'\n'}사실 관계 및 문의사항을 자세하게 입력해주세요.</SubTitle2>
        </ApartmentInfoGroup>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingLeft: 20, paddingRight: 20, borderTopWidth: 1,
          borderTopColor: '#E8EAED'
        }}>
          {ConsultingList.map((item, index) => (
            <Tag
              style={{
                borderColor: taxTypeList.indexOf(item) < 0 ? '#E8EAED'
                  : item === '취득세'
                    ? '#2F87FF'
                    : item === '양도소득세'
                      ? '#2F87FF'
                      : item === '상속세'
                        ? '#2F87FF'
                        : item === '증여세'
                          ? '#2F87FF'
                          : '#E8EAED'
              }}
              //disabled={taxTypeList.indexOf(item) < 0}
              active={taxTypeList.indexOf(item) > -1}
              onPress={() => {
                if (taxTypeList.indexOf(item) > -1) {
                  setTaxTypeList(
                    taxTypeList.filter(selectedItem => selectedItem !== item),
                  );
                } else {
                  setTaxTypeList([...taxTypeList, item]);
                }
              }}
              key={index}>
              <TagText style={{
                color: taxTypeList.indexOf(item) < 0 ? '#E8EAED'
                  : item === '취득세'
                    ? '#2F87FF'
                    : item === '양도소득세'
                      ? '#2F87FF'
                      : item === '상속세'
                        ? '#2F87FF'
                        : item === '증여세'
                          ? '#2F87FF'
                          : '#E8EAED'
              }}>
                {item}
              </TagText>
            </Tag>
          ))}
        </View>
        <View style={{
          paddingLeft: 20, paddingRight: 20,
        }}>
          <ModalAddressInputContainer>
            <DetailAddressInput
              multiline={true}
              value={text}
              onChangeText={setText}
              blurOnSubmit={true}
            />
          </ModalAddressInputContainer>

        </View>
        <ButtonSection width={width}>
          <DropShadow style={styles.dropshadow}>
            <Button onPress={nextHandler}>
              <ButtonText >변경하기</ButtonText>
            </Button>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet >
  );
};

const styles = StyleSheet.create({
  dropdownStyle: {
    width: '37%',
    height: 300,
    borderRadius: 10,
    marginTop: -20,
  },
  buttonStyle: {
    width: '100%',
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EAED',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#A3A5A8',
    letterSpacing: -0.3,
    lineHeight: 16,
    marginRight: 15,
  },
  rowStyle: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0,
    borderBottomColor: '#E8EAED',
  },
  rowTextStyle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1C1F',
    letterSpacing: -0.3,
    lineHeight: 16,
  },
  dropshadow: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

});

export default UpdateConsultingContentAlert;
