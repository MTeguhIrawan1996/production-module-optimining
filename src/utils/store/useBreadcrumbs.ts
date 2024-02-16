import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type Breadcrumb = {
  label: string;
  path: string;
};

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  updateBreadcrumbsByIndex: (index: number, breadcrumb: Breadcrumb) => void;
}

export const useBreadcrumbs = create<BreadcrumbsProps>()(
  persist(
    (set) => ({
      breadcrumbs: [],
      setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => set({ breadcrumbs }),
      updateBreadcrumbsByIndex: (index: number, breadcrumb: Breadcrumb) =>
        set((state) => {
          const breadcrumbs = [...state.breadcrumbs];
          breadcrumbs[index] = breadcrumb;
          return { breadcrumbs };
        }),
    }),
    {
      name: 'breadcrumbs',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![''].includes(key))
        ),
    }
  )
);
