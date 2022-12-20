import {NativeModules, I18nManager, Platform} from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';

export const getDeviceLang = () => {
  if (Platform.OS === 'ios') {
    // iOS:
    const localeiOS =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]; // "en_US"
    return localeiOS;
  }
  if (Platform.OS === 'android') {
    // Android:
    const localeAndroid = NativeModules.I18nManager.localeIdentifier; // "en_US"
    return localeAndroid;
  }
};

export const USER_LANG = 'USER_LANG';

export const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async callback => {
    const userLang = await AsyncStorage.getItem(USER_LANG);
    const deviceLang = userLang || getDeviceLang();
    /** Just for the sake of simplicity ... `ar` is the only supported RTl-Lang in the sample-app */
    const isLangRTL = `${deviceLang}`.includes('ar_'); // ar_US
    /** if the chosen-app-lang doesn't match current-app-direction */
    if (isLangRTL !== I18nManager.isRTL) {
      /** Adjust app-direction */
      await I18nManager.allowRTL(isLangRTL);
      await I18nManager.forceRTL(isLangRTL);
      /** Restart the app for the app-dir change to take effect */
      RNRestart.Restart();
    }
    callback(deviceLang);
  },
  cacheUserLanguage: () => {},
};

export const onLangChange = async userLang => {
  // const userLang = await AsyncStorage.getItem(USER_LANG);
  const lang = userLang || getDeviceLang();
  const isLangRTL = `${lang}`.includes('ar_'); // ar_US
  /** 1. Store user-preferred lang  */
  await AsyncStorage.setItem(USER_LANG, lang);
  /** 2. re-translate the app to `lang`  */
  await i18n.changeLanguage(lang);
  /** 3. */
  if (isLangRTL !== I18nManager.isRTL) {
    /** Change app direction in case of mismatch */
    await I18nManager.allowRTL(isLangRTL);
    await I18nManager.forceRTL(isLangRTL);
    /** Force restart for the app for the changes to take effect */
    RNRestart.Restart();
  }
};
