import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageTopsoilState = {
  page: number;
  search: string;
};

export type IDataRitageTopsoilSliceValue = {
  dataRitageTopsoilState: Partial<
    IDataRitageTopsoilState & {
      filterDate: string | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageTopsoilDumptruckState: Partial<
    IDataRitageTopsoilState & {
      filterDate: string | null;
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
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setDataRitageTopsoilState: (payload) =>
      set((state) => ({
        ...state,
        ...payload,
      })),
    resetDataRitageTopsoilState: () => {
      set(initialState);
    },
  };
};
