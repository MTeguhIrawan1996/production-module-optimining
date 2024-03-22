import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_STOCKPILE_DOME_MASTER = gql`
  query ReadOneStockpileDomeMaster($id: String!) {
    dome(id: $id) {
      id
      handBookId
      name
      stockpile {
        id
        name
      }
      monitoringStockpile {
        id
        material {
          id
          name
          parent {
            id
            name
          }
        }
        tonByRitage
        currentTonSurvey
        ritageSamples {
          additional
          data {
            id
          }
        }
      }
    }
  }
`;

export interface IReadOneStockpileDomeMaster {
  id: string;
  handBookId: string;
  name: string;
  stockpile: {
    id: string;
    name: string;
  };
  monitoringStockpile: {
    id: string;
    material: {
      id: string;
      name: string;
      parent: {
        id: string;
        name: string;
      } | null;
    } | null;
    tonByRitage: number | null;
    currentTonSurvey: number | null;
    ritageSamples: {
      additional: {
        averageSamples: {
          element: {
            id: string;
            name: string | null;
          };
          value: number | null;
        }[];
      };
    };
  };
}

export interface IReadOneStockpileDomeMasterResponse {
  dome: IReadOneStockpileDomeMaster;
}

export interface IReadOneStockpileDomeMasterRequest {
  id: string;
}

export const useReadOneStockpileDomeMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileDomeMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileDomeMasterResponse) => void;
}) => {
  const { data: stockpileDomeMaster, loading: stockpileDomeMasterLoading } =
    useQuery<
      IReadOneStockpileDomeMasterResponse,
      IReadOneStockpileDomeMasterRequest
    >(READ_ONE_STOCKPILE_DOME_MASTER, {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    });

  return {
    stockpileDomeMaster: stockpileDomeMaster?.dome,
    stockpileDomeMasterLoading,
  };
};
