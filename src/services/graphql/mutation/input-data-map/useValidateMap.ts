import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_MAP = gql`
  mutation validateMapData(
    $id: String
    $status: Boolean
    $statusMessage: String
  ) {
    validateMapData(
      input: { id: $id, status: $status, statusMessage: $statusMessage }
    ) {
      id
      mapDataStatus {
        id
        name
      }
    }
  }
`;

export interface IUpdateIsValidateMapRequest extends IUpdateStatusValues {
  id: string;
  status: boolean;
  statusMessage: string | null;
}

interface IUpdateIsValidateMapResponse {
  validateMapDataStatus: {
    id: string;
    mapDataStatus: {
      id;
      name;
    };
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
