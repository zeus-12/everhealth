const { getDefaultConfig } = require('@expo/metro-config');
const withNativewind = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('cjs');

module.exports = withNativewind(getDefaultConfig(__dirname));