import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationHeavyEquipmentDataProdValues } from '@/services/graphql/mutation/heavy-equipment-production/useCreateHeavyEquipmentProduction';

export const UPDATE_HEAVY_EQUIPMENT_PRODUCTION = gql`
  mutation UpdateHeavyEquipmentProduction(
    $id: String!
    $date: String
    $foremanId: String
    $operatorId: String
    $companyHeavyEquipmentId: String
    $shiftId: String
    $workStartTime: String
    $workFinishTime: String
    $desc: String
    $hourMeterBefore: Float
    $hourMeterAfter: Float
    $fuel: Float
    $loseTimes: [CreateLoseTime!]
  ) {
    updateHeavyEquipmentData(
      updateHeavyEquipmentDataInput: {
        id: $id
        date: $date
        foremanId: $foremanId
        operatorId: $operatorId
        companyHeavyEquipmentId: $companyHeavyEquipmentId
        shiftId: $shiftId
        workStartTime: $workStartTime
        workFinishTime: $workFinishTime
        hourMeterBefore: $hourMeterBefore
        hourMeterAfter: $hourMeterAfter
        fuel: $fuel
        desc: $desc
        loseTimes: $loseTimes
      }
    ) {
      id
    }
  }
`;

type IUpdateHeavyEquipmentProductionRequest = {
  id: string;
} & Omit<
  IMutationHeavyEquipmentDataProdValues,
  'heavyEquipmentType' | 'amountHourMeter' | 'amountWorkTime'
>;

interface IUpdateHeavyEquipmentProductionResponse {
  updateHeavyEquipmentData: {
    id: string;
  };
}

export const useUpdateHeavyEquipmentProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateHeavyEquipmentProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateHeavyEquipmentProductionResponse,
    IUpdateHeavyEquipmentProductionRequest
  >(UPDATE_HEAVY_EQUIPMENT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
