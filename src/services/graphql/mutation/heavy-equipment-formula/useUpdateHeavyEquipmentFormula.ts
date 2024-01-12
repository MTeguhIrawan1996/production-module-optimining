import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationCountFormula } from '@/types/global';

export const UPDATE_HEAVY_EQUIPMENT_FORMULA = gql`
  mutation UpdateHeavyEquipmentFormula(
    $id: String!
    $name: String
    $topFormula: CreateCountFormula
    $bottomFormula: CreateCountFormula
  ) {
    updateHeavyEquipmentDataFormula(
      updateHeavyEquipmentDataFormulaInput: {
        id: $id
        name: $name
        topFormula: $topFormula
        bottomFormula: $bottomFormula
      }
    ) {
      id
    }
  }
`;

export interface IMutationHeavyEquipmentFormulaValues {
  name: string;
  topFormula: IMutationCountFormula | null;
  bottomFormula: IMutationCountFormula | null;
}

type IUpdateHeavyEquipmentFormulaRequest = {
  id: string;
} & IMutationHeavyEquipmentFormulaValues;

interface IUpdateHeavyEquipmentFormulaResponse {
  updateHeavyEquipmentDataFormula: {
    id: string;
  };
}

export const useUpdateHeavyEquipmentFormula = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateHeavyEquipmentFormulaResponse) => void;
}) => {
  return useMutation<
    IUpdateHeavyEquipmentFormulaResponse,
    IUpdateHeavyEquipmentFormulaRequest
  >(UPDATE_HEAVY_EQUIPMENT_FORMULA, {
    onError,
    onCompleted,
  });
};
