import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_COMPANY_AVAILABLE_HE = gql`
  mutation CreateCompanyHeavyEquipmentBulk(
    $companyId: String!
    $heavyEquipmentIds: [String!]!
  ) {
    createCompanyHeavyEquipmentBulk(
      createCompanyHeavyEquipmentBulkInput: {
        companyId: $companyId
        heavyEquipmentIds: $heavyEquipmentIds
      }
    ) {
      id
    }
  }
`;

export interface ICreateCompanyHeavyEquipmentBulkRequest {
  companyId: string;
  heavyEquipmentIds: string[];
}

interface ICreateCompanyHeavyEquipmentBulkResponse {
  createCompanyHeavyEquipmentBulk: {
    id: string;
  };
}

export const useCreateCompanyHeavyEquipmentBulk = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateCompanyHeavyEquipmentBulkResponse) => void;
}) => {
  return useMutation<
    ICreateCompanyHeavyEquipmentBulkResponse,
    ICreateCompanyHeavyEquipmentBulkRequest
  >(CREATE_COMPANY_AVAILABLE_HE, {
    onError,
    onCompleted,
  });
};
