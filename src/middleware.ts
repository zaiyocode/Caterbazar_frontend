import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route patterns and their required roles
const ROUTE_PERMISSIONS = {
  // User routes - require 'user' role
  '/profile': ['user'],
  '/my-inquiries': ['user'],
  
  // Vendor routes - require 'vendor' role  
  '/dashboard': ['vendor'],
  
  // Super admin routes - require 'admin' role (without specific phone)
  '/superadmin': ['admin'],
  
  // Admin routes - require 'admin' role with phone number 9178114124
  '/admin': ['admin'],
};

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/vendors', // Vendor listing page (public)
  '/auth', // All auth routes including forgot password flow
];

// Function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

// Function to check if a route is a vendor detail page
function isVendorDetailPage(pathname: string): boolean {
  const vendorDetailPattern = /^\/vendors\/[a-fA-F0-9]{24}$/;
  return vendorDetailPattern.test(pathname);
}

// Function to get user role from request
function getUserRole(request: NextRequest): string | null {
  // Try to get role from cookie first
  const roleCookie = request.cookies.get('userRole')?.value;
  if (roleCookie) return roleCookie;
  
  // Fallback: try to get from localStorage (this won't work in middleware, but we'll handle it)
  // The client-side will need to set cookies when auth state changes
  return null;
}

// Function to get user phone number from request
function getUserPhoneNumber(request: NextRequest): string | null {
  const phoneCookie = request.cookies.get('userPhoneNumber')?.value;
  return phoneCookie || null;
}

// Function to check if user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get('accessToken')?.value;
  return !!accessToken;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Allow vendor detail pages to everyone (public access)
  if (isVendorDetailPage(pathname)) {
    return NextResponse.next();
  }
  
  // Get user authentication status and role
  const authenticated = isAuthenticated(request);
  const userRole = getUserRole(request);
  const userPhoneNumber = getUserPhoneNumber(request);
  
  // Special validation for admin role
  if (authenticated && userRole === 'admin') {
    // Admin with phone 9178114124 can access /admin routes
    if (pathname.startsWith('/admin')) {
      if (userPhoneNumber !== '9178114124') {
        // Admin role without correct phone number - redirect to superadmin dashboard
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
      }
    }
    
    // Admin without phone 9178114124 cannot access /admin routes
    if (pathname.startsWith('/superadmin')) {
      if (userPhoneNumber === '9178114124') {
        // Admin with phone number - redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }
  
  // Check specific route permissions
  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      // Check if user is authenticated
      if (!authenticated && !allowedRoles.includes('guest')) {
        // Redirect to appropriate signin page based on route
        if (route === '/admin') {
          return NextResponse.redirect(new URL('/auth/admin/signin', request.url));
        } else if (route === '/superadmin') {
          return NextResponse.redirect(new URL('/auth/superadmin/signin', request.url));
        } else if (route === '/dashboard') {
          return NextResponse.redirect(new URL('/auth/vendor/signin', request.url));
        } else {
          return NextResponse.redirect(new URL('/auth/customer/signin', request.url));
        }
      }
      
      // Check role permissions
      if (authenticated && userRole && !allowedRoles.includes(userRole)) {
        // Redirect based on user's actual role
        switch (userRole) {
          case 'user':
            return NextResponse.redirect(new URL('/profile', request.url));
          case 'vendor':
            return NextResponse.redirect(new URL('/dashboard', request.url));
          case 'admin':
            // For admin role, check phone number to decide which dashboard
            if (userPhoneNumber === '9178114124') {
              return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } else {
              return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
            }
          default:
            return NextResponse.redirect(new URL('/', request.url));
        }
      }
      
      break;
    }
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
};