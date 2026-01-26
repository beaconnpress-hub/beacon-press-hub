// Authentication utilities for Beacon Press Hub admin

export interface AdminUser {
    email: string;
    role: 'admin' | 'moderator';
    permissions: string[];
}

// TODO: Replace with Supabase Auth
// For MVP: Basic in-memory authentication

const ADMIN_CREDENTIALS = {
    email: "admin@beaconpress.com",
    password: "Beacon123!@#", // Change in production!
    role: "admin" as const,
    permissions: ["posts.create", "posts.edit", "posts.delete", "sponsors.manage", "marketplace.moderate"]
};

/**
 * Validate admin credentials (MVP - replace with Supabase Auth)
 */
export function validateCredentials(email: string, password: string): boolean {
    return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

/**
 * Get admin user info
 */
export function getAdminUser(): AdminUser {
    return {
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role,
        permissions: ADMIN_CREDENTIALS.permissions
    };
}

/**
 * Check if user has permission
 */
export function hasPermission(permission: string): boolean {
    return ADMIN_CREDENTIALS.permissions.includes(permission);
}

/**
 * Create session token
 */
export function createSessionToken(): string {
    return 'authenticated'; // MVP - should be JWT in production
}

/**
 * Verify session token
 */
export function verifySessionToken(token: string): boolean {
    return token === 'authenticated'; // MVP
}

/**
 * Logout admin
 */
export function logout(): void {
    if (typeof document !== 'undefined') {
        document.cookie = 'admin_session=; path=/; max-age=0';
    }
}
