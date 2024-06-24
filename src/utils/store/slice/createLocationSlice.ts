import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type ILocationState = {
  page: number;
  categoryId: string | null;
  search: string;
};

export type ILocationSliceValue = {
  locationState: ILocationState;
};

export interface ILocationSliceAction {
  setLoactionPage: (payload: Pick<ILocationState, 'page'>) => void;
  setCategoryId: (payload: Pick<ILocationState, 'categoryId'>) => void;
  setSearchLocation: (payload: Pick<ILocationState, 'search'>) => void;
  resetLocationState: () => void;
}

const initialState: ILocationSliceValue = {
  locationState: {
    page: 1,
    categoryId: null,
    search: '',
  },
};

export const createLocationSlice: StateCreator<
  ILocationSliceValue & ILocationSliceAction
> = (set) => {
  const sliceName = 'locationSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setSearchLocation: (payload) =>
      set((state) => ({
        locationState: {
          ...state.locationState,
          search: payload.search,
        },
      })),
    setCategoryId: (payload) =>
      set((state) => ({
        locationState: {
          ...state.locationState,
          categoryId: payload.categoryId,
        },
      })),
    setLoactionPage: (payload) =>
      set((state) => ({
        locationState: {
          ...state.locationState,
          page: payload.page,
        },
      })),
    resetLocationState: () => {
      set(initialState);
    },
  };
};
