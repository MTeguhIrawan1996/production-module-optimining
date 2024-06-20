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
  setHeavyEquipmentClassSearch: (
    payload: Pick<IHeavyEquipmentClassState, 'search'>
  ) => void;
  resetHeavyEquipmentClass: () => void;
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
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setHeavyEquipmentClassSearch: (payload) =>
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
    resetHeavyEquipmentClass: () => {
      set(initialState);
    },
  };
};
