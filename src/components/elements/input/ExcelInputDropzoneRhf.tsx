import { Flex, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  MIME_TYPES,
  MS_EXCEL_MIME_TYPE,
} from '@mantine/dropzone';
import { IconUpload, IconX } from '@tabler/icons-react';
import { IconFileUpload } from '@tabler/icons-react';
import { IconDownload } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import PrimaryButton from '@/components/elements/button/PrimaryButton';
import MantineDataTable from '@/components/elements/dataTable/MantineDataTable';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';
import GlobalBadgeStatus from '@/components/elements/global/GlobalBadgeStatus';

import { formatDate } from '@/utils/helper/dateFormat';
import { hourFromat } from '@/utils/helper/hourFromat';

import { CommonProps } from '@/types/global';

export type IExcelInputDropzoneRhfProps = {
  control: 'excel-dropzone';
  name: string;
  label?: string;
  description?: string;
  withAsterisk?: boolean;
  faildData?: unknown[];
  usedWhere?: 'ritage' | 'heavy-equipment-prod';
} & Omit<DropzoneProps, 'name' | 'children'> &
  CommonProps;

const ExcelInputDropzoneRhf: React.FC<IExcelInputDropzoneRhfProps> = ({
  name,
  control,
  description,
  label,
  withAsterisk,
  faildData,
  usedWhere = 'ritage',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [data, setData] = React.useState<unknown[]>([]);
  const [accessor, setAccessor] = React.useState<
    DataTableColumn<{
      accessor: string;
    }>[]
  >([]);
  const ACCEPTED_MIME_TYPES = [...MS_EXCEL_MIME_TYPE, MIME_TYPES.csv];
  const theme = useMantineTheme();
  const { field, fieldState } = useController({
    name,
  });

  const convertJSONtoExcel = () => {
    if (faildData) {
      const formattedData = (faildData as any).map((item: any) => {
        if (usedWhere === 'ritage') {
          if ('tutup dome' in item) {
            return {
              ...item,
              tanggal: formatDate(item['tanggal'], 'YYYY-MM-DD'),
              'apakah ritase bermasalah': item['apakah ritase bermasalah']
                ? 'TRUE'
                : 'FALSE',
              'tutup dome': item['tutup dome'] ? 'TRUE' : 'FALSE',
            };
          }
          return {
            ...item,
            tanggal: formatDate(item['tanggal'], 'YYYY-MM-DD'),
            'apakah ritase bermasalah': item['apakah ritase bermasalah']
              ? 'TRUE'
              : 'FALSE',
          };
        }
        if (usedWhere === 'heavy-equipment-prod') {
          return { ...item };
        }
        return { ...item };
      });

      const newData = formattedData.map((item: any) => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { errors, ...rest } = item;
        return rest;
      });

      const worksheet = XLSX.utils.json_to_sheet(newData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const dataExcel = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const excelFileName = 'fail_data.xlsx';

      if (typeof window !== 'undefined') {
        // Check if browser is running in the client-side
        const excelLink = document.createElement('a');
        excelLink.href = window.URL.createObjectURL(dataExcel);
        excelLink.download = excelFileName;
        excelLink.click();
      }
    }
  };

  React.useEffect(() => {
    const currentValue = field.value as FileWithPath[];

    if (currentValue && currentValue.length > 0) {
      if (typeof window !== 'undefined') {
        const reader = new FileReader();
        reader.readAsArrayBuffer(currentValue[0]);
        reader.onload = (e) => {
          const bstr = e.target?.result;
          const workBook = XLSX.read(bstr, {
            type: 'buffer',
            cellDates: true,
            cellText: true,
          });
          const workSheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workSheetName];
          const data = XLSX.utils.sheet_to_json(workSheet, {
            raw: false,
            dateNF: 'm/d/yyyy',
          });

          const limitData = data.slice(0, 10);
          const modifiedArray = Object.keys(limitData[0] as any).map((key) => ({
            accessor: key,
          }));
          const accessor = modifiedArray.map((val) => {
            const column: DataTableColumn<(typeof modifiedArray)[number]> = {
              accessor: `${val.accessor}`,
              title: `${val.accessor.replace(/[_0-9]/g, '')}`,
              width: val.accessor === 'tanggal' ? 160 : undefined,
            };
            return column;
          });
          setData(limitData);
          setAccessor(accessor);
        };
      }
    }
  }, [field.value]);

  const renderTable: JSX.Element | undefined = React.useMemo(() => {
    const currentValue = field.value as FileWithPath[];

    if (data && data.length > 0) {
      return (
        <Stack align="center" spacing="xs">
          <Text fz={14} fw={500} color="gray.6">
            {currentValue[0].name}
          </Text>
          <MantineDataTable
            tableProps={{
              records: data as any,
              fetching: false,
              highlightOnHover: true,
              idAccessor: (record) => {
                const key = data && data.indexOf(record) + 1;
                return `${key}`;
              },
              columns: [...accessor],
              defaultColumnRender: (record, _, accesor) => {
                const data = record[accesor as keyof typeof record];
                if (accesor === 'apakah ritase bermasalah') {
                  return (
                    <GlobalBadgeStatus
                      color={data === 'TRUE' ? 'gray.6' : 'brand.6'}
                      label={
                        data === 'TRUE'
                          ? t('commonTypography.problem', { ns: 'default' })
                          : t('commonTypography.unProblem', { ns: 'default' })
                      }
                    />
                  );
                }
                if (accesor === 'apakah alat berat bermasalah') {
                  return (
                    <GlobalBadgeStatus
                      color={data === 'TRUE' ? 'gray.6' : 'brand.6'}
                      label={
                        data === 'TRUE'
                          ? t('commonTypography.problem', { ns: 'default' })
                          : t('commonTypography.unProblem', { ns: 'default' })
                      }
                    />
                  );
                }
                if (accesor === 'waktu dari asal') {
                  return hourFromat(data, 'hh:mm:ss A');
                }
                if (accesor === 'waktu sampai') {
                  return hourFromat(data, 'hh:mm:ss A');
                }
                if (accesor === 'tanggal') {
                  const date = formatDate(data);
                  return date ?? '-';
                }
                if (accesor === 'tutup dome') {
                  return (
                    <GlobalBadgeStatus
                      color={data === 'TRUE' ? 'gray.6' : 'brand.6'}
                      label={data === 'TRUE' ? 'Tutup' : 'Buka'}
                    />
                  );
                }
                return data ? data : '-';
              },
              defaultColumnProps: {
                titleStyle: {
                  textTransform: 'capitalize',
                },
              },
            }}
          />
        </Stack>
      );
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, accessor]);

  const renderFaildTable: JSX.Element | undefined = React.useMemo(() => {
    const keywordCount = {};
    const transformedAccessor = accessor.map((item) => {
      const { accessor, title, ...rest } = item;
      const keywords = ['slug jenis waktu hilang', 'jam mulai', 'jam selesai'];

      for (const keyword of keywords) {
        if (accessor.includes(keyword)) {
          const count = (keywordCount[keyword] || 0) + 1;
          keywordCount[keyword] = count;

          const newAccessor = `${keyword} ${count}`;

          return { accessor: newAccessor, title, ...rest };
        }
      }

      return { accessor, title };
    });

    if (faildData && faildData.length > 0) {
      return (
        <MantineDataTable
          tableProps={{
            records: faildData as any,
            fetching: false,
            highlightOnHover: true,
            idAccessor: (record) => {
              const key = faildData && faildData.indexOf(record) + 1;
              return `${key}`;
            },
            columns: [
              ...(usedWhere === 'heavy-equipment-prod'
                ? transformedAccessor
                : accessor),
              {
                accessor: 'errors',
                width: 300,
                title: t('commonTypography.errorDescription', {
                  ns: 'default',
                }),
                render: ({ errors }: any) => {
                  return (
                    <Stack spacing={2}>
                      {errors?.map(({ message }, i: number) => {
                        return (
                          <Text key={i} color="red">
                            {message}
                          </Text>
                        );
                      })}
                    </Stack>
                  );
                },
              },
            ],
            defaultColumnRender: (record, _, accesor) => {
              const rowData = record[accesor as keyof typeof record];
              if (accesor === 'apakah ritase bermasalah') {
                return (
                  <GlobalBadgeStatus
                    color={rowData || rowData === 'TRUE' ? 'gray.6' : 'brand.6'}
                    label={
                      rowData || rowData === 'TRUE'
                        ? t('commonTypography.problem', { ns: 'default' })
                        : t('commonTypography.unProblem', { ns: 'default' })
                    }
                  />
                );
              }
              if (accesor === 'tanggal') {
                const date = formatDate(rowData);
                return date ?? '-';
              }
              if (accesor === 'waktu dari asal') {
                return hourFromat(rowData, 'hh:mm:ss A');
              }
              if (accesor === 'waktu sampai') {
                return hourFromat(rowData, 'hh:mm:ss A');
              }
              if (accesor === 'tutup dome') {
                return (
                  <GlobalBadgeStatus
                    color={rowData === 'TRUE' || rowData ? 'gray.6' : 'brand.6'}
                    label={rowData === 'TRUE' || rowData ? 'Tutup' : 'Buka'}
                  />
                );
              }
              return rowData ? rowData : '-';
            },
            defaultColumnProps: {
              titleStyle: {
                textTransform: 'capitalize',
              },
            },
          }}
        />
      );
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faildData, accessor, usedWhere]);

  return (
    <Stack spacing={8}>
      <Stack spacing={8}>
        {label && (
          <Text component="label" fw={400} fz={16} sx={{ lineHeight: '1.55' }}>
            {t(`components.field.${label}`)}
            {withAsterisk && (
              <Text component="span" color="red" aria-hidden="true">
                {' '}
                *
              </Text>
            )}
          </Text>
        )}
        {description && (
          <Text component="span" fw={400} fz={14} color="gray.6">
            {t(`components.fieldDescription.${description}`)}
          </Text>
        )}
        <Dropzone
          accept={ACCEPTED_MIME_TYPES}
          data-control={control}
          name={name}
          sx={(theme) => ({
            border: `1px solid ${theme.colors.gray[3]}`,
            '&[data-accept]': {
              color: theme.white,
              backgroundColor: theme.colors.blue[6],
            },
          })}
          radius="xs"
          {...rest}
        >
          <Stack justify="center" align="center" mih={120}>
            <Dropzone.Accept>
              <IconUpload
                size="3.2rem"
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === 'dark' ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size="3.2rem"
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Flex direction="column" justify="center" align="center">
                <IconFileUpload
                  size="40px"
                  stroke={1.5}
                  color={theme.colors.dark[3]}
                />
              </Flex>
            </Dropzone.Idle>
          </Stack>
        </Dropzone>
        {fieldState && fieldState.error && (
          <FieldErrorMessage color="red">
            {fieldState.error.message}
          </FieldErrorMessage>
        )}
      </Stack>
      <SimpleGrid cols={1} mt="sm">
        {renderTable}
      </SimpleGrid>
      {faildData && faildData.length ? (
        <Stack spacing={4} mt="lg" align="flex-start">
          <Text fz={16} fw={400} component="span">
            List Data Gagal diupload
          </Text>
          <PrimaryButton
            label={t('commonTypography.download', { ns: 'default' })}
            leftIcon={<IconDownload size="20px" />}
            mt={3}
            onClick={() => convertJSONtoExcel()}
          />
          <SimpleGrid cols={1} mt="sm">
            {renderFaildTable}
          </SimpleGrid>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default ExcelInputDropzoneRhf;
