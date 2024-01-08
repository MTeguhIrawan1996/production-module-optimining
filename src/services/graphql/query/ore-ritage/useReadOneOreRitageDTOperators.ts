import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneRitageDTOperators } from '@/types/global';

export const READ_ONE_ORE_RITAGE_DT_OPERATORS = gql`
  query ReadOneOreRitageDTOperators(
    $date: String
    $shiftId: String
    $companyHeavyEquipmentId: String
  ) {
    oreDumpTruckRitage(
      findOneOreDumpTruckRitageInput: {
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

interface IReadOneOreRitageDTOperatorsResponse {
  oreDumpTruckRitage: IReadOneRitageDTOperators;
}

interface IReadOneOreRitageDTOperatorsRequest {
  date?: string | null;
  shiftId?: string | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadOneOreRitageDTOperators = ({
  variables,
  onCompleted,
  skip,
}: {
  variables: IReadOneOreRitageDTOperatorsRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneOreRitageDTOperatorsResponse) => void;
}) => {
  const { data: oreDumpTruckRitage, loading: oreDumpTruckRitageDetailLoading } =
    useQuery<
      IReadOneOreRitageDTOperatorsResponse,
      IReadOneOreRitageDTOperatorsRequest
    >(READ_ONE_ORE_RITAGE_DT_OPERATORS, {
      variables,
      skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      fetchPolicy: 'cache-and-network',
    });

  return {
    oreDumpTruckRitageDetail: oreDumpTruckRitage?.oreDumpTruckRitage,
    oreDumpTruckRitageDetailLoading,
  };
};
