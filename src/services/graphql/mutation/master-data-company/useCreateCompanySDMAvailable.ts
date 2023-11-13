import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_COMPANY_AVAILABLE_SDM = gql`
  mutation CreateEmployeeBulk(
    $companyId: String!
    $humanResourceIds: [String!]!
  ) {
    createEmployeeBulk(
      createEmployeeBulkInput: {
        companyId: $companyId
        humanResourceIds: $humanResourceIds
      }
    ) {
      id
      humanResource {
        id
      }
    }
  }
`;

export interface ICreateEmployeeBulkRequest {
  companyId: string;
  humanResourceIds: string[];
}

interface ICreateEmployeeBulkResponse {
  createEmployeeBulk: {
    id: string;
    humanResource: {
      id: string;
    }[];
  };
}

export const useCreateEmployeeBulk = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateEmployeeBulkResponse) => void;
}) => {
  return useMutation<ICreateEmployeeBulkResponse, ICreateEmployeeBulkRequest>(
    CREATE_COMPANY_AVAILABLE_SDM,
    {
      onError,
      onCompleted,
    }
  );
};
