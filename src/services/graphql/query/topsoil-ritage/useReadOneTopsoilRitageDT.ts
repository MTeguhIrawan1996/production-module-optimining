import { ApolloError, gql, useLazyQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_FOTO_TOPSOIL_RITAGE_DT = gql`
  query ReadOneFotoTopsoilRitageDT($id: String!) {
    topsoilRitage(id: $id) {
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

interface IReadOneFotoTopsoilRitageDT {
  id: string;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

interface IReadOneFotoTopsoilRitageDTResponse {
  topsoilRitage: IReadOneFotoTopsoilRitageDT;
}

interface IReadOneFotoTopsoilRitageDTRequest {
  id: string;
}

export const useReadOneFotoTopsoilRitageDT = ({
  onCompleted,
}: {
  onCompleted?: (data: IReadOneFotoTopsoilRitageDTResponse) => void;
}) => {
  const [getData, { data: topsoilRitage, loading: topsoilRitageLoading }] =
    useLazyQuery<
      IReadOneFotoTopsoilRitageDTResponse,
      IReadOneFotoTopsoilRitageDTRequest
    >(READ_ONE_FOTO_TOPSOIL_RITAGE_DT, {
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      fetchPolicy: 'cache-and-network',
    });

  return {
    topsoilRitage: topsoilRitage?.topsoilRitage,
    topsoilRitageLoading,
    getData,
  };
};
