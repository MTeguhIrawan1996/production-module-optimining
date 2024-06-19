import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IStockpileState = {
  page: number;
  search: string;
};

export type IStockpileSliceValue = {
  stockpileState: IStockpileState;
  stockpileDomeState: IStockpileState;
};

export interface IStockpileSliceAction {
  setStockpilePage: (payload: Pick<IStockpileState, 'page'>) => void;
  setSearchStockpile: (payload: Pick<IStockpileState, 'search'>) => void;
  setSearchDome: (payload: Pick<IStockpileState, 'search'>) => void;
  setStockpilePageDome: (payload: Pick<IStockpileState, 'page'>) => void;
  resetStockpile: () => void;
  resetStockpileDome: () => void;
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
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setSearchStockpile: (payload) =>
      set((state) => ({
        ...state,
        stockpileState: {
          ...state.stockpileState,
          search: payload.search,
        },
      })),
    setStockpilePage: (payload) =>
      set((state) => ({
        ...state,
        stockpileState: {
          ...state.stockpileState,
          page: payload.page,
        },
      })),
    setSearchDome: (payload) =>
      set((state) => ({
        ...state,
        stockpileDomeState: {
          ...state.stockpileDomeState,
          search: payload.search,
        },
      })),
    setStockpilePageDome: (payload) =>
      set((state) => ({
        ...state,
        stockpileDomeState: {
          ...state.stockpileDomeState,
          page: payload.page,
        },
      })),
    resetStockpile: () =>
      set((state) => ({
        ...state,
        stockpileDomeState: initialState.stockpileState,
      })),
    resetStockpileDome: () =>
      set((state) => ({
        ...state,
        stockpileDomeState: initialState.stockpileDomeState,
      })),
  };
};
