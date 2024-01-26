import { Stack } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, PaperLink } from '@/components/elements';

const detailWeeklyPlanLink = [
  {
    label: 'weeklyPlanInformation',
    href: '/',
  },
  {
    label: 'workingTimePlan',
    href: '/',
  },
  {
    label: 'unitCapacityPlan',
    href: '/',
  },
  {
    label: 'heavyEquipmentRequirementsPlan',
    href: '/',
  },
  {
    label: 'heavyEquipmentAvailabilityPlan',
    href: '/',
  },
  {
    label: 'heavyEquipmentAvailabilityPlan',
    href: '/',
  },
  {
    label: 'productionTargetPlan',
    href: '/',
  },
  {
    label: 'miningPlanMap',
    href: '/',
  },
  {
    label: 'bargingPlan',
    href: '/',
  },
];

const ReadWeeklyPlanBook = () => {
  const { t } = useTranslation('default');

  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <Stack py="xs" spacing="lg">
        {detailWeeklyPlanLink.map((obj, i) => (
          <PaperLink
            label={t(`commonTypography.${obj.label}`)}
            href={obj.href}
            key={i}
          />
        ))}
      </Stack>
    </DashboardCard>
  );
};

export default ReadWeeklyPlanBook;
