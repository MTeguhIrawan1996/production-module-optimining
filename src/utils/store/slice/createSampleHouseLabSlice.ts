import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type ISampleHouseLabState = {
  page: number;
  search: string;
};

export type ISampleHouseLabValue = {
  sampleHouseLabState: ISampleHouseLabState;
};

export interface ISampleHouseLabAction {
  setSampleHouseLabState: (payload: Partial<ISampleHouseLabState>) => void;
  resetSampleHouseLabState: () => void;
}

const initialState: ISampleHouseLabValue = {
  sampleHouseLabState: {
    page: 1,
    search: '',
  },
};

export const createSampleHouseLabSlice: StateCreator<
  ISampleHouseLabValue & ISampleHouseLabAction
> = (set) => {
  const sliceName = 'sampleHouseLabSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setSampleHouseLabState: (payload) =>
      set((state) => ({
        sampleHouseLabState: {
          ...state.sampleHouseLabState,
          ...payload,
        },
      })),
    resetSampleHouseLabState: () => {
      set(initialState);
    },
  };
};
