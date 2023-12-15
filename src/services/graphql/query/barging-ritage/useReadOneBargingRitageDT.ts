import { ApolloError, gql, useLazyQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_FOTO_BARGING_RITAGE_DT = gql`
  query ReadOneFotoBargingRitageDT($id: String!) {
    bargingRitage(id: $id) {
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

interface IReadOneFotoBargingRitageDT {
  id: string;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

interface IReadOneFotoBargingRitageDTResponse {
  bargingRitage: IReadOneFotoBargingRitageDT;
}

interface IReadOneFotoBargingRitageDTRequest {
  id: string;
}

export const useReadOneFotoBargingRitageDT = ({
  onCompleted,
}: {
  onCompleted?: (data: IReadOneFotoBargingRitageDTResponse) => void;
}) => {
  const [getData, { data: bargingRitage, loading: bargingRitageLoading }] =
    useLazyQuery<
      IReadOneFotoBargingRitageDTResponse,
      IReadOneFotoBargingRitageDTRequest
    >(READ_ONE_FOTO_BARGING_RITAGE_DT, {
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      fetchPolicy: 'cache-and-network',
    });

  return {
    bargingRitage: bargingRitage?.bargingRitage,
    bargingRitageLoading,
    getData,
  };
};
