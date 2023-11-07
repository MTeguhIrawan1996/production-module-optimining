import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_MASTER_DATA_HUMAN_RESOURCES = gql`
  mutation DeleteMasterDataHumanResource($id: String!) {
    deleteHumanResource(id: $id)
  }
`;

export interface IDeleteMasterDataHumanResourceRequest {
  id: string;
}

interface IDeleteMasterDataHumanResourceResponse {
  deleteHumanResource: boolean;
}

export const useDeleteMasterDataHumanResource = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteMasterDataHumanResourceResponse) => void;
}) => {
  return useMutation<
    IDeleteMasterDataHumanResourceResponse,
    IDeleteMasterDataHumanResourceRequest
  >(DELETE_MASTER_DATA_HUMAN_RESOURCES, {
    onError,
    onCompleted,
  });
};
