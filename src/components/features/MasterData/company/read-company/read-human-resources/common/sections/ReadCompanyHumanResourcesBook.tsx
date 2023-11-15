import { Divider, Stack, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalHeaderDetail, KeyValueList } from '@/components/elements';

import { IHumanResourceData } from '@/services/graphql/query/master-data-human-resources/useReadOneHumanResource';
import { dateFromat } from '@/utils/helper/dateFormat';

interface IProps {
  humanResource?: IHumanResourceData;
  isLoading?: boolean;
}

const ReadCompanyHumanResourceBook: React.FC<IProps> = ({
  humanResource,
  isLoading,
}) => {
  const { t } = useTranslation('default');

  return (
    <>
      {!isLoading && humanResource ? (
        <>
          <GlobalHeaderDetail
            data={
              humanResource.photo || humanResource.identityPhoto
                ? [
                    {
                      type: 'identityPhoto',
                      alt: humanResource.identityPhoto?.fileName,
                      fileName: humanResource.identityPhoto?.originalFileName,
                      src: humanResource.identityPhoto?.url,
                    },
                    {
                      type: 'yourPhoto',
                      alt: humanResource.photo?.fileName,
                      fileName: humanResource.photo?.originalFileName,
                      src: humanResource.photo?.url,
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
              value: humanResource?.name,
            },
            {
              dataKey: t('commonTypography.aliasName'),
              value: humanResource?.alias,
            },
            {
              dataKey: t('commonTypography.country'),

              value: humanResource
                ? humanResource?.isWni === true
                  ? 'WNI'
                  : 'WNA'
                : null,
            },
            {
              dataKey: t('commonTypography.identityType'),
              value: humanResource?.identityType?.name,
            },
            {
              dataKey: t('commonTypography.identityNumber2'),
              value: humanResource?.identityNumber,
            },
            {
              dataKey: t('commonTypography.pob'),
              value: humanResource?.pob,
            },
            {
              dataKey: t('commonTypography.dob'),
              value: dateFromat(humanResource?.dob ?? ''),
            },
            {
              dataKey: t('commonTypography.gender'),
              value: t(`commonTypography.${humanResource?.gender}`),
            },
            {
              dataKey: t('commonTypography.religion'),
              value: humanResource?.religion?.name,
            },
            {
              dataKey: t('commonTypography.educationDegree'),
              value: humanResource?.educationDegree,
            },
            {
              dataKey: t('commonTypography.marriageStatus'),
              value: humanResource?.marriageStatus?.name,
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
              value: humanResource?.province?.name,
            },
            {
              dataKey: t('commonTypography.regency'),
              value: humanResource?.regency?.name,
            },
            {
              dataKey: t('commonTypography.subdistrict'),

              value: humanResource?.district?.name,
            },
            {
              dataKey: t('commonTypography.village'),
              value: humanResource?.village?.name,
            },
            {
              dataKey: t('commonTypography.detailAddress'),
              value: humanResource?.address,
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
              value: humanResource?.domicileProvince?.name,
            },
            {
              dataKey: t('commonTypography.regency'),
              value: humanResource?.domicileRegency?.name,
            },
            {
              dataKey: t('commonTypography.subdistrict'),

              value: humanResource?.domicileDistrict?.name,
            },
            {
              dataKey: t('commonTypography.village'),
              value: humanResource?.domicileVillage?.name,
            },
            {
              dataKey: t('commonTypography.detailAddress'),
              value: humanResource?.domicileAddress,
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
              value: humanResource?.phoneNumber,
            },
            {
              dataKey: t('commonTypography.email'),
              value: humanResource?.email,
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
              value: humanResource?.bloodType,
            },
            {
              dataKey: t('commonTypography.resus'),
              value: humanResource?.resus,
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
    </>
  );
};

export default ReadCompanyHumanResourceBook;
