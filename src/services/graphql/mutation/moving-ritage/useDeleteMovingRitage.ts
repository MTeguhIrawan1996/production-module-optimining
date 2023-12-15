import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_MOVING_RITAGE = gql`
  mutation DeleteMovingRitage($id: String!) {
    deleteMovingRitage(id: $id)
  }
`;

export interface IDeleteMovingRitageRequest {
  id: string;
}

interface IDeleteMovingRitageResponse {
  deleteMovingRitage: boolean;
}

export const useDeleteMovingRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteMovingRitageResponse) => void;
}) => {
  return useMutation<IDeleteMovingRitageResponse, IDeleteMovingRitageRequest>(
    DELETE_MOVING_RITAGE,
    {
      onError,
      onCompleted,
    }
  );
};
