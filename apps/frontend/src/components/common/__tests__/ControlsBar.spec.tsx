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

    expect(onSearchChange).toHaveBeenCalledTimes(4); // Once per character
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
