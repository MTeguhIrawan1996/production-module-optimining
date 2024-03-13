import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_MAP = gql`
  mutation validateMapDataStatus(
    $id: String!
    $changeStatus: MapDataStatusValidation!
  ) {
    validateMapDataStatus(input: $input) {
      id
      name
    }
  }
`;

export interface IUpdateIsValidateMapRequest extends IUpdateStatusValues {
  id: string;
  status: 'INVALID' | 'WAITING_FOR_CONFIRMATION';
}

interface IUpdateIsValidateMapResponse {
  validateMapDataStatus: {
    id: string;
  };
}

export const useValidateMap = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateMapResponse) => void;
}) => {
  return useMutation<IUpdateIsValidateMapResponse, IUpdateIsValidateMapRequest>(
    UPDATE_ISVALID_MAP,
    {
      onError,
      onCompleted,
    }
  );
};
