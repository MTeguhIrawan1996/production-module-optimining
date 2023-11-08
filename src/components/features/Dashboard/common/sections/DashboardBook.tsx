import i18n from 'i18n';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardBook = () => {
  const { pathname, asPath, query, push } = useRouter();
  const { t } = useTranslation('default');
  const storedLanguage = Cookies.get('language');
  const initialLanguage = storedLanguage;

  const handleChangeLanguage = (locale: string) => {
    push({ pathname, query }, asPath, { locale });
    i18n.changeLanguage(locale);
    Cookies.set('language', locale);
    // Simpan preferensi bahasa ke penyimpanan lokal atau state aplikasi
  };

  React.useEffect(() => {
    i18n.changeLanguage(initialLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <p>{t('halloworld')}</p>

      <div>
        <button onClick={() => handleChangeLanguage('id')}>
          Bahasa Indonesia
        </button>
        <button onClick={() => handleChangeLanguage('en')}>English</button>
      </div>
    </div>
    // <div className="">{locales}</div>
  );
};

export default DashboardBook;
