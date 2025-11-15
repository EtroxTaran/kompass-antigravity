// Temporary toast hook stub until shadcn/ui toast is available
export function useToast() {
  return {
    toast: (options: {
      title?: string;
      description?: string;
      variant?: string;
    }) => {
      console.log('Toast:', options);
    },
  };
}
