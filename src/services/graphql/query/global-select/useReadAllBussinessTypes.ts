import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_BUSINESS_TYPE = gql`
  query ReadAllBussinessType(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    companyBusinessTypes(
      findAllCompanyBusinessTypeInput: {
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

export interface ICompanyBusinessTypesData {
  id: string;
  name: string;
  slug: string;
}

interface ICompanyBusinessTypesResponse {
  companyBusinessTypes: GResponse<ICompanyBusinessTypesData>;
}

export const useReadAllBussinessTypes = ({
  variables,
  onCompleted,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: ICompanyBusinessTypesResponse) => void;
}) => {
  const {
    data: companyBusinessTypesdata,
    loading: companyBusinessTypesLoading,
  } = useQuery<ICompanyBusinessTypesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_BUSINESS_TYPE,
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
    companyBusinessTypesdata:
      companyBusinessTypesdata?.companyBusinessTypes.data,
    companyBusinessTypesMeta:
      companyBusinessTypesdata?.companyBusinessTypes.meta,
    companyBusinessTypesLoading,
  };
};
