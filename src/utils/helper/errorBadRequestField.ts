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

// export const errorBadRequestField = <T>(err: ApolloError) => {
//   return err.graphQLErrors.reduce((acc: IReponse<T>[], { extensions }) => {
//     const newExtensions = extensions as IErrorResponseExtensionGql<T>;
//     if (newExtensions.code === 'BAD_REQUEST') {
//       newExtensions.originalError.errors?.forEach(
//         ({ property, children, constraints }) => {
//           if (children.length > 0) {
//             children.forEach(({ property: property1, children: children1 }) => {
//               children1.forEach(
//                 ({
//                   constraints: constraints2,
//                   property: property2,
//                   children: children2,
//                 }) => {
//                   if (children2.length > 0) {
//                     children2.forEach(
//                       ({
//                         property: property3,
//                         children: children3,
//                         constraints: constraints3,
//                       }) => {
//                         if (children3.length > 0) {
//                           children3.forEach(
//                             ({
//                               constraints: constraints4,
//                               property: property4,
//                             }) => {
//                               for (const key in constraints4) {
//                                 if (
//                                   Object.prototype.hasOwnProperty.call(
//                                     constraints4,
//                                     key
//                                   )
//                                 ) {
//                                   const message = constraints4[key];
//                                   const name = `${property as string}.${
//                                     property1 as string
//                                   }.${property2 as string}.${
//                                     property3 as string
//                                   }.${property4 as string}`;
//                                   acc.push({
//                                     type: 'manual',
//                                     name: name as any,
//                                     message,
//                                   });
//                                 }
//                               }
//                             }
//                           );
//                           return;
//                         }
//                         for (const key in constraints3) {
//                           if (
//                             Object.prototype.hasOwnProperty.call(
//                               constraints3,
//                               key
//                             )
//                           ) {
//                             const message = constraints3[key];
//                             const name = `${property as string}.${
//                               property1 as string
//                             }.${property2 as string}.${property3 as string}`;
//                             acc.push({
//                               type: 'manual',
//                               name: name as any,
//                               message,
//                             });
//                           }
//                         }
//                       }
//                     );
//                     return;
//                   }
//                   for (const key in constraints2) {
//                     if (
//                       Object.prototype.hasOwnProperty.call(constraints2, key)
//                     ) {
//                       const message = constraints2[key];
//                       const name = `${property as string}.${
//                         property1 as string
//                       }.${property2 as string}`;
//                       acc.push({
//                         type: 'manual',
//                         name: name as any,
//                         message,
//                       });
//                     }
//                   }
//                 }
//               );
//             });
//             return;
//           }
//           for (const key in constraints) {
//             if (Object.prototype.hasOwnProperty.call(constraints, key)) {
//               const message = constraints[key];
//               acc.push({
//                 type: 'manual',
//                 name: property,
//                 message,
//               });
//             }
//           }
//         }
//       );
//     }
//     return acc;
//   }, []);
// };

// export const errorRestBadRequestField = <T>(err: AxiosRestErrorResponse<T>) => {
//   return err.response?.data?.errors?.reduce(
//     (acc: IReponse<T>[], { constraints, children, property }) => {
//       if (err.response?.data.statusCode === 400) {
//         if (children.length > 0) {
//           children.forEach(({ property: indexRes, children: children1 }) => {
//             children1.forEach(
//               ({ constraints: constraints2, property: property2 }) => {
//                 for (const key in constraints2) {
//                   if (Object.prototype.hasOwnProperty.call(constraints2, key)) {
//                     const message = constraints2[key];
//                     const name = `${property as string}.${indexRes as string}.${
//                       property2 as string
//                     }`;
//                     acc.push({
//                       type: 'manual',
//                       name: name as any,
//                       message,
//                     });
//                   }
//                 }
//               }
//             );
//           });
//         }
//         for (const key in constraints) {
//           if (Object.prototype.hasOwnProperty.call(constraints, key)) {
//             const message = constraints[key];
//             acc.push({
//               type: 'manual',
//               name: property,
//               message,
//             });
//           }
//         }
//       }
//       return acc;
//     },
//     []
//   );
// };

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
