### **Libraries**

[https://www.i18next.com](https://www.i18next.com/)

- NextJS: [https://github.com/i18next/next-i18next](https://github.com/i18next/next-i18next)
- ReactJS, React Native: [https://github.com/i18next/react-i18next](https://github.com/i18next/react-i18next)

### Locale detection

**Nextjs**

Next.js will try to automatically detect which locale the user prefers based on the `[Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)` header and the current domain.

```jsx
// next.config.js
module.exports = {
  i18n: {
    localeDetection: true, // default is true. Only use this config if you need to disable automatic locale detection
  },
};
```

**Reactjs**

For browser usage there is the [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector) which detects language based on: _cookie, localStorage, navigator, querystring (append `?lng=LANGUAGE` to URL), htmlTag, path, subdomain_

```jsx
import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationEN from "../public/locales/en/translation.json";
import translationDE from "../public/locales/de/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};

i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
```

**React Native**

```jsx
import { NativeModules } from "react-native";

// iOS:
const locale =
  NativeModules.SettingsManager.settings.AppleLocale ||
  NativeModules.SettingsManager.settings.AppleLanguages[0]; // "fr_FR"

// Android:
const locale = NativeModules.I18nManager.localeIdentifier; // "fr_FR"
```

### **Internationalized Routing**

**Nextjs**

Next.js has built-in support for internationalized routing since `v10.0.0`

- Sub-path Routing

```jsx
// next.config.js
module.exports = {
  i18n: {
    locales: ["en-US", "fr", "nl-NL"],
    defaultLocale: "en-US",
  },
};
```

- Domain routing

```jsx
// next.config.js
module.exports = {
  i18n: {
    locales: ["en-US", "fr", "nl-NL", "nl-BE"],
    defaultLocale: "en-US",

    domains: [
      {
        // Note: subdomains must be included in the domain value to be matched
        // e.g. www.example.com should be used if that is the expected hostname
        domain: "example.com",
        defaultLocale: "en-US",
      },
      {
        domain: "example.fr",
        defaultLocale: "fr",
      },
      {
        domain: "example.nl",
        defaultLocale: "nl-NL",
        // specify other locales that should be redirected
        // to this domain
        locales: ["nl-BE"],
      },
    ],
  },
};
```

**Reactjs**

Routing process: **_routeChangeStart -> currentComponent unmounts -> routeChangeComplete -> nextComponent mounts_**

```jsx
const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleRouteChangeComplete = (path: string) => {
      // Find the lng for the path
      const findPathReturnLng = (): string => {
        let i;
        for (i = 0; i < routes.length; i++) {
          const [route, lng] = routes[i];
          if (path.includes(route)) {
            return lng;
          }
        }

        return "en";
      };
      const lng = findPathReturnLng();

      if (i18n.language !== lng) i18n.changeLanguage(lng);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
  }, []);

  return children;
};
```

**React Native**

Using libraries

- [react-native-restart](https://github.com/avishayil/react-native-restart)
- [async-storage](https://github.com/react-native-async-storage/async-storage)

Dynamically change app language and app direction

- On-App-Load
  - Change app language to the **current device language** (_if the user has no saved preference for app language_).
  - OR change app language to the **user-preferred-app language** (**If any**).
  - Adjust app-direction accordingly.

```jsx
const languageDetector = {
  init: Function.prototype,
  type: "languageDetector",
  async: true, // flags below detection to be async
  detect: async (callback) => {
    const userLang = await AsyncStorage.getItem(USER_LANG);
    const deviceLang = userLang || getDeviceLang();
    /** Just for the sake of simplicity ... `ar` is the only supported RTl-Lang in the sample-app */
    const isLangRTL = deviceLang === "ar";
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
```

- On-App-Lang-Change (manually by the user)
  - Change app language, and app-direction to the newly selected lang and instantly update the UI.

```jsx
const onLangChange = async () => {
  const userLang = await AsyncStorage.getItem(USER_LANG);
  const lang = (userLang || getDeviceLang()) === "ar" ? "en" : "ar";
  const isLangRTL = lang === "ar";
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
```

### Supports LTR and RTL text

**Nextjs, Reactjs**

To add LTR or RTL support to the application, we will set on `index.html` `<body>` an attribute called `dir` dynamically.

Set the attribute on the entry component ( by default `App.js` ).

```jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir(); // return ltr or rtl of current language
  return <div className="App">{t("welcome")}</div>;
}

export default App;
```

Or set **`[HTML dir Attribute](https://www.w3schools.com/tags/att_global_dir.asp)`** when global components are mounted (Header, Footer…)

```jsx
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const Header = () => {
  const { t, i18n } = useTranslation('common');
  const localeDir = i18n.dir(); // return ltr or rtl of current language

  useEffect(() => {
    document.querySelector('html')?.setAttribute('dir', localeDir);
  }, [localeDir]);

  return (
    <header>
				{...}
    </header>
  );
};

export default Header;
```
