import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneRitageDTOperators } from '@/types/global';

export const READ_ONE_BARGING_RITAGE_DT_OPERATORS = gql`
  query ReadOneBargingRitageDTOperators(
    $date: String
    $shiftId: String
    $companyHeavyEquipmentId: String
  ) {
    bargingDumpTruckRitage(
      findOneBargingDumpTruckRitageInput: {
        date: $date
        shiftId: $shiftId
        companyHeavyEquipmentId: $companyHeavyEquipmentId
      }
    ) {
      date
      companyHeavyEquipment {
        id
        hullNumber
      }
      shift {
        id
        name
      }
      operators
    }
  }
`;

interface IReadOneBargingRitageDTOperatorsResponse {
  bargingDumpTruckRitage: IReadOneRitageDTOperators;
}

interface IReadOneBargingRitageDTOperatorsRequest {
  date?: string | null;
  shiftId?: string | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadOneBargingRitageDTOperators = ({
  variables,
  onCompleted,
  skip,
}: {
  variables: IReadOneBargingRitageDTOperatorsRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneBargingRitageDTOperatorsResponse) => void;
}) => {
  const {
    data: bargingDumpTruckRitage,
    loading: bargingDumpTruckRitageDetailLoading,
  } = useQuery<
    IReadOneBargingRitageDTOperatorsResponse,
    IReadOneBargingRitageDTOperatorsRequest
  >(READ_ONE_BARGING_RITAGE_DT_OPERATORS, {
    variables,
    skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    bargingDumpTruckRitageDetail:
      bargingDumpTruckRitage?.bargingDumpTruckRitage,
    bargingDumpTruckRitageDetailLoading,
  };
};
