import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IHeavyEquipmentState = {
  page: number | null;
  search: string | null;
  filterBrandId: string | null;
  filterTypeId: string | null;
  filterClassId: string | null;
  filterModelId: string | null;
  filterBadgeValue: string[] | null;
};

export type IHeavyEquipmentSliceValue = {
  heavyEquipmentState: IHeavyEquipmentState;
};

export interface IHeavyEquipmentSliceAction {
  setHeavyEquipmentState: (payload: Partial<IHeavyEquipmentState>) => void;
  resetHeavyEquipmentState: () => void;
}

const initialState: IHeavyEquipmentSliceValue = {
  heavyEquipmentState: {
    page: 1,
    search: '',
    filterBrandId: null,
    filterTypeId: null,
    filterClassId: null,
    filterModelId: null,
    filterBadgeValue: null,
  },
};

export const createHeavyEquipmentSlice: StateCreator<
  IHeavyEquipmentSliceValue & IHeavyEquipmentSliceAction
> = (set) => {
  const sliceName = 'heavyEquipmentSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setHeavyEquipmentState: (payload) =>
      set((state) => ({
        heavyEquipmentState: {
          ...state.heavyEquipmentState,
          ...payload,
        },
      })),
    resetHeavyEquipmentState: () => {
      set(initialState);
    },
  };
};
