import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_LOCATION_MASTER = gql`
  mutation CreateLocationMaster(
    $name: String!
    $handBookId: String!
    $categoryId: String
  ) {
    createLocation(
      createLocationInput: {
        name: $name
        handBookId: $handBookId
        categoryId: $categoryId
      }
    ) {
      id
    }
  }
`;

export interface IMutationLocationValues {
  name: string;
  handBookId: string;
  categoryId: string | null;
}

type ICreateLocationMasterRequest = IMutationLocationValues;

interface ICreateLocationMasterResponse {
  createLocation: {
    id: string;
  };
}

export const useCreateLocationMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateLocationMasterResponse) => void;
}) => {
  return useMutation<
    ICreateLocationMasterResponse,
    ICreateLocationMasterRequest
  >(CREATE_LOCATION_MASTER, {
    onError,
    onCompleted,
  });
};
