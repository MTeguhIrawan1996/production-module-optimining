import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  createHeavyEquipmentClassSlice,
  IHeavyEquipmentClassSliceAction,
  IHeavyEquipmentClassSliceValue,
} from '@/utils/store/slice/createHeavyEquipmentClassSlice';
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
  IHeavyEquipmentClassSliceValue &
  IHeavyEquipmentClassSliceAction &
  ICompanySliceValue &
  ICompanySliceAction;

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
