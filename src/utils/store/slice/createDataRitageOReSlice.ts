import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageOreState = {
  page: number;
  search: string;
};

export type IDataRitageOreSliceValue = {
  dataRitageOreState: Partial<
    IDataRitageOreState & {
      period: string | null;
      startDate: Date | null;
      endDate: Date | null;
      year: number | null;
      week: number | null;
      month: number | null;
      fromPitId: string | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
      filterBadgeValue: string[] | null;
    }
  >;
  dataRitageOreDumptruckState: Partial<
    IDataRitageOreState & {
      filterDate: Date | null;
      filterBadgeValue: string[] | null;
    }
  >;
};

export interface IDataRitageOreSliceAction {
  setDataRitageOreState: (payload: Partial<IDataRitageOreSliceValue>) => void;
  resetDataRitageOreState: () => void;
}

const initialState: IDataRitageOreSliceValue = {
  dataRitageOreState: {
    page: 1,
    search: '',
    period: null,
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    fromPitId: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
    filterBadgeValue: null,
  },
  dataRitageOreDumptruckState: {
    page: 1,
    search: '',
    filterDate: null,
    filterBadgeValue: null,
  },
};

export const createDataRitageOreSlice: StateCreator<
  IDataRitageOreSliceValue & IDataRitageOreSliceAction
> = (set) => {
  const sliceName = 'ritageOreSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setDataRitageOreState: (payload) =>
      set((state) => ({
        dataRitageOreState: {
          ...state.dataRitageOreState,
          ...payload.dataRitageOreState,
        },
        dataRitageOreDumptruckState: {
          ...state.dataRitageOreDumptruckState,
          ...payload.dataRitageOreDumptruckState,
        },
      })),
    resetDataRitageOreState: () => {
      set(initialState);
    },
  };
};
