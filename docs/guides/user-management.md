# User Management Guide

This guide explains how to manage users in the KOMPASS application.

## Overview

User management in KOMPASS involves:

- Creating and updating user accounts
- Assigning and managing roles
- Activating/deactivating users
- Synchronizing users between Keycloak and CouchDB

## Access Control

Only users with **GF** (Geschäftsführer) or **ADMIN** roles can manage users.

## User Management UI

Access the user management page at `/admin` (requires User.READ permission).

### Features

- **User List**: View all users with search and filtering
- **Create User**: Create new users with email, password, and roles
- **Edit User**: Update user information and roles
- **Delete User**: Soft delete (sets active=false)
- **Role Management**: Assign, revoke, and set primary roles

## Creating Users

### Via Application UI

1. Navigate to `/admin`
2. Click "Neuer Benutzer"
3. Fill in the form:
   - **E-Mail-Adresse**: User's email (used as username)
   - **Name**: Display name
   - **Passwort**: Must be at least 12 characters with uppercase, lowercase, number, and special character
   - **Telefonnummer** (optional): Contact phone number
   - **Rollen**: Select one or more roles
   - **Hauptrolle**: Primary role (must be in selected roles)
   - **Aktiv**: Whether user account is active
4. Click "Erstellen"

The user will be created in both Keycloak and CouchDB automatically.

### User Creation Process

1. User is created in Keycloak via Admin API
2. User is created in CouchDB with Keycloak user ID reference
3. Roles are assigned in Keycloak
4. User entity is stored in CouchDB with roles and metadata

## Editing Users

1. Navigate to `/admin`
2. Click "Bearbeiten" on a user row
3. Update user information:
   - **Name**: Can be updated
   - **E-Mail**: Cannot be changed (email is used as username in Keycloak)
   - **Telefonnummer**: Can be updated
   - **Rollen**: Can be added/removed
   - **Hauptrolle**: Can be changed (must be in roles array)
   - **Aktiv**: Can be toggled
4. Click "Aktualisieren"

**Note:** Email cannot be changed after user creation. To change email, delete and recreate the user.

## Role Management

### Assigning Roles

Users can have multiple roles. To assign roles:

1. Edit the user
2. Check the roles you want to assign
3. Select a primary role (must be one of the assigned roles)
4. Save changes

### Revoking Roles

Roles can be revoked via the API endpoint:

- `DELETE /api/v1/users/:id/roles/:roleId`

**Restrictions:**

- User must have at least one role (cannot remove last role)
- If removing the primary role, a new primary role is automatically selected from remaining roles

### Primary Role

The primary role determines:

- Default UI context
- Which permissions are checked first
- Default view in the application

Users can have multiple roles, but only one primary role at a time.

## User Status

### Active Users

Active users can:

- Log in to the application
- Access features based on their roles
- Receive notifications

### Inactive Users

Inactive users (soft deleted):

- Cannot log in
- Are hidden from most views (can be filtered)
- Can be reactivated by setting `active: true`

## User Synchronization

Users are synchronized between Keycloak and CouchDB:

- **Keycloak**: Source of truth for authentication (passwords, login sessions)
- **CouchDB**: Source of truth for user data (profile, roles, metadata)

### Synchronization Rules

1. **User Creation**: Create in Keycloak first, then CouchDB
2. **User Update**: Update both systems simultaneously
3. **Role Assignment**: Assign in Keycloak, then update CouchDB
4. **User Deletion**: Soft delete in CouchDB, hard delete in Keycloak

### Handling Sync Failures

If synchronization fails:

- Backend logs the error
- User creation/update may partially succeed
- Check backend logs for details
- Manually verify user exists in both systems

## API Endpoints

### User Management

- `GET /api/v1/users` - List all users (with filters)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Soft delete user

### Role Management

- `GET /api/v1/users/:id/roles` - Get user roles
- `PUT /api/v1/users/:id/roles` - Assign roles
- `DELETE /api/v1/users/:id/roles/:roleId` - Revoke role
- `PUT /api/v1/users/:id/primary-role` - Update primary role

## Best Practices

1. **Use Application UI**: Always create users via the application UI for proper synchronization
2. **Assign Minimal Roles**: Only assign roles that the user actually needs
3. **Set Primary Role**: Always set a primary role that matches the user's main function
4. **Deactivate Instead of Delete**: Use soft delete (set active=false) instead of hard delete
5. **Document Role Changes**: Use the reason field when assigning/revoking roles (for audit trail)
6. **Regular Review**: Periodically review user roles and access

## Troubleshooting

### User Cannot Log In

- Verify user exists in Keycloak: Check Keycloak Admin Console
- Verify user is enabled: Check `active` field in CouchDB
- Verify user has at least one role assigned
- Check password is set correctly in Keycloak

### User Not Appearing in List

- Check user's `active` status
- Verify user has required roles
- Check search/filter settings
- Verify user exists in CouchDB

### Role Changes Not Reflecting

- Check KeycloakAdminService logs for sync errors
- Verify roles exist in Keycloak realm
- Manually verify roles in Keycloak Admin Console
- Check user's token (may need to log out and back in)

### Sync Errors

- Check backend logs for Keycloak API errors
- Verify Keycloak Admin credentials are correct
- Check Keycloak is accessible from backend
- Verify network connectivity between services
