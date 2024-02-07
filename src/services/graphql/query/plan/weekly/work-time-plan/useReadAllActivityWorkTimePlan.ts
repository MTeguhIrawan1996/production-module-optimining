import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_ACTIVITY_WORK_TIME_PLAN = gql`
  query ReadAllActivityWorkTimePlan {
    activities {
      id
      name
    }
  }
`;

export interface IReadAllActivityWorkTimePlanData {
  id: string;
  name: string;
}

interface IReadAllActivityWorkTimePlanResponse {
  activities: IReadAllActivityWorkTimePlanData[];
}

export const useReadAllActivityWorkTimePlan = ({
  onCompleted,
  skip,
}: {
  onCompleted?: (data: IReadAllActivityWorkTimePlanResponse) => void;
  skip?: boolean;
}) => {
  const { data: activityWorkTimePlan } =
    useQuery<IReadAllActivityWorkTimePlanResponse>(
      READ_ALL_ACTIVITY_WORK_TIME_PLAN,
      {
        skip: skip,
        onError: (err: ApolloError) => {
          return err;
        },
        onCompleted,
        fetchPolicy: 'cache-first',
      }
    );

  return {
    activityWorkTImePlan: activityWorkTimePlan?.activities,
  };
};
