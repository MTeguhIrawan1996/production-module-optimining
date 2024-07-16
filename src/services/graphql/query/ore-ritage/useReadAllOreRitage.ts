import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import {
  GResponse,
  ICommonRitagesData,
  IGlobalMetaRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_ORE = gql`
  query ReadAllRitageOre(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
  ) {
    oreRitages(
      findAllOreRitageInput: {
        page: $page
        limit: $limit
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
        subMaterial {
          id
          name
        }
        fromAt
        arriveAt
        fromPit {
          id
          name
        }
        dome {
          id
          name
        }
        sampleNumber
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

interface IOtherProps {
  fromPit: Pick<ILocationsData, 'id' | 'name'> | null;
  dome: Pick<IStockpilesData, 'id' | 'name'> | null;
  sampleNumber: string | null;
}

interface IOreRitagesResponse {
  oreRitages: GResponse<ICommonRitagesData<IOtherProps>>;
}

interface IOreRitagesRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadAllRitageOre = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: IOreRitagesRequest;
  onCompleted?: (data: IOreRitagesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: oreRitagesData,
    loading: oreRitagesDataLoading,
    refetch,
  } = useQuery<IOreRitagesResponse, IOreRitagesRequest>(READ_ALL_RITAGE_ORE, {
    variables: variables,
    skip: skip,
    notifyOnNetworkStatusChange: true,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
  });

  return {
    oreRitagesData: oreRitagesData?.oreRitages.data,
    oreRitagesDataMeta: oreRitagesData?.oreRitages.meta,
    oreRitagesDataLoading,
    refetchOreRitages: refetch,
  };
};
