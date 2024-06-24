import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IWeatherProductionState = {
  page: number;
  search: string;
  year: number | null;
  week: number | null;
};

export type IWeatherProductionValue = {
  weatherProductionState: IWeatherProductionState;
};

export interface IWeatherProductionAction {
  setWeatherProductionState: (
    payload: Partial<IWeatherProductionState>
  ) => void;
  resetWeatherProductionState: () => void;
}

const initialState: IWeatherProductionValue = {
  weatherProductionState: {
    page: 1,
    search: '',
    year: null,
    week: null,
  },
};

export const createWeatherProductionSlice: StateCreator<
  IWeatherProductionValue & IWeatherProductionAction
> = (set) => {
  const sliceName = 'weatherProductionSlice';
  sliceResetFns.set(sliceName, () => set(initialState));
  return {
    ...initialState,
    setWeatherProductionState: (payload) =>
      set((state) => ({
        weatherProductionState: {
          ...state.weatherProductionState,
          ...payload,
        },
      })),
    resetWeatherProductionState: () => {
      set(initialState);
    },
  };
};
