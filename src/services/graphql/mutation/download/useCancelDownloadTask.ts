import { ApolloError, gql, useMutation } from '@apollo/client';

export const MUTATION_CANCEL_DOWNLOAD_TASK = gql`
  mutation CancelDownloadTask($id: String!) {
    cancelDownloadTask(id: $id)
  }
`;

type IDownloadTaskRequest = {
  id: string;
};

export const useCancelDownloadTask = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: () => void;
}) => {
  return useMutation<any, IDownloadTaskRequest>(MUTATION_CANCEL_DOWNLOAD_TASK, {
    onError,
    onCompleted,
  });
};
