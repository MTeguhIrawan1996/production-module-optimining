import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_COMPANY_HUMAN_RESOURCE = gql`
  mutation DeleteCompanyHumanResource($id: String!) {
    deleteEmployee(id: $id)
  }
`;

export interface IDeleteCompanyHumanResourceRequest {
  id: string;
}

interface IDeleteCompanyHumanResourceResponse {
  deleteEmployee: boolean;
}

export const useDeleteCompanyHumanResource = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteCompanyHumanResourceResponse) => void;
}) => {
  return useMutation<
    IDeleteCompanyHumanResourceResponse,
    IDeleteCompanyHumanResourceRequest
  >(DELETE_COMPANY_HUMAN_RESOURCE, {
    onError,
    onCompleted,
  });
};
