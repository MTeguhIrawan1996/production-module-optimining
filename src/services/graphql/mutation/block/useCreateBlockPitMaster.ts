import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_BLOCK_PIT_MASTER = gql`
  mutation CreateBlockPitMaster($blockId: String, $pits: [CreatePit!]) {
    createPitBulk(createPitBulkInput: { blockId: $blockId, pits: $pits }) {
      id
    }
  }
`;

export interface IMutationBlockPitValues {
  pits: {
    name: string;
    handBookId: string;
  }[];
}

export interface ICreateBlockPitMasterRequest extends IMutationBlockPitValues {
  blockId: string;
}

interface ICreateBlockPitMasterResponse {
  createPitBulk: {
    id: string;
  };
}

export const useCreateBlockPitMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateBlockPitMasterResponse) => void;
}) => {
  return useMutation<
    ICreateBlockPitMasterResponse,
    ICreateBlockPitMasterRequest
  >(CREATE_BLOCK_PIT_MASTER, {
    onError,
    onCompleted,
  });
};
