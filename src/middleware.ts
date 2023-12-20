// import type { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { IPermissionAuth } from '@/types/global';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_JWT_SECRET,
  });

  const accessToken = token?.login?.accessToken?.token;

  // // JIKA BELUM LOGIN DAN INGIN AKSES HALAMAN YANG DIPROTECT(MATCH CONFIG) LOGIN MAKA AKAN DILEMPAR KE HALAMAN LOGIN
  if (pathname !== '/' && !accessToken) {
    const url = new URL(`/`, request.url);
    return NextResponse.redirect(url);
  }

  // // JIKA SUDAH LOGIN DAN INGIN AKSES AUTH TANPA LOGOUT MAKAN AKAN DIKEMBALIKAN KE HALAMAN DASHBOARD
  if (pathname === '/' && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const protectedPaths = [
    {
      path: '/dashboard',
      allowedPermissions: ['all'],
    },
    {
      path: '/master-data/company',
      allowedPermissions: ['create-company'],
    },
    {
      path: '/master-data/human-resources',
      allowedPermissions: ['create-human-resources'],
    },
    {
      path: '/master-data/heavy-equipment',
      allowedPermissions: ['create-heavy-equipment'],
    },
    {
      path: '/master-data/location',
      allowedPermissions: ['create-location'],
    },
    {
      path: '/master-data/block',
      allowedPermissions: ['create-block'],
    },
    {
      path: '/master-data/stockpile',
      allowedPermissions: ['create-stockpile'],
    },
    {
      path: '/master-data/material',
      allowedPermissions: ['create-material'],
    },
    {
      path: '/master-data/material',
      allowedPermissions: ['create-material'],
    },
    {
      path: '/master-data/working-hours-plan',
      allowedPermissions: ['create-working-hour-plan'],
    },
    {
      path: '/master-data/activity-plan',
      allowedPermissions: ['create-activity-plan'],
    },
    {
      path: '/master-data/element',
      allowedPermissions: ['create-element'],
    },
    {
      path: '/master-data/shift',
      allowedPermissions: ['create-shift'],
    },
    {
      path: '/master-data/factory',
      allowedPermissions: ['create-factory'],
    },
    {
      path: '/reference/company-type',
      allowedPermissions: ['create-company-type'],
    },
    {
      path: '/reference/heavy-equipment-class',
      allowedPermissions: ['create-heavy-equipment-class'],
    },
    {
      path: '/reference/heavy-equipment',
      allowedPermissions: ['create-heavy-equipment-reference'],
    },
    {
      path: '/input-data/quality-control-management/stockpile-monitoring',
      allowedPermissions: ['create-monitoring-stockpile'],
    },
    {
      path: '/input-data/quality-control-management/sample-house-lab',
      allowedPermissions: ['create-house-sample-and-lab'],
    },
    {
      path: '/input-data/production/data-ritage',
      allowedPermissions: [
        'create-ore-ritage',
        'create-overburden-ritage',
        'create-quarry-ritage',
        'create-barging-ritage',
        'create-moving-ritage',
        'create-topsoil-ritage',
      ],
    },
    {
      path: '/setting/management-role',
      allowedPermissions: ['create-role'],
    },
    {
      path: '/setting/user',
      allowedPermissions: ['create-user'],
    },
  ];

  // const cleanedPath = pathname.split('/').slice(0, 4).join('/');

  const matchProtectedPath = protectedPaths.find(
    (path) => path.path === pathname
  );

  if (matchProtectedPath && token) {
    const now = dayjs().unix();
    const url = new URL(`/not-found`, request.url);

    if (now < token.login?.accessToken?.exp) {
      const baseURL = process.env.NEXT_PUBLIC_REST_API_URL;
      const authorization = token
        ? `Bearer ${token.login.accessToken.token}`
        : '';

      try {
        const response = await fetch(`${baseURL}/auth/profile/permissions`, {
          method: 'GET',
          headers: { authorization },
        });

        const { data } = await response.json();
        const permission = (data as IPermissionAuth[]).map((val) => val.slug);
        const validAccess = matchProtectedPath?.allowedPermissions.some(
          (allow) => {
            const permissionWithAll = [...permission, 'all'];
            return permissionWithAll.some((permission) => permission === allow);
          }
        );
        if (validAccess) {
          return NextResponse.next();
        } else {
          return NextResponse.rewrite(url);
        }
      } catch (error) {
        return NextResponse.rewrite(url);
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/master-data/:path*',
    '/reference/:path*',
    '/input-data/:path*',
    '/setting/:path*',
  ],
};
