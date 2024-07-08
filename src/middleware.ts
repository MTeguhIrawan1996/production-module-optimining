/* eslint-disable no-console */
import Cookies from 'js-cookie';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import {
  CHECK_PERMISSION_USER_MIDLLEWARE,
  IGetCheckPermissionResponse,
} from '@/services/graphql/query/auth/useCheckPermission';
import { checkAccess } from '@/utils/constants/Auth/check-access';

export interface IPermissionAuth {
  id: string;
  slug: string;
}

const storedLanguage = Cookies.get('language');
const initialLanguage = storedLanguage || 'id';

export async function middleware(request: NextRequest) {
  const loginPage = new URL(`/auth/signin`, request.url);
  const dashboardPage = new URL('/dashboard', request.url);
  const errorPage = new URL('/500', request.url);
  const notFoundPage = new URL(`/not-found`, request.url);
  const { pathname } = request.nextUrl;
  const cleanedPath = pathname.split('/').slice(0, 3).join('/');
  const cleanedPath2 = pathname.split('/').slice(0, 4).join('/');

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_JWT_SECRET,
  });

  const authorization = token
    ? `Bearer ${token?.login?.accessToken?.token}`
    : '';

  const objAccess = checkAccess.find(
    (v) => v.path === cleanedPath || v.path === cleanedPath2
  );
  const variable = {
    moduleSlug: objAccess?.moduleSlug || [],
  };

  const url = new URL(`${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}`);
  url.searchParams.append('query', CHECK_PERMISSION_USER_MIDLLEWARE);
  url.searchParams.append('variables', JSON.stringify(variable));

  console.log('USER AKSES PAGE', { cleanedPath, cleanedPath2 });

  // SEMENTARA, `/` DIARAHKAN KE /dashboard
  if (pathname === '/') {
    console.log('USER ACCES / REDIRECT TO DASHBOARD');
    return NextResponse.redirect(dashboardPage);
  }

  // JIKA TIDAK MEMILIKI TOKEN/BELUM LOGIN DAN INGIN MENGAKSES HALAMAN DIDALAM LOGIN MAKA AKAN DILEMPAR KE LOGIN PAGE
  if (!pathname.startsWith('/auth') && !token) {
    console.log('USER NOT LOGIN');
    return NextResponse.redirect(loginPage);
  }

  if (token) {
    // JIKA SUDAH LOGIN DAN INGIN AKSES HALAMAN AUTH TANPA LOGOUT MAKA AKAN DIKEMBALIKAN KE HALAMAN DASHBOARD
    if (pathname.startsWith('/auth')) {
      console.log('USER ACCES PAGE LOGIN NOT LOGOUT');
      return NextResponse.redirect(dashboardPage);
    }

    console.log('VARIABLE GET', variable);
    // JIKA ADA TOKEN CEK APAKAH ACCES VALID
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept-Language': initialLanguage,
          Authorization: authorization,
          'Content-Type': 'application/json',
        },
      });
      const data: IGetCheckPermissionResponse = await response.json();
      const permission =
        pathname === '/dashboard'
          ? ['dashboard']
          : data.data.checkPermissions.map((val) => val.slug);

      console.log(permission, 'PERMISSION');

      if (permission.length === 0) {
        console.log('INVALID ACCESS');
        return NextResponse.redirect(notFoundPage);
      }

      console.log('VALID ACCES');
      // JIKA TOKEN EXPIRED, PROSES AKAN DILANJUTKAN DAN AKAN OTOMATIS LOGOUT KETIKA MELAKUKAN REQUEST
      return NextResponse.next();
    } catch (error) {
      console.log({ error });
      console.log('ERROR PAGE');
      return NextResponse.redirect(errorPage);
    }
  }
  console.log('RETURN UNPROTECTH PATH');
  return NextResponse.next();
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
