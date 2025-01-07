const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {
    resolver: { sourceExts, assetExts },
} = defaultConfig;

const config = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'), // 기존 svg 제거
        sourceExts: [...sourceExts, 'svg'], // svg 추가
    },
};

config.resolver.assetExts.push('png'); // png 확장자를 명시적으로 포함

module.exports = mergeConfig(defaultConfig, config);
