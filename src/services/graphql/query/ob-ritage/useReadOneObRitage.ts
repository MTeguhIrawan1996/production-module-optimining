import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import { IReadOneRitage } from '@/types/global';

export const READ_ONE_OB_RITAGE = gql`
  query ReadOneObRitage($id: String!) {
    overburdenRitage(id: $id) {
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
      disposal {
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

interface IReadOneObRitage {
  disposal: Pick<ILocationsData, 'id' | 'name'> | null;
}

interface IReadOneObRitageResponse {
  overburdenRitage: IReadOneRitage<IReadOneObRitage>;
}

interface IReadOneObRitageRequest {
  id: string;
}

export const useReadOneObRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneObRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneObRitageResponse) => void;
}) => {
  const { data: overburdenRitage, loading: overburdenRitageLoading } = useQuery<
    IReadOneObRitageResponse,
    IReadOneObRitageRequest
  >(READ_ONE_OB_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    overburdenRitage: overburdenRitage?.overburdenRitage,
    overburdenRitageLoading,
  };
};
