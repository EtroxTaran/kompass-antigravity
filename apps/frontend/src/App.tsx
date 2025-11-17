import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { EntityType, Permission } from '@kompass/shared';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/guards/RoleGuard';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

/**
 * Main App Component
 *
 * Sets up routing and authentication context.
 * All routes except /login are protected and require authentication.
 * Routes are protected with role-based access control (RBAC).
 */
function App(): React.ReactElement {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with AppShell layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Dashboard - All authenticated users */}
            <Route
              path="/dashboard"
              element={
                <RoleGuard entityType={EntityType.Customer} permission={Permission.READ}>
                  <DashboardPage />
                </RoleGuard>
              }
            />

            {/* Customers - ADM (own), INNEN (all), GF (all) */}
            <Route
              path="/customers"
              element={
                <RoleGuard entityType={EntityType.Customer} permission={Permission.READ}>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold">Kunden</h1>
                    <p className="text-muted-foreground mt-2">
                      Kundenverwaltung wird hier implementiert.
                    </p>
                  </div>
                </RoleGuard>
              }
            />

            {/* Opportunities - ADM (own), INNEN (all), PLAN (assigned), GF (all) */}
            <Route
              path="/opportunities"
              element={
                <RoleGuard entityType={EntityType.Opportunity} permission={Permission.READ}>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold">Chancen</h1>
                    <p className="text-muted-foreground mt-2">
                      Chancenverwaltung wird hier implementiert.
                    </p>
                  </div>
                </RoleGuard>
              }
            />

            {/* Projects - PLAN (assigned), GF (all) */}
            <Route
              path="/projects"
              element={
                <RoleGuard entityType={EntityType.Project} permission={Permission.READ}>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold">Projekte</h1>
                    <p className="text-muted-foreground mt-2">
                      Projektverwaltung wird hier implementiert.
                    </p>
                  </div>
                </RoleGuard>
              }
            />

            {/* Finance - BUCH (all), GF (all) */}
            <Route
              path="/finance"
              element={
                <RoleGuard entityType={EntityType.Invoice} permission={Permission.READ}>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold">Finanzen</h1>
                    <p className="text-muted-foreground mt-2">
                      Finanzverwaltung wird hier implementiert.
                    </p>
                  </div>
                </RoleGuard>
              }
            />

            {/* Admin - GF (all) */}
            <Route
              path="/admin"
              element={
                <RoleGuard entityType={EntityType.User} permission={Permission.READ}>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold">Administration</h1>
                    <p className="text-muted-foreground mt-2">
                      Systemverwaltung wird hier implementiert.
                    </p>
                  </div>
                </RoleGuard>
              }
            />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
