import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_BARGING_RITAGE = gql`
  mutation DeleteBargingRitage($id: String!) {
    deleteBargingRitage(id: $id)
  }
`;

export interface IDeleteBargingRitageRequest {
  id: string;
}

interface IDeleteBargingRitageResponse {
  deleteBargingRitage: boolean;
}

export const useDeleteBargingRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteBargingRitageResponse) => void;
}) => {
  return useMutation<IDeleteBargingRitageResponse, IDeleteBargingRitageRequest>(
    DELETE_BARGING_RITAGE,
    {
      onError,
      onCompleted,
    }
  );
};
