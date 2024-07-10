import { StateCreator } from 'zustand';

export type IHydrationStateValue = {
  _hasHydrated: boolean;
};

export interface IHydrationStateAction {
  setHasHydrated: (payload: boolean) => void;
}

const initialState: IHydrationStateValue = {
  _hasHydrated: false,
};

export const createHydrationSlice: StateCreator<
  IHydrationStateValue & IHydrationStateAction
> = (set) => {
  return {
    ...initialState,
    setHasHydrated: (state) => {
      set({
        _hasHydrated: state,
      });
    },
  };
};
