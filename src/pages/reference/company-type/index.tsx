import dynamic from 'next/dynamic';
import * as React from 'react';

import CompanyTypePage from '@/components/features/Reference/company-type/common';
// import Link from 'next/link';
// import DashboardLayout from 'main/DashboardLayout';

const DashboardLayout = dynamic(() => import('main/DashboardLayout'), {
  ssr: false,
});

const CompanyType = () => {
  // const { companyTypesdata, companyTypesLoading } = useReadAllCompanyTypes({
  //   variables: {
  //     limit: null,
  //     orderBy: null,
  //     orderDir: null,
  //     page: null,
  //     search: null,
  //   },
  // });
  return (
    <>
      <CompanyTypePage />
    </>
  );
  // return <div>Helloo</div>;
};

export default CompanyType;

CompanyType.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
