import { Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import PaperLink from '@/components/elements/link/PaperLink';

interface IPlanGroupLinkProps {
  type: 'read' | 'update';
  planType?: 'weekly' | 'monthly';
}

const PlanGroupLink: React.FC<IPlanGroupLinkProps> = ({
  type,
  planType = 'weekly',
}) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  const links = [
    {
      label: 'weeklyPlanInformation',
      href: `/plan/${planType}/${type}/${planType}-plan-information/${id}`,
    },
    {
      label: 'workingTimePlan',
      href: `/plan/${planType}/${type}/${planType}-plan-group/${id}?tabs=workTimePlan`,
    },
    {
      label: 'unitCapacityPlan',
      href: `/plan/${planType}/${type}/${planType}-plan-group/${id}?tabs=unitCapacityPlan`,
    },
    {
      label: 'heavyEquipmentReqPlan',
      href: `/plan/${planType}/${type}/${planType}-plan-group/${id}?tabs=heavyEquipmentReqPlan`,
    },
    {
      label: 'heavyEquipmentAvailabilityPlan',
      href: `/plan/${planType}/${type}/${planType}-plan-group/${id}?tabs=heavyEquipmentAvailabilityPlan`,
    },
    {
      label: 'productionTargetPlan',
      href: `/plan/${planType}/${type}/${planType}-plan-group/${id}?tabs=productionTargetPlan`,
    },
    {
      label: 'miningMapPlan',
      href: `/plan/${planType}/${type}/${planType}-plan-group/${id}?tabs=miningMapPlan`,
    },
    {
      label: 'bargingTargetPlan',
      href: `/plan/${planType}/${type}/${planType}-plan-group/${id}?tabs=bargingTargetPlan`,
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
