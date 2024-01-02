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
        ({ property, children, constraints }) => {
          if (children.length > 0) {
            children.forEach(({ property: property1, children: children1 }) => {
              children1.forEach(
                ({
                  constraints: constraints2,
                  property: property2,
                  children: children2,
                }) => {
                  if (children2.length > 0) {
                    children2.forEach(
                      ({ property: property3, children: children3 }) => {
                        children3.forEach(
                          ({
                            constraints: constraints4,
                            property: property4,
                          }) => {
                            for (const key in constraints4) {
                              if (
                                Object.prototype.hasOwnProperty.call(
                                  constraints4,
                                  key
                                )
                              ) {
                                const message = constraints4[key];
                                const name = `${property as string}.${
                                  property1 as string
                                }.${property2 as string}.${
                                  property3 as string
                                }.${property4 as string}`;
                                acc.push({
                                  type: 'manual',
                                  name: name as any,
                                  message,
                                });
                              }
                            }
                          }
                        );
                      }
                    );
                    return;
                  }
                  for (const key in constraints2) {
                    if (
                      Object.prototype.hasOwnProperty.call(constraints2, key)
                    ) {
                      const message = constraints2[key];
                      const name = `${property as string}.${
                        property1 as string
                      }.${property2 as string}`;
                      acc.push({
                        type: 'manual',
                        name: name as any,
                        message,
                      });
                    }
                  }
                }
              );
            });
            return;
          }
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
    (acc: IReponse<T>[], { constraints, children, property }) => {
      if (err.response?.data.statusCode === 400) {
        if (children.length > 0) {
          children.forEach(({ property: indexRes, children: children1 }) => {
            children1.forEach(
              ({ constraints: constraints2, property: property2 }) => {
                for (const key in constraints2) {
                  if (Object.prototype.hasOwnProperty.call(constraints2, key)) {
                    const message = constraints2[key];
                    const name = `${property as string}.${indexRes as string}.${
                      property2 as string
                    }`;
                    acc.push({
                      type: 'manual',
                      name: name as any,
                      message,
                    });
                  }
                }
              }
            );
          });
        }
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
