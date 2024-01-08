import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneRitageDTOperators } from '@/types/global';

export const READ_ONE_OB_RITAGE_DT_OPERATORS = gql`
  query ReadOneObRitageDTOperators(
    $date: String
    $shiftId: String
    $companyHeavyEquipmentId: String
  ) {
    overburdenDumpTruckRitage(
      findOneOverburdenDumpTruckRitageInput: {
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

interface IReadOneObRitageDTOperatorsResponse {
  overburdenDumpTruckRitage: IReadOneRitageDTOperators;
}

interface IReadOneObRitageDTOperatorsRequest {
  date?: string | null;
  shiftId?: string | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadOneObRitageDTOperators = ({
  variables,
  onCompleted,
  skip,
}: {
  variables: IReadOneObRitageDTOperatorsRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneObRitageDTOperatorsResponse) => void;
}) => {
  const {
    data: overburdenDumpTruckRitage,
    loading: overburdenDumpTruckRitageDetailLoading,
  } = useQuery<
    IReadOneObRitageDTOperatorsResponse,
    IReadOneObRitageDTOperatorsRequest
  >(READ_ONE_OB_RITAGE_DT_OPERATORS, {
    variables,
    skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    overburdenDumpTruckRitageDetail:
      overburdenDumpTruckRitage?.overburdenDumpTruckRitage,
    overburdenDumpTruckRitageDetailLoading,
  };
};
