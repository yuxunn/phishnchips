// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force all @firebase/* packages to be resolved as ESM
  if (moduleName.startsWith('@firebase/')) {
    return context.resolveRequest(
      {
        ...context,
        isESMImport: true, // 🚨 Force it to treat this import as ESM
      },
      moduleName,
      platform
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
