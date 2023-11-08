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

// const exp = {
//   data: {
//     humanResource: {
//       id: 'ea3b476a-aa32-4a2c-8d39-69625f45876d',
//       name: 'Roni',
//       alias: 'roni',
//       isWni: true,
//       identityTypeId: '112c56a4-fce3-4a9f-b00a-dc3f67dfd770',
//       identityType: {
//         id: '112c56a4-fce3-4a9f-b00a-dc3f67dfd770',
//         name: 'KTP/KTA',
//       },
//       pob: 'bekasi',
//       dob: '2000-01-01',
//       gender: 'male',
//       religion: null,
//       educationDegree: null,
//       marriageStatus: null,
//       province: {
//         name: 'BANTEN',
//       },
//       regency: {
//         name: 'KOTA TANGERANG SELATAN',
//       },
//       district: {
//         name: 'PAMULANG',
//       },
//       village: {
//         name: 'PAMULANG BARAT',
//       },
//       address: 'test address',
//       isAddressSameWithDomicile: false,
//       domicileProvince: {
//         name: 'BANTEN',
//       },
//       domicileRegency: {
//         name: 'KOTA TANGERANG SELATAN',
//       },
//       domicileDistrict: {
//         name: 'PAMULANG',
//       },
//       domicileVillage: {
//         name: 'BENDA BARU',
//       },
//       domicileAddress: 'test domicile address',
//       phoneNumber: '0888000111222',
//       email: 'roni@email.com',
//       bloodType: 'A',
//       resus: '+',
//       photo: {
//         originalFileName:
//           '_mantine-contextmenu__next_static_media_1.637fffdd.webp',
//         url: '/uploads/169935065466454628470.webp',
//       },
//       identityPhoto: {
//         originalFileName: 'milad-fakurian-GJKx5lhwU3M-unsplash.jpg',
//         url: '/uploads/169935065507741665132.webp',
//       },
//     },
//   },
// };

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
      enebleBackBottom
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
                data={
                  humanResourceData.photo || humanResourceData.identityPhoto
                    ? [
                        {
                          type: 'yourPhoto',
                          alt: humanResourceData.photo?.fileName,
                          fileName: humanResourceData.photo?.originalFileName,
                          src: humanResourceData.photo?.url,
                        },
                        {
                          type: 'identityPhoto',
                          alt: humanResourceData.identityPhoto?.fileName,
                          fileName:
                            humanResourceData.identityPhoto?.originalFileName,
                          src: humanResourceData.identityPhoto?.url,
                        },
                      ]
                    : []
                }
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
                  dataKey: t('commonTypography.dop'),
                  value: humanResourceData?.dob,
                },
                {
                  dataKey: t('commonTypography.gender'),
                  value: humanResourceData?.gender,
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
