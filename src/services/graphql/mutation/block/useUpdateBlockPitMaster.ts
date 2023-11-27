import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_BLOCK_PIT_MASTER = gql`
  mutation UpdateBlockPitMaster(
    $id: String!
    $blockId: String!
    $name: String!
    $handBookId: String!
  ) {
    updatePit(
      updatePitInput: {
        id: $id
        blockId: $blockId
        name: $name
        handBookId: $handBookId
      }
    ) {
      id
    }
  }
`;

export interface IMutationUpdateBlockPitValues {
  name: string;
  handBookId: string;
}

type IUpdateBlockPitMasterRequest = {
  id: string;
  blockId: string;
} & IMutationUpdateBlockPitValues;

interface IUpdateBlockPitMasterResponse {
  updatePit: {
    id: string;
  };
}

export const useUpdateBlockPitMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateBlockPitMasterResponse) => void;
}) => {
  return useMutation<
    IUpdateBlockPitMasterResponse,
    IUpdateBlockPitMasterRequest
  >(UPDATE_BLOCK_PIT_MASTER, {
    onError,
    onCompleted,
  });
};
