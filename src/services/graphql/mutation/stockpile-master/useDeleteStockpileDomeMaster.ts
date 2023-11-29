import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_STOCKPILE_DOME_MASTER = gql`
  mutation DeleteStockpileDomeMaster($id: String!) {
    deleteDome(id: $id)
  }
`;

export interface IDeleteDomeMasterRequest {
  id: string;
}

interface IDeleteDomeMasterResponse {
  deleteDome: boolean;
}

export const useDeleteStockpileDomeMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteDomeMasterResponse) => void;
}) => {
  return useMutation<IDeleteDomeMasterResponse, IDeleteDomeMasterRequest>(
    DELETE_STOCKPILE_DOME_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
