import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IStockpileMonitoringState = {
  page: number;
  search: string;
  period: string | null;
  startDate: Date | null;
  endDate: Date | null;
  stockpileId: string | null;
  year: number | null;
  month: number | null;
  week: number | null;
  filterBadgeValue: string[] | null;
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
    period: null,
    startDate: null,
    endDate: null,
    stockpileId: null,
    year: null,
    month: null,
    week: null,
    filterBadgeValue: null,
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
