import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect all /admin routes
    if (path.startsWith('/admin')) {
        // Allow login page without authentication
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        // Check for admin session token
        const adminToken = request.cookies.get('admin_session');

        // If no token, redirect to login
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Verify token is valid (basic check)
        if (adminToken.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};
