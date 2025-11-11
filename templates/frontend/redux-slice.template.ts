/**
 * TEMPLATE: Redux Toolkit Slice
 * 
 * Usage: Copy this template for global state management
 * Replace {{EntityName}} with your entity name
 * 
 * CRITICAL REQUIREMENTS:
 * 1. Use Redux Toolkit ONLY for global app state
 * 2. Use Zustand for local feature state
 * 3. Use React Query for server state
 * 4. Never put business logic in reducers
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { {{EntityName}} } from '@kompass/shared/types/entities/{{entity-name}}';
import { {{entityName}}Api } from '../services/{{entity-name}}.service';
import type { RootState } from '@/store';

/**
 * State shape for {{entityName}} slice
 */
interface {{EntityName}}State {
  /** List of {{entityName}}s */
  items: {{EntityName}}[];
  
  /** Currently selected {{entityName}} ID */
  selectedId: string | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error message */
  error: string | null;
  
  /** Filters applied to list */
  filters: {
    search: string;
    owner?: string;
    rating?: 'A' | 'B' | 'C';
  };
  
  /** Pagination */
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
}

/**
 * Initial state
 */
const initialState: {{EntityName}}State = {
  items: [],
  selectedId: null,
  loading: false,
  error: null,
  filters: {
    search: '',
  },
  pagination: {
    total: 0,
    offset: 0,
    limit: 50,
  },
};

// ============================================================================
// ASYNC THUNKS (for async operations)
// ============================================================================

/**
 * Fetch all {{entityName}}s
 */
export const fetch{{EntityName}}s = createAsyncThunk(
  '{{entityName}}/fetchAll',
  async (filters: any, { rejectWithValue }) => {
    try {
      return await {{entityName}}Api.getAll(filters);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch single {{entityName}}
 */
export const fetch{{EntityName}} = createAsyncThunk(
  '{{entityName}}/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await {{entityName}}Api.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================================================
// SLICE DEFINITION
// ============================================================================

export const {{entityName}}Slice = createSlice({
  name: '{{entityName}}',
  initialState,
  reducers: {
    /**
     * Set selected {{entityName}} ID
     */
    select{{EntityName}}: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    
    /**
     * Update filters
     */
    setFilters: (state, action: PayloadAction<Partial<{{EntityName}}State['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    /**
     * Reset filters
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    /**
     * Set pagination
     */
    setPagination: (state, action: PayloadAction<Partial<{{EntityName}}State['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  
  // ============================================================================
  // EXTRA REDUCERS (handle async thunk actions)
  // ============================================================================
  
  extraReducers: (builder) => {
    // Fetch all {{entityName}}s
    builder.addCase(fetch{{EntityName}}s.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetch{{EntityName}}s.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.data;
      state.pagination.total = action.payload.total;
    });
    builder.addCase(fetch{{EntityName}}s.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch single {{entityName}}
    builder.addCase(fetch{{EntityName}}.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetch{{EntityName}}.fulfilled, (state, action) => {
      state.loading = false;
      // Add or update in items array
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index >= 0) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });
    builder.addCase(fetch{{EntityName}}.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  select{{EntityName}},
  setFilters,
  resetFilters,
  setPagination,
  clearError,
} = {{entityName}}Slice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

/** Select all {{entityName}}s */
export const selectAll{{EntityName}}s = (state: RootState) => state.{{entityName}}.items;

/** Select selected {{entityName}} */
export const selectSelected{{EntityName}} = (state: RootState) => {
  const { items, selectedId } = state.{{entityName}};
  return items.find(item => item._id === selectedId) || null;
};

/** Select loading state */
export const selectLoading = (state: RootState) => state.{{entityName}}.loading;

/** Select error */
export const selectError = (state: RootState) => state.{{entityName}}.error;

/** Select filters */
export const selectFilters = (state: RootState) => state.{{entityName}}.filters;

/** Select pagination */
export const selectPagination = (state: RootState) => state.{{entityName}}.pagination;

// ============================================================================
// REDUCER
// ============================================================================

export default {{entityName}}Slice.reducer;

