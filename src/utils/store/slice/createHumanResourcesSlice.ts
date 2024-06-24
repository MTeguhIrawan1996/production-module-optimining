import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IHumanResourcesState = {
  page: number;
  search: string;
};

export type IHumanResourcesSliceValue = {
  humanResourcesState: IHumanResourcesState;
};

export interface IHumanResourcesSliceAction {
  setHumanResourcesPage: (payload: Pick<IHumanResourcesState, 'page'>) => void;
  setSearchHumanResources: (
    payload: Pick<IHumanResourcesState, 'search'>
  ) => void;
  resetHumanResourcesState: () => void;
}

const initialState: IHumanResourcesSliceValue = {
  humanResourcesState: {
    page: 1,
    search: '',
  },
};

export const createHumanResourcesSlice: StateCreator<
  IHumanResourcesSliceValue & IHumanResourcesSliceAction
> = (set) => {
  const sliceName = 'humanResourcesSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setSearchHumanResources: (payload) =>
      set((state) => ({
        humanResourcesState: {
          ...state.humanResourcesState,
          search: payload.search,
        },
      })),
    setHumanResourcesPage: (payload) =>
      set((state) => ({
        humanResourcesState: {
          ...state.humanResourcesState,
          page: payload.page,
        },
      })),
    resetHumanResourcesState: () => {
      set(initialState);
    },
  };
};
