import { ApolloError, gql, useLazyQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_FOTO_MOVING_RITAGE_DT = gql`
  query ReadOneFotoMovingRitageDT($id: String!) {
    movingRitage(id: $id) {
      id
      photos {
        id
        originalFileName
        url
        fileName
      }
    }
  }
`;

interface IReadOneFotoMovingRitageDT {
  id: string;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

interface IReadOneFotoMovingRitageDTResponse {
  movingRitage: IReadOneFotoMovingRitageDT;
}

interface IReadOneFotoMovingRitageDTRequest {
  id: string;
}

export const useReadOneFotoMovingRitageDT = ({
  onCompleted,
}: {
  onCompleted?: (data: IReadOneFotoMovingRitageDTResponse) => void;
}) => {
  const [getData, { data: movingRitage, loading: movingRitageLoading }] =
    useLazyQuery<
      IReadOneFotoMovingRitageDTResponse,
      IReadOneFotoMovingRitageDTRequest
    >(READ_ONE_FOTO_MOVING_RITAGE_DT, {
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      fetchPolicy: 'cache-and-network',
    });

  return {
    movingRitage: movingRitage?.movingRitage,
    movingRitageLoading,
    getData,
  };
};
