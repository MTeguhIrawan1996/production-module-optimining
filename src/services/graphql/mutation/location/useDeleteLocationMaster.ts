import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_LOCATION_MASTER = gql`
  mutation DeleteLocationMaster($id: String!) {
    deleteLocation(id: $id)
  }
`;

export interface IDeleteLocationMasterRequest {
  id: string;
}

interface IDeleteLocationMasterResponse {
  deleteLocation: boolean;
}

export const useDeleteLocationMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteLocationMasterResponse) => void;
}) => {
  return useMutation<
    IDeleteLocationMasterResponse,
    IDeleteLocationMasterRequest
  >(DELETE_LOCATION_MASTER, {
    onError,
    onCompleted,
  });
};
