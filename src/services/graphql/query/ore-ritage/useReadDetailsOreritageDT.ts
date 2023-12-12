import { ApolloError, gql, useQuery } from '@apollo/client';

import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import {
  GResponse,
  IElementWithValue,
  IGlobalMetaRequest,
  IListDetailRitageDTData,
} from '@/types/global';

export const READ_DETAILS_ORE_RITAGE_DT = gql`
  query ReadDetailsOreRitageDT(
    $page: Int
    $limit: Int
    $date: String
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
        fromLevel
        toLevel
        bucketVolume
        tonByRitage
        dome {
          id
          name
        }
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

export interface IOtherDetailsRitageOreDT {
  fromLevel: string | null;
  toLevel: string | null;
  bucketVolume: number | null;
  dome: Pick<IStockpilesData, 'id' | 'name'> | null;
  sampleNumber: string | null;
  houseSampleAndLab: {
    elements: IElementWithValue[] | null;
  } | null;
}

interface IDetailsOreRitageDTResponse {
  oreRitages: GResponse<IListDetailRitageDTData<IOtherDetailsRitageOreDT>>;
}

interface IDetailsOreRitageDTRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadDetailsOreRitageDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDetailsOreRitageDTRequest;
  onCompleted?: (data: IDetailsOreRitageDTResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: detailsOreRitageDTData,
    loading: detailsOreRitageDTDataLoading,
    refetch,
  } = useQuery<IDetailsOreRitageDTResponse, IDetailsOreRitageDTRequest>(
    READ_DETAILS_ORE_RITAGE_DT,
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
    detailsOreRitageDTData: detailsOreRitageDTData?.oreRitages.data,
    detailsOreRitageDTDataMeta: detailsOreRitageDTData?.oreRitages.meta,
    detailsOreRitageDTDataLoading,
    refetchDetailsOreRitageDT: refetch,
  };
};
