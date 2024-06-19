import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IBlockState = {
  page: number;
  searchBlock: string;
};

export type IBlockSliceValue = {
  blockState: IBlockState;
};

export interface IBlockSliceAction {
  setBlockPage: (payload: Pick<IBlockState, 'page'>) => void;
  setSearchBlock: (payload: Pick<IBlockState, 'searchBlock'>) => void;
}

const initialState: IBlockSliceValue = {
  blockState: {
    page: 1,
    searchBlock: '',
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
  };
};
