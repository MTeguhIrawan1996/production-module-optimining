import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';

import {
  GResponse,
  ICommonRitagesData,
  IGlobalMetaRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_TOPSOIL = gql`
  query ReadAllRitageTopsoil(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
  ) {
    topsoilRitages(
      findAllTopsoilRitageInput: {
        page: $page
        limit: $limit
        date: $date
        orderBy: $orderBy
        orderDir: $orderDir
        shiftId: $shiftId
        companyHeavyEquipmentId: $companyHeavyEquipmentId
        isRitageProblematic: $isRitageProblematic
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
        date
        shift {
          id
          name
        }
        companyHeavyEquipment {
          id
          hullNumber
        }
        material {
          id
          name
        }
        subMaterial {
          id
          name
        }
        fromAt
        arriveAt
        toLocation {
          id
          name
        }
        status {
          id
          name
          color
        }
        isComplete
        isRitageProblematic
      }
    }
  }
`;

interface IOtherQuaryRitgaeProps {
  toLocation: Pick<ILocationsData, 'id' | 'name'> | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
}

interface ITopsoilRitagesResponse {
  topsoilRitages: GResponse<ICommonRitagesData<IOtherQuaryRitgaeProps>>;
}

interface ITopsoilRitagesRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadAllRitageTopsoil = ({
  variables,
  onCompleted,
  onError,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: ITopsoilRitagesRequest;
  onCompleted?: (data: ITopsoilRitagesResponse) => void;
  onError?: ({ graphQLErrors }: ApolloError) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: topsoilRitagesData,
    loading: topsoilRitagesDataLoading,
    refetch,
  } = useQuery<ITopsoilRitagesResponse, ITopsoilRitagesRequest>(
    READ_ALL_RITAGE_TOPSOIL,
    {
      variables: variables,
      skip: skip,
      onError,
      onCompleted,
      fetchPolicy,
    }
  );

  return {
    topsoilRitagesData: topsoilRitagesData?.topsoilRitages.data,
    topsoilRitagesDataMeta: topsoilRitagesData?.topsoilRitages.meta,
    topsoilRitagesDataLoading,
    refetchTopsoilRitages: refetch,
  };
};
