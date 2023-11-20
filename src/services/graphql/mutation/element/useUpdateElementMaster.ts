import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationElementValues } from '@/services/graphql/mutation/element/useCreateElementMaster';

export const UPDATE_ELEMENT_MASTER = gql`
  mutation UpdateElementMaster($id: String!, $name: String!) {
    updateElement(updateElementInput: { id: $id, name: $name }) {
      id
    }
  }
`;

type IUpdateElementMasterRequest = {
  id: string;
} & IMutationElementValues;

interface IUpdateElementMasterResponse {
  updateElement: {
    id: string;
  };
}

export const useUpdateElementMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateElementMasterResponse) => void;
}) => {
  return useMutation<IUpdateElementMasterResponse, IUpdateElementMasterRequest>(
    UPDATE_ELEMENT_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
