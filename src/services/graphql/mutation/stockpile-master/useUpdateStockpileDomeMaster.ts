import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_STOCKPILE_DOME_MASTER = gql`
  mutation UpdateStockpileDomeMaster(
    $id: String!
    $stockpileId: String!
    $name: String!
    $handBookId: String!
  ) {
    updateDome(
      updateDomeInput: {
        id: $id
        stockpileId: $stockpileId
        name: $name
        handBookId: $handBookId
      }
    ) {
      id
    }
  }
`;

export interface IMutationUpdateStockpileDomeValues {
  name: string;
  handBookId: string;
}

type IUpdateStockpileDomeMasterRequest = {
  id: string;
  stockpileId: string;
} & IMutationUpdateStockpileDomeValues;

interface IUpdateStockpileDomeMasterResponse {
  updateDome: {
    id: string;
  };
}

export const useUpdateStockpileDomeMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateStockpileDomeMasterResponse) => void;
}) => {
  return useMutation<
    IUpdateStockpileDomeMasterResponse,
    IUpdateStockpileDomeMasterRequest
  >(UPDATE_STOCKPILE_DOME_MASTER, {
    onError,
    onCompleted,
  });
};
