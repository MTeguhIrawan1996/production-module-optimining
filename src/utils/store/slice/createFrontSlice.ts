import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

export type IFrontState = {
  page: number;
  search: string;
  period: string | null;
  week: number | null;
  month: number | null;
  quarter: number | null;
  year: number | null;
  pitId: string | null;
  domeId: string | null;
  shiftId: string | null;
  materialId: string | null;
  startDate: Date | null;
  endDate: Date | null;
  filterBadgeValue: string[] | null;
};

export type IFrontSliceValue = {
  frontPitState: Partial<Omit<IFrontState, 'domeId'>>;
  frontDomeState: Partial<Omit<IFrontState, 'pitId' | 'materialId'>>;
};

export interface IFrontSliceAction {
  setFrontState: (payload: Partial<IFrontSliceValue>) => void;
  resetFrontState: () => void;
}

const initialState: IFrontSliceValue = {
  frontPitState: {
    page: 1,
    search: '',
    period: null,
    week: null,
    month: null,
    quarter: null,
    year: null,
    pitId: null,
    shiftId: null,
    materialId: null,
    startDate: null,
    endDate: null,
    filterBadgeValue: null,
  },
  frontDomeState: {
    page: 1,
    search: '',
    period: null,
    week: null,
    month: null,
    year: null,
    quarter: null,
    domeId: null,
    shiftId: null,
    startDate: null,
    endDate: null,
    filterBadgeValue: null,
  },
};

export const createFrontSlice: StateCreator<
  IFrontSliceValue & IFrontSliceAction
> = (set) => {
  const sliceName = 'frontSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setFrontState: (payload) =>
      set((state) => ({
        frontDomeState: {
          ...state.frontDomeState,
          ...payload.frontDomeState,
        },
        frontPitState: {
          ...state.frontPitState,
          ...payload.frontPitState,
        },
      })),
    resetFrontState: () => {
      set(initialState);
    },
  };
};
