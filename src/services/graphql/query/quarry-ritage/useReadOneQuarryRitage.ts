import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationCategoriesData } from '@/services/graphql/query/global-select/useReadAllLocationCategory ';
import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import { IReadOneRitage } from '@/types/global';

export const READ_ONE_QUARRY_RITAGE = gql`
  query ReadOneQuarryRitage($id: String!) {
    quarryRitage(id: $id) {
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

interface IReadOneQuarryRitage {
  toLocation: Pick<ILocationsData, 'id' | 'name'> | null;
  locationCategory: Pick<ILocationCategoriesData, 'id' | 'name'> | null;
}

interface IReadOneQuarryRitageResponse {
  quarryRitage: IReadOneRitage<IReadOneQuarryRitage>;
}

interface IReadOneQuarryRitageRequest {
  id: string;
}

export const useReadOneQuarryRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneQuarryRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneQuarryRitageResponse) => void;
}) => {
  const { data: quarryRitage, loading: quarryRitageLoading } = useQuery<
    IReadOneQuarryRitageResponse,
    IReadOneQuarryRitageRequest
  >(READ_ONE_QUARRY_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    quarryRitage: quarryRitage?.quarryRitage,
    quarryRitageLoading,
  };
};
