const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Module aliases
const ALIASES = {
  tslib: path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
};

// Custom resolver logic
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle aliasing
  const resolvedModuleName = ALIASES[moduleName] ?? moduleName;

  // Handle ESM enforcement for @firebase/*
  if (resolvedModuleName.startsWith('@firebase/')) {
    return context.resolveRequest(
      {
        ...context,
        isESMImport: true, // Force ESM resolution
      },
      resolvedModuleName,
      platform
    );
  }

  // Default resolution with alias (if applicable)
  return context.resolveRequest(context, resolvedModuleName, platform);
};

module.exports = config;
