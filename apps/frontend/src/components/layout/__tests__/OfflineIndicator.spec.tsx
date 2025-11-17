import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { useOffline } from '../../../hooks/useOffline';
import { OfflineIndicator } from '../OfflineIndicator';

// Mock useOffline hook
vi.mock('../../../hooks/useOffline', () => ({
  useOffline: vi.fn(),
}));

describe('OfflineIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when online', () => {
    vi.mocked(useOffline).mockReturnValue({
      isOnline: true,
      isOffline: false,
    });

    const { container } = render(<OfflineIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it('should render offline badge when offline', () => {
    vi.mocked(useOffline).mockReturnValue({
      isOnline: false,
      isOffline: true,
    });

    render(<OfflineIndicator />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});
