import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_FACTORY_MASTER = gql`
  mutation CreateFactoryMaster($name: String!) {
    createFactory(createFactoryInput: { name: $name }) {
      id
    }
  }
`;

export interface IMutationFactoryValues {
  name: string;
}

type ICreateFactoryMasterRequest = IMutationFactoryValues;

interface ICreateFactoryMasterResponse {
  createFactory: {
    id: string;
  };
}

export const useCreateFactoryMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateFactoryMasterResponse) => void;
}) => {
  return useMutation<ICreateFactoryMasterResponse, ICreateFactoryMasterRequest>(
    CREATE_FACTORY_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
