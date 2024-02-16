import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PermissionProps {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
}

export const usePermissions = create(
  persist<PermissionProps>(
    (set) => ({
      permissions: [],
      setPermissions: (permissions: string[]) => set({ permissions }),
    }),
    {
      name: 'permissions', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
