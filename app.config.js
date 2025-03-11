export default ({ config }) => ({
  expo: {
    name: "Allyson",
    scheme: "allyson",
    slug: "allyson",
    userInterfaceStyle: "automatic",
    version: "2.0.6",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#000000",
    },
    updates: {
      url: "https://u.expo.dev/e3953d53-ace6-4b91-9ff4-a834af626bbb",
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    assetBundlePatterns: ["**/*"],
    androidNavigationBar: {
      backgroundColor: "#000000", // Black color
      barStyle: "light-content", // White icons (for visibility)
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.allyson.app",
      buildNumber: "13",
    },
    android: {
      googleServicesFile: "./google-services.json",
      package: "com.allysonai.allyson",
      versionCode: 5,
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#000000",
      },
      androidNavigationBar: {
        backgroundColor: "#000000", // Black color
        barStyle: "light-content", // White icons (for visibility)
      },
      permissions: [
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_EXTERNAL_STORAGE",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "e3953d53-ace6-4b91-9ff4-a834af626bbb",
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
      },
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            minSdkVersion: 26,
            buildToolsVersion: "34.0.0",
            kotlinVersion: "1.8.22",
          },
          ios: {
            deploymentTarget: "14.0",
          },
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allyson needs access your photos to let you share photos in your conversations.",
        },
      ],
      [
        "expo-tracking-transparency",
        {
          userTrackingPermission:
            "Allow Allyson to collect app-related data that can be used for tracking you or your device to personalize your experience.",
        },
      ],
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Production",
        },
      ],
      ["expo-router"],
      [
        "expo-file-system",
        {
          filePermission:
            "Allyson needs access to your files and media to download files.",
        },
      ],
    ],
  },
});
