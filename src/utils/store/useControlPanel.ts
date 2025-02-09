import { z } from 'zod';
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
  createDataRitageBargingSlice,
  IDataRitageBargingSliceAction,
  IDataRitageBargingSliceValue,
} from '@/utils/store/slice/createDataRitageBargingSlice';
import {
  createDataRitageMovingSlice,
  IDataRitageMovingSliceAction,
  IDataRitageMovingSliceValue,
} from '@/utils/store/slice/createDataRitageMovingSlice';
import {
  createDataRitageOBSlice,
  IDataRitageOBSliceAction,
  IDataRitageOBSliceValue,
} from '@/utils/store/slice/createDataRitageOBSlice';
import {
  createDataRitageOreSlice,
  IDataRitageOreSliceAction,
  IDataRitageOreSliceValue,
} from '@/utils/store/slice/createDataRitageOReSlice';
import {
  createDataRitageQuarrySlice,
  IDataRitageQuarrySliceAction,
  IDataRitageQuarrySliceValue,
} from '@/utils/store/slice/createDataRitageQuarrySlice';
import {
  createDataRitageTopsoilSlice,
  IDataRitageTopsoilSliceAction,
  IDataRitageTopsoilSliceValue,
} from '@/utils/store/slice/createDataRitageTopSoilSlice';
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
  createHeavyEquipmentProductionSlice,
  IHeavyEquipmentProductionStateAction,
  IHeavyEquipmentProductionStateValue,
} from '@/utils/store/slice/createHeavyEquipmentProductionSlice';
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
  createHydrationSlice,
  IHydrationStateAction,
  IHydrationStateValue,
} from '@/utils/store/slice/createHydrationSlice';
import {
  createLocationSlice,
  ILocationSliceAction,
  ILocationSliceValue,
} from '@/utils/store/slice/createLocationSlice';
import {
  createManagementRoleSlice,
  IManagementRoleStateAction,
  IManagementRoleStateValue,
} from '@/utils/store/slice/createManagementRoleSlice';
import {
  createMonthlyMapProductionSlice,
  IMonthlyMapProductionStateAction,
  IMonthlyMapProductionStateValue,
} from '@/utils/store/slice/createMonthlyMapProductionSlice';
import {
  createQuarterlyMapProductionSlice,
  IQuarterlyMapProductionStateAction,
  IQuarterlyMapProductionStateValue,
} from '@/utils/store/slice/createQuarterlyMapProductionSlice';
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
  createUserSlice,
  IUserStateAction,
  IUserStateValue,
} from '@/utils/store/slice/createUserSlice';
import {
  createWeatherProductionSlice,
  IWeatherProductionAction,
  IWeatherProductionValue,
} from '@/utils/store/slice/createWeatherProductionSlice';
import {
  createWeeklyMapProductionSlice,
  IWeeklyMapProductionStateAction,
  IWeeklyMapProductionStateValue,
} from '@/utils/store/slice/createWeeklyMapProductionSlice';
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
  createYearlyMapProductionSlice,
  IYearlyMapProductionStateAction,
  IYearlyMapProductionStateValue,
} from '@/utils/store/slice/createYearlyMapProductionSlice';

import {
  createFrontSlice,
  IFrontSliceAction,
  IFrontSliceValue,
} from './slice/createFrontSlice';

type ICommonProps = IHydrationStateValue &
  IHydrationStateAction &
  ILocationSliceValue &
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
  IElementStateAction &
  IDataRitageOBSliceValue &
  IDataRitageOBSliceAction &
  IDataRitageOreSliceValue &
  IDataRitageOreSliceAction &
  IDataRitageQuarrySliceValue &
  IDataRitageQuarrySliceAction &
  IDataRitageTopsoilSliceValue &
  IDataRitageTopsoilSliceAction &
  IDataRitageBargingSliceValue &
  IDataRitageBargingSliceAction &
  IDataRitageMovingSliceValue &
  IDataRitageMovingSliceAction &
  IManagementRoleStateValue &
  IManagementRoleStateAction &
  IUserStateValue &
  IUserStateAction &
  IHeavyEquipmentProductionStateValue &
  IHeavyEquipmentProductionStateAction &
  IWeeklyMapProductionStateValue &
  IWeeklyMapProductionStateAction &
  IMonthlyMapProductionStateValue &
  IMonthlyMapProductionStateAction &
  IQuarterlyMapProductionStateValue &
  IQuarterlyMapProductionStateAction &
  IYearlyMapProductionStateValue &
  IYearlyMapProductionStateAction;

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
  | 'heavyEquipmentProductionSlice'
  | 'weeklyPlanSlice'
  | 'workingHoursPlanSlice'
  | 'ritageOreSlice'
  | 'ritageOBSlice'
  | 'ritageBargingSlice'
  | 'ritageMovingSlice'
  | 'ritageQuarrySlice'
  | 'ritageTopSoilSlice'
  | 'managementRoleSlice'
  | 'userSlice'
  | 'monthlyMapProductionSlice'
  | 'weeklyMapProductionSlice'
  | 'yearlyMapProductionSlice'
  | 'quarterlyMapProductionSlice';

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
      ...createHydrationSlice(...a),
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
      ...createDataRitageOBSlice(...a),
      ...createDataRitageQuarrySlice(...a),
      ...createDataRitageTopsoilSlice(...a),
      ...createDataRitageBargingSlice(...a),
      ...createDataRitageMovingSlice(...a),
      ...createDataRitageOreSlice(...a),
      ...createManagementRoleSlice(...a),
      ...createUserSlice(...a),
      ...createHeavyEquipmentProductionSlice(...a),
      ...createWeeklyMapProductionSlice(...a),
      ...createMonthlyMapProductionSlice(...a),
      ...createQuarterlyMapProductionSlice(...a),
      ...createYearlyMapProductionSlice(...a),
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
      onRehydrateStorage: () => (state) => {
        const stateString = JSON.stringify(state);
        const newState = JSON.parse(stateString, (_, value) => {
          const isDateString = z.string().datetime().safeParse(value);
          if (isDateString.success) return new Date(isDateString.data);
          return value;
        });
        useControlPanel.setState(newState);
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useControlPanel;
