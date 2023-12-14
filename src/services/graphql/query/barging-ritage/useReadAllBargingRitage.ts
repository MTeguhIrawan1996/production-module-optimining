import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import {
  GResponse,
  ICommonRitagesData,
  IGlobalMetaRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_BARGING = gql`
  query ReadAllRitageBarging(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
  ) {
    bargingRitages(
      findAllBargingRitageInput: {
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
          name
        }
        subMaterial {
          id
          name
        }
        fromAt
        arriveAt
        dome {
          id
          name
          stockpile {
            id
            name
          }
        }
        barging {
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

type IDomeWithStockpile =
  | {
      stockpile: Pick<IStockpilesData, 'id' | 'name'> | null;
    } & Pick<IStockpilesData, 'id' | 'name'>;

interface IOtherProps {
  barging: Pick<ILocationsData, 'id' | 'name'> | null;
  dome: IDomeWithStockpile | null;
  sampleNumber: string | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
}

interface IBargingRitagesResponse {
  bargingRitages: GResponse<ICommonRitagesData<IOtherProps>>;
}

interface IBargingRitagesRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadAllRitageBarging = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IBargingRitagesRequest;
  onCompleted?: (data: IBargingRitagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: bargingRitagesData,
    loading: bargingRitagesDataLoading,
    refetch,
  } = useQuery<IBargingRitagesResponse, IBargingRitagesRequest>(
    READ_ALL_RITAGE_BARGING,
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
    bargingRitagesData: bargingRitagesData?.bargingRitages.data,
    bargingRitagesDataMeta: bargingRitagesData?.bargingRitages.meta,
    bargingRitagesDataLoading,
    refetchBargingRitages: refetch,
  };
};
