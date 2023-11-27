import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationBlockValues } from '@/services/graphql/mutation/block/useCreateBlockMaster';

export const UPDATE_BLOCK_MASTER = gql`
  mutation UpdateBlockMaster(
    $id: String!
    $name: String!
    $handBookId: String!
  ) {
    updateBlock(
      updateBlockInput: { id: $id, name: $name, handBookId: $handBookId }
    ) {
      id
    }
  }
`;

type IUpdateBlockMasterRequest = {
  id: string;
} & IMutationBlockValues;

interface IUpdateBlockMasterResponse {
  updateBlock: {
    id: string;
  };
}

export const useUpdateBlockMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateBlockMasterResponse) => void;
}) => {
  return useMutation<IUpdateBlockMasterResponse, IUpdateBlockMasterRequest>(
    UPDATE_BLOCK_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
