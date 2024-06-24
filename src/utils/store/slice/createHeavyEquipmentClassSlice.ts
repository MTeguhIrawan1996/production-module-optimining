import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IHeavyEquipmentClassState = {
  page: number;
  search: string;
};

export type IHeavyEquipmentClassSliceValue = {
  heavyEquipmentClassState: IHeavyEquipmentClassState;
};

export interface IHeavyEquipmentClassSliceAction {
  setHeavyEquipmentClassPage: (
    payload: Pick<IHeavyEquipmentClassState, 'page'>
  ) => void;
  setSearchHeavyEquipmentClass: (
    payload: Pick<IHeavyEquipmentClassState, 'search'>
  ) => void;
  resetHeavyEquipmentClassState: () => void;
}

const initialState: IHeavyEquipmentClassSliceValue = {
  heavyEquipmentClassState: {
    page: 1,
    search: '',
  },
};

export const createHeavyEquipmentClassSlice: StateCreator<
  IHeavyEquipmentClassSliceValue & IHeavyEquipmentClassSliceAction
> = (set) => {
  const sliceName = 'heavyEquipmentClassSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setSearchHeavyEquipmentClass: (payload) =>
      set((state) => ({
        heavyEquipmentClassState: {
          ...state.heavyEquipmentClassState,
          search: payload.search,
        },
      })),
    setHeavyEquipmentClassPage: (payload) =>
      set((state) => ({
        heavyEquipmentClassState: {
          ...state.heavyEquipmentClassState,
          page: payload.page,
        },
      })),
    resetHeavyEquipmentClassState: () => {
      set(initialState);
    },
  };
};
