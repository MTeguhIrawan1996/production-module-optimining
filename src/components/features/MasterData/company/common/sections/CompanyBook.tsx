import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

const dataExample = [
  {
    id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
    companyName: 'Sipes Inc',
    companyCode: '280 Rigoberto Divide',
    companyType: 'Twin Falls',
    director: 'MT',
  },
  {
    id: '3c147f0b-c63f-4830-8ced-f378aad9efc6',
    companyName: 'Runolfsdottir - Cummerata',
    companyCode: '102 Konopelski Greens',
    companyType: 'Missouri CompanyType',
    director: 'KY',
  },
  {
    id: '331992e8-7144-49c4-a8fd-fae9a6921b13',
    companyName: 'Johnston LLC',
    companyCode: '230 Julie Lake',
    companyType: 'Hartford',
    director: 'KY',
  },
  {
    id: 'eb089974-a0ed-4ec2-84a3-4d7bd3935b63',
    companyName: 'Crist and Sons',
    companyCode: '3387 Blick Turnpike',
    companyType: 'Attleboro',
    director: 'WV',
  },
  {
    id: 'fc257801-7b32-41ca-a31b-57ae6739415b',
    companyName: 'Schmidt and Sons',
    companyCode: '286 Leif Lock',
    companyType: 'Collierville',
    director: 'AL',
  },
  {
    id: 'c942ac73-2c51-4bf1-b4a7-04419acf58c0',
    companyName: 'Nicolas Group',
    companyCode: '09622 Marcel Place',
    companyType: 'Highland',
    director: 'OR',
  },
  {
    id: 'ad36f2d0-b186-4f1e-9a04-57e59715dc8f',
    companyName: 'Kub and Sons',
    companyCode: '8699 Upton Fords',
    companyType: 'East Providence',
    director: 'IN',
  },
  {
    id: 'e4a64ab6-4a9f-4f53-8f9e-dbf761fe9a69',
    companyName: 'Jakubowski - Rolfson',
    companyCode: "191 O'Connell Greens",
    companyType: 'San Rafael',
    director: 'MA',
  },
  {
    id: '996fdd92-a399-4bef-9188-b0458ecee682',
    companyName: 'Welch - Tremblay',
    companyCode: '31622 Isobel Fall',
    companyType: 'Olathe',
    director: 'AR',
  },
  {
    id: 'd0d0f9b1-7bb9-4b1e-967d-3ea81de7dd59',
    companyName: 'Mueller, Hodkiewicz and Beahan',
    companyCode: '21751 Elisa Village',
    companyType: 'Grand Prairie',
    director: 'WA',
  },
];

const CompanyBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  return (
    <DashboardCard
      addButton={{
        label: t('company.createCompany'),
        onClick: () => router.push('/master-data/company/create'),
      }}
      searchBar={{
        placeholder:
          'Cari berdasarkan Nama Perusahaan, Nama Pegawai, NIP, Divisi dan Jabatan',
      }}
      MultipleFilter={{
        MultipleFilterData: [
          {
            data: [
              {
                label: 'react',
                value: 'react',
              },
              {
                label: 'mantine',
                value: 'mantine',
              },
            ],
            label: t('commonTypography.companyType'),
            placeholder: t('company.chooseCompanyType'),
            searchable: true,
            clearable: true,
          },
        ],
      }}
    >
      <MantineDataTable
        tableProps={{
          records: dataExample,
          defaultColumnProps: {
            textAlignment: 'center',
          },
          highlightOnHover: true,
          shadow: 'none',
          onRowClick: ({ id }) => {
            // eslint-disable-next-line no-console
            console.log(id);
          },
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) => dataExample.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'companyName',
              title: t('commonTypography.companyName'),
            },
            {
              accessor: 'companyCode',
              title: t('commonTypography.companyCode'),
            },
            {
              accessor: 'companyType',
              title: t('commonTypography.companyType'),
            },
            { accessor: 'director', title: t('commonTypography.director') },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/master-data/company/read/${id}`);
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        // eslint-disable-next-line no-console
                        console.log('del');
                      },
                    }}
                  />
                );
              },
            },
          ],
        }}
        paginationProps={{
          setPage: () => {},
          currentPage: 1,
          totalAllData: 100,
          totalData: 10,
          totalPage: 20,
          // isFetching: true,
        }}
      />
    </DashboardCard>
  );
};

export default CompanyBook;
