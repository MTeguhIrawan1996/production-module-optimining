import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_HEAVY_EQUIPMENT_PRODUCTION = gql`
  mutation UpdateIsDeterminedHeavyEquipmentProduction(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineHeavyEquipmentData(
      determineHeavyEquipmentDataInput: {
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

export interface IUpdateIsDeterminedHeavyEquipmentProductionRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedHeavyEquipmentProductionResponse {
  determineHeavyEquipmentData: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useDeterminedHeavyEquipmentProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (
    data: IUpdateIsDeterminedHeavyEquipmentProductionResponse
  ) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedHeavyEquipmentProductionResponse,
    IUpdateIsDeterminedHeavyEquipmentProductionRequest
  >(UPDATE_ISDETERMINED_HEAVY_EQUIPMENT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
