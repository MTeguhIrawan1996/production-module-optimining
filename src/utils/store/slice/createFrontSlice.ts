import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IFrontState = {
  page: number;
  search: string;
};

export type IFrontSliceValue = {
  frontPitState: Partial<IFrontState>;
  frontDomeState: Partial<IFrontState>;
};

export interface IFrontSliceAction {
  setFrontState: (payload: Partial<IFrontSliceValue>) => void;
  resetFrontState: () => void;
}

const initialState: IFrontSliceValue = {
  frontPitState: {
    page: 1,
    search: '',
  },
  frontDomeState: {
    page: 1,
    search: '',
  },
};

export const createFrontSlice: StateCreator<
  IFrontSliceValue & IFrontSliceAction
> = (set) => {
  const sliceName = 'frontSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setFrontState: (payload) =>
      set((state) => ({
        frontDomeState: {
          ...state.frontDomeState,
          ...payload.frontDomeState,
        },
        frontPitState: {
          ...state.frontPitState,
          ...payload.frontPitState,
        },
      })),
    resetFrontState: () => {
      set(initialState);
    },
  };
};
