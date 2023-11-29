import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationStockpileValues } from '@/services/graphql/mutation/stockpile-master/useCreateStockpileMaster';

export const UPDATE_STOCKPILE_MASTER = gql`
  mutation UpdateStockpileMaster(
    $id: String!
    $name: String!
    $handBookId: String!
  ) {
    updateStockpile(
      updateStockpileInput: { id: $id, name: $name, handBookId: $handBookId }
    ) {
      id
    }
  }
`;

type IUpdateStockpileMasterRequest = {
  id: string;
} & IMutationStockpileValues;

interface IUpdateStockpileMasterResponse {
  updateStockpile: {
    id: string;
  };
}

export const useUpdateStockpileMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateStockpileMasterResponse) => void;
}) => {
  return useMutation<
    IUpdateStockpileMasterResponse,
    IUpdateStockpileMasterRequest
  >(UPDATE_STOCKPILE_MASTER, {
    onError,
    onCompleted,
  });
};
