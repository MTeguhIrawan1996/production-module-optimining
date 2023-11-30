import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_ORE_RITAGE = gql`
  mutation DeleteOreRitage($id: String!) {
    deleteOreRitage(id: $id)
  }
`;

export interface IDeleteOreRitageRequest {
  id: string;
}

interface IDeleteOreRitageResponse {
  deleteOreRitage: boolean;
}

export const useDeleteOreRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteOreRitageResponse) => void;
}) => {
  return useMutation<IDeleteOreRitageResponse, IDeleteOreRitageRequest>(
    DELETE_ORE_RITAGE,
    {
      onError,
      onCompleted,
    }
  );
};
