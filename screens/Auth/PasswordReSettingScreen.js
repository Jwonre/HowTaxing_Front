

// import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, useWindowDimensions, BackHandler,View,
  Text,
  TextInput,
  ScrollView,
  Animated,
  StyleSheet,Dimensions,
  StatusBar } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DeleteIcon from '../../assets/icons/delete_circle.svg';

import { Header } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView } from 'react-native';

const Container = styled.View`
  flex: 1.0;
  background-color: #fff;
`;
const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #D9D9D9;
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
const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
`;

const IdLoginScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const _scrollViewRef = useRef(null);
  const [inputValue, setInputValue] = useState('');


  useLayoutEffect(() => {
   // 상태 표시줄 설정 (전역 설정)
   StatusBar.setBarStyle('dark-content', true); // 아이콘 색상: 어두운 색
   StatusBar.setBackgroundColor('#ffffff'); // 배경색: 흰색 (안드로이드 전용)
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            navigation.goBack();
            // dispatch(clearHouseInfo());
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
  
      headerTitleAlign: 'center',
      title: '비밀번호 재설정하기.',
      headerShadowVisible: false,
      // contentStyle: {
      //   borderTopColor: '#D9D9D9',
      //   borderTopWidth: 1,
      // },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
    
      },
      
    });
  },[]);

  return (
    <View style={styles.rootContainer}>
    {/* 파란색 라인 */}
    <View style={styles.blueLine} />

    {/* 스크롤 뷰 */}
    <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Section */}
        <View style={styles.inputSection}>
            {/* Label */}
            <Text style={styles.label}>아이디</Text>

            {/* Input Field */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="아이디를 입력해주세요."
                placeholderTextColor="#A3A5A8"
                value={inputValue}
                onChangeText={setInputValue}
              />
              {inputValue !== '' && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setInputValue('')}
                >
                  <DeleteIcon />
                </TouchableOpacity>
              )}
            </View>

            {/* Find ID Button */}
            <TouchableOpacity style={styles.findIdButton}>
              <Text style={styles.findId}>아이디 찾기</Text>
            </TouchableOpacity>
          </View>

            <View style = {styles.secondContent}>
                <View style={styles.inputSection}>
                    {/* Label */}
                    <Text style={styles.label}>비밀번호</Text>

                    {/* Input Field */}
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="비밀번호를 입력해주세요."
                        placeholderTextColor="#A3A5A8"
                        value={inputValue}
                        onChangeText={setInputValue}
                      />
                      {inputValue !== '' && (
                        <TouchableOpacity
                          style={styles.clearButton}
                          onPress={() => setInputValue('')}
                        >
                          <DeleteIcon />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Find ID Button */}
                    <TouchableOpacity style={styles.findIdButton}>
                      <Text style={styles.findId}>비밀번호 재설정</Text>
                    </TouchableOpacity>
              </View>

              
                {/* Login Button */}
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonLabel}>시작하기</Text>
                </TouchableOpacity>
                {/* Sign Up */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>계정이 없으신가요?</Text>
                </View>

                <View style={styles.signUpFooter}>
                <TouchableOpacity>
                    <Text style={styles.signUpText}>회원가입</Text>
                  </TouchableOpacity>
                </View>
        </View>
          
        {/* 추가 콘텐츠를 여기에 배치 가능 */}
      </ScrollView>
  </View>
    
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blueLine: {
    height: 5, // 라인 두께
    backgroundColor: '#2f87ff', // 파란색
  },
  content: {
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  secondContent: {
    marginTop: 20,
  },
  inputSection: {
    marginTop: 10,
  },
  label: {
    fontSize: 17,
    marginBottom: 10,
    color:'#1b1C1F',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
  },
  inputWrapper: {
    flexDirection: 'row', // TextInput과 Clear 버튼 가로 배치
    alignItems: 'center', // 세로 가운데 정렬
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 8, // TextInput과 "아이디 찾기" 버튼 사이 간격
  },
  input: {
    flex: 1, // TextInput이 가로로 공간을 채움
    color: '#000', // 글자 색상
    fontSize: 13, // 폰트 크기
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 13, // 버튼이 인풋 중앙에 오도록
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
  findId: {
    fontSize: 13, // 폰트 크기
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
    color: '#717274',
    textDecorationLine: 'underline', // 밑줄 추가
    textDecorationColor: '#717274', // 밑줄 색상 설정
  },
  loginButton: {
    backgroundColor: '#2F87ff',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 30,
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Pretendard-Medium', // 원하는 폰트 패밀리
    fontWeight: 'medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'Pretendard-Bold', // 원하는 폰트 패밀리
    fontWeight: '700', // 폰트 두께 (400은 기본)
   
  },

  signUpText: {
    fontSize: 13,
    color: '#2F87FF',
    fontFamily: 'Pretendard-Regular', // 원하는 폰트 패밀리
    fontWeight: '400', // 폰트 두께 (400은 기본)
    textDecorationLine: 'underline', // 밑줄 추가
    textDecorationColor: '#2F87FF', // 밑줄 색상 설정
  },
  findIdButton: {
    alignSelf: 'flex-end', // 부모의 오른쪽 끝에 정렬
  },
});



export default IdLoginScreen;
