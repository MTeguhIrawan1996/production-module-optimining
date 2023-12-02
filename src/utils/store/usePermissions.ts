import { create } from 'zustand';

interface PermissionProps {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
}

export const usePermissions = create<PermissionProps>((set) => ({
  permissions: [],
  setPermissions: (permissions: string[]) => set({ permissions }),
}));
