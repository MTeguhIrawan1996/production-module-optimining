import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageMovingState = {
  page: number;
  search: string;
};

export type IDataRitageMovingSliceValue = {
  dataRitageMovingState: Partial<
    IDataRitageMovingState & {
      filterDate: string | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageMovingDumptruckState: Partial<
    IDataRitageMovingState & {
      filterDate: string | null;
    }
  >;
};

export interface IDataRitageMovingSliceAction {
  setDataRitageMovingState: (
    payload: Partial<IDataRitageMovingSliceValue>
  ) => void;
  resetDataRitageMovingState: () => void;
}

const initialState: IDataRitageMovingSliceValue = {
  dataRitageMovingState: {
    page: 1,
    search: '',
    filterDate: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
  },
  dataRitageMovingDumptruckState: {
    page: 1,
    search: '',
  },
};

export const createDataRitageMovingSlice: StateCreator<
  IDataRitageMovingSliceValue & IDataRitageMovingSliceAction
> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setDataRitageMovingState: (payload) =>
      set((state) => ({
        ...state,
        ...payload,
      })),
    resetDataRitageMovingState: () => {
      set(initialState);
    },
  };
};
