import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IHeavyEquipmentReferenceState = {
  page: number;
  search: string;
  brandId: string | null;
  typeId: string | null;
  filterBadgeValue: string[] | null;
};

export type IHeavyEquipmentReferenceSliceValue = {
  heavyEquipmentReferenceState: IHeavyEquipmentReferenceState;
};

export interface IHeavyEquipmentReferenceSliceAction {
  setHeavyEquipmentReferenceState: (
    payload: Partial<IHeavyEquipmentReferenceState>
  ) => void;
  resetHeavyEquipmentReferenceState: () => void;
}

const initialState: IHeavyEquipmentReferenceSliceValue = {
  heavyEquipmentReferenceState: {
    page: 1,
    search: '',
    brandId: null,
    typeId: null,
    filterBadgeValue: null,
  },
};

export const createHeavyEquipmentReferenceSlice: StateCreator<
  IHeavyEquipmentReferenceSliceValue & IHeavyEquipmentReferenceSliceAction
> = (set) => {
  const sliceName = 'heavyEquipmentReferenceSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setHeavyEquipmentReferenceState: (payload) =>
      set((state) => ({
        heavyEquipmentReferenceState: {
          ...state.heavyEquipmentReferenceState,
          ...payload,
        },
      })),
    resetHeavyEquipmentReferenceState: () => {
      set(initialState);
    },
  };
};
