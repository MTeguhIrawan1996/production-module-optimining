import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationCategoriesData } from '@/services/graphql/query/global-select/useReadAllLocationCategory ';
import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import {
  GResponse,
  IGlobalMetaRequest,
  IListDetailRitageDTData,
} from '@/types/global';

export const READ_DETAILS_TOPSOIL_RITAGE_DT = gql`
  query ReadDetailsTopsoilRitageDT(
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

export interface IOtherReadDetailsTopsoilRitageDT {
  fromPit: Pick<ILocationsData, 'id' | 'name'> | null;
  toLocation: Pick<ILocationsData, 'id' | 'name'> | null;
  toLocationCategory: Pick<ILocationCategoriesData, 'id' | 'name'> | null;
}

interface IReadDetailsTopsoilRitageDTResponse {
  topsoilRitages: GResponse<
    IListDetailRitageDTData<IOtherReadDetailsTopsoilRitageDT>
  >;
}

interface IReadDetailsTopsoilRitageDTRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadDetailsTopsoilRitageDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IReadDetailsTopsoilRitageDTRequest;
  onCompleted?: (data: IReadDetailsTopsoilRitageDTResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: topsoilRitagesDTData,
    loading: topsoilRitagesDTDataLoading,
    refetch,
  } = useQuery<
    IReadDetailsTopsoilRitageDTResponse,
    IReadDetailsTopsoilRitageDTRequest
  >(READ_DETAILS_TOPSOIL_RITAGE_DT, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    topsoilRitagesDTData: topsoilRitagesDTData?.topsoilRitages.data,
    topsoilRitagesDTDataMeta: topsoilRitagesDTData?.topsoilRitages.meta,
    topsoilRitagesDTDataLoading,
    refetchtopsoilRitagesDT: refetch,
  };
};
