export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clients/:path*',
    '/projects/:path*',
    '/tasks/:path*',
    '/time-tracking/:path*',
    '/invoices/:path*',
    '/team/:path*',
    '/settings/:path*',
    '/api/clients/:path*',
    '/api/projects/:path*',
    '/api/tasks/:path*',
    '/api/time-entries/:path*',
    '/api/invoices/:path*',
    '/api/team/:path*',
    '/api/dashboard/:path*',
  ],
}
