import { StateCreator } from 'zustand';

import { sliceResetFns } from '@/utils/store/useControlPanel';

type IWeatherProductionState = {
  page: number;
  search: string;
  period: string | null;
  startDate: Date | null;
  endDate: Date | null;
  year: number | null;
  week: number | null;
  month: number | null;
  shiftId: string | null;
  filterBadgeValue: string[] | null;
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
    period: null,
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    shiftId: null,
    filterBadgeValue: null,
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
