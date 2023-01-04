import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import BuiltInFormatsDemo from '../components/BuiltInFormatsDemo';

// Remove getStaticProps if you want to use Locize to manage translations
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en-US', ['common', 'built-in-demo'])),
  },
});

export default function About() {
  return (
    <main className={styles.main}>
      <BuiltInFormatsDemo />
    </main>
  );
}
