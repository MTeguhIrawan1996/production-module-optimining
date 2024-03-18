import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { querystring } from 'zustand-querystring';

interface Store {
  page: number;
  setPage: (page: number) => void;
}

export const useStoreWeeklyQueryUrl = create<Store>()(
  querystring(
    immer((set) => ({
      page: 1,
      setPage: (page: number) => set({ page }),
    })),
    {
      select(path) {
        return {
          page: '/plan/weekly' === path,
        };
      },
    }
  )
);
