import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type ICompanyState = {
  page: number;
  search: string;
  filterBadgeValue: string[] | null;
};

type IHeavyEquipmentCompanyState = {
  brandId: string | null;
  typeId: string | null;
  modelId: string | null;
  classId: string | null;
} & ICompanyState;

type IHumanResourceCompanyState = {
  divisionId: string | null;
  positionId: string | null;
  employeStatusId: string | null;
  formStatus: string | null;
} & ICompanyState;

export type ICompanySliceValue = {
  companyState: ICompanyState;
  heavyEquipmentCompanyState: IHeavyEquipmentCompanyState;
  humanResourceCompanyState: IHumanResourceCompanyState;
};

export interface ICompanySliceAction {
  setCompanyState: (payload: Partial<ICompanyState>) => void;
  setHeavyEquipmentCompanyState: (
    payload: Partial<IHeavyEquipmentCompanyState>
  ) => void;
  setHumanResourceCompanyState: (
    payload: Partial<IHumanResourceCompanyState>
  ) => void;
  resetCompanyState: () => void;
  resetHeavyEquipmentCompanyState: () => void;
  resetHumanResourceCompanyState: () => void;
}

const initialState: ICompanySliceValue = {
  companyState: {
    page: 1,
    search: '',
    filterBadgeValue: null,
  },
  heavyEquipmentCompanyState: {
    page: 1,
    search: '',
    brandId: null,
    classId: null,
    modelId: null,
    typeId: null,
    filterBadgeValue: null,
  },
  humanResourceCompanyState: {
    page: 1,
    search: '',
    divisionId: null,
    positionId: null,
    employeStatusId: null,
    formStatus: null,
    filterBadgeValue: null,
  },
};

export const createCompanySlice: StateCreator<
  ICompanySliceValue & ICompanySliceAction
> = (set) => {
  const sliceName = 'companySlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setCompanyState: (payload) =>
      set((state) => ({
        companyState: {
          ...state.companyState,
          ...payload,
        },
      })),
    setHeavyEquipmentCompanyState: (payload) =>
      set((state) => ({
        heavyEquipmentCompanyState: {
          ...state.heavyEquipmentCompanyState,
          ...payload,
        },
      })),
    setHumanResourceCompanyState: (payload) =>
      set((state) => ({
        humanResourceCompanyState: {
          ...state.humanResourceCompanyState,
          ...payload,
        },
      })),
    resetCompanyState: () => {
      set((state) => ({
        ...state,
        companyState: initialState.companyState,
      }));
    },
    resetHeavyEquipmentCompanyState: () => {
      set((state) => ({
        ...state,
        heavyEquipmentCompanyState: initialState.heavyEquipmentCompanyState,
      }));
    },
    resetHumanResourceCompanyState: () => {
      set((state) => ({
        ...state,
        humanResourceCompanyState: initialState.humanResourceCompanyState,
      }));
    },
  };
};
