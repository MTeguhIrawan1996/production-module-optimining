import { create, StoreApi } from 'zustand';
import PubStore from 'zustand-pub';

type Breadcrumb = {
  label: string;
  path: string;
};

type BreadcrumbsState = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  updateBreadcrumbsByIndex: (index: number, breadcrumb: Breadcrumb) => void;
};

const pubStore = new PubStore('key');

const store = pubStore.defineStore<BreadcrumbsState>('breadcrumbs', (set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => set({ breadcrumbs }),
  updateBreadcrumbsByIndex: (index: number, breadcrumb: Breadcrumb) =>
    set((state) => {
      const breadcrumbs = [...state.breadcrumbs];
      breadcrumbs[index] = breadcrumb;
      return { breadcrumbs };
    }),
}));

export const useBreadcrumbs = create<StoreApi<BreadcrumbsState>>(store);
