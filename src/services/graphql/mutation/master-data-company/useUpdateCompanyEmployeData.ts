import { ApolloError, gql, useMutation } from '@apollo/client';

import { IDate } from '@/types/global';

export const UPDATE_COMPANY_EMPLOYE_DATA = gql`
  mutation UpdateCompanyEmployeData(
    $id: String!
    $nip: String!
    $statusId: String
    $entryDate: String!
    $isStillWorking: Boolean!
    $quitDate: String
  ) {
    updateEmployeeData(
      updateEmployeeDataInput: {
        id: $id
        nip: $nip
        statusId: $statusId
        entryDate: $entryDate
        isStillWorking: $isStillWorking
        quitDate: $quitDate
      }
    ) {
      id
    }
  }
`;

export interface IUpdateEmployeeDataRequest {
  id: string;
  nip: string;
  statusId: string | null;
  entryDate: IDate;
  isStillWorking: boolean;
  quitDate: IDate;
}

interface IUpdateEmployeeDataResponse {
  updateEmployeeData: {
    id: string;
  };
}

export const useUpdateCompanyEmployeeData = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateEmployeeDataResponse) => void;
}) => {
  return useMutation<IUpdateEmployeeDataResponse, IUpdateEmployeeDataRequest>(
    UPDATE_COMPANY_EMPLOYE_DATA,
    {
      onError,
      onCompleted,
    }
  );
};
