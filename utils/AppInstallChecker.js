import DeviceInfo from 'react-native-device-info';

class AppInstallChecker {
    static async isAppInstalled(packageName){
        try{
            const isInstalled = await DeviceInfo.isAppInstalled(packageName);
            console.log(`${packageName} 설치 여부: ${isInstalled}`);
            return isInstalled;
        }catch(error){
            console.error("앱 설치 여부 확인 실패",error);
            return false;
        }
    }

      // 카카오톡 설치 여부 확인
  static async isKakaoTalkLoginAvailable() {
    return await this.isAppInstalled('com.kakao.talk');
  }

  // 예시: 다른 앱도 추가할 수 있습니다.
  static async isOtherAppInstalled(packageName) {
    return await this.isAppInstalled(packageName);
  }
  
}
export default AppInstallChecker;
