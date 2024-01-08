import i18n from 'i18n';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardBook = () => {
  const { pathname, asPath, query, push } = useRouter();
  const { t } = useTranslation('default');

  const handleChangeLanguage = (locale: string) => {
    push({ pathname, query }, asPath, { locale });
    i18n.changeLanguage(locale);
    Cookies.set('language', locale);
    // Simpan preferensi bahasa ke penyimpanan lokal atau state aplikasi
  };

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
