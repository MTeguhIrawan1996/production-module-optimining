import { ApolloError, gql, useMutation } from '@apollo/client';

export const DOWNLOAD_FRONT_PRDUCTION = gql`
  mutation DownloadFrontProduction(
    $entity: String
    $timeFilterType: String
    $startDate: String
    $endDate: String
    $shiftId: String
    $pitId: String
    $materialId: String
  ) {
    createDownloadTasks(
      createDownloadTasksInput: {
        entity: $entity
        timeFilterType: $timeFilterType
        startDate: $startDate
        endDate: $endDate
        shiftId: $shiftId
        pitId: $pitId
        materialId: $materialId
      }
    ) {
      id
      type
    }
  }
`;

export interface IDownloadFrontProductionValues {
  period: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  year: string | null;
  month: string | null;
  week: string | null;
  locationId: string | null;
  shiftId: string | null;
  materialId: string | null;
}

type IDownloadFrontProductionRequest = Omit<
  IDownloadFrontProductionValues,
  'block'
>;

interface IDownloadFrontProductionResponse {
  createDownloadTasks: {
    id: string;
    type: string;
  };
}

export const useDownloadFrontProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDownloadFrontProductionResponse) => void;
}) => {
  return useMutation<
    IDownloadFrontProductionResponse,
    IDownloadFrontProductionRequest
  >(DOWNLOAD_FRONT_PRDUCTION, {
    onError,
    onCompleted,
  });
};
