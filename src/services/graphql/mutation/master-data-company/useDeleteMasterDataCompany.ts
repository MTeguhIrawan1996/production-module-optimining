import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_MASTER_DATA_COMPANY = gql`
  mutation DeleteMasterDataCompany($id: String!) {
    deleteCompany(id: $id)
  }
`;

export interface IDeleteMasterDataCompanyRequest {
  id: string;
}

interface IDeleteMasterDataCompanyResponse {
  deleteCompany: boolean;
}

export const useDeleteMasterDataCompany = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteMasterDataCompanyResponse) => void;
}) => {
  return useMutation<
    IDeleteMasterDataCompanyResponse,
    IDeleteMasterDataCompanyRequest
  >(DELETE_MASTER_DATA_COMPANY, {
    onError,
    onCompleted,
  });
};
