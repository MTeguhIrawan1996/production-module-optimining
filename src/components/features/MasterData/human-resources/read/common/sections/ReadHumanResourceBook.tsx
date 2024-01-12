import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalHeaderDetail,
  KeyValueList,
} from '@/components/elements';

import { useReadOneHumanResource } from '@/services/graphql/query/master-data-human-resources/useReadOneHumanResource';
import { formatDate } from '@/utils/helper/dateFormat';

const ReadHumanResourceBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { humanResourceData, humanResourceDataLoading } =
    useReadOneHumanResource({
      variables: {
        id,
      },
      skip: !router.isReady,
    });
  /* #endregion  /**======== Query =========== */

  const yourPhoto = humanResourceData?.photo
    ? [
        {
          type: 'yourPhoto',
          alt: humanResourceData?.photo?.fileName,
          fileName: humanResourceData?.photo?.originalFileName,
          src: humanResourceData?.photo?.url,
        },
      ]
    : [];

  const identityPhoto = humanResourceData?.identityPhoto
    ? [
        {
          type: 'identityPhoto',
          alt: humanResourceData?.identityPhoto?.fileName,
          fileName: humanResourceData?.identityPhoto?.originalFileName,
          src: humanResourceData?.identityPhoto?.url,
        },
      ]
    : [];

  return (
    <DashboardCard
      title={t('commonTypography.humanResources2')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/master-data/human-resources/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      enebleBackBottomOuter={{
        onClick: () => router.push('/master-data/human-resources'),
      }}
      shadow="xs"
      isLoading={humanResourceDataLoading}
      paperStackProps={{
        spacing: 'sm',
      }}
    >
      <Tabs
        defaultValue="profile"
        radius={4}
        styles={{
          tabsList: {
            flexWrap: 'nowrap',
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="profile" fz={14} fw={500}>
            {t('commonTypography.profile')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="profile">
          {!humanResourceDataLoading && humanResourceData ? (
            <>
              <GlobalHeaderDetail
                data={[...yourPhoto, ...identityPhoto]}
                title="document"
              />
              <Divider my="md" />
            </>
          ) : null}
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('humanResources.humanResourcesIdentity')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.fullName'),
                  value: humanResourceData?.name,
                },
                {
                  dataKey: t('commonTypography.aliasName'),
                  value: humanResourceData?.alias,
                },
                {
                  dataKey: t('commonTypography.country'),

                  value: humanResourceData
                    ? humanResourceData?.isWni === true
                      ? 'WNI'
                      : 'WNA'
                    : null,
                },
                {
                  dataKey: t('commonTypography.identityType'),
                  value: humanResourceData?.identityType?.name,
                },
                {
                  dataKey: t('commonTypography.identityNumber2'),
                  value: humanResourceData?.identityNumber,
                },
                {
                  dataKey: t('commonTypography.pob'),
                  value: humanResourceData?.pob,
                },
                {
                  dataKey: t('commonTypography.dob'),
                  value: formatDate(humanResourceData?.dob ?? '-'),
                },
                {
                  dataKey: t('commonTypography.gender'),
                  value: t(`commonTypography.${humanResourceData?.gender}`),
                },
                {
                  dataKey: t('commonTypography.religion'),
                  value: humanResourceData?.religion?.name,
                },
                {
                  dataKey: t('commonTypography.educationDegree'),
                  value: humanResourceData?.educationDegree,
                },
                {
                  dataKey: t('commonTypography.marriageStatus'),
                  value: humanResourceData?.marriageStatus?.name,
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.address')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.province'),
                  value: humanResourceData?.province?.name,
                },
                {
                  dataKey: t('commonTypography.regency'),
                  value: humanResourceData?.regency?.name,
                },
                {
                  dataKey: t('commonTypography.subdistrict'),

                  value: humanResourceData?.district?.name,
                },
                {
                  dataKey: t('commonTypography.village'),
                  value: humanResourceData?.village?.name,
                },
                {
                  dataKey: t('commonTypography.detailAddress'),
                  value: humanResourceData?.address,
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.domicileAddress')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.province'),
                  value: humanResourceData?.domicileProvince?.name,
                },
                {
                  dataKey: t('commonTypography.regency'),
                  value: humanResourceData?.domicileRegency?.name,
                },
                {
                  dataKey: t('commonTypography.subdistrict'),

                  value: humanResourceData?.domicileDistrict?.name,
                },
                {
                  dataKey: t('commonTypography.village'),
                  value: humanResourceData?.domicileVillage?.name,
                },
                {
                  dataKey: t('commonTypography.detailAddress'),
                  value: humanResourceData?.domicileAddress,
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.contact')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.phoneNumber'),
                  value: humanResourceData?.phoneNumber,
                },
                {
                  dataKey: t('commonTypography.email'),
                  value: humanResourceData?.email,
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.bloodType')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.bloodType'),
                  value: humanResourceData?.bloodType,
                },
                {
                  dataKey: t('commonTypography.resus'),
                  value: humanResourceData?.resus,
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadHumanResourceBook;
