/**
 * Customer Feature Module
 * 
 * Exports all public components, hooks, and types
 */

// Components
export { CustomerList } from './components/CustomerList';

// Hooks
export {
  useCustomer,
  useCustomerList,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from './hooks/useCustomer';

// Store
export { useCustomerStore } from './store/customerStore';

// Types
export type { Customer, Address, DSGVOConsent } from '@kompass/shared';

