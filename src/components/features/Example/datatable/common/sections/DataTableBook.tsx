import { TextInput, Tooltip } from '@mantine/core';
import * as React from 'react';

import { DashboardCard, MantineDataTable } from '@/components/elements';

const tableExp = [
  {
    id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
    name: 'Sipes Inc',
    amount: 1,
    unit: 'Jam/Hari',
  },
  {
    id: '3c147f0b-c63f-4830-8ced-f378aad9efc6',
    name: 'Runolfsdottir - Cummerata',
    amount: 2,
    unit: 'Jam',
  },
  {
    id: '331992e8-7144-49c4-a8fd-fae9a6921b13',
    name: 'Johnston LLC',
    amount: 3,
    unit: 'Jam',
  },
  {
    id: 'eb089974-a0ed-4ec2-84a3-4d7bd3935b63',
    name: 'Crist and Sons',
    amount: 4,
    unit: 'Jam',
  },
  {
    id: 'fc257801-7b32-41ca-a31b-57ae6739415b',
    name: 'Schmidt and Sons',
    amount: 5,
    unit: 'Jam',
  },
  {
    id: 'c942ac73-2c51-4bf1-b4a7-04419acf58c0',
    name: 'Nicolas Group',
    amount: 6,
    unit: 'Jam',
  },
  {
    id: 'ad36f2d0-b186-4f1e-9a04-57e59715dc8f',
    name: 'Kub and Sons',
    amount: 7,
    unit: 'Jam',
  },
];

const DataTableBook = () => {
  return (
    <DashboardCard
      title="Sumber Daya Manusia"
      enebleBack
      shadow="sm"
      withBorder
      // isLoading
    >
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          withColumnBorders: true,
          groups: [
            {
              id: 'no',
              title: 'No',
              style: { textAlign: 'center' },
              columns: [
                {
                  accessor: 'index',
                  title: '',
                  render: (record) => {
                    return tableExp && tableExp.indexOf(record) + 1;
                  },
                  width: 60,
                },
              ],
            },
            {
              id: 'activity',
              title: 'Kegiatan',
              style: { textAlign: 'center' },
              columns: [{ accessor: 'name', title: '' }],
            },
            {
              id: 'day',
              title: 'Tanggal',
              style: { textAlign: 'center' },
              columns: [
                {
                  accessor: 'minggu',
                  width: 100,
                  render: ({ id, name }, index) => {
                    if (id === '331992e8-7144-49c4-a8fd-fae9a6921b13') {
                      return <div className="">Sistem</div>;
                    }
                    return (
                      <Tooltip
                        label={`${index}+${name}`}
                        hidden={false}
                        color="red"
                        position="right"
                      >
                        <TextInput
                          // error="foo"
                          width={50}
                          radius={8}
                        />
                      </Tooltip>
                    );
                  },
                },
                {
                  accessor: 'senin',
                  width: 100,
                  render: ({ name, id }, index) => {
                    if (id === '331992e8-7144-49c4-a8fd-fae9a6921b13') {
                      return <div className="">Sistem</div>;
                    }
                    return (
                      <Tooltip
                        label={`${index}+${name}`}
                        hidden={false}
                        color="red"
                        position="right"
                      >
                        <TextInput
                          // error="foo"
                          width={50}
                          radius={8}
                        />
                      </Tooltip>
                    );
                  },
                },
                {
                  accessor: 'selasa',
                  width: 100,
                  render: ({ id, name }, index) => {
                    if (id === '331992e8-7144-49c4-a8fd-fae9a6921b13') {
                      return <div className="">Sistem</div>;
                    }
                    return (
                      <Tooltip
                        label={`${index}+${name}`}
                        hidden={false}
                        color="red"
                        position="right"
                      >
                        <TextInput
                          // error="foo"
                          width={50}
                          radius={8}
                        />
                      </Tooltip>
                    );
                  },
                },
              ],
            },
            {
              id: 'amount',
              title: 'Total',
              style: { textAlign: 'center' },
              columns: [{ accessor: 'amount', title: '', width: 100 }],
            },
            {
              id: 'unit',
              title: 'Unit',
              style: { textAlign: 'center' },
              columns: [{ accessor: 'unit', title: '', width: 100 }],
            },
          ],
          rowExpansion: {
            allowMultiple: true,
            expanded: {
              recordIds: ['331992e8-7144-49c4-a8fd-fae9a6921b13'],
            },
            content: () => (
              <MantineDataTable
                tableProps={{
                  noHeader: true,
                  shadow: '0',
                  withBorder: false,
                  minHeight: 0,
                  borderRadius: 0,
                  groups: [
                    {
                      id: 'no',
                      title: 'No',
                      style: { textAlign: 'center' },
                      columns: [
                        {
                          accessor: 'index',
                          title: '',
                          render: () => null,
                          width: 60,
                        },
                      ],
                    },
                    {
                      id: 'activity',
                      title: 'Kegiatan',
                      style: { textAlign: 'center' },
                      columns: [{ accessor: 'name', title: '' }],
                    },
                    {
                      id: 'day',
                      title: 'Tanggal',
                      style: { textAlign: 'center' },
                      columns: [
                        {
                          accessor: 'minggu',
                          width: 100,
                          render: ({ name }, index) => {
                            return (
                              <Tooltip
                                label={`${index}+${name}`}
                                hidden={false}
                                color="red"
                                position="right"
                              >
                                <TextInput
                                  // error="foo"
                                  width={50}
                                  radius={8}
                                />
                              </Tooltip>
                            );
                          },
                        },
                        {
                          accessor: 'senin',
                          width: 100,
                          render: ({ name }, index) => {
                            return (
                              <Tooltip
                                label={`${index}+${name}`}
                                hidden={false}
                                color="red"
                                position="right"
                              >
                                <TextInput error={true} width={50} radius={8} />
                              </Tooltip>
                            );
                          },
                        },
                        {
                          accessor: 'selasa',
                          width: 100,
                          render: ({ name }, index) => {
                            return (
                              <Tooltip
                                label={`${index}+${name}`}
                                hidden={false}
                                color="red"
                                position="right"
                              >
                                <TextInput
                                  // error="foo"
                                  width={50}
                                  radius={8}
                                />
                              </Tooltip>
                            );
                          },
                        },
                      ],
                    },
                    {
                      id: 'amount',
                      title: 'Total',
                      style: { textAlign: 'center' },
                      columns: [{ accessor: 'amount', title: '', width: 100 }],
                    },
                    {
                      id: 'unit',
                      title: 'Unit',
                      style: { textAlign: 'center' },
                      columns: [{ accessor: 'unit', title: '', width: 100 }],
                    },
                  ],
                  records: tableExp,
                }}
              />
            ),
          },
          // fetching: true,
          records: tableExp,
        }}
      />
    </DashboardCard>
  );
};

export default DataTableBook;
