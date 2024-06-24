import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IHeavyEquipmentProductionState = {
  page: number;
  search: string;
  date: Date | null;
};

export type IHeavyEquipmentProductionStateValue = {
  heavyEquipmentProductionState: IHeavyEquipmentProductionState;
};

export interface IHeavyEquipmentProductionStateAction {
  setHeavyEquipmentProductionState: (
    payload: Partial<IHeavyEquipmentProductionState>
  ) => void;
  resetHeavyEquipmentProductionState: () => void;
}

const initialState: IHeavyEquipmentProductionStateValue = {
  heavyEquipmentProductionState: {
    page: 1,
    search: '',
    date: null,
  },
};

export const createHeavyEquipmentProductionSlice: StateCreator<
  IHeavyEquipmentProductionStateValue & IHeavyEquipmentProductionStateAction
> = (set) => {
  const sliceName = 'heavyEquipmentProductionSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setHeavyEquipmentProductionState: (payload) =>
      set((state) => ({
        heavyEquipmentProductionState: {
          ...state.heavyEquipmentProductionState,
          ...payload,
        },
      })),
    resetHeavyEquipmentProductionState: () => {
      set(initialState);
    },
  };
};
