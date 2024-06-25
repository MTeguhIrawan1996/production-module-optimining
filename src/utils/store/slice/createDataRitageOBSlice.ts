import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageOBState = {
  page: number;
  search: string;
};

export type IDataRitageOBSliceValue = {
  dataRitageOBState: Partial<
    IDataRitageOBState & {
      filterDate: Date | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageOBDumptruckState: Partial<
    IDataRitageOBState & {
      filterDate: Date | null;
    }
  >;
};

export interface IDataRitageOBSliceAction {
  setDataRitageOBState: (payload: Partial<IDataRitageOBSliceValue>) => void;
  resetDataRitageOBState: () => void;
}

const initialState: IDataRitageOBSliceValue = {
  dataRitageOBState: {
    page: 1,
    search: '',
    filterDate: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
  },
  dataRitageOBDumptruckState: {
    page: 1,
    search: '',
  },
};

export const createDataRitageOBSlice: StateCreator<
  IDataRitageOBSliceValue & IDataRitageOBSliceAction
> = (set) => {
  const sliceName = 'ritageOBSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setDataRitageOBState: (payload) =>
      set((state) => ({
        ...state,
        ...payload,
      })),
    resetDataRitageOBState: () => {
      set(initialState);
    },
  };
};
