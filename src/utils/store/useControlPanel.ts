import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createBlockSlice,
  IBlockSliceAction,
  IBlockSliceValue,
} from '@/utils/store/slice/createBlockSlice';
import {
  createLocationSlice,
  ILocationSliceAction,
  ILocationSliceValue,
} from '@/utils/store/slice/createLocationSlice';

type ICommonProps = ILocationSliceValue &
  ILocationSliceAction &
  IBlockSliceValue &
  IBlockSliceAction;

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
