import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IQuarterlyMapProductionState = {
  page: number;
  search: string;
  mapQuarterlyCategory: string | null;
  mapQuarterlyLocation: string | null;
  year: number | null;
  quarter: number | null;
};

export type IQuarterlyMapProductionStateValue = {
  quarterlyMapProductionState: IQuarterlyMapProductionState;
};

export interface IQuarterlyMapProductionStateAction {
  setQuarterlyMapProductionState: (
    payload: Partial<IQuarterlyMapProductionState>
  ) => void;
  resetQuarterlyMapProductionState: () => void;
}

const initialState: IQuarterlyMapProductionStateValue = {
  quarterlyMapProductionState: {
    page: 1,
    search: '',
    mapQuarterlyCategory: null,
    mapQuarterlyLocation: null,
    year: null,
    quarter: null,
  },
};

export const createQuarterlyMapProductionSlice: StateCreator<
  IQuarterlyMapProductionStateValue & IQuarterlyMapProductionStateAction
> = (set) => {
  const sliceName = 'quarterlyMapProductionSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setQuarterlyMapProductionState: (payload) =>
      set((state) => ({
        quarterlyMapProductionState: {
          ...state.quarterlyMapProductionState,
          ...payload,
        },
      })),
    resetQuarterlyMapProductionState: () => {
      set(initialState);
    },
  };
};
