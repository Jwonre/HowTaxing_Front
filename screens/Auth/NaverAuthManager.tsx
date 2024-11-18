import naverLogin, { NaverLoginResponse } from '@react-native-seoul/naver-login';
/** Fill your keys */
const consumerKey = 'orG8AAE8iHfRSoiySAbv';
const consumerSecret = 'DEn_pJGqup';
const appName = '하우택싱';

/** This key is setup in iOS. So don't touch it */
const serviceUrlSchemeIOS = 'howtaxingrelease';
class NaverAuthManager {
   
  
  // 네이버 로그인
  async signIn(): Promise<NaverLoginResponse | null> {
     
    try{
        naverLogin.initialize({
            appName,
            consumerKey,
            consumerSecret,
            serviceUrlSchemeIOS,
            disableNaverAppAuthIOS: true,
          });
    }catch(error){
        console.error('초기화 실패 : ',error);
    }
  
    try {
      const response: NaverLoginResponse = await naverLogin.login();
      console.log('네이버 로그인 성공:', response);
      return response;
    } catch (error) {
      console.error('네이버 로그인 실패:', error);
      return null;
    }
  }

  // 네이버 로그아웃
  async signOut(): Promise<void> {
    try {
      const result = await naverLogin.logout();
      console.log('네이버 로그아웃 성공:', result);
      return result;
    } catch (error) {
      console.error('네이버 로그아웃 실패:', error);
    }
  }
}

// Singleton 패턴으로 인스턴스 생성
const naverAuthManager = new NaverAuthManager();
export default naverAuthManager;
