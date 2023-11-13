import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_COMPANY_HEAVY_EQUIPMENT = gql`
  mutation DeleteCompanyHeavyEquipment($id: String!) {
    deleteCompanyHeavyEquipment(id: $id)
  }
`;

interface IDeleteCompanyHERequest {
  id: string;
}

interface IDeleteCompanyHEResponse {
  deleteCompanyHeavyEquipment: boolean;
}

export const useDeleteCompanyHeavyEquipment = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteCompanyHEResponse) => void;
}) => {
  return useMutation<IDeleteCompanyHEResponse, IDeleteCompanyHERequest>(
    DELETE_COMPANY_HEAVY_EQUIPMENT,
    {
      onError,
      onCompleted,
    }
  );
};
