import { create } from "zustand";

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
}

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
  setAuth: (
    isAuthenticated: boolean,
    user: { username: string } | null
  ) => void;
  clearAuth: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearchQuery: () => set({ searchQuery: "" }),
}));

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
  clearAuth: () => set({ isAuthenticated: false, user: null }),
}));
