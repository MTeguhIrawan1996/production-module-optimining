import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createActivityPlanSlice,
  IActivityPlanSliceAction,
  IActivityPlanSliceValue,
} from '@/utils/store/slice/createActivityPlanSlice';
import {
  createBargingMonitoringSlice,
  IBargingMonitoringAction,
  IBargingMonitoringValue,
} from '@/utils/store/slice/createBargingMonitoringSlice';
import {
  createBlockSlice,
  IBlockSliceAction,
  IBlockSliceValue,
} from '@/utils/store/slice/createBlockSlice';
import {
  createCompanySlice,
  ICompanySliceAction,
  ICompanySliceValue,
} from '@/utils/store/slice/createCompanySlice';
import {
  createElementSlice,
  IElementStateAction,
  IElementStateValue,
} from '@/utils/store/slice/createElementSlice';
import {
  createHeavyEquipmentClassSlice,
  IHeavyEquipmentClassSliceAction,
  IHeavyEquipmentClassSliceValue,
} from '@/utils/store/slice/createHeavyEquipmentClassSlice';
import {
  createHeavyEquipmentReferenceSlice,
  IHeavyEquipmentReferenceSliceAction,
  IHeavyEquipmentReferenceSliceValue,
} from '@/utils/store/slice/createHeavyEquipmentReferenceSlice';
import {
  createHeavyEquipmentSlice,
  IHeavyEquipmentSliceAction,
  IHeavyEquipmentSliceValue,
} from '@/utils/store/slice/createHeavyEquipmentSlice';
import {
  createHumanResourcesSlice,
  IHumanResourcesSliceAction,
  IHumanResourcesSliceValue,
} from '@/utils/store/slice/createHumanResourcesSlice';
import {
  createLocationSlice,
  ILocationSliceAction,
  ILocationSliceValue,
} from '@/utils/store/slice/createLocationSlice';
import {
  createSampleHouseLabSlice,
  ISampleHouseLabAction,
  ISampleHouseLabValue,
} from '@/utils/store/slice/createSampleHouseLabSlice';
import {
  createStockpileMonitoringSlice,
  IStockpileMonitoringAction,
  IStockpileMonitoringValue,
} from '@/utils/store/slice/createStockpileMonitoringSlice';
import {
  createStockpileSlice,
  IStockpileSliceAction,
  IStockpileSliceValue,
} from '@/utils/store/slice/createStockpileSlice';
import {
  createWeatherProductionSlice,
  IWeatherProductionAction,
  IWeatherProductionValue,
} from '@/utils/store/slice/createWeatherProductionSlice';
import {
  createWeeklyPlanSlice,
  IWeeklyPlanAction,
  IWeeklyPlanValue,
} from '@/utils/store/slice/createWeeklyPlanSlice';
import {
  createWHPSlice,
  IWHPSliceAction,
  IWHPSliceValue,
} from '@/utils/store/slice/createWorkingHoursPlanSlice';

import {
  createFrontSlice,
  IFrontSliceAction,
  IFrontSliceValue,
} from './slice/createFrontSlice';

type ICommonProps = ILocationSliceValue &
  ILocationSliceAction &
  IBlockSliceValue &
  IBlockSliceAction &
  IWHPSliceValue &
  IWHPSliceAction &
  IStockpileSliceValue &
  IStockpileSliceAction &
  IHeavyEquipmentClassSliceValue &
  IHeavyEquipmentClassSliceAction &
  ICompanySliceValue &
  ICompanySliceAction &
  IActivityPlanSliceValue &
  IActivityPlanSliceAction &
  IHeavyEquipmentClassSliceValue &
  IHeavyEquipmentClassSliceAction &
  IHumanResourcesSliceValue &
  IHumanResourcesSliceAction &
  IHeavyEquipmentSliceValue &
  IHeavyEquipmentSliceAction &
  IFrontSliceValue &
  IFrontSliceAction &
  IHeavyEquipmentReferenceSliceValue &
  IHeavyEquipmentReferenceSliceAction &
  IWeeklyPlanValue &
  IWeeklyPlanAction &
  IWeatherProductionValue &
  IWeatherProductionAction &
  IStockpileMonitoringValue &
  IStockpileMonitoringAction &
  ISampleHouseLabValue &
  ISampleHouseLabAction &
  IBargingMonitoringValue &
  IBargingMonitoringAction &
  IElementStateValue &
  IElementStateAction;

export type ISliceName =
  | 'locationSlice'
  | 'blockSlice'
  | 'activityPlanSlice'
  | 'bargingMonitoringSlice'
  | 'companySlice'
  | 'elementSlice'
  | 'frontSlice'
  | 'heavyEquipmentClassSlice'
  | 'heavyEquipmentReferenceSlice'
  | 'heavyEquipmentSlice'
  | 'humanResourcesSlice'
  | 'sampleHouseLabSlice'
  | 'stockpileMonitoringSlice'
  | 'stockpileSlice'
  | 'weatherProductionSlice'
  | 'weeklyPlanSlice'
  | 'workingHoursPlanSlice';

export const sliceResetFns = new Map<ISliceName, () => void>();

export const resetAllSlices = (excludedSlices: Set<ISliceName> = new Set()) => {
  sliceResetFns.forEach((resetFn, sliceName) => {
    if (!excludedSlices.has(sliceName)) {
      resetFn();
    }
  });
};

const useControlPanel = create<ICommonProps>()(
  persist(
    (...a) => ({
      _hasHydrated: false,
      ...createLocationSlice(...a),
      ...createBlockSlice(...a),
      ...createWHPSlice(...a),
      ...createStockpileSlice(...a),
      ...createHeavyEquipmentClassSlice(...a),
      ...createCompanySlice(...a),
      ...createActivityPlanSlice(...a),
      ...createHeavyEquipmentClassSlice(...a),
      ...createHumanResourcesSlice(...a),
      ...createHeavyEquipmentSlice(...a),
      ...createFrontSlice(...a),
      ...createHeavyEquipmentReferenceSlice(...a),
      ...createWeeklyPlanSlice(...a),
      ...createWeatherProductionSlice(...a),
      ...createStockpileMonitoringSlice(...a),
      ...createSampleHouseLabSlice(...a),
      ...createBargingMonitoringSlice(...a),
      ...createElementSlice(...a),
    }),
    {
      name: 'control-panel-storage',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['_hasHydrated'].includes(key)
          )
        ),
      skipHydration: true,
    }
  )
);

export default useControlPanel;
