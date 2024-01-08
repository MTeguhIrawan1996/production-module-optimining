import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_FRONT_PRODUCTION = gql`
  mutation DeleteFrontProduction($id: String!) {
    deleteFrontData(id: $id)
  }
`;

export interface IDeleteFrontProductionRequest {
  id: string;
}

interface IDeleteFrontProductionResponse {
  deleteFrontData: boolean;
}

export const useDeleteFrontProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteFrontProductionResponse) => void;
}) => {
  return useMutation<
    IDeleteFrontProductionResponse,
    IDeleteFrontProductionRequest
  >(DELETE_FRONT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
