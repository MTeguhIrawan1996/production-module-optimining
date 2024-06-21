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
  IDataRitageMovingSliceAction;

export const sliceResetFns = new Set<() => void>();

export const resetAllSlices = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
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
      ...createDataRitageOBSlice(...a),
      ...createDataRitageQuarrySlice(...a),
      ...createDataRitageTopsoilSlice(...a),
      ...createDataRitageBargingSlice(...a),
      ...createDataRitageMovingSlice(...a),
      ...createDataRitageOreSlice(...a),
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
