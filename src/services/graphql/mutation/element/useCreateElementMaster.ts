import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_ELEMENT_MASTER = gql`
  mutation CreateElementMaster($name: String!) {
    createElement(createElementInput: { name: $name }) {
      id
    }
  }
`;

export interface IMutationElementValues {
  name: string;
}

type ICreateElementMasterRequest = IMutationElementValues;

interface ICreateElementMasterResponse {
  createElement: {
    id: string;
  };
}

export const useCreateElementMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateElementMasterResponse) => void;
}) => {
  return useMutation<ICreateElementMasterResponse, ICreateElementMasterRequest>(
    CREATE_ELEMENT_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
