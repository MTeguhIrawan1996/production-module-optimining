import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface state {
  searchRole: string;
  setSearchRole: (payload: string) => void;
}

const useSearchLocal = create<state>()(
  persist(
    (set) => ({
      searchRole: '',
      setSearchRole: (searchRole) => set({ searchRole }),
    }),
    {
      name: 'search-storage',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![''].includes(key))
        ),
      // skipHydration: true,
    }
  )
);

export default useSearchLocal;
