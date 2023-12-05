import { Flex, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  MS_EXCEL_MIME_TYPE,
} from '@mantine/dropzone';
import { IconUpload, IconX } from '@tabler/icons-react';
import { IconFileUpload } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import MantineDataTable from '@/components/elements/dataTable/MantineDataTable';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';
import GlobalBadgeStatus from '@/components/elements/global/GlobalBadgeStatus';

import { CommonProps } from '@/types/global';

export type IExcelInputDropzoneRhfProps = {
  control: 'excel-dropzone';
  name: string;
  label?: string;
  description?: string;
  withAsterisk?: boolean;
} & Omit<DropzoneProps, 'name' | 'children'> &
  CommonProps;

const ExcelInputDropzoneRhf: React.FC<IExcelInputDropzoneRhfProps> = ({
  name,
  control,
  description,
  label,
  withAsterisk,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [data, setData] = React.useState<unknown[]>([]);
  const [accessor, setAccessor] = React.useState<
    DataTableColumn<{
      accessor: string;
    }>[]
  >([]);
  const ACCEPTED_MIME_TYPES = [...MS_EXCEL_MIME_TYPE];
  const theme = useMantineTheme();
  const { field, fieldState } = useController({
    name,
  });

  React.useEffect(() => {
    const currentValue = field.value as FileWithPath[];
    if (currentValue && currentValue.length > 0) {
      if (typeof window !== 'undefined') {
        const reader = new FileReader();
        reader.readAsArrayBuffer(currentValue[0]);
        reader.onload = (e) => {
          const bstr = e.target?.result;
          const workBook = XLSX.read(bstr, { type: 'buffer' });
          const workSheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workSheetName];
          const data = XLSX.utils.sheet_to_json(workSheet);
          const limitData = data.slice(0, 5);
          const modifiedArray = Object.keys(limitData[0] as any).map((key) => ({
            accessor: key,
          }));
          const accessor = modifiedArray.map((val) => {
            const column: DataTableColumn<(typeof modifiedArray)[number]> = {
              accessor: `${val.accessor}`,
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
    if (data && data.length > 0) {
      return (
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
              if (accesor === 'is_ritage_problematic') {
                return (
                  <GlobalBadgeStatus
                    color={data ? 'gray.6' : 'brand.6'}
                    label={
                      data
                        ? t('commonTypography.unComplete', { ns: 'default' })
                        : t('commonTypography.complete', { ns: 'default' })
                    }
                  />
                );
              }
              if (accesor === 'close_dome') {
                return (
                  <GlobalBadgeStatus
                    color={data ? 'gray.6' : 'brand.6'}
                    label={data ? 'true' : 'false'}
                  />
                );
              }
              return data ? data : '-';
            },
          }}
        />
      );
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, accessor]);

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
    </Stack>
  );
};

export default ExcelInputDropzoneRhf;
