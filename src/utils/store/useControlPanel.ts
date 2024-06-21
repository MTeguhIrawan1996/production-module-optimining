import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createActivityPlanSlice,
  IActivityPlanSliceAction,
  IActivityPlanSliceValue,
} from '@/utils/store/slice/createActivityPlanSlice';
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
  createHeavyEquipmentClassSlice,
  IHeavyEquipmentClassSliceAction,
  IHeavyEquipmentClassSliceValue,
} from '@/utils/store/slice/createHeavyEquipmentClassSlice';
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
  createStockpileSlice,
  IStockpileSliceAction,
  IStockpileSliceValue,
} from '@/utils/store/slice/createStockpileSlice';
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
