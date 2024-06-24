import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageQuarryState = {
  page: number;
  search: string;
};

export type IDataRitageQuarrySliceValue = {
  dataRitageQuarryState: Partial<
    IDataRitageQuarryState & {
      filterDate: string | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageQuarryDumptruckState: Partial<
    IDataRitageQuarryState & {
      filterDate: string | null;
    }
  >;
};

export interface IDataRitageQuarrySliceAction {
  setDataRitageQuarryState: (
    payload: Partial<IDataRitageQuarrySliceValue>
  ) => void;
  resetDataRitageQuarryState: () => void;
}

const initialState: IDataRitageQuarrySliceValue = {
  dataRitageQuarryState: {
    page: 1,
    search: '',
    filterDate: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
  },
  dataRitageQuarryDumptruckState: {
    page: 1,
    search: '',
  },
};

export const createDataRitageQuarrySlice: StateCreator<
  IDataRitageQuarrySliceValue & IDataRitageQuarrySliceAction
> = (set) => {
  const sliceName = 'ritageQuarrySlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setDataRitageQuarryState: (payload) =>
      set((state) => ({
        ...state,
        ...payload,
      })),
    resetDataRitageQuarryState: () => {
      set(initialState);
    },
  };
};
