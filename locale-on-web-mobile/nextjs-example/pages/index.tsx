import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Remove getStaticProps if you want to use Locize to manage translations
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en-US', [
      'common',
      'built-in-demo',
    ])),
  },
});

export default function Home() {
  const { locale } = useRouter();
  const { t } = useTranslation(['common', 'built-in-demo']);
  // const { t, i18n } = useTranslation(['common', 'built-in-demo'], {
  //   bindI18n: 'languageChanged loaded',
  // });

  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  // useEffect(() => {
  //   i18n.reloadResources(i18n.resolvedLanguage, ['common', 'built-in-demo']);
  // }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.description}>
          {t('yourLng')}: {locale}
        </p>

        <p className={styles.description}>{t('description')}</p>


        <p className={styles.description}>{t('newKey', 'This is new line')}</p>
      </main>
    </div>
  );
}
