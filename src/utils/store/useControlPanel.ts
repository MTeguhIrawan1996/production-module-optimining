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
  createHeavyEquipmentClassSlice,
  IHeavyEquipmentClassSliceAction,
  IHeavyEquipmentClassSliceValue,
} from '@/utils/store/slice/createHeavyEquipmentClassSlice';
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

type ICommonProps = ILocationSliceValue &
  ILocationSliceAction &
  IBlockSliceValue &
  IBlockSliceAction &
  IWHPSliceValue &
  IWHPSliceAction &
  IStockpileSliceValue &
  IStockpileSliceAction &
  IActivityPlanSliceValue &
  IActivityPlanSliceAction &
  IHeavyEquipmentClassSliceValue &
  IHeavyEquipmentClassSliceAction &
  IHumanResourcesSliceValue &
  IHumanResourcesSliceAction;

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
      ...createActivityPlanSlice(...a),
      ...createHeavyEquipmentClassSlice(...a),
      ...createHumanResourcesSlice(...a),
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
