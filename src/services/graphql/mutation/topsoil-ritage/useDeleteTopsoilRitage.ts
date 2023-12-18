import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_TOPSOIL_RITAGE = gql`
  mutation DeleteTopsoilRitage($id: String!) {
    deleteTopsoilRitage(id: $id)
  }
`;

export interface IDeleteTopsoilRitageRequest {
  id: string;
}

interface IDeleteTopsoilRitageResponse {
  deleteTopsoilRitage: boolean;
}

export const useDeleteTopsoilRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteTopsoilRitageResponse) => void;
}) => {
  return useMutation<IDeleteTopsoilRitageResponse, IDeleteTopsoilRitageRequest>(
    DELETE_TOPSOIL_RITAGE,
    {
      onError,
      onCompleted,
    }
  );
};
