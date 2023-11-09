import { ApolloError, gql, useMutation } from '@apollo/client';

import { IDate } from '@/types/global';

export const UPDATE_COMPANY_POSITION_HISTORY = gql`
  mutation UpdateCompanyPositionHistory(
    $id: String!
    $positionHistories: [PositionHistoryInput!]!
  ) {
    updateEmployeePositions(
      updateEmployeePositionsInput: {
        id: $id
        positionHistories: $positionHistories
      }
    ) {
      id
    }
  }
`;

export interface IPositionHistories {
  positionId: string | null;
  divisionId: string | null;
  startDate: IDate;
  isStill: boolean;
  endDate: IDate;
}

export interface IUpdateEmployeePositionsRequest {
  id: string;
  positionHistories: IPositionHistories[];
}

interface IUpdateEmployeePositionsResponse {
  updateEmployeePositions: {
    id: string;
  };
}

export const useUpdateCompanyPositionHistory = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateEmployeePositionsResponse) => void;
}) => {
  return useMutation<
    IUpdateEmployeePositionsResponse,
    IUpdateEmployeePositionsRequest
  >(UPDATE_COMPANY_POSITION_HISTORY, {
    onError,
    onCompleted,
  });
};
