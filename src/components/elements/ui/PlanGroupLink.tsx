import { Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import PaperLink from '@/components/elements/link/PaperLink';

interface IPlanGroupLinkProps {
  type: 'read' | 'update';
}

const PlanGroupLink: React.FC<IPlanGroupLinkProps> = ({ type }) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  const links = [
    {
      label: 'weeklyPlanInformation',
      href: `/plan/weekly/${type}/weekly-plan-information/${id}`,
    },
    {
      label: 'workingTimePlan',
      href: `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=workTimePlan`,
    },
    {
      label: 'unitCapacityPlan',
      href: `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=unitCapacityPlan`,
    },
    {
      label: 'heavyEquipmentReqPlan',
      href: `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=heavyEquipmentReqPlan`,
    },
    {
      label: 'heavyEquipmentAvailabilityPlan',
      href: `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=heavyEquipmentAvailabilityPlan`,
    },
    {
      label: 'productionTargetPlan',
      href: `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=productionTargetPlan`,
    },
    {
      label: 'miningMapPlan',
      href: `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=miningMapPlan`,
    },
    {
      label: 'bargingTargetPlan',
      href: `/plan/weekly/${type}/weekly-plan-group/${id}?tabs=bargingTargetPlan`,
    },
  ];
  return (
    <Stack py="xs" spacing="lg">
      {links.map((obj, i) => (
        <PaperLink
          label={t(`commonTypography.${obj.label}`)}
          href={`${obj.href}`}
          key={i}
        />
      ))}
    </Stack>
  );
};

export default PlanGroupLink;
