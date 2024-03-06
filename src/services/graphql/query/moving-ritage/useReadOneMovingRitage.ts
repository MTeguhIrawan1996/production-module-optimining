import { ApolloError, gql, useQuery } from '@apollo/client';

import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import { IElementWithValue, IReadOneRitage } from '@/types/global';

export const READ_ONE_MOVING_RITAGE = gql`
  query ReadOneMovingRitage($id: String!) {
    movingRitage(id: $id) {
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
      fromDome {
        id
        name
      }
      toDome {
        id
        name
      }
      bulkSamplingDensity
      bucketVolume
      tonByRitage
      sampleNumber
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
`;

interface IReadOneMovingRitage {
  fromDome: Pick<IStockpilesData, 'id' | 'name'> | null;
  toDome: Pick<IStockpilesData, 'id' | 'name'> | null;
  sampleNumber: string | null;
  closeDome: boolean | null;
  houseSampleAndLab: {
    elements: IElementWithValue[] | null;
  } | null;
}

interface IReadOneMovingRitageResponse {
  movingRitage: IReadOneRitage<IReadOneMovingRitage>;
}

interface IReadOneMovingRitageRequest {
  id: string;
}

export const useReadOneMovingRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneMovingRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneMovingRitageResponse) => void;
}) => {
  const { data: movingRitage, loading: movingRitageLoading } = useQuery<
    IReadOneMovingRitageResponse,
    IReadOneMovingRitageRequest
  >(READ_ONE_MOVING_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    movingRitage: movingRitage?.movingRitage,
    movingRitageLoading,
  };
};
