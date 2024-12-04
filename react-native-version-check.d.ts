declare module 'react-native-version-check' { 
  export default class VersionCheck { 
    static getCurrentVersion(): string; 
    static getLatestVersion(): Promise<string>; 
  } 
}