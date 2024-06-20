import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IFrontState = {
  page: number;
  search: string;
};

export type IFrontSliceValue = {
  frontState: IFrontState;
};

export interface IFrontSliceAction {
  setFrontState: (payload: Partial<IFrontState>) => void;
  resetFrontState: () => void;
}

const initialState: IFrontSliceValue = {
  frontState: {
    page: 1,
    search: '',
  },
};

export const createFrontSlice: StateCreator<
  IFrontSliceValue & IFrontSliceAction
> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setFrontState: (payload) =>
      set((state) => ({
        frontState: {
          ...state.frontState,
          ...payload,
        },
      })),
    resetFrontState: () => {
      set(initialState);
    },
  };
};
