import { ApolloError, gql, useLazyQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_FOTO_OB_RITAGE_DT = gql`
  query ReadOneFotoObRitageDT($id: String!) {
    overburdenRitage(id: $id) {
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

interface IReadOneFotoObRitageDT {
  id: string;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

interface IReadOneFotoObRitageDTResponse {
  overburdenRitage: IReadOneFotoObRitageDT;
}

interface IReadOneFotoObRitageDTRequest {
  id: string;
}

export const useReadOneFotoObRitageDT = ({
  onCompleted,
}: {
  onCompleted?: (data: IReadOneFotoObRitageDTResponse) => void;
}) => {
  const [
    getData,
    { data: overburdenRitage, loading: overburdenRitageLoading },
  ] = useLazyQuery<
    IReadOneFotoObRitageDTResponse,
    IReadOneFotoObRitageDTRequest
  >(READ_ONE_FOTO_OB_RITAGE_DT, {
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    overburdenRitage: overburdenRitage?.overburdenRitage,
    overburdenRitageLoading,
    getData,
  };
};
