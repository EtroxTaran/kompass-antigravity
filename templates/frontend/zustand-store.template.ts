/**
 * Zustand Store Template for KOMPASS
 * 
 * Use Zustand for:
 * - Local feature state (not shared across features)
 * - Temporary UI state (modal open/close, filters)
 * - Simple state that doesn't need Redux overhead
 * 
 * Usage: Replace {{FEATURE_NAME}} with your feature name
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * State shape for {{FEATURE_NAME}} store
 */
interface {{FEATURE_NAME}}Store {
  // ==================== State ====================
  
  /** Search term for filtering */
  searchTerm: string;
  
  /** Active filters */
  filters: {
    status: string | null;
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
  };
  
  /** UI state */
  isModalOpen: boolean;
  selectedIds: string[];
  viewMode: 'grid' | 'list' | 'table';
  
  // ==================== Actions ====================
  
  /** Set search term */
  setSearchTerm: (term: string) => void;
  
  /** Set status filter */
  setStatusFilter: (status: string | null) => void;
  
  /** Set date range filter */
  setDateRange: (from: Date | null, to: Date | null) => void;
  
  /** Reset all filters */
  resetFilters: () => void;
  
  /** Open modal */
  openModal: () => void;
  
  /** Close modal */
  closeModal: () => void;
  
  /** Toggle item selection */
  toggleSelection: (id: string) => void;
  
  /** Clear selection */
  clearSelection: () => void;
  
  /** Set view mode */
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  
  /** Reset store to initial state */
  reset: () => void;
}

/**
 * Initial state
 */
const initialState = {
  searchTerm: '',
  filters: {
    status: null,
    dateRange: {
      from: null,
      to: null,
    },
  },
  isModalOpen: false,
  selectedIds: [],
  viewMode: 'list' as const,
};

/**
 * {{FEATURE_NAME}} Zustand store
 * 
 * @example
 * ```tsx
 * // In your component:
 * const { searchTerm, setSearchTerm, filters, resetFilters } = use{{FEATURE_NAME}}Store();
 * 
 * return (
 *   <Input 
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *   />
 * );
 * ```
 */
export const use{{FEATURE_NAME}}Store = create<{{FEATURE_NAME}}Store>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setSearchTerm: (term) =>
          set({ searchTerm: term }, false, '{{FEATURE_NAME}}/setSearchTerm'),

        setStatusFilter: (status) =>
          set(
            (state) => ({
              filters: {
                ...state.filters,
                status,
              },
            }),
            false,
            '{{FEATURE_NAME}}/setStatusFilter'
          ),

        setDateRange: (from, to) =>
          set(
            (state) => ({
              filters: {
                ...state.filters,
                dateRange: { from, to },
              },
            }),
            false,
            '{{FEATURE_NAME}}/setDateRange'
          ),

        resetFilters: () =>
          set(
            { filters: initialState.filters, searchTerm: '' },
            false,
            '{{FEATURE_NAME}}/resetFilters'
          ),

        openModal: () => set({ isModalOpen: true }, false, '{{FEATURE_NAME}}/openModal'),

        closeModal: () =>
          set({ isModalOpen: false }, false, '{{FEATURE_NAME}}/closeModal'),

        toggleSelection: (id) =>
          set(
            (state) => ({
              selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id],
            }),
            false,
            '{{FEATURE_NAME}}/toggleSelection'
          ),

        clearSelection: () =>
          set({ selectedIds: [] }, false, '{{FEATURE_NAME}}/clearSelection'),

        setViewMode: (mode) =>
          set({ viewMode: mode }, false, '{{FEATURE_NAME}}/setViewMode'),

        reset: () => set(initialState, false, '{{FEATURE_NAME}}/reset'),
      }),
      {
        name: '{{FEATURE_NAME_LOWER}}-storage',
        partialize: (state) => ({
          // Only persist these fields
          viewMode: state.viewMode,
          filters: state.filters,
        }),
      }
    ),
    {
      name: '{{FEATURE_NAME}}Store',
    }
  )
);

