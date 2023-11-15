import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_COMPANY_PERMISSION_TYPE = gql`
  query ReadAllCompanyPermissionType(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    companyPermissionTypes(
      findAllCompanyPermissionTypeInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        name
        slug
      }
    }
  }
`;

export interface ICompanyPermissionTypesData {
  id: string;
  name: string;
  slug: string;
}

interface ICompanyPermissionTypesResponse {
  companyPermissionTypes: GResponse<ICompanyPermissionTypesData>;
}

export const useReadAllCompanyPermissionTypes = ({
  variables,
  onCompleted,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: ICompanyPermissionTypesResponse) => void;
}) => {
  const {
    data: companyPermissionTypesdata,
    loading: companyPermissionTypesLoading,
  } = useQuery<ICompanyPermissionTypesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_COMPANY_PERMISSION_TYPE,
    {
      variables: variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-first',
    }
  );

  return {
    companyPermissionTypesdata:
      companyPermissionTypesdata?.companyPermissionTypes.data,
    companyPermissionTypesMeta:
      companyPermissionTypesdata?.companyPermissionTypes.meta,
    companyPermissionTypesLoading,
  };
};
