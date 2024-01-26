import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_HEAVY_EQUIPMENT_PRODUCTION = gql`
  mutation CreateHeavyEquipmentProduction(
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
    createHeavyEquipmentData(
      createHeavyEquipmentDataInput: {
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

type Idetails = {
  startTime: string;
  finishTime: string;
};

export type IloseTimes = {
  workingHourPlanId: string;
  name?: string;
  amountHour?: string;
  details: Idetails[];
};

export interface IMutationHeavyEquipmentDataProdValues {
  date?: Date | string | null;
  foremanId: string | null;
  operatorId: string | null;
  companyHeavyEquipmentId: string | null;
  shiftId: string | null;
  workStartTime: string;
  workFinishTime: string;
  amountWorkTime: string;
  desc: string;
  heavyEquipmentType: string;
  hourMeterBefore: number | '';
  hourMeterAfter: number | '';
  amountHourMeter: number | '';
  fuel: number | '';
  loseTimes: IloseTimes[];
}

type ICreateHeavyEquipmentProductionRequest = Omit<
  IMutationHeavyEquipmentDataProdValues,
  'heavyEquipmentType' | 'amountHourMeter' | 'amountWorkTime'
>;

interface ICreateHeavyEquipmentProductionResponse {
  createHeavyEquipmentData: {
    id: string;
  };
}

export const useCreateHeavyEquipmentProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateHeavyEquipmentProductionResponse) => void;
}) => {
  return useMutation<
    ICreateHeavyEquipmentProductionResponse,
    ICreateHeavyEquipmentProductionRequest
  >(CREATE_HEAVY_EQUIPMENT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
