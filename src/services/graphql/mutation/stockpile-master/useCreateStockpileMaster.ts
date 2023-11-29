import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_STOCKPILE_MASTER = gql`
  mutation CreateStockpileMaster($name: String!, $handBookId: String!) {
    createStockpile(
      createStockpileInput: { name: $name, handBookId: $handBookId }
    ) {
      id
    }
  }
`;

export interface IMutationStockpileValues {
  name: string;
  handBookId: string;
}

type ICreateStockpileMasterRequest = IMutationStockpileValues;

interface ICreateStockpileMasterResponse {
  createStockpile: {
    id: string;
  };
}

export const useCreateStockpileMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateStockpileMasterResponse) => void;
}) => {
  return useMutation<
    ICreateStockpileMasterResponse,
    ICreateStockpileMasterRequest
  >(CREATE_STOCKPILE_MASTER, {
    onError,
    onCompleted,
  });
};
