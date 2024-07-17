import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageTopsoilState = {
  page: number;
  search: string;
  filterBadgeValue: string[] | null;
};

export type IDataRitageTopsoilSliceValue = {
  dataRitageTopsoilState: Partial<
    IDataRitageTopsoilState & {
      period: string | null;
      startDate: Date | null;
      endDate: Date | null;
      year: number | null;
      week: number | null;
      month: number | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageTopsoilDumptruckState: Partial<
    IDataRitageTopsoilState & {
      filterDate: Date | null;
    }
  >;
};

export interface IDataRitageTopsoilSliceAction {
  setDataRitageTopsoilState: (
    payload: Partial<IDataRitageTopsoilSliceValue>
  ) => void;
  resetDataRitageTopsoilState: () => void;
}

const initialState: IDataRitageTopsoilSliceValue = {
  dataRitageTopsoilState: {
    page: 1,
    search: '',
    period: null,
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
    filterBadgeValue: null,
  },
  dataRitageTopsoilDumptruckState: {
    page: 1,
    search: '',
    filterDate: null,
    filterBadgeValue: null,
  },
};

export const createDataRitageTopsoilSlice: StateCreator<
  IDataRitageTopsoilSliceValue & IDataRitageTopsoilSliceAction
> = (set) => {
  const sliceName = 'ritageTopSoilSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setDataRitageTopsoilState: (payload) =>
      set((state) => ({
        dataRitageTopsoilState: {
          ...state.dataRitageTopsoilState,
          ...payload.dataRitageTopsoilState,
        },
        dataRitageTopsoilDumptruckState: {
          ...state.dataRitageTopsoilDumptruckState,
          ...payload.dataRitageTopsoilDumptruckState,
        },
      })),
    resetDataRitageTopsoilState: () => {
      set(initialState);
    },
  };
};
