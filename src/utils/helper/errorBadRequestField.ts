import { ApolloError } from '@apollo/client';

import {
  AxiosRestErrorResponse,
  IChildren,
  IErrorResponseExtensionGql,
} from '@/types/global';

interface IReponse<T> {
  type: string;
  name: keyof T;
  message: string;
}

export const errorRestBadRequestField = <T>(err: AxiosRestErrorResponse<T>) => {
  const flattenErrors = (errors: IChildren<T>[], prefix = '') => {
    return errors.reduce(
      (acc: IReponse<T>[], { property, children, constraints }) => {
        const currentPrefix = prefix
          ? `${prefix}.${property as string}`
          : property;

        if (children && children.length > 0) {
          acc.push(...flattenErrors(children, currentPrefix as string));
        } else {
          for (const key in constraints) {
            if (Object.prototype.hasOwnProperty.call(constraints, key)) {
              const message = constraints[key];
              acc.push({
                type: 'manual',
                name: currentPrefix as any,
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

  return err.response?.data.errors.reduce((acc: IReponse<T>[]) => {
    if (err.response?.data.statusCode === 400 && err.response.data.errors) {
      acc.push(...flattenErrors(err.response.data.errors));
    }
    return acc;
  }, []);
};

export const errorBadRequestField = <T>(err: ApolloError) => {
  const flattenErrors = (errors: IChildren<T>[], prefix = '') => {
    return errors.reduce(
      (acc: IReponse<T>[], { property, children, constraints }) => {
        const currentPrefix = prefix
          ? `${prefix}.${property as string}`
          : property;

        if (children && children.length > 0) {
          acc.push(...flattenErrors(children, currentPrefix as string));
        } else {
          for (const key in constraints) {
            if (Object.prototype.hasOwnProperty.call(constraints, key)) {
              const message = constraints[key];
              acc.push({
                type: 'manual',
                name: currentPrefix as any,
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

  return err.graphQLErrors.reduce((acc: IReponse<T>[], { extensions }) => {
    const newExtensions = extensions as IErrorResponseExtensionGql<T>;
    if (
      newExtensions.code === 'BAD_REQUEST' &&
      newExtensions.originalError.errors
    ) {
      acc.push(...flattenErrors(newExtensions.originalError.errors));
    }
    return acc;
  }, []);
};
