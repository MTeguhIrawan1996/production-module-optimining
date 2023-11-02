import i18n from 'i18n';
import { useRouter } from 'next/router';
import * as React from 'react';

const DashboardBook = () => {
  const { pathname, asPath, query, push } = useRouter();
  const { t } = i18n;

  const handleChangeLanguage = (locale: string) => {
    push({ pathname, query }, asPath, { locale });
    i18n.changeLanguage(locale);
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
