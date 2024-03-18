import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_ACTIVITY_TYPE_PLAN = gql`
  query ReadAllActivityTypePlan {
    activityTypes {
      id
      name
    }
  }
`;

export interface IActivityTypePlanData {
  id: string;
  name: string;
}

interface IActivityTypePlanResponse {
  activityTypes: IActivityTypePlanData[];
}

export const useReadAllActivityTypePlan = ({
  onCompleted,
  skip,
}: {
  onCompleted?: (data: IActivityTypePlanResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: activityTypesData,
    loading: activityTypesDataLoading,
    refetch,
  } = useQuery<IActivityTypePlanResponse>(READ_ALL_ACTIVITY_TYPE_PLAN, {
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    activityTypesData: activityTypesData?.activityTypes,
    activityTypesDataLoading,
    refetchActivityTypes: refetch,
  };
};
