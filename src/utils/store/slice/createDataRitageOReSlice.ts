import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IDataRitageOreState = {
  page: number;
  search: string;
};

export type IDataRitageOreSliceValue = {
  dataRitageOreState: Partial<
    IDataRitageOreState & {
      filterDate: Date | null;
      filterStatus: string | null;
      filterShift: string | null;
      filtercompanyHeavyEquipmentId: string | null;
    }
  >;
  dataRitageOreDumptruckState: Partial<
    IDataRitageOreState & {
      filterDate: Date | null;
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
    filterDate: null,
    filterStatus: null,
    filterShift: null,
    filtercompanyHeavyEquipmentId: null,
  },
  dataRitageOreDumptruckState: {
    page: 1,
    search: '',
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
        ...state,
        ...payload,
      })),
    resetDataRitageOreState: () => {
      set(initialState);
    },
  };
};
