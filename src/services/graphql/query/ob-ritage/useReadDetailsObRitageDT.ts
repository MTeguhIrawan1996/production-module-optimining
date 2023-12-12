import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import {
  GResponse,
  IGlobalMetaRequest,
  IListDetailRitageDTData,
} from '@/types/global';

export const READ_DETAILS_OB_RITAGE_DT = gql`
  query ReadDetailsObRitageDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
  ) {
    overburdenRitages(
      findAllOverburdenRitageInput: {
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
        tonByRitage
        fromPit {
          id
          name
        }
        disposal {
          id
          name
        }
      }
    }
  }
`;

export interface IOtherDetailsRitageObDT {
  disposal: Pick<ILocationsData, 'id' | 'name'> | null;
  fromPit: {
    id: string;
    name: string;
  } | null;
}

interface IDetailsObRitageDTResponse {
  overburdenRitages: GResponse<
    IListDetailRitageDTData<IOtherDetailsRitageObDT>
  >;
}

interface IDetailsObRitageDTRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadDetailsObRitageDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDetailsObRitageDTRequest;
  onCompleted?: (data: IDetailsObRitageDTResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: detailsObRitageDTData,
    loading: detailsObRitageDTDataLoading,
    refetch,
  } = useQuery<IDetailsObRitageDTResponse, IDetailsObRitageDTRequest>(
    READ_DETAILS_OB_RITAGE_DT,
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
    detailsObRitageDTData: detailsObRitageDTData?.overburdenRitages.data,
    detailsObRitageDTDataMeta: detailsObRitageDTData?.overburdenRitages.meta,
    detailsObRitageDTDataLoading,
    refetchDetailsObRitageDT: refetch,
  };
};
