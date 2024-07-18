import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IHeavyEquipmentProductionState = {
  page: number;
  search: string;
  period: string | null;
  startDate: Date | null;
  endDate: Date | null;
  year: number | null;
  week: number | null;
  month: number | null;
  shiftId: string | null;
  companyHeavyEquipmentId: string | null;
  filterBadgeValue: string[] | null;
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
    period: null,
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    shiftId: null,
    companyHeavyEquipmentId: null,
    filterBadgeValue: null,
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
