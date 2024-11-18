import {
  login,
  logout,
  unlink,
  getProfile,
  shippingAddresses,
  serviceTerms,
  KakaoOAuthToken,
  KakaoProfile,
  KakaoShippingAddresses,
  KakaoUserServiceTerms,
} from '@react-native-seoul/kakao-login';

class KakaoAuthManager {
  // 로그인
  async signIn(): Promise<KakaoOAuthToken | null> {
    
    try {
      const token: KakaoOAuthToken = await login();
      console.log('카카오 로그인 성공:', token);
      return token;
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      return null;
    }
  }

  // 로그아웃
  async signOut(): Promise<string | null> {
    try {
      const message = await logout();
      console.log('카카오 로그아웃 성공:', message);
      return message;
    } catch (error) {
      console.error('카카오 로그아웃 실패:', error);
      return null;
    }
  }

  // 프로필 정보 가져오기
  async getProfile(): Promise<KakaoProfile | null> {
    try {
      const profile: KakaoProfile = await getProfile();
      console.log('카카오 프로필 가져오기 성공:', profile);
      return profile;
    } catch (error) {
      console.error('카카오 프로필 가져오기 실패:', error);
      return null;
    }
  }

  // 배송지 정보 가져오기
  async getShippingAddresses(): Promise<KakaoShippingAddresses | null> {
    try {
      const addresses: KakaoShippingAddresses = await shippingAddresses();
      console.log('카카오 배송지 정보 가져오기 성공:', addresses);
      return addresses;
    } catch (error) {
      console.error('카카오 배송지 정보 가져오기 실패:', error);
      return null;
    }
  }

  // 서비스 약관 가져오기
  async getServiceTerms(): Promise<KakaoUserServiceTerms | null> {
    try {
      const terms: KakaoUserServiceTerms = await serviceTerms();
      console.log('카카오 서비스 약관 가져오기 성공:', terms);
      return terms;
    } catch (error) {
      console.error('카카오 서비스 약관 가져오기 실패:', error);
      return null;
    }
  }

  // 연결 끊기
  async unlink(): Promise<string | null> {
    try {
      const message = await unlink();
      console.log('카카오 연결 끊기 성공:', message);
      return message;
    } catch (error) {
      console.error('카카오 연결 끊기 실패:', error);
      return null;
    }
  }
}

// Singleton 패턴으로 인스턴스 생성
const kakaoAuthManager = new KakaoAuthManager();
export default kakaoAuthManager;
