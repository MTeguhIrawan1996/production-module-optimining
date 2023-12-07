import { GraphQLClient } from 'graphql-request';
import Cookies from 'js-cookie';

const storedLanguage = Cookies.get('language');
const initialLanguage = storedLanguage || 'id';

export const gqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '',
  {
    method: `GET`,
    headers: {
      'Accept-Language': initialLanguage,
    },
    jsonSerializer: {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
  }
);
