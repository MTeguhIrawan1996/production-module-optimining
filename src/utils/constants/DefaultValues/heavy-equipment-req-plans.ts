import {
  IMutationHeavyEquipmentReqPlanActivity,
  IMutationWeeklyHeavyEquipmentRequirement,
} from '@/services/graphql/mutation/plan/weekly/useCreateHeavyEquipmentReqPlan';

export const weeklyHeavyEquipmentRequirement: IMutationWeeklyHeavyEquipmentRequirement[] =
  [
    {
      id: null,
      day: 0,
      value: '',
    },
    {
      id: null,
      day: 1,
      value: '',
    },
    {
      id: null,
      day: 2,
      value: '',
    },
    {
      id: null,
      day: 3,
      value: '',
    },
    {
      id: null,
      day: 4,
      value: '',
    },
    {
      id: null,
      day: 5,
      value: '',
    },
    {
      id: null,
      day: 6,
      value: '',
    },
  ];

export const activities: IMutationHeavyEquipmentReqPlanActivity[] = [
  {
    id: null,
    activityId: '',
    classId: '',
    weeklyHeavyEquipmentRequirements: weeklyHeavyEquipmentRequirement,
  },
];
