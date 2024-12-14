// Note: 전자증명서 서비스 이용약관

import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  StyleSheet,

} from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import DeleteIcon from '../../assets/icons/delete_circle.svg';
import CheckIcon from '../../assets/icons/check_circle.svg';
import ImpossibleIcon from '../../assets/icons/impossible_circle.svg';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_button.svg';
import getFontSize from '../../utils/getFontSize';
import DropShadow from 'react-native-drop-shadow';
import { SheetManager } from 'react-native-actions-sheet';
import BackIcon from '../../assets/icons/back_button.svg';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config'
import axios from 'axios';

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
  color: #1b1c1f;
  line-height: 20px;
  letter-spacing: -0.3px;
  margin-bottom: 10px;
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

const CircleButton = styled.TouchableOpacity.attrs(props => ({
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

const AddMembership = props => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const webviewRef = useRef(null);
  const { width } = useWindowDimensions();
  const [activeButton, setActiveButton] = useState(true);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [checkpassword, setCheckPassword] = useState('');
  const [IdOk, setIdOk] = useState('1');
  const [IdCheckresult, setIdCheckresult] = useState('');
  const [PasswordOk, setPasswordOk] = useState('1');
  const [PasswordCheckOk, setPasswordCheckOk] = useState('1');
  const [isConnected, setIsConnected] = useState(true);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const hasNavigatedBackRef = useRef(hasNavigatedBack);

  /*************  ✨ Codeium Command ⭐  *************/
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
  /******  102e980b-d954-4ccb-9e8b-58aaa2f9d92b  *******/
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

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 16;
    const regex = /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*]){2,}[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (password.length < minLength || password.length > maxLength) { return false; }
    return regex.test(password);
  };

  const getLoginYn = async () => {
    try {
      const url = `${Config.APP_API_URL}user/idCheck?id=${encodeURIComponent(id)}`;
      console.log('url', url);
      const response = await axios.get(url);

      if (response.data.errYn == 'Y') {
        if (input1.length > 0) {
          setIdOk('3');
          setIdCheckresult(response.data.errMsg ? response.data.errMsg : '로그인 중복체크 중 문제가 생겼어요.');
          return false;
        } else {
          setIdOk('1');
          setIdCheckresult('');
          return false;
        }
      } else {
        setIdOk('2');
        setIdCheckresult('입력하신 아이디를 사용할 수 있어요.');
        return true;
      }

    } catch (error) {
      setIdOk('3');
      setIdCheckresult('로그인 중복체크 중 문제가 생겼어요.');
      return false;
    }
  };

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
      title: '필수정보 입력하기',
      headerShadowVisible: false,
      contentStyle: {
        borderTopWidth: 0,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#1b1c1f',
        letterSpacing: -0.8,
      },
    });
  }, []);

  return (
    <Container>
      <ProgressSection>
      </ProgressSection>
      <IntroSection>
        <View style={{ marginBottom: 15 }}>
          <ModalText>아이디</ModalText>
          <ModalInputContainer>
            <ModalInput
              ref={input1}
              onSubmitEditing={async () => {
                const logincheck = await getLoginYn();
                if (logincheck) {
                  input2.current.focus();
                } else {
                  if (id.length > 0) {
                    input1.current.focus();
                  }
                }
              }}
              onBlur={async () => {
                const logincheck = await getLoginYn();
                if (logincheck) {
                  input2.current.focus();
                } else {
                  if (id.length > 0) {
                    input1.current.focus();
                  }
                }
              }}
              placeholder="아이디를 입력해주세요."
              value={id}
              onChangeText={async (id) => {
                setId(id.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/g, ''));
                setIdOk('1');
                setIdCheckresult('');
              }}
              autoCompleteType="id"
              autoCapitalize="none"
              style={[
                styles.input_not_content,
                id.length > 0 && styles.input, // id 값이 있을 때 굵은 스타일 적용
              ]}
            />
            {IdOk === '1' && <CircleButton onPress={() => { setId(''); }}>
              <DeleteIcon />
            </CircleButton>
            }
            {IdOk === '2' && <CircleButton>
              <CheckIcon />
            </CircleButton>
            }
            {IdOk === '3' && <CircleButton onPress={() => { setId(''); setIdOk('1') }}>
              <ImpossibleIcon />
            </CircleButton>
            }
          </ModalInputContainer>
          <Text style={{ fontSize: 13, color: '#2F87FF', marginTop: 5, marginLeft: 5 }}>{IdCheckresult}</Text>
        </View>
        <View style={{ marginBottom: 15 }}>
          <ModalText>비밀번호</ModalText>
          <ModalInputContainer>
            <ModalInput
              ref={input2}
              //  onSubmitEditing={() => input2.current.focus()}
              style={password.length > 0 ? styles.input : styles.input_not_content}

              value={password}
              placeholder="비밀번호를 입력해주세요."
              onChangeText={async (password) => {
                if (password.length === 0) {
                  setPasswordOk('1');
                  setPassword('');
                } else {
                  if (validatePassword(password)) {
                    setPassword(password);
                    setPasswordOk('2');
                    setCheckPassword('');
                    setPasswordCheckOk('1');
                  }
                  else {
                    setPassword(password);
                    setPasswordOk('3');
                    setCheckPassword('');
                    setPasswordCheckOk('1');
                  }
                }

              }}
              autoCompleteType="pwd"
              secureTextEntry={true}
              maxLength={16}
              onSubmitEditing={async () => {
                if (validatePassword(password)) { input3.current.focus(); } else { input2.current.focus(); }
              }}
            />
            {PasswordOk === '1' && <CircleButton onPress={() => { setPassword(''); }}>
              <DeleteIcon />
            </CircleButton>
            }
            {PasswordOk === '2' && <CircleButton>
              <CheckIcon />
            </CircleButton>
            }
            {PasswordOk === '3' && <CircleButton onPress={() => { setPassword(''); setPasswordOk('1') }}>
              <ImpossibleIcon />
            </CircleButton>
            }
          </ModalInputContainer>
          <Text style={styles.expiredText2}>{PasswordOk === '2' || password === '' ? '' : '8~16자, 영문 대소문/숫자/특수문자 2종류 이상 조합해주세요.'}</Text>
        </View>
        <View>
          <ModalText>비밀번호 확인</ModalText>
          <ModalInputContainer>
            <ModalInput
              ref={input3}
              //  onSubmitEditing={() => input2.current.focus()}
              style={checkpassword.length > 0 ? styles.input : styles.input_not_content}

              placeholder="비밀번호를 다시 입력해주세요."
              value={checkpassword}
              secureTextEntry={true}
              onChangeText={async (checkpassword) => {
                if (checkpassword.length === 0) {
                  setCheckPassword('');
                  setPasswordCheckOk('1');
                }
                else {
                  if (checkpassword === password) {
                    setCheckPassword(checkpassword); setPasswordCheckOk('2');
                  } else { setCheckPassword(checkpassword); setPasswordCheckOk('3'); }
                }
              }}
              autoCompleteType="pwd"
              maxLength={16}
            />
            {PasswordCheckOk === '1' && <CircleButton onPress={() => { setCheckPassword(''); }}>
              <DeleteIcon />
            </CircleButton>
            }
            {PasswordCheckOk === '2' && <CircleButton>
              <CheckIcon />
            </CircleButton>
            }
            {PasswordCheckOk === '3' && <CircleButton onPress={() => { setCheckPassword(''); setPasswordCheckOk('1'); }}>
              <ImpossibleIcon />
            </CircleButton>
            }
          </ModalInputContainer>
          <Text style={{    fontFamily: 'Pretendard-Regular',
 fontSize: 13, color: PasswordCheckOk === '2' ? '#a3a5a8' : '#FF7401', marginTop: 10, marginLeft: 5 }}>{PasswordCheckOk === '2' || PasswordCheckOk === '1' ? '' : '입력하신 비밀번호가 일치하지 않아요.'}</Text>
        </View>

      </IntroSection>
      <ButtonSection>
        <Button
          active={IdOk === '2' && PasswordOk === '2' && PasswordCheckOk === '2'}
          disabled={IdOk !== '2' || PasswordOk !== '2' || PasswordCheckOk !== '2'}
          style={{ backgroundColor: (IdOk === '2' && PasswordOk === '2' && PasswordCheckOk === '2') ? '#2F87FF' : '#E8EAED' }}
          width={width}
          onPress={async () => {
            const state = await NetInfo.fetch();
            const canProceed = await handleNetInfoChange(state);
            if (canProceed) {
              await navigation.push('CheckTerms', { LoginAcessType: 'IDPASS', id: id, password: password });
            }
          }
            // 동의하기 버튼 클릭 시 redux에 저장
          }>
          <ButtonText style={{ color: IdOk === '2' && PasswordOk === '2' && PasswordCheckOk === '2' ? '#FFFFFF' : '#a3a5a8' }}>{'다음으로'}</ButtonText>
        </Button>
      </ButtonSection>
    </Container>
  );
};


const styles = StyleSheet.create({

  input_not_content: {
    flex: 1, // TextInput이 남은 공간을 차지하도록 설정
    color: '#000',
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
  },
  input: {
    flex: 1, // TextInput이 남은 공간을 차지하도록 설정
    color: '#000',
    fontSize: 17,
    fontFamily: 'Pretendard-Regular',
  },
  expiredText2: {
    fontSize: 13,
    color: '#2F87FF', // 빨간색 텍스트
    marginTop : 10,
    fontFamily: 'Pretendard-Regular',
  },
  expiredText: {
    fontSize: 13,
    marginTop : 10,
    color: '#FF7401', // 빨간색 텍스트
    fontFamily: 'Pretendard-Regular',
  },
});

export default AddMembership;
