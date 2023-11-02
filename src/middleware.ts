// import type { NextRequest } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_JWT_SECRET,
  });

  // const accessToken = token?.login?.accessToken?.token;

  // // JIKA BELUM LOGIN DAN INGIN AKSES HALAMAN YANG DIPROTECT(MATCH CONFIG) LOGIN MAKA AKAN DILEMPAR KE HALAMAN LOGIN
  // if (pathname !== '/' && !accessToken) {
  //   const url = new URL(`/`, request.url);
  //   return NextResponse.redirect(url);
  // }

  // // JIKA SUDAH LOGIN DAN INGIN AKSES AUTH TANPA LOGOUT MAKAN AKAN DIKEMBALIKAN KE HALAMAN DASHBOARD
  // if (pathname === '/' && accessToken) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  const protectedPaths = [
    {
      path: '/dashboard',
      allowedPermissions: ['all'],
    },
    {
      path: '/exmaple/data-table',
      allowedPermissions: ['all'],
    },
  ];

  // const cleanedPath = pathname.split('/').slice(0, 4).join('/');

  const matchProtectedPath = protectedPaths.find(
    (path) => path.path === pathname
  );

  if (matchProtectedPath && token && token.permission) {
    const validAccess = matchProtectedPath?.allowedPermissions.some((allow) =>
      token.permission?.some(
        (permission) => allow === permission.slug || allow === 'all'
      )
    );
    if (validAccess) {
      return NextResponse.next();
    } else {
      const url = new URL(`/not-found`, request.url);
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/example/:path*'],
};
