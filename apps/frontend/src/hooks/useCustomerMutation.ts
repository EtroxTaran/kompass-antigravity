import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import {
  customerService,
  type CreateCustomerRequest,
  type UpdateCustomerRequest,
} from '@/services/customer.service';

import { customerKeys } from './useCustomers';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Hook to create a new customer
 *
 * @returns React Query mutation for creating customers
 */
export function useCreateCustomer(): ReturnType<
  typeof useMutation<Customer, Error, CreateCustomerRequest>
> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation<Customer, Error, CreateCustomerRequest>({
    mutationFn: (data) => customerService.create(data),
    onSuccess: (customer) => {
      // Invalidate customer list queries
      void queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      // Add new customer to cache
      queryClient.setQueryData(customerKeys.detail(customer._id), customer);

      // Show success toast
      toast({
        title: 'Kunde erstellt',
        description: `${customer.companyName} wurde erfolgreich erstellt.`,
        variant: 'default',
      });

      // Navigate to customer detail page
      void navigate(`/customers/${customer._id}`);
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: 'Fehler beim Erstellen',
        description: error.message || 'Der Kunde konnte nicht erstellt werden.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an existing customer
 *
 * @returns React Query mutation for updating customers
 */
export function useUpdateCustomer(): ReturnType<
  typeof useMutation<
    Customer,
    Error,
    { id: string; data: UpdateCustomerRequest }
  >
> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation<
    Customer,
    Error,
    { id: string; data: UpdateCustomerRequest }
  >({
    mutationFn: ({ id, data }) => customerService.update(id, data),
    onSuccess: (customer) => {
      // Invalidate customer list queries
      void queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      // Update customer in cache
      queryClient.setQueryData(customerKeys.detail(customer._id), customer);

      // Show success toast
      toast({
        title: 'Kunde aktualisiert',
        description: `${customer.companyName} wurde erfolgreich aktualisiert.`,
        variant: 'default',
      });

      // Navigate to customer detail page
      void navigate(`/customers/${customer._id}`);
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: 'Fehler beim Aktualisieren',
        description:
          error.message || 'Der Kunde konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    },
  });
}
