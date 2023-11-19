import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationFactoryValues } from '@/services/graphql/mutation/factory/useCreateFactoryMaster';

export const UPDATE_FACTORY_MASTER = gql`
  mutation UpdateFactoryMaster($id: String!, $name: String!) {
    updateFactory(updateFactoryInput: { id: $id, name: $name }) {
      id
    }
  }
`;

type IUpdateFactoryMasterRequest = {
  id: string;
} & IMutationFactoryValues;

interface IUpdateFactoryMasterResponse {
  updateFactory: {
    id: string;
  };
}

export const useUpdateFactoryMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateFactoryMasterResponse) => void;
}) => {
  return useMutation<IUpdateFactoryMasterResponse, IUpdateFactoryMasterRequest>(
    UPDATE_FACTORY_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
