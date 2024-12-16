import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthCredentialState,
  AppleAuthError,
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
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
      });

      const { user, email, fullName, identityToken } = appleAuthRequestResponse;

      console.log('애플 로그인 성공:', {
        user,
        email,
        fullName,
        identityToken,
      });

      return {
        user,
        email,
        fullName: {
          givenName: fullName?.givenName,
          familyName: fullName?.familyName,
        },
        identityToken,
      };
    } catch (error) {
      if (error instanceof AppleAuthError) {
        console.error('애플 로그인 실패 (AppleAuthError):', error);
      } else {
        console.error('애플 로그인 실패:', error);
      }
      return null;
    }
  }

  // 자격 상태 확인
  async getCredentialState(user: string): Promise<AppleAuthCredentialState | null> {
    try {
      const credentialState = await appleAuth.getCredentialStateForUser(user);

      console.log('애플 자격 상태 확인 성공:', credentialState);

      return credentialState;
    } catch (error) {
      console.error('애플 자격 상태 확인 실패:', error);
      return null;
    }
  }
}

// Singleton 패턴으로 인스턴스 생성
const appleAuthManager = new AppleAuthManager();
export default appleAuthManager;
