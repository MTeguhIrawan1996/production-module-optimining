import { Text } from '@mantine/core';
import * as React from 'react';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

const tableExp = [
  {
    id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
    name: 'Sipes Inc',
    streetAddress: '280 Rigoberto Divide',
    city: 'Twin Falls',
    state: 'MT',
    missionStatement:
      'Strategize magnetic vortals. Strategize magnetic vortals. Strategize magnetic vortals.',
  },
  {
    id: '3c147f0b-c63f-4830-8ced-f378aad9efc6',
    name: 'Runolfsdottir - Cummerata',
    streetAddress: '102 Konopelski Greens',
    city: 'Missouri City',
    state: 'KY',
    missionStatement: 'Leverage one-to-one methodologies.',
  },
  {
    id: '331992e8-7144-49c4-a8fd-fae9a6921b13',
    name: 'Johnston LLC',
    streetAddress: '230 Julie Lake',
    city: 'Hartford',
    state: 'KY',
    missionStatement: 'Transition wireless initiatives.',
  },
  {
    id: 'eb089974-a0ed-4ec2-84a3-4d7bd3935b63',
    name: 'Crist and Sons',
    streetAddress: '3387 Blick Turnpike',
    city: 'Attleboro',
    state: 'WV',
    missionStatement: 'Revolutionize out-of-the-box infomediaries.',
  },
  {
    id: 'fc257801-7b32-41ca-a31b-57ae6739415b',
    name: 'Schmidt and Sons',
    streetAddress: '286 Leif Lock',
    city: 'Collierville',
    state: 'AL',
    missionStatement: 'Optimize bricks-and-clicks eyeballs.',
  },
  {
    id: 'c942ac73-2c51-4bf1-b4a7-04419acf58c0',
    name: 'Nicolas Group',
    streetAddress: '09622 Marcel Place',
    city: 'Highland',
    state: 'OR',
    missionStatement: 'Transition vertical interfaces.',
  },
  {
    id: 'ad36f2d0-b186-4f1e-9a04-57e59715dc8f',
    name: 'Kub and Sons',
    streetAddress: '8699 Upton Fords',
    city: 'East Providence',
    state: 'IN',
    missionStatement: 'Drive proactive models.',
  },
  {
    id: 'e4a64ab6-4a9f-4f53-8f9e-dbf761fe9a69',
    name: 'Jakubowski - Rolfson',
    streetAddress: "191 O'Connell Greens",
    city: 'San Rafael',
    state: 'MA',
    missionStatement: 'Streamline cutting-edge architectures.',
  },
  {
    id: '996fdd92-a399-4bef-9188-b0458ecee682',
    name: 'Welch - Tremblay',
    streetAddress: '31622 Isobel Fall',
    city: 'Olathe',
    state: 'AR',
    missionStatement: 'Deploy wireless solutions.',
  },
  {
    id: 'd0d0f9b1-7bb9-4b1e-967d-3ea81de7dd59',
    name: 'Mueller, Hodkiewicz and Beahan',
    streetAddress: '21751 Elisa Village',
    city: 'Grand Prairie',
    state: 'WA',
    missionStatement: 'Facilitate bleeding-edge web-readiness.',
  },
];

const DataTableBook2 = () => {
  return (
    <DashboardCard
      // shadow="sm"
      // withBorder
      // isLoading
      addButton={{
        label: 'ExampleAdd',
      }}
      searchBar={{
        // eslint-disable-next-line no-console
        onChange: () => console.log('onChnge'),
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
            label: 'example',
            placeholder: 'example',
            searchable: true,
            clearable: true,
          },
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
            label: 'example1',
            placeholder: 'example',
          },
        ],
      }}
    >
      <MantineDataTable
        tableProps={{
          onRowClick: ({ id }) => {
            // eslint-disable-next-line no-console
            console.log(id);
          },
          highlightOnHover: true,
          shadow: 'none',
          columns: [
            { accessor: 'name', textAlignment: 'center' },
            {
              accessor: 'missionStatement',
              title: <Text>MissionStatement</Text>,
              width: 300,
              visibleMediaQuery: (theme) =>
                `(min-width: ${theme.breakpoints.md})`,
            },
            { accessor: 'streetAddress' },
            { accessor: 'city' },
            { accessor: 'state' },
            {
              accessor: 'action',
              title: 'Aksi',
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        // eslint-disable-next-line no-console
                        console.log('red', id);
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        // eslint-disable-next-line no-console
                        console.log('up');
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
          defaultColumnProps: {
            textAlignment: 'center',
            // noWrap: false,
            // ellipsis: true,
          },

          // fetching: true,
          records: tableExp,
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

export default DataTableBook2;
