/**
 * Redux Toolkit Slice Template for KOMPASS
 * 
 * Use Redux Toolkit for:
 * - Global app state (user, theme, language)
 * - Shared data across features
 * - Data that persists across routes
 * 
 * Usage: Replace {{ENTITY_NAME}} with your entity name
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { {{ENTITY_NAME}} } from '@kompass/shared';

/**
 * State shape for {{ENTITY_NAME}} slice
 */
interface {{ENTITY_NAME}}State {
  /** All {{ENTITY_NAME}}s in state */
  entities: {{ENTITY_NAME}}[];
  
  /** Currently selected {{ENTITY_NAME}} ID */
  selectedId: string | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error message if any */
  error: string | null;
  
  /** Filters applied to list */
  filters: {
    searchTerm: string;
    status: string | null;
    owner: string | null;
  };
  
  /** Pagination */
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

/**
 * Initial state
 */
const initialState: {{ENTITY_NAME}}State = {
  entities: [],
  selectedId: null,
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    status: null,
    owner: null,
  },
  pagination: {
    page: 1,
    pageSize: 25,
    total: 0,
  },
};

/**
 * {{ENTITY_NAME}} slice
 */
export const {{ENTITY_NAME_LOWER}}Slice = createSlice({
  name: '{{ENTITY_NAME_LOWER}}',
  initialState,
  reducers: {
    /**
     * Set all {{ENTITY_NAME}}s
     */
    set{{ENTITY_NAME_PLURAL}}: (state, action: PayloadAction<{{ENTITY_NAME}}[]>) => {
      state.entities = action.payload;
      state.pagination.total = action.payload.length;
    },

    /**
     * Add a single {{ENTITY_NAME}}
     */
    add{{ENTITY_NAME}}: (state, action: PayloadAction<{{ENTITY_NAME}}>) => {
      state.entities.push(action.payload);
      state.pagination.total += 1;
    },

    /**
     * Update a {{ENTITY_NAME}}
     */
    update{{ENTITY_NAME}}: (state, action: PayloadAction<{{ENTITY_NAME}}>) => {
      const index = state.entities.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        state.entities[index] = action.payload;
      }
    },

    /**
     * Remove a {{ENTITY_NAME}}
     */
    remove{{ENTITY_NAME}}: (state, action: PayloadAction<string>) => {
      state.entities = state.entities.filter((e) => e._id !== action.payload);
      state.pagination.total -= 1;
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    },

    /**
     * Select a {{ENTITY_NAME}}
     */
    select{{ENTITY_NAME}}: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },

    /**
     * Clear selection
     */
    clearSelection: (state) => {
      state.selectedId = null;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    /**
     * Set error
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set search filter
     */
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      state.pagination.page = 1; // Reset to first page
    },

    /**
     * Set status filter
     */
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload;
      state.pagination.page = 1;
    },

    /**
     * Set owner filter
     */
    setOwnerFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.owner = action.payload;
      state.pagination.page = 1;
    },

    /**
     * Reset all filters
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },

    /**
     * Set page
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    /**
     * Set page size
     */
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // Reset to first page
    },
  },
});

// Export actions
export const {
  set{{ENTITY_NAME_PLURAL}},
  add{{ENTITY_NAME}},
  update{{ENTITY_NAME}},
  remove{{ENTITY_NAME}},
  select{{ENTITY_NAME}},
  clearSelection,
  setLoading,
  setError,
  clearError,
  setSearchTerm,
  setStatusFilter,
  setOwnerFilter,
  resetFilters,
  setPage,
  setPageSize,
} = {{ENTITY_NAME_LOWER}}Slice.actions;

// Export reducer
export default {{ENTITY_NAME_LOWER}}Slice.reducer;

// ==================== Selectors ====================

/**
 * Select all {{ENTITY_NAME}}s
 * 
 * @note RootState type should be imported from your store configuration
 */
export const selectAll{{ENTITY_NAME_PLURAL}} = (state: { {{ENTITY_NAME_LOWER}}: {{ENTITY_NAME}}State }) => 
  state.{{ENTITY_NAME_LOWER}}.entities;

/**
 * Select currently selected {{ENTITY_NAME}}
 */
export const selectCurrent{{ENTITY_NAME}} = (state: { {{ENTITY_NAME_LOWER}}: {{ENTITY_NAME}}State }) => {
  const { entities, selectedId } = state.{{ENTITY_NAME_LOWER}};
  return entities.find((e) => e._id === selectedId) || null;
};

/**
 * Select filtered {{ENTITY_NAME}}s
 */
export const selectFiltered{{ENTITY_NAME_PLURAL}} = (state: { {{ENTITY_NAME_LOWER}}: {{ENTITY_NAME}}State }) => {
  const { entities, filters } = state.{{ENTITY_NAME_LOWER}};
  
  return entities.filter((entity) => {
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      // TODO: Adjust search fields
      const matches = entity.name.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }

    // Apply status filter
    if (filters.status && entity.status !== filters.status) {
      return false;
    }

    // Apply owner filter
    if (filters.owner && entity.owner !== filters.owner) {
      return false;
    }

    return true;
  });
};

/**
 * Select loading state
 */
export const select{{ENTITY_NAME}}Loading = (state: { {{ENTITY_NAME_LOWER}}: {{ENTITY_NAME}}State }) => 
  state.{{ENTITY_NAME_LOWER}}.loading;

/**
 * Select error state
 */
export const select{{ENTITY_NAME}}Error = (state: { {{ENTITY_NAME_LOWER}}: {{ENTITY_NAME}}State }) => 
  state.{{ENTITY_NAME_LOWER}}.error;

