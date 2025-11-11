/**
 * {{COMPONENT_NAME}} Component
 * 
 * IMPORTANT: This component uses shadcn/ui components ONLY
 * NEVER create custom UI components - always use shadcn/ui
 * 
 * Installation: pnpm dlx shadcn-ui@latest add [component-name]
 * 
 * Usage: Replace {{COMPONENT_NAME}} with your component name
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

/**
 * Props for {{COMPONENT_NAME}} component
 */
interface {{COMPONENT_NAME}}Props {
  // TODO: Add your component props
  id?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * {{COMPONENT_NAME}} - {{DESCRIPTION}}
 * 
 * Features:
 * - Uses shadcn/ui components exclusively
 * - Accessible (WCAG 2.1 AA compliant)
 * - Mobile-first responsive
 * - Loading states
 * - Error handling
 * 
 * @example
 * ```tsx
 * <{{COMPONENT_NAME}} 
 *   id="123"
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function {{COMPONENT_NAME}}({ 
  id,
  onSave,
  onCancel 
}: {{COMPONENT_NAME}}Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // TODO: Implement your logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Operation completed successfully',
      });
      
      onSave?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{{COMPONENT_NAME}}</CardTitle>
        <CardDescription>
          {{DESCRIPTION}}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* TODO: Add your component content using shadcn/ui components */}
        <p className="text-sm text-muted-foreground">
          Component content goes here
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          aria-label="Cancel"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          aria-label="Save changes"
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
