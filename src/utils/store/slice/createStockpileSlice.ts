import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IStockpileState = {
  page: number;
  search: string;
};

export type IStockpileSliceValue = {
  stockpileState: Partial<IStockpileState>;
  stockpileDomeState: Partial<IStockpileState>;
};

export interface IStockpileSliceAction {
  setStockpileState: (payload: Partial<IStockpileSliceValue>) => void;
  resetStockpileState: () => void;
}

const initialState: IStockpileSliceValue = {
  stockpileState: {
    page: 1,
    search: '',
  },
  stockpileDomeState: {
    page: 1,
    search: '',
  },
};

export const createStockpileSlice: StateCreator<
  IStockpileSliceValue & IStockpileSliceAction
> = (set) => {
  const sliceName = 'stockpileSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setStockpileState: (payload) =>
      set((state) => ({
        stockpileState: {
          ...state.stockpileState,
          ...payload.stockpileState,
        },
        stockpileDomeState: {
          ...state.stockpileDomeState,
          ...payload.stockpileDomeState,
        },
      })),
    resetStockpileState: () => {
      set(initialState);
    },
  };
};
