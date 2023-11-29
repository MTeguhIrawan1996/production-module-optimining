import { ApolloError, gql, useMutation } from '@apollo/client';

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
  startDate?: Date | string | null;
  isStill: boolean;
  endDate?: Date | string | null;
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
