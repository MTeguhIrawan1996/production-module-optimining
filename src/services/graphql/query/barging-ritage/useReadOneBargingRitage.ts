import { ApolloError, gql, useQuery } from '@apollo/client';

import { IHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import { IElementWithValue, IReadOneRitage } from '@/types/global';

export const READ_ONE_BARGING_RITAGE = gql`
  query ReadOneBargingRitage($id: String!) {
    bargingRitage(id: $id) {
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
      bargeCompanyHeavyEquipment {
        id
        hullNumber
      }
      closeDome
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

type IDomeWithStockpile =
  | {
      stockpile: Pick<IStockpilesData, 'id' | 'name'> | null;
    } & Pick<IStockpilesData, 'id' | 'name'>;

interface IReadOneBargingRitage {
  dome: IDomeWithStockpile | null;
  barging: Pick<ILocationsData, 'id' | 'name'> | null;
  sampleNumber: string | null;
  closeDome: boolean | null;
  bargeCompanyHeavyEquipment: Pick<
    IHeavyEquipmentCompany,
    'id' | 'hullNumber'
  > | null;
  houseSampleAndLab: {
    elements: IElementWithValue[] | null;
  } | null;
}

interface IReadOneBargingRitageResponse {
  bargingRitage: IReadOneRitage<IReadOneBargingRitage>;
}

interface IReadOneBargingRitageRequest {
  id: string;
}

export const useReadOneBargingRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneBargingRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneBargingRitageResponse) => void;
}) => {
  const { data: bargingRitage, loading: bargingRitageLoading } = useQuery<
    IReadOneBargingRitageResponse,
    IReadOneBargingRitageRequest
  >(READ_ONE_BARGING_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    bargingRitage: bargingRitage?.bargingRitage,
    bargingRitageLoading,
  };
};
