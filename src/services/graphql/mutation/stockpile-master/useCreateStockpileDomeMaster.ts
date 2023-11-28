import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_STOCKPILE_DOME_MASTER = gql`
  mutation CreateStockpileDomeMaster(
    $stockpileId: String
    $domes: [CreateDome!]
  ) {
    createDomeBulk(
      createDomeBulkInput: { stockpileId: $stockpileId, domes: $domes }
    ) {
      id
    }
  }
`;

export interface IMutationStockpileDomeValues {
  domes: {
    name: string;
    handBookId: string;
  }[];
}

export interface ICreateStockpileDomeMasterRequest
  extends IMutationStockpileDomeValues {
  stockpileId: string;
}

interface ICreateStockpileDomeMasterResponse {
  createDomeBulk: {
    id: string;
  };
}

export const useCreateStockpileDomeMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateStockpileDomeMasterResponse) => void;
}) => {
  return useMutation<
    ICreateStockpileDomeMasterResponse,
    ICreateStockpileDomeMasterRequest
  >(CREATE_STOCKPILE_DOME_MASTER, {
    onError,
    onCompleted,
  });
};
