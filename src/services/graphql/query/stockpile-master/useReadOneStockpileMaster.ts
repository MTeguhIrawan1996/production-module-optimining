import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_STOCKPILE_MASTER = gql`
  query ReadOneStockpileMaster($id: String!) {
    stockpile(id: $id) {
      id
      handBookId
      name
    }
  }
`;

export interface IReadOneStockpileMaster {
  id: string;
  handBookId: string;
  name: string;
}

export interface IReadOneStockpileMasterResponse {
  stockpile: IReadOneStockpileMaster;
}

export interface IReadOneStockpileMasterRequest {
  id: string;
}

export const useReadOneStockpileMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMasterResponse) => void;
}) => {
  const { data: stockpileMaster, loading: stockpileMasterLoading } = useQuery<
    IReadOneStockpileMasterResponse,
    IReadOneStockpileMasterRequest
  >(READ_ONE_STOCKPILE_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    stockpileMaster: stockpileMaster?.stockpile,
    stockpileMasterLoading,
  };
};
