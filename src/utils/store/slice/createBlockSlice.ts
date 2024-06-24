import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IBlockState = {
  page: number;
  search: string;
};

export type IBlockSliceValue = {
  blockState: IBlockState;
  pitState: IBlockState;
};

export interface IBlockSliceAction {
  setBlockPage: (payload: Pick<IBlockState, 'page'>) => void;
  setSearchBlock: (payload: Pick<IBlockState, 'search'>) => void;
  resetBlockState: () => void;
  setPitPage: (payload: Pick<IBlockState, 'page'>) => void;
  setSearchPit: (payload: Pick<IBlockState, 'search'>) => void;
  resetPitState: () => void;
}

const initialState: IBlockSliceValue = {
  blockState: {
    page: 1,
    search: '',
  },
  pitState: {
    page: 1,
    search: '',
  },
};

export const createBlockSlice: StateCreator<
  IBlockSliceValue & IBlockSliceAction
> = (set) => {
  const sliceName = 'blockSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setSearchBlock: (payload) =>
      set((state) => ({
        blockState: {
          ...state.blockState,
          search: payload.search,
        },
      })),
    setBlockPage: (payload) =>
      set((state) => ({
        blockState: {
          ...state.blockState,
          page: payload.page,
        },
      })),
    resetBlockState: () => {
      set((state) => ({
        blockState: initialState.blockState,
        pitState: state.pitState,
      }));
    },
    setSearchPit: (payload) =>
      set((state) => ({
        pitState: {
          ...state.pitState,
          search: payload.search,
        },
      })),
    setPitPage: (payload) =>
      set((state) => ({
        pitState: {
          ...state.pitState,
          page: payload.page,
        },
      })),
    resetPitState: () => {
      set((state) => ({
        blockState: state.blockState,
        pitState: initialState.pitState,
      }));
    },
  };
};
