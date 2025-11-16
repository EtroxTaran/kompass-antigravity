// Temporary toast hook stub until shadcn/ui toast is available
export function useToast(): {
  toast: (options: {
    title?: string;
    description?: string;
    variant?: string;
  }) => void;
} {
  return {
    toast: (options: {
      title?: string;
      description?: string;
      variant?: string;
    }): void => {
      // eslint-disable-next-line no-console
      console.log('Toast:', options);
    },
  };
}
