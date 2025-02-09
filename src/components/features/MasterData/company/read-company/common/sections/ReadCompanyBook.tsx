import { Box, createStyles, Divider, Flex } from '@mantine/core';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import * as React from 'react';

import {
  DashboardCard,
  KeyValueList,
  NextImageFill,
} from '@/components/elements';

import { useReadOneCompany } from '@/services/graphql/query/master-data-company/useReadOneCompany';
import { formatDate } from '@/utils/helper/dateFormat';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const useStyles = createStyles(() => ({
  image: {
    objectFit: 'contain',
    backgroundPosition: 'center',
  },
}));

const ReadCompanyBook = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;
  const isPermissionUpdate = permissions?.includes('update-company');

  const { companyData, companyDataLoading } = useReadOneCompany({
    variables: {
      id: id,
    },
    skip: !router.isReady,
  });
  return (
    <DashboardCard
      pb={0}
      paperStackProps={{ spacing: 0 }}
      childrenStackProps={{ spacing: 0 }}
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () => {
                router.push(`/master-data/company/update/${id}`);
              },
            }
          : undefined
      }
      isLoading={companyDataLoading}
    >
      <Divider my="md" />
      <Flex gap="xs">
        <Box sx={{ flex: 1.3 }}>
          <KeyValueList
            data={[
              {
                dataKey: t('commonTypography.companyName'),
                value: companyData?.name,
              },
              {
                dataKey: t('company.companyAlias'),
                value: companyData?.alias,
              },
              {
                dataKey: t('commonTypography.nib2'),
                value: companyData?.nib,
              },
              {
                dataKey: t('commonTypography.phoneNumber'),
                value: companyData?.phoneNumber1,
              },
              {
                dataKey: t('commonTypography.email'),
                value: companyData?.email1,
              },
              {
                dataKey: t('commonTypography.address'),
                value: companyData?.address,
              },
              {
                dataKey: t('commonTypography.companyPermissionType'),
                value: companyData?.permissionType?.name,
              },
              {
                dataKey: `${t('commonTypography.number')} ${
                  companyData?.permissionType?.name ?? ''
                }`,
                value: companyData?.permissionTypeNumber,
              },
              {
                dataKey: `${t('commonTypography.date')} ${
                  companyData?.permissionType?.name ?? ''
                }`,
                value: formatDate(companyData?.permissionTypeDate) ?? '-',
              },
            ]}
            type="grid"
            keySpan={5}
            valueSpan={7}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          {companyData && companyData.logo ? (
            <NextImageFill
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${companyData.logo.url}`}
              alt={companyData.logo.originalFileName}
              figureProps={{
                h: 280,
                w: 280,
                radius: 'xs',
              }}
              imageClassName={classes.image}
            />
          ) : null}
        </Box>
      </Flex>
      <Divider my="lg" />
      <Flex gap="xs">
        <Box sx={{ flex: 1.3 }}>
          <KeyValueList
            data={[
              {
                dataKey: t('commonTypography.directorName'),
                value: companyData?.presidentDirector?.humanResource?.name,
              },
              {
                dataKey: t('commonTypography.identityNumber'),
                value:
                  companyData?.presidentDirector?.humanResource?.identityNumber,
              },
              {
                dataKey: t('commonTypography.nip'),
                value: companyData?.presidentDirector?.nip,
              },
              {
                dataKey: t('commonTypography.dateOfOffice'),
                value:
                  formatDate(companyData?.presidentDirector?.startDate) ?? '-',
              },
            ]}
            type="grid"
            keySpan={5}
            valueSpan={7}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          {companyData &&
          companyData.presidentDirector?.humanResource?.photo ? (
            <NextImageFill
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${companyData.presidentDirector.humanResource.photo.url}`}
              alt={
                companyData.presidentDirector.humanResource?.photo
                  ?.originalFileName ?? ''
              }
              figureProps={{
                h: 280,
                w: 280,
                radius: 'xs',
              }}
            />
          ) : null}
        </Box>
      </Flex>
      <Divider my="md" />
    </DashboardCard>
  );
};

export default ReadCompanyBook;
