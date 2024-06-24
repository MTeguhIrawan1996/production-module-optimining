import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageBargingState = {
  page: number;
  search: string;
};

export type IDataRitageBargingSliceValue = {
  dataRitageBargingState: Partial<
    IDataRitageBargingState & {
      filterDate: string | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageBargingDumptruckState: Partial<
    IDataRitageBargingState & {
      filterDate: string | null;
    }
  >;
};

export interface IDataRitageBargingSliceAction {
  setDataRitageBargingState: (
    payload: Partial<IDataRitageBargingSliceValue>
  ) => void;
  resetDataRitageBargingState: () => void;
}

const initialState: IDataRitageBargingSliceValue = {
  dataRitageBargingState: {
    page: 1,
    search: '',
    filterDate: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
  },
  dataRitageBargingDumptruckState: {
    page: 1,
    search: '',
  },
};

export const createDataRitageBargingSlice: StateCreator<
  IDataRitageBargingSliceValue & IDataRitageBargingSliceAction
> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setDataRitageBargingState: (payload) =>
      set((state) => ({
        ...state,
        ...payload,
      })),
    resetDataRitageBargingState: () => {
      set(initialState);
    },
  };
};
