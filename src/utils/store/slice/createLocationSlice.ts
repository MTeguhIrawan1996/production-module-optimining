import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type ILocationState = {
  page: number;
  categoryId: string | null;
  searchLoaction: string;
};

export type ILocationSliceValue = {
  locationState: ILocationState;
};

export interface ILocationSliceAction {
  setLoactionPage: (payload: Pick<ILocationState, 'page'>) => void;
  setCategoryId: (payload: Pick<ILocationState, 'categoryId'>) => void;
  setSearchLocation: (payload: Pick<ILocationState, 'searchLoaction'>) => void;
}

const initialState: ILocationSliceValue = {
  locationState: {
    page: 1,
    categoryId: null,
    searchLoaction: '',
  },
};

export const createLocationSlice: StateCreator<
  ILocationSliceValue & ILocationSliceAction
> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setSearchLocation: (payload) =>
      set((state) => ({
        locationState: {
          ...state.locationState,
          searchLoaction: payload.searchLoaction,
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
  };
};
