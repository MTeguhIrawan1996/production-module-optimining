import {
  Checkbox,
  Divider,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard } from '@/components/elements';

import { useReadOneRole } from '@/services/graphql/query/management-role/useReadOneManagementRole';

const ReadManagementRoleBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [permissionsIds, setPermissionsIds] = React.useState<string[]>([]);

  const { roleData, roleDataLoading } = useReadOneRole({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      const allCheckboxValues: string[] = [];
      data.role.modules.data.forEach((moduleData) => {
        moduleData.permissions.data.forEach((checkbox) => {
          allCheckboxValues.push(checkbox.id);
        });
      });
      setPermissionsIds(allCheckboxValues);
    },
  });

  return (
    <DashboardCard
      withBorder
      enebleBackBottomInner={{
        onClick: () => router.push('/setting/management-role'),
      }}
      shadow="xs"
      title={t('managementRole.managementRoleTitle')}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/setting/management-role/update/${id}`),
      }}
      isLoading={roleDataLoading}
    >
      <Tabs
        defaultValue="information"
        radius={4}
        styles={{
          tabsList: {
            flexWrap: 'nowrap',
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="information" fz={14} fw={500}>
            {t('commonTypography.information')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="information">
          <Stack pt={32}>
            <Stack spacing="xs">
              <SimpleGrid cols={2}>
                <Text fz={20} fw={400} color="dark.3">
                  {t('managementRole.roleName')}
                </Text>
                <Text fz={20} fw={600} color="dark.6">
                  {roleData?.name}
                </Text>
              </SimpleGrid>
              <Divider my="xs" size="xs" />
              <SimpleGrid cols={2}>
                <Text fz={20} fw={400} color="dark.3">
                  {t('commonTypography.description')}
                </Text>
                <Text fz={20} fw={600} color="dark.6">
                  {roleData?.desc ?? '-'}
                </Text>
              </SimpleGrid>
              <Divider my="xs" size="xs" />
            </Stack>
            <Stack pos="relative">
              <Text fz={24} fw={600} color="brand">
                {t('managementRole.accessPermission')}
              </Text>
              <Stack spacing="xs">
                <Checkbox.Group value={permissionsIds}>
                  <SimpleGrid cols={2}>
                    {roleData?.modules?.data.map((val, key) => (
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
                              readOnly
                            />
                          ))}
                        </Flex>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </Checkbox.Group>
              </Stack>
            </Stack>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadManagementRoleBook;
