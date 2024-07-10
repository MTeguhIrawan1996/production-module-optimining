import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageMovingState = {
  page: number;
  search: string;
  filterBadgeValue: string[] | null;
};

export type IDataRitageMovingSliceValue = {
  dataRitageMovingState: Partial<
    IDataRitageMovingState & {
      filterDate: Date | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageMovingDumptruckState: Partial<
    IDataRitageMovingState & {
      filterDate: Date | null;
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
    filterBadgeValue: null,
  },
  dataRitageMovingDumptruckState: {
    page: 1,
    search: '',
    filterDate: null,
    filterBadgeValue: null,
  },
};

export const createDataRitageMovingSlice: StateCreator<
  IDataRitageMovingSliceValue & IDataRitageMovingSliceAction
> = (set) => {
  const sliceName = 'ritageMovingSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setDataRitageMovingState: (payload) =>
      set((state) => ({
        dataRitageMovingState: {
          ...state.dataRitageMovingState,
          ...payload.dataRitageMovingState,
        },
        dataRitageMovingDumptruckState: {
          ...state.dataRitageMovingDumptruckState,
          ...payload.dataRitageMovingDumptruckState,
        },
      })),
    resetDataRitageMovingState: () => {
      set(initialState);
    },
  };
};
