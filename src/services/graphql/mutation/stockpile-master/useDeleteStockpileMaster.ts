import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_STOCKPILE_MASTER = gql`
  mutation DeleteStockpileMaster($id: String!) {
    deleteStockpile(id: $id)
  }
`;

export interface IDeleteStockpileMasterRequest {
  id: string;
}

interface IDeleteStockpileMasterResponse {
  deleteStockpile: boolean;
}

export const useDeleteStockpileMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteStockpileMasterResponse) => void;
}) => {
  return useMutation<
    IDeleteStockpileMasterResponse,
    IDeleteStockpileMasterRequest
  >(DELETE_STOCKPILE_MASTER, {
    onError,
    onCompleted,
  });
};
