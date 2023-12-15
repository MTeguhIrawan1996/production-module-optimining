import { ApolloError, gql, useLazyQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_FOTO_QUARRY_RITAGE_DT = gql`
  query ReadOneFotoQuarryRitageDT($id: String!) {
    quarryRitage(id: $id) {
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

interface IReadOneFotoQuarryRitageDT {
  id: string;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

interface IReadOneFotoQuarryRitageDTResponse {
  quarryRitage: IReadOneFotoQuarryRitageDT;
}

interface IReadOneFotoQuarryRitageDTRequest {
  id: string;
}

export const useReadOneFotoQuarryRitageDT = ({
  onCompleted,
}: {
  onCompleted?: (data: IReadOneFotoQuarryRitageDTResponse) => void;
}) => {
  const [getData, { data: quarryRitage, loading: quarryRitageLoading }] =
    useLazyQuery<
      IReadOneFotoQuarryRitageDTResponse,
      IReadOneFotoQuarryRitageDTRequest
    >(READ_ONE_FOTO_QUARRY_RITAGE_DT, {
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      fetchPolicy: 'cache-and-network',
    });

  return {
    quarryRitage: quarryRitage?.quarryRitage,
    quarryRitageLoading,
    getData,
  };
};
