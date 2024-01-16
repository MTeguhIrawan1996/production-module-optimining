import * as React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardBook = () => {
  const { t } = useTranslation('default');

  return (
    <div className="">
      <p>{t('halloworld')}</p>
    </div>
  );
};

export default DashboardBook;
