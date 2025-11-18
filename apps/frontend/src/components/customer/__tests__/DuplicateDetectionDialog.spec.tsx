import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { createDefaultAddress } from '@kompass/shared';

import { DuplicateDetectionDialog } from '../DuplicateDetectionDialog';

import type { DuplicateMatch } from '@/types/duplicate-detection.types';
import type { Customer } from '@kompass/shared/types/entities/customer';

const mockCustomer: Customer = {
  _id: 'customer-123',
  _rev: '1-abc',
  type: 'customer',
  companyName: 'Müller GmbH',
  legalName: 'Müller GmbH & Co. KG',
  vatNumber: 'DE123456789',
  email: 'info@mueller.de',
  phone: '+49-89-1234567',
  billingAddress: createDefaultAddress({
    street: 'Hauptstraße',
    streetNumber: '15',
    zipCode: '80331',
    city: 'München',
    country: 'Deutschland',
  }),
  customerType: 'active',
  rating: 'A',
  locations: [],
  tags: [],
  createdBy: 'user-1',
  createdAt: new Date(),
  modifiedBy: 'user-1',
  modifiedAt: new Date(),
  version: 1,
};

describe('DuplicateDetectionDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    duplicate: mockCustomer,
    onCancel: vi.fn(),
    onContinue: vi.fn(),
  };

  it('should render dialog when open', () => {
    render(<DuplicateDetectionDialog {...defaultProps} />);

    expect(
      screen.getByText('Potentieller Duplikat-Kunde erkannt')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ein Kunde mit ähnlichen Informationen existiert bereits. Bitte überprüfen Sie die Details, bevor Sie fortfahren.'
      )
    ).toBeInTheDocument();
  });

  it('should display existing customer preview', () => {
    render(<DuplicateDetectionDialog {...defaultProps} />);

    expect(screen.getByText('Müller GmbH')).toBeInTheDocument();
    expect(screen.getByText('DE123456789')).toBeInTheDocument();
    expect(screen.getByText('80331 München')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('info@mueller.de')).toBeInTheDocument();
    expect(screen.getByText('+49-89-1234567')).toBeInTheDocument();
  });

  it('should display similarity percentage for fuzzy matches', () => {
    const duplicateMatch: DuplicateMatch = {
      customer: mockCustomer,
      similarity: 0.85,
      matchType: 'companyName',
    };

    render(
      <DuplicateDetectionDialog {...defaultProps} duplicate={duplicateMatch} />
    );

    expect(screen.getByText('85% ähnlich')).toBeInTheDocument();
  });

  it('should display exact match badge for VAT duplicates', () => {
    const duplicateMatch: DuplicateMatch = {
      customer: mockCustomer,
      similarity: 1.0,
      matchType: 'vat',
    };

    render(
      <DuplicateDetectionDialog {...defaultProps} duplicate={duplicateMatch} />
    );

    expect(screen.getByText('Exakte Übereinstimmung')).toBeInTheDocument();
  });

  it('should call onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<DuplicateDetectionDialog {...defaultProps} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onContinue when Continue Anyway button is clicked', async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();

    render(
      <DuplicateDetectionDialog {...defaultProps} onContinue={onContinue} />
    );

    const continueButton = screen.getByRole('button', {
      name: /trotzdem fortfahren/i,
    });
    await user.click(continueButton);

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('should not render when closed', () => {
    render(<DuplicateDetectionDialog {...defaultProps} open={false} />);

    expect(
      screen.queryByText('Potentieller Duplikat-Kunde erkannt')
    ).not.toBeInTheDocument();
  });

  it('should handle customer without optional fields', () => {
    const minimalCustomer: Customer = {
      _id: 'customer-456',
      _rev: '1-def',
      type: 'customer',
      companyName: 'Test GmbH',
      billingAddress: createDefaultAddress({
        street: 'Test',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      }),
      customerType: 'active',
      locations: [],
      tags: [],
      createdBy: 'user-1',
      createdAt: new Date(),
      modifiedBy: 'user-1',
      modifiedAt: new Date(),
      version: 1,
    };

    render(
      <DuplicateDetectionDialog {...defaultProps} duplicate={minimalCustomer} />
    );

    expect(screen.getByText('Test GmbH')).toBeInTheDocument();
    expect(screen.getByText('80331 München')).toBeInTheDocument();
    // VAT number should not be displayed
    expect(screen.queryByText(/USt-IdNr/i)).not.toBeInTheDocument();
  });

  it('should display legal name if different from company name', () => {
    render(<DuplicateDetectionDialog {...defaultProps} />);

    expect(screen.getByText('Müller GmbH & Co. KG')).toBeInTheDocument();
  });
});
