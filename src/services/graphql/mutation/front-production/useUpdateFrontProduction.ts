import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationFrontProductionValues } from '@/services/graphql/mutation/front-production/useCreateFrontProduction';

export const UPDATE_FRONT_PRODUCTION = gql`
  mutation UpdateFrontProduction(
    $id: String!
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
    updateFrontData(
      updateFrontDataInput: {
        id: $id
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

type IUpdateFrontProductionRequest = {
  id: string;
} & Omit<IMutationFrontProductionValues, 'block'>;

export type IFrontProductionNameProps = keyof Omit<
  IMutationFrontProductionValues,
  'block'
>;
export type IFrontProductionValueProps = string | Date | number | null;

interface IUpdateFrontProductionResponse {
  updateFrontData: {
    id: string;
  };
}

export const useUpdateFrontProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateFrontProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateFrontProductionResponse,
    IUpdateFrontProductionRequest
  >(UPDATE_FRONT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
