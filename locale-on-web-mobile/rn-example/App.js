/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import i18n from './src/utils/i18n';
import {onLangChange} from './src/utils/languageDetector';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = React.memo(({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
});

const App = React.memo(() => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.safeAreaView, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.headerContainer}>
        <Text style={styles.loginLabel}>{i18n.t('login')} (Login)</Text>
        <Text style={styles.signupLabel}>{i18n.t('signup')} (Signup)</Text>
      </View>
      <Section title={i18n.t('welcome')}>
        {i18n.t('edit')} <Text style={styles.highlight}>App.js </Text>
        {i18n.t('to_change_this_screen')}
      </Section>
      <View style={styles.btnContainer}>
        <Button
          title="Change Lang to ar_US"
          onPress={() => onLangChange('ar_US')}
        />
        <Button
          title="Change Lang to en_US"
          onPress={() => onLangChange('en_US')}
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  loginLabel: {
    color: 'red',
  },
  signupLabel: {
    color: 'blue',
  },
  btnContainer: {
    marginTop: 24,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
