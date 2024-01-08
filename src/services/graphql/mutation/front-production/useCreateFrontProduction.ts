import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_FRONT_PRODUCTION = gql`
  mutation CreateFrontProduction(
    $date: String
    $companyHeavyEquipmentId: String
    $frontId: String
    $materialId: String
    $type: String
    $pitId: String
    $gridId: String
    $elevationId: String
    $domeId: String
    $x: Float
    $y: Float
  ) {
    createFrontData(
      createFrontDataInput: {
        date: $date
        companyHeavyEquipmentId: $companyHeavyEquipmentId
        frontId: $frontId
        materialId: $materialId
        type: $type
        pitId: $pitId
        gridId: $gridId
        elevationId: $elevationId
        domeId: $domeId
        x: $x
        y: $y
      }
    ) {
      id
    }
  }
`;

export interface IMutationFrontProductionValues {
  date?: Date | string | null;
  companyHeavyEquipmentId: string | null;
  frontId: string | null;
  materialId: string | null;
  type: string;
  pitId: string | null;
  block: string | null;
  gridId: string | null;
  elevationId: string | null;
  domeId: string | null;
  x: number | '';
  y: number | '';
}

type ICreateFrontProductionRequest = Omit<
  IMutationFrontProductionValues,
  'block'
>;

interface ICreateFrontProductionResponse {
  createFrontData: {
    id: string;
  };
}

export const useCreateFrontProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateFrontProductionResponse) => void;
}) => {
  return useMutation<
    ICreateFrontProductionResponse,
    ICreateFrontProductionRequest
  >(CREATE_FRONT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
