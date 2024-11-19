

// import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, useWindowDimensions, BackHandler,View,
  Text,
  TextInput,
  StyleSheet, } from 'react-native';
import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView } from 'react-native';

const IdLoginScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     header: () => (
  //       <SafeAreaView style={{ backgroundColor: '#000' }}>

  //       <View
  //         style={{
  //           height: 60,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           borderBottomWidth: 2,
  //           borderBottomColor: '#007BFF', // 파란색 라인
  //           backgroundColor: '#fff', // 헤더 배경색
  //         }}>
  //         <Text
  //           style={{
  //             fontFamily: 'Pretendard-Bold',
  //             fontSize: 17,
  //             color: '#333',
  //             letterSpacing: -0.8,
  //           }}>
  //           아이디를 입력해주세요.
  //         </Text>
  //       </View>
  //             </SafeAreaView>

  //     ),
      
  //   });
  // });
  
  useLayoutEffect(() => {
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
      title: '아이디를 입력해주세요.',
      headerShadowVisible: false,
      contentStyle: {
        borderTopColor: '#D9D9D9',
        borderTopWidth: 1,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
        borderBottomWidth :5,
        borderBottomColor: '#D9D9D9',
      },
      
    });
  });

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>아이디로 시작하기</Text> */}

      {/* <View
        style={{
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 2,
          borderBottomColor: '#007BFF', // 파란색 라인
        }}/> */}
      {/* ID Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력해주세요."
          value={id}
          onChangeText={setId}
        />
        {id ? (
          <TouchableOpacity onPress={() => setId('')}>
            <Icon name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        ) : null}
      </View>
      <TouchableOpacity style={styles.textButton}>
        <Text style={styles.textButtonLabel}>아이디 찾기</Text>
      </TouchableOpacity>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요."
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* {password ? (
          <TouchableOpacity onPress={() => setPassword('')}>
            <Icon name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        ) : null} */}
      </View>
      <TouchableOpacity style={styles.textButton}>
        <Text style={styles.textButtonLabel}>비밀번호 재설정</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonLabel}>시작하기</Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <View style={styles.footer}>
        <Text>계정이 없으신가요?</Text>
        <TouchableOpacity>
          <Text style={styles.signUpText}> 회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  textButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  textButtonLabel: {
    color: '#007BFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default IdLoginScreen;
