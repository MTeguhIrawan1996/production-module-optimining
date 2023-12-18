import { ApolloError, gql, useQuery } from '@apollo/client';

import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import {
  GResponse,
  IElementWithValue,
  IGlobalMetaRequest,
  IListDetailRitageDTData,
} from '@/types/global';

export const READ_DETAILS_MOVING_RITAGE_DT = gql`
  query ReadDetailsMovingRitageDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
  ) {
    movingRitages(
      findAllMovingRitageInput: {
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
        fromDome {
          id
          name
        }
        toDome {
          id
          name
        }
        bucketVolume
        tonByRitage
        sampleNumber
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

export interface IOtherDetailsRitageMovingDT {
  fromDome: Pick<IStockpilesData, 'id' | 'name'> | null;
  toDome: Pick<IStockpilesData, 'id' | 'name'> | null;
  sampleNumber: string | null;
  houseSampleAndLab: {
    elements: IElementWithValue[] | null;
  } | null;
}

interface IDetailsMovingRitageDTResponse {
  movingRitages: GResponse<
    IListDetailRitageDTData<IOtherDetailsRitageMovingDT>
  >;
}

interface IDetailsMovingRitageDTRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadDetailsMovingRitageDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDetailsMovingRitageDTRequest;
  onCompleted?: (data: IDetailsMovingRitageDTResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: detailsMovingRitageDT,
    loading: detailsMovingRitageDTLoading,
    refetch,
  } = useQuery<IDetailsMovingRitageDTResponse, IDetailsMovingRitageDTRequest>(
    READ_DETAILS_MOVING_RITAGE_DT,
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
    detailsMovingRitageDT: detailsMovingRitageDT?.movingRitages.data,
    detailsMovingRitageDTMeta: detailsMovingRitageDT?.movingRitages.meta,
    detailsMovingRitageDTLoading,
    refetchDetailsMovingRitageDT: refetch,
  };
};
