import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneRitageDTOperators } from '@/types/global';

export const READ_ONE_MOVING_RITAGE_DT_OPERATORS = gql`
  query ReadOneMovingRitageDTOperators(
    $date: String
    $shiftId: String
    $companyHeavyEquipmentId: String
  ) {
    movingDumpTruckRitage(
      findOneMovingDumpTruckRitageInput: {
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

interface IReadOneMovingRitageDTOperatorsResponse {
  movingDumpTruckRitage: IReadOneRitageDTOperators;
}

interface IReadOneMovingRitageDTOperatorsRequest {
  date?: string | null;
  shiftId?: string | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadOneMovingRitageDTOperators = ({
  variables,
  onCompleted,
  skip,
}: {
  variables: IReadOneMovingRitageDTOperatorsRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneMovingRitageDTOperatorsResponse) => void;
}) => {
  const {
    data: movingDumpTruckRitage,
    loading: movingDumpTruckRitageDetailLoading,
  } = useQuery<
    IReadOneMovingRitageDTOperatorsResponse,
    IReadOneMovingRitageDTOperatorsRequest
  >(READ_ONE_MOVING_RITAGE_DT_OPERATORS, {
    variables,
    skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    movingDumpTruckRitageDetail: movingDumpTruckRitage?.movingDumpTruckRitage,
    movingDumpTruckRitageDetailLoading,
  };
};
