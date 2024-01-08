import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneRitageDTOperators } from '@/types/global';

export const READ_ONE_TOPSOIL_RITAGE_DT_OPERATORS = gql`
  query ReadOneTopsoilRitageDTOperators(
    $date: String
    $shiftId: String
    $companyHeavyEquipmentId: String
  ) {
    topsoilDumpTruckRitage(
      findOneTopsoilDumpTruckRitageInput: {
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

interface IReadOneTopsoilRitageDTOperatorsResponse {
  topsoilDumpTruckRitage: IReadOneRitageDTOperators;
}

interface IReadOneTopsoilRitageDTOperatorsRequest {
  date?: string | null;
  shiftId?: string | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadOneTopsoilRitageDTOperators = ({
  variables,
  onCompleted,
  skip,
}: {
  variables: IReadOneTopsoilRitageDTOperatorsRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneTopsoilRitageDTOperatorsResponse) => void;
}) => {
  const {
    data: topsoilDumpTruckRitage,
    loading: topsoilDumpTruckRitageDetailLoading,
  } = useQuery<
    IReadOneTopsoilRitageDTOperatorsResponse,
    IReadOneTopsoilRitageDTOperatorsRequest
  >(READ_ONE_TOPSOIL_RITAGE_DT_OPERATORS, {
    variables,
    skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    topsoilDumpTruckRitageDetail:
      topsoilDumpTruckRitage?.topsoilDumpTruckRitage,
    topsoilDumpTruckRitageDetailLoading,
  };
};
