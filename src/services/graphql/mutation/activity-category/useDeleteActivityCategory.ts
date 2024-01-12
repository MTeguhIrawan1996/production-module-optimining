import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_ACTIVITY_CATEGORY = gql`
  mutation DeleteActivityCategory($id: String!) {
    deleteWorkingHourPlanCategory(id: $id)
  }
`;

export interface IDeleteActivityCategoryRequest {
  id: string;
}

interface IDeleteActivityCategoryResponse {
  deleteWorkingHourPlanCategory: boolean;
}

export const useDeleteActivityCategory = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteActivityCategoryResponse) => void;
}) => {
  return useMutation<
    IDeleteActivityCategoryResponse,
    IDeleteActivityCategoryRequest
  >(DELETE_ACTIVITY_CATEGORY, {
    onError,
    onCompleted,
  });
};
