import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IBlockState = {
  page: number;
  searchBlock: string;
};
type IPitState = {
  page: number;
  searchPit: string;
};

export type IBlockSliceValue = {
  blockState: IBlockState;
  pitState: IPitState;
};

export interface IBlockSliceAction {
  setBlockPage: (payload: Pick<IBlockState, 'page'>) => void;
  setSearchBlock: (payload: Pick<IBlockState, 'searchBlock'>) => void;
  resetBlockState: () => void;
  setPitPage: (payload: Pick<IPitState, 'page'>) => void;
  setSearchPit: (payload: Pick<IPitState, 'searchPit'>) => void;
  resetPitState: () => void;
}

const initialState: IBlockSliceValue = {
  blockState: {
    page: 1,
    searchBlock: '',
  },
  pitState: {
    page: 1,
    searchPit: '',
  },
};

export const createBlockSlice: StateCreator<
  IBlockSliceValue & IBlockSliceAction
> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setSearchBlock: (payload) =>
      set((state) => ({
        blockState: {
          ...state.blockState,
          searchBlock: payload.searchBlock,
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
          searchPit: payload.searchPit,
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
