import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export interface IPermissionAuth {
  id: string;
  slug: string;
}

export async function middleware(request: NextRequest) {
  const loginPage = new URL(`/auth/signin`, request.url);
  const dashboardPage = new URL('/dashboard', request.url);
  const errorPage = new URL('/500', request.url);
  const notFoundPage = new URL(`/not-found`, request.url);

  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_JWT_SECRET,
  });

  const REST_API_URL = process.env.NEXT_PUBLIC_REST_API_URL;
  const authorization = token
    ? `Bearer ${token?.login?.accessToken?.token}`
    : '';

  try {
    const response = await fetch(`${REST_API_URL}/auth/profile/permissions`, {
      method: 'GET',
      headers: { authorization },
    });
    const { data } = await response.json();

    const permission = (data as IPermissionAuth[] | undefined)?.map(
      (val) => val.slug
    );

    // // JIKA BELUM LOGIN DAN INGIN AKSES HALAMAN SELAIN AUTH, MAKA AKAN DILEMPAR KE HALAMAN LOGIN
    if (!pathname.startsWith('/auth') && !permission) {
      return NextResponse.redirect(loginPage);
    }

    // // JIKA SUDAH LOGIN DAN INGIN AKSES HALAMAN AUTH TANPA LOGOUT MAKA AKAN DIKEMBALIKAN KE HALAMAN DASHBOARD
    if (pathname.startsWith('/auth') && permission) {
      return NextResponse.redirect(dashboardPage);
    }

    // SEMENTARA, `/` DIARAHKAN KE /dashboard
    if (pathname === '/') {
      return NextResponse.redirect(dashboardPage);
    }

    const protectedPaths = [
      {
        path: '/dashboard',
        allowedPermissions: ['all'], // FIXME: siapa yang bisa akses dashboard ?
      },
      {
        path: '/master-data/company',
        allowedPermissions: ['create-company'],
      },
      {
        path: '/master-data/human-resources',
        allowedPermissions: ['create-human-resource'],
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
        path: '/master-data/activity-category',
        allowedPermissions: [
          'create-working-hour-plan-category',
          'create-heavy-equipment-data-formula',
        ],
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
        allowedPermissions: ['update-monitoring-stockpile'],
      },
      {
        path: '/input-data/quality-control-management/sample-house-lab',
        allowedPermissions: ['create-house-sample-and-lab'],
      },
      {
        path: '/input-data/quality-control-management/shipping-monitoring',
        allowedPermissions: ['create-monitoring-barging'],
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
        path: '/input-data/production/data-heavy-equipment',
        allowedPermissions: ['create-heavy-equipment-data'],
      },
      {
        path: '/input-data/production/data-weather',
        allowedPermissions: ['create-weather-data'],
      },
      {
        path: '/input-data/production/data-front',
        allowedPermissions: ['create-front-data'],
      },
      {
        path: '/plan/weekly',
        allowedPermissions: ['create-weekly-plan'],
      },
      {
        path: '/plan/monthly',
        allowedPermissions: ['create-monthly-plan'],
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

    const matchProtectedPath = protectedPaths.find(
      (path) => path.path === pathname
    );

    // JIKA PATH ADALAH PROTECTED PATHS, ...
    if (matchProtectedPath && token) {
      console.log('protected path'); // eslint-disable-line

      const now = dayjs().unix();

      const validAccess = matchProtectedPath?.allowedPermissions.some(
        (allow) => {
          const permissionWithAll = [...(permission ?? []), 'all'];
          return permissionWithAll.some((permission) => permission === allow);
        }
      );
      // JIKA TOKEN EXPIRED, LEMPAR KE LOGIN
      if (now > token.login?.accessToken?.exp) {
        return NextResponse.next();
      }

      // JIKA TOKEN TIDAK MEMILIKI HAK AKSES ATAS PATH, ARAHKAN KE /not-found
      if (!validAccess) {
        return NextResponse.redirect(notFoundPage);
      }
      return NextResponse.next();
    }

    // JIKA PATH BUKAN PROTECTED PATHS, LANJUTKAN
    console.log('unprotected path'); // eslint-disable-line

    return NextResponse.next();
  } catch (error) {
    console.log('error | middleware', error); // eslint-disable-line
    return NextResponse.redirect(errorPage);
  }
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/',
    '/dashboard/:path*',
    '/master-data/:path*',
    '/reference/:path*',
    '/input-data/:path*',
    '/plan/:path*',
    '/setting/:path*',
  ],
};
