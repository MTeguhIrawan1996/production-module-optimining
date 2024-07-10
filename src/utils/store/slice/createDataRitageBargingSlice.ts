import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageBargingState = {
  page: number;
  search: string;
  filterBadgeValue: string[] | null;
};

export type IDataRitageBargingSliceValue = {
  dataRitageBargingState: Partial<
    IDataRitageBargingState & {
      filterDate: Date | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageBargingDumptruckState: Partial<
    IDataRitageBargingState & {
      filterDate: Date | null;
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
    filterBadgeValue: null,
  },
  dataRitageBargingDumptruckState: {
    page: 1,
    search: '',
    filterDate: null,
    filterBadgeValue: null,
  },
};

export const createDataRitageBargingSlice: StateCreator<
  IDataRitageBargingSliceValue & IDataRitageBargingSliceAction
> = (set) => {
  const sliceName = 'ritageBargingSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setDataRitageBargingState: (payload) =>
      set((state) => ({
        dataRitageBargingState: {
          ...state.dataRitageBargingState,
          ...payload.dataRitageBargingState,
        },
        dataRitageBargingDumptruckState: {
          ...state.dataRitageBargingDumptruckState,
          ...payload.dataRitageBargingDumptruckState,
        },
      })),
    resetDataRitageBargingState: () => {
      set(initialState);
    },
  };
};
