import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ControlsBar } from '../ControlsBar';

describe('ControlsBar', () => {
  it('should render search input', () => {
    render(
      <ControlsBar
        searchValue=""
        onSearchChange={vi.fn()}
        searchPlaceholder="Search..."
      />
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('should call onSearchChange when typing in search', async () => {
    const onSearchChange = vi.fn();
    render(
      <ControlsBar
        searchValue=""
        onSearchChange={onSearchChange}
        searchPlaceholder="Search..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'test');

    // Should be called multiple times (at least once per character)
    // React event batching may cause duplicate calls per character
    expect(onSearchChange).toHaveBeenCalled();
    expect(onSearchChange.mock.calls.length).toBeGreaterThanOrEqual(4);
    // Verify it was called with at least "t", "e", "s", "t" (each character)
    const allCalls = onSearchChange.mock.calls.map((call) => call[0]);
    expect(allCalls).toContain('t');
    expect(allCalls).toContain('e');
    expect(allCalls).toContain('s');
  });

  it('should show filter button with count badge', () => {
    render(
      <ControlsBar
        searchValue=""
        onSearchChange={vi.fn()}
        activeFilterCount={3}
        onFilterClick={vi.fn()}
      />
    );

    const filterButton = screen.getByText(/Filter/i);
    expect(filterButton).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Badge count
  });

  it('should show primary action button', () => {
    render(
      <ControlsBar
        searchValue=""
        onSearchChange={vi.fn()}
        primaryAction={{
          label: 'New Item',
          onClick: vi.fn(),
        }}
      />
    );

    expect(screen.getByText('New Item')).toBeInTheDocument();
  });

  it('should show bulk actions when items are selected', () => {
    render(
      <ControlsBar
        searchValue=""
        onSearchChange={vi.fn()}
        selectedCount={5}
        bulkActions={[
          { label: 'Delete', onClick: vi.fn(), variant: 'destructive' },
        ]}
      />
    );

    expect(screen.getByText(/5.*ausgewählt/i)).toBeInTheDocument();
  });
});
