import {
  Checkbox,
  CheckboxGroupProps,
  Flex,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldErrorMessage } from '@/components/elements';

import { IModuleData } from '@/services/graphql/query/module/useReadAllModule';

export type ICheckboxGroupRoleAccessProps = {
  name: string;
  handleCheckedAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dataComponents?: IModuleData[];
  fetching?: boolean;
} & Omit<CheckboxGroupProps, 'name' | 'children'>;

const CheckboxGroupRoleAccess: React.FC<ICheckboxGroupRoleAccessProps> = ({
  name,
  handleCheckedAll,
  dataComponents,
  fetching,
  ...rest
}) => {
  const { t } = useTranslation('default');
  const { field, fieldState } = useController({ name });

  if (!dataComponents && !fetching) return null;

  return (
    <Stack pos="relative">
      <Text
        fz={20}
        fw={600}
        sx={{
          visibility: fetching ? 'hidden' : 'visible',
        }}
      >
        {t('managementRole.accessSetting')}
      </Text>
      <Checkbox
        fz={14}
        fw={400}
        radius={2}
        label={t('commonTypography.chooseAll')}
        onChange={handleCheckedAll}
        sx={{
          visibility: fetching ? 'hidden' : 'visible',
        }}
      />
      <Stack spacing="xs">
        {fieldState && fieldState.error ? (
          <FieldErrorMessage color="red">
            {fieldState.error.message}
          </FieldErrorMessage>
        ) : null}
        <Checkbox.Group
          {...field}
          labelProps={{
            style: {
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 16,
            },
          }}
          {...rest}
        >
          <SimpleGrid cols={2}>
            {dataComponents?.map((val, key) => (
              <Paper withBorder shadow="xs" p="md" key={key}>
                <Text fz={16} mb={16} fw={600}>
                  {val.name}
                </Text>
                <Flex direction="column" gap="xs">
                  {val.permissions?.data.map((value, i) => (
                    <Checkbox
                      radius={2}
                      label={value.action.name}
                      key={i}
                      value={value.id}
                    />
                  ))}
                </Flex>
              </Paper>
            ))}
          </SimpleGrid>
        </Checkbox.Group>
      </Stack>
      <LoadingOverlay visible={fetching ?? false} overlayBlur={2} />
    </Stack>
  );
};

export default CheckboxGroupRoleAccess;
