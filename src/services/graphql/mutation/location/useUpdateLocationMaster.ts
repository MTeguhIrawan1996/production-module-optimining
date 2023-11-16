import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationLocationValues } from '@/services/graphql/mutation/location/useCreateLocationMaster';

export const UPDATE_LOCATION_MASTER = gql`
  mutation UpdateLocationMaster(
    $id: String!
    $name: String!
    $handBookId: String!
    $categoryId: String!
  ) {
    updateLocation(
      updateLocationInput: {
        id: $id
        name: $name
        handBookId: $handBookId
        categoryId: $categoryId
      }
    ) {
      id
    }
  }
`;

type IUpdateLocationMasterRequest = {
  id: string;
} & IMutationLocationValues;

interface IUpdateLocationMasterResponse {
  updateLocation: {
    id: string;
  };
}

export const useUpdateLocationMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateLocationMasterResponse) => void;
}) => {
  return useMutation<
    IUpdateLocationMasterResponse,
    IUpdateLocationMasterRequest
  >(UPDATE_LOCATION_MASTER, {
    onError,
    onCompleted,
  });
};
