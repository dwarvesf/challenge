import { ChangeEventHandler, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Header = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const localeDir = i18n.dir();

  useEffect(() => {
    document.querySelector('html')?.setAttribute('dir', localeDir);
  }, [localeDir]);

  const handleLocaleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;

    router.push(router.route, router.asPath, {
      locale: value,
    });
  };

  return (
    <header>
      <nav>
        <Link href="/" className={router.asPath === '/' ? 'active' : ''}>
          {t('menu.home')}
        </Link>
        <Link
          href="/about"
          className={router.asPath === '/about' ? 'active' : ''}
        >
          {t('menu.about')}
        </Link>
      </nav>

      <select onChange={handleLocaleChange} value={router.locale}>
        <option value="en-US">English</option>
        <option value="vi">Tiếng Việt</option>
        <option value="ar">Arabic</option>
      </select>
    </header>
  );
};

export default Header;
