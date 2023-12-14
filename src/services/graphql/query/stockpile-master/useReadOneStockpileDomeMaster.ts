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
