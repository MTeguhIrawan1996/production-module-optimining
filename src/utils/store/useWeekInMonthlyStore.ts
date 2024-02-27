import { create } from 'zustand';

interface WeeklyInMonthly {
  weeklyInMonthly: number[];
  setWeeklyInMonthly: (weeklyInMonthly: number[]) => void;
}

export const useStoreWeeklyInMonthly = create<WeeklyInMonthly>((set) => ({
  weeklyInMonthly: [],
  setWeeklyInMonthly: (weeklyInMonthly: number[]) => set({ weeklyInMonthly }),
}));
