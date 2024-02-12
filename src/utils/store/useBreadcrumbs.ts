import { create } from 'zustand';
type Breadcrumb = {
  label: string;
  path: string;
};

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  updateBreadcrumbsByIndex: (index: number, breadcrumb: Breadcrumb) => void;
}

export const useBreadcrumbs = create<BreadcrumbsProps>()((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => set({ breadcrumbs }),
  updateBreadcrumbsByIndex: (index: number, breadcrumb: Breadcrumb) =>
    set((state) => {
      const breadcrumbs = [...state.breadcrumbs];
      breadcrumbs[index] = breadcrumb;
      return { breadcrumbs };
    }),
}));
