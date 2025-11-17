import { AlertCircle } from 'lucide-react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Unauthorized Page Component
 *
 * Shows "Access Denied" message when user tries to access a route
 * they don't have permission for.
 *
 * @example
 * ```tsx
 * <Route path="/unauthorized" element={<UnauthorizedPage />} />
 * ```
 */
export function UnauthorizedPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const reason =
    (location.state as { reason?: string })?.reason ||
    'Insufficient permissions';

  const handleGoHome = (): void => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Zugriff verweigert</CardTitle>
          <CardDescription className="mt-2">
            Sie haben keine Berechtigung, auf diese Seite zuzugreifen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reason && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Grund:</strong> {reason}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button onClick={handleGoHome} className="w-full">
              Zum Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Zurück
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
