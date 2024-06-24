import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IElementState = {
  page: number;
  search: string;
};

export type IElementStateValue = {
  elementState: IElementState;
};

export interface IElementStateAction {
  setElementState: (payload: Partial<IElementState>) => void;
  resetElementState: () => void;
}

const initialState: IElementStateValue = {
  elementState: {
    page: 1,
    search: '',
  },
};

export const createElementSlice: StateCreator<
  IElementStateValue & IElementStateAction
> = (set) => {
  const sliceName = 'elementSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setElementState: (payload) =>
      set((state) => ({
        elementState: {
          ...state.elementState,
          ...payload,
        },
      })),
    resetElementState: () => {
      set(initialState);
    },
  };
};
