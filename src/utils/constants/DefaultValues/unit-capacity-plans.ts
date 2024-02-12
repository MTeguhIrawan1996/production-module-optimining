import {
  IMaterialsGroup,
  ITargetPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyUnitcapacityPlan';

export const targetPlansDay: ITargetPlan[] = [
  {
    id: '',
    day: 0,
    rate: '',
    ton: '',
  },
  {
    id: '',
    day: 1,
    rate: '',
    ton: '',
  },
  {
    id: '',
    day: 2,
    rate: '',
    ton: '',
  },
  {
    id: '',
    day: 3,
    rate: '',
    ton: '',
  },
  {
    id: '',
    day: 4,
    rate: '',
    ton: '',
  },
  {
    id: '',
    day: 5,
    rate: '',
    ton: '',
  },
  {
    id: '',
    day: 6,
    rate: '',
    ton: '',
  },
];

export const material: IMaterialsGroup = {
  id: '',
  materialId: '',
  fleet: '',
  classId: '',
  frontId: '',
  physicalAvailability: '',
  useOfAvailability: '',
  effectiveWorkingHour: '',
  distance: '',
  dumpTruckCount: '',
  targetPlans: targetPlansDay,
};
