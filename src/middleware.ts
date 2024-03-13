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
    // eslint-disable-next-line no-console
    console.log('Success get permission');

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
        allowedPermissions: ['read-company'],
      },
      {
        path: '/master-data/human-resources',
        allowedPermissions: ['read-human-resource'],
      },
      {
        path: '/master-data/heavy-equipment',
        allowedPermissions: ['read-heavy-equipment'],
      },
      {
        path: '/master-data/location',
        allowedPermissions: ['read-location'],
      },
      {
        path: '/master-data/block',
        allowedPermissions: ['read-block'],
      },
      {
        path: '/master-data/stockpile',
        allowedPermissions: ['read-stockpile'],
      },
      {
        path: '/master-data/material',
        allowedPermissions: ['read-material'],
      },
      {
        path: '/master-data/material',
        allowedPermissions: ['read-material'],
      },
      {
        path: '/master-data/working-hours-plan',
        allowedPermissions: ['read-working-hour-plan'],
      },
      {
        path: '/master-data/activity-plan',
        allowedPermissions: ['read-activity-plan'],
      },
      {
        path: '/master-data/element',
        allowedPermissions: ['read-element'],
      },
      {
        path: '/master-data/shift',
        allowedPermissions: ['read-shift'],
      },
      {
        path: '/master-data/factory',
        allowedPermissions: ['read-factory'],
      },
      {
        path: '/master-data/activity-category',
        allowedPermissions: [
          'read-working-hour-plan-category',
          'read-heavy-equipment-data-formula',
        ],
      },
      {
        path: '/reference/company-type',
        allowedPermissions: ['read-company-type'],
      },
      {
        path: '/reference/heavy-equipment-class',
        allowedPermissions: ['read-heavy-equipment-class'],
      },
      {
        path: '/reference/heavy-equipment',
        allowedPermissions: ['read-heavy-equipment-reference'],
      },
      {
        path: '/input-data/quality-control-management/stockpile-monitoring',
        allowedPermissions: ['read-monitoring-stockpile'],
      },
      {
        path: '/input-data/quality-control-management/sample-house-lab',
        allowedPermissions: ['read-house-sample-and-lab'],
      },
      {
        path: '/input-data/quality-control-management/shipping-monitoring',
        allowedPermissions: ['read-monitoring-barging'],
      },
      {
        path: '/input-data/production/data-ritage',
        allowedPermissions: [
          'read-ore-ritage',
          'read-overburden-ritage',
          'read-quarry-ritage',
          'read-barging-ritage',
          'read-moving-ritage',
          'read-topsoil-ritage',
        ],
      },
      {
        path: '/input-data/production/data-heavy-equipment',
        allowedPermissions: ['read-heavy-equipment-data'],
      },
      {
        path: '/input-data/production/data-weather',
        allowedPermissions: ['read-weather-data'],
      },
      {
        path: '/input-data/production/data-front',
        allowedPermissions: ['read-front-data'],
      },
      {
        path: '/input-data/production/map',
        allowedPermissions: ['all'],
      },
      {
        path: '/plan/weekly',
        allowedPermissions: ['read-weekly-plan'],
      },
      {
        path: '/plan/monthly',
        allowedPermissions: ['read-monthly-plan'],
      },
      {
        path: '/setting/management-role',
        allowedPermissions: ['read-role'],
      },
      {
        path: '/setting/user',
        allowedPermissions: ['read-user'],
      },
      {
        path: '/setting/user',
        allowedPermissions: ['create-user'],
      },
      // input data-map
      {
        path: '/input-data/production/map/weekly',
        allowedPermissions: ['create-map-data'],
      },
      {
        path: '/input-data/production/map/monthly',
        allowedPermissions: ['create-map-data'],
      },
      {
        path: '/input-data/production/map/quarterly',
        allowedPermissions: ['create-map-data'],
      },
      {
        path: '/input-data/production/map/yearly',
        allowedPermissions: ['create-map-data'],
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
        console.log('access invalid'); // eslint-disable-line
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
