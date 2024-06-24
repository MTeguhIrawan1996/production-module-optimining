import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IStockpileMonitoringState = {
  page: number;
  search: string;
  stockpileId: string | null;
  year: number | null;
  month: number | null;
  week: number | null;
};

export type IStockpileMonitoringValue = {
  stockpileMonitoringState: IStockpileMonitoringState;
};

export interface IStockpileMonitoringAction {
  setStockpileMonitoringState: (
    payload: Partial<IStockpileMonitoringState>
  ) => void;
  resetStockpileMonitoringState: () => void;
}

const initialState: IStockpileMonitoringValue = {
  stockpileMonitoringState: {
    page: 1,
    search: '',
    stockpileId: null,
    year: null,
    month: null,
    week: null,
  },
};

export const createStockpileMonitoringSlice: StateCreator<
  IStockpileMonitoringValue & IStockpileMonitoringAction
> = (set) => {
  const sliceName = 'stockpileMonitoringSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setStockpileMonitoringState: (payload) =>
      set((state) => ({
        stockpileMonitoringState: {
          ...state.stockpileMonitoringState,
          ...payload,
        },
      })),
    resetStockpileMonitoringState: () => {
      set(initialState);
    },
  };
};
