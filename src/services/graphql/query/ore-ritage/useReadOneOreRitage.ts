import { ApolloError, gql, useQuery } from '@apollo/client';

import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import { IElementWithValue, IReadOneRitage } from '@/types/global';

export const READ_ONE_ORE_RITAGE = gql`
  query ReadOneOreRitage($id: String!) {
    oreRitage(id: $id) {
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
      fromLevel
      toLevel
      stockpile {
        id
        name
      }
      dome {
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
      closeDome
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

interface IReadOneOreRitage {
  fromLevel: string | null;
  toLevel: string | null;
  stockpile: Pick<IStockpilesData, 'id' | 'name'> | null;
  dome: Pick<IStockpilesData, 'id' | 'name'> | null;
  sampleNumber: string | null;
  closeDome: boolean | null;
  houseSampleAndLab: {
    elements: IElementWithValue[] | null;
  } | null;
}

interface IReadOneOreRitageResponse {
  oreRitage: IReadOneRitage<IReadOneOreRitage>;
}

interface IReadOneOreRitageRequest {
  id: string;
}

export const useReadOneOreRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneOreRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneOreRitageResponse) => void;
}) => {
  const { data: oreRitage, loading: oreRitageLoading } = useQuery<
    IReadOneOreRitageResponse,
    IReadOneOreRitageRequest
  >(READ_ONE_ORE_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    oreRitage: oreRitage?.oreRitage,
    oreRitageLoading,
  };
};
