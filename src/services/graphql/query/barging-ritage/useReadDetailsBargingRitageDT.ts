import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import {
  GResponse,
  IElementWithValue,
  IGlobalMetaRequest,
  IListDetailRitageDTData,
} from '@/types/global';

export const READ_DETAILS_BARGING_RITAGE_DT = gql`
  query ReadDetailsBargingRitageDT(
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
        bucketVolume
        tonByRitage
        sampleNumber
        desc
        houseSampleAndLab {
          elements {
            value
            element {
              id
              name
            }
          }
        }
      }
    }
  }
`;

type IDomeWithStockpile =
  | {
      stockpile: Pick<IStockpilesData, 'id' | 'name'> | null;
    } & Pick<IStockpilesData, 'id' | 'name'>;

export interface IOtherReadDetailsBargingRitageDT {
  barging: Pick<ILocationsData, 'id' | 'name'> | null;
  dome: IDomeWithStockpile | null;
  sampleNumber: string | null;
  houseSampleAndLab: {
    elements: IElementWithValue[] | null;
  } | null;
}

interface IReadDetailsBargingRitageDTResponse {
  bargingRitages: GResponse<
    IListDetailRitageDTData<IOtherReadDetailsBargingRitageDT>
  >;
}

interface IReadDetailsBargingRitageDTRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadDetailsBargingRitageDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IReadDetailsBargingRitageDTRequest;
  onCompleted?: (data: IReadDetailsBargingRitageDTResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: detailsBargingRitagesDT,
    loading: detailsBargingRitagesDTLoading,
    refetch,
  } = useQuery<
    IReadDetailsBargingRitageDTResponse,
    IReadDetailsBargingRitageDTRequest
  >(READ_DETAILS_BARGING_RITAGE_DT, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    detailsBargingRitagesDT: detailsBargingRitagesDT?.bargingRitages.data,
    detailsBargingRitagesDTMeta: detailsBargingRitagesDT?.bargingRitages.meta,
    detailsBargingRitagesDTLoading,
    refetchDetailsBargingRitagesDT: refetch,
  };
};
