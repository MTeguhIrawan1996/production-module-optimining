import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationCategoriesData } from '@/services/graphql/query/global-select/useReadAllLocationCategory ';
import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import {
  GResponse,
  IGlobalMetaRequest,
  IListDetailRitageDTData,
} from '@/types/global';

export const READ_DETAILS_QUARRY_RITAGE_DT = gql`
  query ReadDetailsQuarryRitageDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
  ) {
    quarryRitages(
      findAllQuarryRitageInput: {
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
        shift {
          id
          name
        }
        weather {
          id
          name
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
        duration
        bucketVolume
        tonByRitage
        fromPit {
          id
          name
        }
        toLocationCategory {
          id
          name
        }
        toLocation {
          id
          name
        }
        desc
      }
    }
  }
`;

export interface IOtherReadDetailsQuarryRitageDT {
  fromPit: Pick<ILocationsData, 'id' | 'name'> | null;
  toLocation: Pick<ILocationsData, 'id' | 'name'> | null;
  toLocationCategory: Pick<ILocationCategoriesData, 'id' | 'name'> | null;
}

interface IReadDetailsQuarryRitageDTResponse {
  quarryRitages: GResponse<
    IListDetailRitageDTData<IOtherReadDetailsQuarryRitageDT>
  >;
}

interface IReadDetailsQuarryRitageDTRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadDetailsQuarryRitageDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IReadDetailsQuarryRitageDTRequest;
  onCompleted?: (data: IReadDetailsQuarryRitageDTResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: quarryRitagesDTData,
    loading: quarryRitagesDTDataLoading,
    refetch,
  } = useQuery<
    IReadDetailsQuarryRitageDTResponse,
    IReadDetailsQuarryRitageDTRequest
  >(READ_DETAILS_QUARRY_RITAGE_DT, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    quarryRitagesDTData: quarryRitagesDTData?.quarryRitages.data,
    quarryRitagesDTDataMeta: quarryRitagesDTData?.quarryRitages.meta,
    quarryRitagesDTDataLoading,
    refetchQuarryRitagesDT: refetch,
  };
};
