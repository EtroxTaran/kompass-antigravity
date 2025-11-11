/**
 * Form Template for KOMPASS
 * 
 * Uses:
 * - react-hook-form for form state
 * - zod for validation
 * - shadcn/ui form components
 * 
 * NEVER create custom form inputs - ALWAYS use shadcn/ui
 * 
 * Installation:
 * pnpm dlx shadcn-ui@latest add form
 * pnpm dlx shadcn-ui@latest add input
 * pnpm dlx shadcn-ui@latest add button
 * pnpm dlx shadcn-ui@latest add select
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

/**
 * Validation schema (Zod)
 * 
 * Must match backend validation rules from DATA_MODEL_SPECIFICATION.md
 */
const {{ENTITY_NAME_LOWER}}FormSchema = z.object({
  // TODO: Add your fields with validation
  
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must not exceed 200 characters')
    .regex(
      /^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/,
      'Name contains invalid characters'
    ),

  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .regex(/^[\+]?[0-9\s\-()]+$/, 'Invalid phone format')
    .min(7, 'Phone number too short')
    .max(20, 'Phone number too long')
    .optional()
    .or(z.literal('')),

  status: z.enum(['active', 'inactive', 'archived'], {
    required_error: 'Please select a status',
  }),

  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),

  priority: z
    .number()
    .int()
    .min(1, 'Priority must be at least 1')
    .max(10, 'Priority must not exceed 10'),
});

/**
 * Type inferred from schema
 */
type {{ENTITY_NAME}}FormValues = z.infer<typeof {{ENTITY_NAME_LOWER}}FormSchema>;

/**
 * Props for {{ENTITY_NAME}}Form
 */
interface {{ENTITY_NAME}}FormProps {
  /** Initial values (for edit mode) */
  initialValues?: Partial<{{ENTITY_NAME}}FormValues>;
  
  /** Submit handler */
  onSubmit: (data: {{ENTITY_NAME}}FormValues) => Promise<void>;
  
  /** Cancel handler */
  onCancel?: () => void;
  
  /** Submit button text */
  submitLabel?: string;
  
  /** Loading state */
  isLoading?: boolean;
}

/**
 * {{ENTITY_NAME}} Form Component
 * 
 * Features:
 * - Validation with Zod schema
 * - Accessible form fields (WCAG 2.1 AA)
 * - Error messages
 * - Loading states
 * - Keyboard navigation
 * 
 * @example
 * ```tsx
 * <{{ENTITY_NAME}}Form
 *   initialValues={existing{{ENTITY_NAME}}}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   submitLabel="Update {{ENTITY_NAME}}"
 *   isLoading={isUpdating}
 * />
 * ```
 */
export function {{ENTITY_NAME}}Form({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isLoading = false,
}: {{ENTITY_NAME}}FormProps): JSX.Element {
  const { toast } = useToast();

  const form = useForm<{{ENTITY_NAME}}FormValues>({
    resolver: zodResolver({{ENTITY_NAME_LOWER}}FormSchema),
    defaultValues: initialValues || {
      name: '',
      email: '',
      phone: '',
      status: 'active',
      description: '',
      priority: 5,
    },
  });

  const handleFormSubmit = async (data: {{ENTITY_NAME}}FormValues): Promise<void> => {
    try {
      await onSubmit(data);
      
      toast({
        title: 'Success',
        description: '{{ENTITY_NAME}} saved successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save {{ENTITY_NAME}}',
      });
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleFormSubmit)} 
        className="space-y-6"
        aria-label="{{ENTITY_NAME}} form"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter name"
                  {...field}
                  aria-required="true"
                />
              </FormControl>
              <FormDescription>
                The name must be 2-200 characters (letters, numbers, basic punctuation)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+49-89-1234567"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Select */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger aria-required="true">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Textarea */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional description (max 1000 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority Number Input */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  aria-required="true"
                />
              </FormControl>
              <FormDescription>
                Priority level (1-10, where 10 is highest)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              aria-label="Cancel"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            aria-label={submitLabel}
          >
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
