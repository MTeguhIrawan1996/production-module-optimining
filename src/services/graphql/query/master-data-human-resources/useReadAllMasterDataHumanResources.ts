import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MASTER_DATA_HUMAN_RESOURCES = gql`
  query ReadAllHumanResources(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $religionId: String
    $marriageStatusId: String
    $gender: String
  ) {
    humanResources(
      findAllHumanResourceInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        religionId: $religionId
        marriageStatusId: $marriageStatusId
        gender: $gender
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
        email
        phoneNumber
        identityNumber
      }
    }
  }
`;

export interface IHumanResourcesData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  identityNumber: string;
}

interface IHumanResourcesResponse {
  humanResources: GResponse<IHumanResourcesData>;
}

interface IHumanResourcesRequest extends IGlobalMetaRequest {
  religionId: string | null;
  marriageStatusId: string | null;
  gender: string | null;
}

export const useReadAllHumanResourcesMasterData = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IHumanResourcesRequest>;
  onCompleted?: (data: IHumanResourcesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: humanResourcesData,
    loading: humanResourcesDataLoading,
    refetch,
  } = useQuery<IHumanResourcesResponse, Partial<IHumanResourcesRequest>>(
    READ_ALL_MASTER_DATA_HUMAN_RESOURCES,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    humanResourcesData: humanResourcesData?.humanResources.data,
    humanResourcesDataMeta: humanResourcesData?.humanResources.meta,
    humanResourcesDataLoading,
    refetchHumanResources: refetch,
  };
};
