import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_HEAVY_EQUIPMENT_PRODUCTION = gql`
  mutation UpdateIsValidateHeavyEquipmentProduction(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateHeavyEquipmentData(
      validateHeavyEquipmentDataInput: {
        id: $id
        status: $status
        statusMessage: $statusMessage
      }
    ) {
      id
      status {
        id
        name
      }
    }
  }
`;

export interface IUpdateIsValidateHeavyEquipmentProductionRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateHeavyEquipmentProductionResponse {
  validateHeavyEquipmentData: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useValidateHeavyEquipmentProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (
    data: IUpdateIsValidateHeavyEquipmentProductionResponse
  ) => void;
}) => {
  return useMutation<
    IUpdateIsValidateHeavyEquipmentProductionResponse,
    IUpdateIsValidateHeavyEquipmentProductionRequest
  >(UPDATE_ISVALID_HEAVY_EQUIPMENT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
