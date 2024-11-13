import React, { useRef, useEffect, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

const LoginWebview = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const webViewRef = useRef(null);
    const socialType = props.route.params.socialType;
    const { width, height } = Dimensions.get('window');
    const [webViewStyle, setWebViewStyle] = useState({ width: width, height: height });

    useEffect(() => {
        navigation.setOptions({
            onWebViewMessage: (message) => {
                handleWebViewMessage({ nativeEvent: { data: message } });
            }
        });
    }, [navigation]);

    const uri = { uri: `${Config.APP_API_URL}oauth2/authorization/${socialType}` };

    console.log('uri', uri);
    const sendWebMessage = () => {
        webViewRef.current.injectJavaScript(`
        const url = document?.URL === null ? null : document?.URL;
        if ((url.indexOf('https://') === -1) || (url === null)) {
            window.ReactNativeWebView.postMessage('url');
        } else {
            const preElement = document.getElementsByTagName("pre")[0];
            const data = preElement.innerText; // 결과 
            if (data !== null) {
                window.ReactNativeWebView.postMessage(data);
            }
        }
        `);
    };

    const handleWebViewMessage = event => {
        console.log('event.nativeEvent', event.nativeEvent);
        const message = event.nativeEvent.data;
        if (message === 'url') {
            setWebViewStyle({
                flex: 1,
                width: width,
                height: height,
            });
        } else {
            setWebViewStyle({
                flex: 1,
                width: width,
                height: width,
            });
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.errYn === 'Y') {
                SheetManager.show('info', {
                    payload: {
                        type: 'error',
                        message: '로그인에 실패했습니다.',
                        buttontext: '확인하기',
                    },
                });
            } else if (parsedMessage.errYn === 'N') {
                const data = parsedMessage.data;
                route.params.onWebViewMessage({ nativeEvent: { data: data } });
            }
        }
    };

    return (
        <WebView
            style={webViewStyle}
            ref={webViewRef}
            source={uri}
            onLoad={sendWebMessage}
            onMessage={handleWebViewMessage}
            option={{ tarBarVisible: false }}
            mixedContentMode="always"
        />
    );
};

export default LoginWebview;
