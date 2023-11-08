import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_COMPANY_TYPE = gql`
  query ReadAllCompanyType(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    companyTypes(
      findAllCompanyTypeInput: {
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

export interface ICompanyTypesData {
  id: string;
  name: string;
  slug: string;
}

interface ICompanyTypesResponse {
  companyTypes: GResponse<ICompanyTypesData>;
}

export const useReadAllCompanyTypes = ({
  variables,
  onCompleted,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: ICompanyTypesResponse) => void;
}) => {
  const { data: companyTypesdata, loading: companyTypesLoading } = useQuery<
    ICompanyTypesResponse,
    Partial<IGlobalMetaRequest>
  >(READ_ALL_COMPANY_TYPE, {
    variables: variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    companyTypesdata: companyTypesdata?.companyTypes.data,
    companyTypesMeta: companyTypesdata?.companyTypes.meta,
    companyTypesLoading,
  };
};
