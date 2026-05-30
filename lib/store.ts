import { create } from 'zustand'
import { User, Cafe, Rating } from './types'
import { mockCafes } from './mockData'

interface AuthStore {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: (user: User, token: string) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  setUser: (user: User) => set({ user }),
}))

interface AppStore {
  selectedCity: string
  setSelectedCity: (city: string) => void
  cafes: Cafe[]
  setCafes: (cafes: Cafe[]) => void
  userRatings: Rating[]
  setUserRatings: (ratings: Rating[]) => void
  addRating: (rating: Rating) => void
  isLoadingCafes: boolean
  setIsLoadingCafes: (loading: boolean) => void
  viewMode: 'list' | 'map'
  setViewMode: (mode: 'list' | 'map') => void
}

export const useAppStore = create<AppStore>((set) => ({
  selectedCity: 'Dublin',
  setSelectedCity: (city: string) => set({ selectedCity: city }),
  // Seed with mock cafes so there's zero-latency baseline content
  cafes: mockCafes,
  setCafes: (cafes: Cafe[]) => set({ cafes }),
  userRatings: [],
  setUserRatings: (ratings: Rating[]) => set({ userRatings: ratings }),
  addRating: (rating: Rating) =>
    set((state) => ({ userRatings: [rating, ...state.userRatings] })),
  isLoadingCafes: false,
  setIsLoadingCafes: (loading: boolean) => set({ isLoadingCafes: loading }),
  viewMode: 'list',
  setViewMode: (mode: 'list' | 'map') => set({ viewMode: mode }),
}))
