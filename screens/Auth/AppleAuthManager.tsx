import appleAuth, {

} from '@invertase/react-native-apple-authentication';

class AppleAuthManager {
  // 로그인
  async signIn(): Promise<{
    user: string;
    email?: string;
    fullName?: {
      givenName?: string;
      familyName?: string;
    };
    identityToken?: string;
  } | null> {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { user, email, fullName, identityToken } = appleAuthRequestResponse;

      console.log('애플 로그인 성공:', {
        user,
        email,
        fullName,
        identityToken,
      });

      if (identityToken) {
        // 성공적으로 토큰을 받아온 경우
        console.log('Apple Identity Token:', identityToken);
        return {
          user,
          identityToken,
        };
      } else {

        console.error('애플 로그인 실패:', '토큰을 가져올 수 없습니다.');

        return null;
      }

     
    } catch (error) {
      console.error('애플 로그인 실패:', error);

      return null;
    }
  }

  // 자격 상태 확인
  // async getCredentialState(user: string): Promise<AppleAuthCredentialState | null> {
  //   try {
  //     const credentialState = await appleAuth.getCredentialStateForUser(user);

  //     console.log('애플 자격 상태 확인 성공:', credentialState);

  //     return credentialState;
  //   } catch (error) {
  //     console.error('애플 자격 상태 확인 실패:', error);
  //     return null;
  //   }
  // }
}

// Singleton 패턴으로 인스턴스 생성
const appleAuthManager = new AppleAuthManager();
export default appleAuthManager;

