import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type IDownloadTaskState = {
  isOpen: boolean;
  downloadIds: string[];
};

export type IStockpileMonitoringValue = {
  _hasHydrated: boolean;
  downloadPanel: Partial<IDownloadTaskState>;
};

export interface IStockpileMonitoringAction {
  setDownloadTaskStore: (payload: Partial<IStockpileMonitoringValue>) => void;
  resetDownloadTaskStore: () => void;
}

const initialState: IStockpileMonitoringValue = {
  _hasHydrated: false,
  downloadPanel: {
    downloadIds: [],
    isOpen: false,
  },
};

export const useDownloadTaskStore = create<
  IStockpileMonitoringValue & IStockpileMonitoringAction
>()(
  persist(
    (set) => ({
      ...initialState,
      setDownloadTaskStore: (payload) =>
        set((state) => ({
          downloadPanel: {
            ...state.downloadPanel,
            ...payload.downloadPanel,
          },
        })),
      resetDownloadTaskStore: () => {
        set(initialState);
      },
    }),
    {
      name: 'download-task', // name of the item in the storage (must be unique)
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['_hasHydrated'].includes(key)
          )
        ),
      onRehydrateStorage: () => (state) => {
        state?.setDownloadTaskStore({ _hasHydrated: true });
      },
    }
  )
);
