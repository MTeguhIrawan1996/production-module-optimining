import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationCountFormula } from '@/types/global';

export const UPDATE_ACTIVITY_CATEGORY = gql`
  mutation UpdateActivityCategory(
    $id: String!
    $name: String
    $type: String
    $activities: [UpdateActivityId!]
    $countFormula: CreateCountFormula
  ) {
    updateWorkingHourPlanCategory(
      updateWorkingHourPlanCategoryInput: {
        id: $id
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

export interface IActivityIds {
  activityId: string | null;
}

export interface IMutationLoseTimeValues {
  activities?: IActivityIds[];
}
export interface IMutationCalculationValues {
  name?: string;
  countFormula?: IMutationCountFormula | null;
}

type IUpdateActivityCategoryRequest = {
  id: string;
  type: 'default' | 'count_formula' | null;
} & IMutationLoseTimeValues &
  IMutationCalculationValues;

interface IUpdateActivityCategoryResponse {
  updateWorkingHourPlanCategory: {
    id: string;
  };
}

export const useUpdateActivityCategory = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateActivityCategoryResponse) => void;
}) => {
  return useMutation<
    IUpdateActivityCategoryResponse,
    IUpdateActivityCategoryRequest
  >(UPDATE_ACTIVITY_CATEGORY, {
    onError,
    onCompleted,
  });
};
