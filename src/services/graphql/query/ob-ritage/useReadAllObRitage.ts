import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import {
  GResponse,
  ICommonRitagesData,
  IGlobalMetaRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_OB = gql`
  query ReadAllRitageOB(
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
        disposal {
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

interface IOtherProps {
  disposal: Pick<ILocationsData, 'id' | 'name'> | null;
  sampleNumber: string | null;
}

interface IOverburdenRitagesResponse {
  overburdenRitages: GResponse<ICommonRitagesData<IOtherProps>>;
}

interface IOverburdenRitagesRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadAllRitageOB = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IOverburdenRitagesRequest;
  onCompleted?: (data: IOverburdenRitagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: overburdenRitagesData,
    loading: overburdenRitagesDataLoading,
    refetch,
  } = useQuery<IOverburdenRitagesResponse, IOverburdenRitagesRequest>(
    READ_ALL_RITAGE_OB,
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
    overburdenRitagesData: overburdenRitagesData?.overburdenRitages.data,
    overburdenRitagesDataMeta: overburdenRitagesData?.overburdenRitages.meta,
    overburdenRitagesDataLoading,
    refetchOverburdenRitages: refetch,
  };
};
