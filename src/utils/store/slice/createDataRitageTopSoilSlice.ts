import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageTopsoilState = {
  page: number;
  search: string;
};

export type IDataRitageTopsoilSliceValue = {
  dataRitageTopsoilState: Partial<
    IDataRitageTopsoilState & {
      filterDate: Date | null;
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
    filterDate: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
  },
  dataRitageTopsoilDumptruckState: {
    page: 1,
    search: '',
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
