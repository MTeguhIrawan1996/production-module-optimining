import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_SAMPLE_HOUSE_LAB = gql`
  mutation UpdateIsDeterminedSampleHouseLab(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineHouseSampleAndLab(
      determineHouseSampleAndLabInput: {
        id: $id
        status: $status
        statusMessage: $statusMessage
      }
    ) {
      id
      status {
        id
        name
      }
    }
  }
`;

export interface IUpdateIsDeterminedSampleHouseLabRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedSampleHouseLabResponse {
  determineHouseSampleAndLab: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedSampleHouseLab = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedSampleHouseLabResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedSampleHouseLabResponse,
    IUpdateIsDeterminedSampleHouseLabRequest
  >(UPDATE_ISDETERMINED_SAMPLE_HOUSE_LAB, {
    onError,
    onCompleted,
  });
};
