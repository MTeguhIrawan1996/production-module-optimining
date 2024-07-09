import { create } from 'zustand';

export type IFilterDataProps = {
  key: string;
  data: {
    id: string;
    name: string;
  }[];
};

interface FilterDataCommon {
  filterDataCommon: IFilterDataProps[];
  setFilterDataCommon: (payload: IFilterDataProps) => void;
}

export const useFilterDataCommon = create<FilterDataCommon>((set) => ({
  filterDataCommon: [],
  setFilterDataCommon: (filterDataCommon: IFilterDataProps) =>
    set((state) => {
      const isExist = state.filterDataCommon.some(
        (v) => v.key === filterDataCommon.key
      );

      if (isExist) {
        const newState = state.filterDataCommon.map((v) => {
          if (v.key === filterDataCommon.key) {
            return { ...v, data: filterDataCommon.data };
          }
          return v;
        });
        return { filterDataCommon: newState };
      }

      const value = [...state.filterDataCommon, filterDataCommon];
      return { filterDataCommon: value };
    }),
}));
