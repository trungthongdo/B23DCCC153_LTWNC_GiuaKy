import { create } from 'zustand';
import { BookCategory } from '../types/book';

export type CategoryFilter = 'Tất cả' | BookCategory;

export interface FilterState {
  searchTerm: string;
  category: CategoryFilter;
  setSearchTerm: (term: string) => void;
  setCategory: (category: CategoryFilter) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: '',
  category: 'Tất cả',
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setCategory: (category: CategoryFilter) => set({ category }),
  resetFilter: () => set({ searchTerm: '', category: 'Tất cả' }),
}));
