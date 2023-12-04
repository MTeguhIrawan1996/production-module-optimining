import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_SAMPLE_HOUSE_LAB = gql`
  mutation UpdateIsValidateSampleHouseLab(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateHouseSampleAndLab(
      validateHouseSampleAndLabInput: {
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

export interface IUpdateIsValidateSampleHouseLabRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateSampleHouseLabResponse {
  validateHouseSampleAndLab: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateSampleHouseLab = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateSampleHouseLabResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateSampleHouseLabResponse,
    IUpdateIsValidateSampleHouseLabRequest
  >(UPDATE_ISVALID_SAMPLE_HOUSE_LAB, {
    onError,
    onCompleted,
  });
};
