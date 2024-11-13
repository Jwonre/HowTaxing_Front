// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import getFontSize from '../../utils/getFontSize';
import DropShadow from 'react-native-drop-shadow';
import { SheetManager } from 'react-native-actions-sheet';
import DeleteIcon from '../../assets/icons/delete_circle.svg';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import { useDispatch, useSelector } from 'react-redux';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #2f87ff;
`;

const IntroSection = styled.View`

  padding: 20px;
  margin-top: 20px;
`;

const ModalText = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #000;
  line-height: 20px;
  letter-spacing: -0.3px;
  margin-bottom: 5px;
`;

const MembershipText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-regular;
  text-align: center;
  color: #2F87FF;
  line-height: 20px;
  letter-spacing: -0.3px;
  text-decoration: underline;
`;



const ModalInputContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
  autoCapitalize: 'none',
  autoCorrect: false,
}))`
  width: 100%;
  height: 56px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 40px 0 15px; 
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;

const ButtonSection = styled.View`
  width: 100%;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => (props.active ? '#2F87FF' : '#e5e5e5')};
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: #2F87FF;
`;

const ButtonText = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#a3a5a8')};
  line-height: 20px;
  color: #fff;
`;

const DeleteCircleButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
}))`
  width: 13px;
  height: 13px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
  align-items: center;
  justify-content: center;
  right: 10%;

`;

const Login_ID = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const webviewRef = useRef(null);
  const { width } = useWindowDimensions();
  const [activeButton, setActiveButton] = useState(true);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);


  console.log('props:', props); 
  console.log('width:', width); 
  console.log('activeButton:', activeButton); 
  console.log('id:', id); 
  console.log('password:', password);


  /**
   * This function is a callback function for NetInfo's
   * event listener. It returns a promise that resolves
   * to true if the internet is connected and false if
   * it is not. It also navigates to the NetworkAlert
   * screen if the internet is not connected.
   *
   * @param {Object} state - The state of the internet
   *   connection.
   *
   * @return {Promise<Boolean>} - A promise that resolves
   *   to true if the internet is connected and false if
   *   it is not.
   */
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            //navigation.goBack({ tokens: props?.route?.params?.tokens });
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '아이디로 시작하기',
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

  return (
    <Container>
      <ProgressSection>
      </ProgressSection>
      <IntroSection>
        <View style={{ marginBottom: 25 }}>
          <ModalText>아이디</ModalText>
          <ModalInputContainer>
            <ModalInput
              ref={input1}
              onSubmitEditing={() => input2.current.focus()}
              placeholder="아이디를 입력해주세요."
              //  autoFocus={currentPageIndex === 2}
              value={id}
              onChangeText={setId}
              autoCompleteType="id"
              autoCapitalize="none"
            />
            <DeleteCircleButton
              onPress={() => {
                setId('');
              }}>
              <DeleteIcon />
            </DeleteCircleButton>
          </ModalInputContainer>
        </View>
        <View>
          <ModalText>비밀번호</ModalText>
          <ModalInputContainer>
            <ModalInput
              ref={input2}
              //  onSubmitEditing={() => input2.current.focus()}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChangeText={setPassword}
              autoCompleteType="pwd"
              secureTextEntry={true}
              onSubmitEditing={async () => {
                const state = await NetInfo.fetch();
                const canProceed = await handleNetInfoChange(state);
                if (canProceed) {

                }
              }}
            />
            <DeleteCircleButton
              onPress={() => {
                setPassword('');
              }}>
              <DeleteIcon />
            </DeleteCircleButton>
          </ModalInputContainer>

        </View>
      </IntroSection>
      <ButtonSection>
        <Button
          width={width}
          onPress={() => {

          }
            // 동의하기 버튼 클릭 시 redux에 저장
          }>
          <ButtonText>{'시작하기'}</ButtonText>
        </Button>
        <View style={{ marginTop: 20 }}>
          <ModalText style={{ textAlign: 'center', marginBottom: 10 }}>계정이 없으신가요?</ModalText>
          <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('AddMembership')}>
            <MembershipText>회원가입</MembershipText>
          </TouchableOpacity>
        </View>
      </ButtonSection>
    </Container>
  );
};

export default Login_ID;
