import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_ACTIVITY_FORM = gql`
  query ReadAllActivityForm {
    activityForms {
      id
      name
    }
  }
`;

interface IActivityFormItem {
  id: string;
  name: string;
}

interface IReadAllActivityForm {
  activityForms: IActivityFormItem[];
}

export const useReadAllActivityForm = ({
  onCompleted,
  skip,
}: {
  onCompleted?: (data: IReadAllActivityForm) => void;
  skip?: boolean;
}) => {
  const {
    data: activityFormData,
    loading: activityFormDataLoading,
    refetch,
  } = useQuery<IReadAllActivityForm>(READ_ALL_ACTIVITY_FORM, {
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    activityFormData: activityFormData?.activityForms,
    activityFormDataLoading,
    refetchactivityFormData: refetch,
  };
};
