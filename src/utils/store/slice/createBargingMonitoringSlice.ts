import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IBargingMonitoringState = {
  page: number;
  search: string;
  bargeHeavyEquipmentId: string | null;
  factoryCategoryId: string | null;
  year: number | null;
  month: number | null;
  week: number | null;
};

export type IBargingMonitoringValue = {
  bargingMonitoringState: IBargingMonitoringState;
};

export interface IBargingMonitoringAction {
  setBargingMonitoringState: (
    payload: Partial<IBargingMonitoringState>
  ) => void;
  resetBargingMonitoringState: () => void;
}

const initialState: IBargingMonitoringValue = {
  bargingMonitoringState: {
    page: 1,
    search: '',
    bargeHeavyEquipmentId: null,
    factoryCategoryId: null,
    year: null,
    month: null,
    week: null,
  },
};

export const createBargingMonitoringSlice: StateCreator<
  IBargingMonitoringValue & IBargingMonitoringAction
> = (set) => {
  const sliceName = 'bargingMonitoringSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setBargingMonitoringState: (payload) =>
      set((state) => ({
        bargingMonitoringState: {
          ...state.bargingMonitoringState,
          ...payload,
        },
      })),
    resetBargingMonitoringState: () => {
      set(initialState);
    },
  };
};
