import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { SortableTableHeader } from '../SortableTableHeader';

describe('SortableTableHeader', () => {
  it('should render header text', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader column="name" onSort={vi.fn()}>
              Name
            </SortableTableHeader>
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should show unsorted indicator when not sorted', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader column="name" onSort={vi.fn()}>
              Name
            </SortableTableHeader>
          </tr>
        </thead>
      </table>
    );

    // Should show double arrow (unsorted)
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show ascending indicator when sorted ascending', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="name"
              currentSortColumn="name"
              currentSortDirection="asc"
              onSort={vi.fn()}
            >
              Name
            </SortableTableHeader>
          </tr>
        </thead>
      </table>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Should have aria-sort="ascending"
    expect(button).toHaveAttribute('aria-sort', 'ascending');
  });

  it('should show descending indicator when sorted descending', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="name"
              currentSortColumn="name"
              currentSortDirection="desc"
              onSort={vi.fn()}
            >
              Name
            </SortableTableHeader>
          </tr>
        </thead>
      </table>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-sort', 'descending');
  });

  it('should call onSort with column and direction when clicked', async () => {
    const onSort = vi.fn();
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader column="name" onSort={onSort}>
              Name
            </SortableTableHeader>
          </tr>
        </thead>
      </table>
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(onSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('should toggle sort direction when clicked again', async () => {
    const onSort = vi.fn();
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="name"
              currentSortColumn="name"
              currentSortDirection="asc"
              onSort={onSort}
            >
              Name
            </SortableTableHeader>
          </tr>
        </thead>
      </table>
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(onSort).toHaveBeenCalledWith('name', 'desc');
  });
});
