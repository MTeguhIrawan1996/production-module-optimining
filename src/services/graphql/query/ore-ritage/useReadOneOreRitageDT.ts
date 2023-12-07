import { ApolloError, gql, useLazyQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_FOTO_ORE_RITAGE_DT = gql`
  query ReadOneFotoOreRitageDT($id: String!) {
    oreRitage(id: $id) {
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

interface IReadOneFotoOreRitageDT {
  id: string;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

interface IReadOneFotoOreRitageDTResponse {
  oreRitage: IReadOneFotoOreRitageDT;
}

interface IReadOneFotoOreRitageDTRequest {
  id: string;
}

export const useReadOneFotoOreRitageDT = ({
  onCompleted,
}: {
  onCompleted?: (data: IReadOneFotoOreRitageDTResponse) => void;
}) => {
  const [getData, { data: oreRitage, loading: oreRitageLoading }] =
    useLazyQuery<
      IReadOneFotoOreRitageDTResponse,
      IReadOneFotoOreRitageDTRequest
    >(READ_ONE_FOTO_ORE_RITAGE_DT, {
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      fetchPolicy: 'cache-and-network',
    });

  return {
    oreRitage: oreRitage?.oreRitage,
    oreRitageLoading,
    getData,
  };
};
