import { ApolloError, gql, useQuery } from '@apollo/client';

import { IGlobalMetaRequest, IReadFormulaParameter } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT_FORMULA = gql`
  query ReadOneHeavyEquipmentFormula($id: String!) {
    heavyEquipmentDataFormula(id: $id) {
      id
      name
      topFormula {
        parameters {
          order
          operator
          category {
            id
            name
          }
        }
      }
      bottomFormula {
        parameters {
          id
          order
          operator
          category {
            id
            name
          }
        }
      }
    }
  }
`;

export interface IReadOneHeavyEquipmentFormulaData {
  id: string;
  name: string;
  topFormula: {
    parameters: IReadFormulaParameter[];
  } | null;
  bottomFormula: {
    parameters: IReadFormulaParameter[];
  } | null;
}

interface IReadOneHeavyEquipmentFormulaResponse {
  heavyEquipmentDataFormula: IReadOneHeavyEquipmentFormulaData;
}

interface IReadOneHeavyEquipmentFormulaRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneHeavyEquipmentFormula = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IReadOneHeavyEquipmentFormulaRequest;
  onCompleted?: (data: IReadOneHeavyEquipmentFormulaResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: readOneHeavyEquipmentFormulaData,
    loading: readOneHeavyEquipmentFormulaDataLoading,
    refetch,
  } = useQuery<
    IReadOneHeavyEquipmentFormulaResponse,
    IReadOneHeavyEquipmentFormulaRequest
  >(READ_ONE_HEAVY_EQUIPMENT_FORMULA, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    readOneHeavyEquipmentFormulaDataPure:
      readOneHeavyEquipmentFormulaData?.heavyEquipmentDataFormula,
    readOneHeavyEquipmentFormulaDataLoading,
    refetchReadOneHeavyEquipmentFormulaData: refetch,
  };
};
