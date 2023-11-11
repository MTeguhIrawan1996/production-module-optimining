import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_ELIGIBILITY_STATUS = gql`
  query ReadAllEligibilityStatus {
    heavyEquipmentEligibilityStatuses {
      id
      name
    }
  }
`;

export interface IEligibilityStatusData {
  id: string;
  name: string;
}

interface IEligibilityStatusesResponse {
  heavyEquipmentEligibilityStatuses: IEligibilityStatusData[];
}

export const useReadAllEligibilityStatus = ({
  onCompleted,
  skip,
}: {
  onCompleted?: (data: IEligibilityStatusesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: eligibilityStatusData,
    loading: eligibilityStatusDataLoading,
    refetch,
  } = useQuery<IEligibilityStatusesResponse>(READ_ALL_ELIGIBILITY_STATUS, {
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    eligibilityStatusData:
      eligibilityStatusData?.heavyEquipmentEligibilityStatuses,
    eligibilityStatusDataLoading,
    refetchEligibilityStatusData: refetch,
  };
};
