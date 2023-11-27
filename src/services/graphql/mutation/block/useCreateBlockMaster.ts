import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_BLOCK_MASTER = gql`
  mutation CreateBlockMaster($name: String!, $handBookId: String!) {
    createBlock(createBlockInput: { name: $name, handBookId: $handBookId }) {
      id
    }
  }
`;

export interface IMutationBlockValues {
  name: string;
  handBookId: string;
}

type ICreateBlockMasterRequest = IMutationBlockValues;

interface ICreateBlockMasterResponse {
  createBlock: {
    id: string;
  };
}

export const useCreateBlockMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateBlockMasterResponse) => void;
}) => {
  return useMutation<ICreateBlockMasterResponse, ICreateBlockMasterRequest>(
    CREATE_BLOCK_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
