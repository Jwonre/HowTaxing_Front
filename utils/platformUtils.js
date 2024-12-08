import { Platform } from 'react-native';

const PlatformUtils = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

export default PlatformUtils;
