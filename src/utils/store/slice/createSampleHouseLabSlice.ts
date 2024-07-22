import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type ISampleHouseLabState = {
  page: number;
  search: string;
  period: string | null;
  startDate: Date | null;
  endDate: Date | null;
  year: number | null;
  month: number | null;
  week: number | null;
  sampleTypeId: string | null;
  shiftId: string | null;
  filterBadgeValue: string[] | null;
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
    period: null,
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    sampleTypeId: null,
    shiftId: null,
    filterBadgeValue: null,
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
