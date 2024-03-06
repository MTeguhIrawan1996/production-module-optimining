import {
  IMaterialsGroup,
  ITargetPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyUnitcapacityPlan';

export const targetPlansDay: ITargetPlan[] = [
  {
    id: null,
    day: 0,
    rate: '',
    ton: '',
  },
  {
    id: null,
    day: 1,
    rate: '',
    ton: '',
  },
  {
    id: null,
    day: 2,
    rate: '',
    ton: '',
  },
  {
    id: null,
    day: 3,
    rate: '',
    ton: '',
  },
  {
    id: null,
    day: 4,
    rate: '',
    ton: '',
  },
  {
    id: null,
    day: 5,
    rate: '',
    ton: '',
  },
  {
    id: null,
    day: 6,
    rate: '',
    ton: '',
  },
];

export const material: IMaterialsGroup = {
  id: null,
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
