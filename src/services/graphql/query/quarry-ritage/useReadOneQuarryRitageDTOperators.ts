import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneRitageDTOperators } from '@/types/global';

export const READ_ONE_QUARRY_RITAGE_DT_OPERATORS = gql`
  query ReadOneQuarryRitageDTOperators(
    $date: String
    $shiftId: String
    $companyHeavyEquipmentId: String
  ) {
    quarryDumpTruckRitage(
      findOneQuarryDumpTruckRitageInput: {
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

interface IReadOneQuarryRitageDTOperatorsResponse {
  quarryDumpTruckRitage: IReadOneRitageDTOperators;
}

interface IReadOneQuarryRitageDTOperatorsRequest {
  date?: string | null;
  shiftId?: string | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadOneQuarryRitageDTOperators = ({
  variables,
  onCompleted,
  skip,
}: {
  variables: IReadOneQuarryRitageDTOperatorsRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneQuarryRitageDTOperatorsResponse) => void;
}) => {
  const {
    data: quarryDumpTruckRitage,
    loading: quarryDumpTruckRitageDetailLoading,
  } = useQuery<
    IReadOneQuarryRitageDTOperatorsResponse,
    IReadOneQuarryRitageDTOperatorsRequest
  >(READ_ONE_QUARRY_RITAGE_DT_OPERATORS, {
    variables,
    skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    quarryDumpTruckRitageDetail: quarryDumpTruckRitage?.quarryDumpTruckRitage,
    quarryDumpTruckRitageDetailLoading,
  };
};
