import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, onChange, onInput, ...props }, ref) => {
    // Handle both onChange and onInput to support browser automation tools
    // Browser automation tools may trigger onInput without triggering onChange
    // React Hook Form uses onChange, so we ensure onChange is called when onInput is triggered
    const handleInput = React.useCallback(
      (e: React.FormEvent<HTMLInputElement>) => {
        // Call onInput if provided (rare, but support it)
        if (onInput) {
          onInput(e);
        }
        // Also trigger onChange to ensure React Hook Form updates
        // Browser automation tools often trigger onInput but not onChange
        if (onChange && e.currentTarget) {
          // Create a synthetic change event compatible with React Hook Form
          const syntheticEvent = {
            ...e,
            target: e.currentTarget,
            currentTarget: e.currentTarget,
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      },
      [onChange, onInput]
    );

    // Normal onChange handler - React Hook Form will use this
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(e);
        }
      },
      [onChange]
    );

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        onChange={handleChange}
        onInput={handleInput}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
