import { ApolloError } from '@apollo/client';

import {
  AxiosRestErrorResponse,
  IErrorResponseExtensionGql,
} from '@/types/global';

interface IReponse<T> {
  type: string;
  name: keyof T;
  message: string;
}

export const errorBadRequestField = <T>(err: ApolloError) => {
  return err.graphQLErrors.reduce((acc: IReponse<T>[], { extensions }) => {
    const newExtensions = extensions as IErrorResponseExtensionGql<T>;
    if (newExtensions.code === 'BAD_REQUEST') {
      newExtensions.originalError.errors?.forEach(
        ({ property, constraints }) => {
          for (const key in constraints) {
            if (Object.prototype.hasOwnProperty.call(constraints, key)) {
              const message = constraints[key];
              acc.push({
                type: 'manual',
                name: property,
                message,
              });
            }
          }
        }
      );
    }
    return acc;
  }, []);
};

export const errorRestBadRequestField = <T>(err: AxiosRestErrorResponse<T>) => {
  return err.response?.data?.errors?.reduce(
    (acc: IReponse<T>[], { constraints, property }) => {
      if (err.response?.data.statusCode === 400) {
        for (const key in constraints) {
          if (Object.prototype.hasOwnProperty.call(constraints, key)) {
            const message = constraints[key];
            acc.push({
              type: 'manual',
              name: property,
              message,
            });
          }
        }
      }
      return acc;
    },
    []
  );
};
