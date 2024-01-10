import { ApolloError, gql, useMutation } from '@apollo/client';

import {
  IMutationCalculationValues,
  IMutationLoseTimeValues,
} from '@/services/graphql/mutation/activity-category/useUpdateActivityCategory';

export const CREATE_ACTIVITY_CATEGORY = gql`
  mutation CreateActivityCategory(
    $name: String
    $type: String
    $activities: [CreateActivityId!]
    $countFormula: CreateCountFormula
  ) {
    createWorkingHourPlanCategory(
      createWorkingHourPlanCategoryInput: {
        name: $name
        type: $type
        activities: $activities
        countFormula: $countFormula
      }
    ) {
      id
    }
  }
`;

type ICreateActivityCategoryRequest = {
  type: 'default' | 'count_formula' | null;
} & IMutationLoseTimeValues &
  IMutationCalculationValues;

interface ICreateActivityCategoryResponse {
  createWorkingHourPlanCategory: {
    id: string;
  };
}

export const useCreateActivityCategory = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateActivityCategoryResponse) => void;
}) => {
  return useMutation<
    ICreateActivityCategoryResponse,
    ICreateActivityCategoryRequest
  >(CREATE_ACTIVITY_CATEGORY, {
    onError,
    onCompleted,
  });
};
