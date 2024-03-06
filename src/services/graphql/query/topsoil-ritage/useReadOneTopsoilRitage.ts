import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationCategoriesData } from '@/services/graphql/query/global-select/useReadAllLocationCategory ';
import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import { IReadOneRitage } from '@/types/global';

export const READ_ONE_TOPSOIL_RITAGE = gql`
  query ReadOneTopsoilRitage($id: String!) {
    topsoilRitage(id: $id) {
      id
      date
      checkerFrom {
        id
        humanResource {
          id
          name
        }
      }
      checkerFromPosition
      checkerTo {
        id
        humanResource {
          id
          name
        }
      }
      checkerToPosition
      shift {
        id
        name
      }
      companyHeavyEquipment {
        id
        hullNumber
      }
      companyHeavyEquipmentChange {
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
      duration
      weather {
        id
        name
      }
      fromPit {
        id
        name
      }
      fromFront {
        id
        name
      }
      fromBlock {
        id
        name
      }
      fromGrid {
        id
        name
      }
      fromSequence {
        id
        name
      }
      fromElevation {
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
      bulkSamplingDensity
      bucketVolume
      tonByRitage
      desc
      photos {
        id
        originalFileName
        url
        fileName
      }
      status {
        id
        name
      }
      statusMessage
      isRitageProblematic
    }
  }
`;

interface IReadOneTopsoilRitage {
  fromPit: {
    id: string;
    name: string;
  } | null;
  fromFront: {
    id: string;
    name: string;
  } | null;
  fromBlock: {
    id: string;
    name: string;
  } | null;
  fromGrid: {
    id: string;
    name: string;
  } | null;
  fromSequence: {
    id: string;
    name: string;
  } | null;
  fromElevation: {
    id: string;
    name: string;
  } | null;
  toLocation: Pick<ILocationsData, 'id' | 'name'> | null;
  toLocationCategory: Pick<ILocationCategoriesData, 'id' | 'name'> | null;
}

interface IReadOneTopsoilRitageResponse {
  topsoilRitage: IReadOneRitage<IReadOneTopsoilRitage>;
}

interface IReadOneTopsoilRitageRequest {
  id: string;
}

export const useReadOneTopsoilRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneTopsoilRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneTopsoilRitageResponse) => void;
}) => {
  const { data: topsoilRitage, loading: topsoilRitageLoading } = useQuery<
    IReadOneTopsoilRitageResponse,
    IReadOneTopsoilRitageRequest
  >(READ_ONE_TOPSOIL_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    topsoilRitage: topsoilRitage?.topsoilRitage,
    topsoilRitageLoading,
  };
};
