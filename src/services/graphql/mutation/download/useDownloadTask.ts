import { ApolloError, gql, useMutation } from '@apollo/client';

export const MUTATION_DOWNLOAD_TASK = gql`
  mutation DownloadTask(
    $entity: EntityDownloadEnum!
    $timeFilterType: TimeFilterTypeDownloadEnum!
    $timeFilter: JSON!
    $columnFilter: JSON!
  ) {
    createDownloadTasks(
      createDownloadTaskInput: {
        entity: $entity
        timeFilterType: $timeFilterType
        timeFilter: $timeFilter
        columnFilter: $columnFilter
      }
    ) {
      id
      entity
      timeFilterType
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

export interface IDownloadOreProductionValues {
  locationId: string | null;
}
export interface IDownloadBargingProductionValues {
  stockpileId: string | null;
  domeId: string | null;
}
export interface IDownloadRitageCommonValue {
  period: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  year: string | null;
  month: string | null;
  week: string | null;
  shiftId: string | null;
  heavyEquipmentCode: string | null;
  ritageStatus: string | null;
}
export type IDownloadRitageProductionValues = IDownloadRitageCommonValue &
  IDownloadOreProductionValues &
  IDownloadBargingProductionValues;

type IDownloadTaskRequest = {
  entity: string | null;
  timeFilterType: string | null;
  timeFilter: {
    startDate?: string;
    endDate?: string;
    year?: number;
    week?: number;
    month?: number;
  };
  columnFilter: {
    shiftId?: string | null;
    isRitageProblematic?: boolean | null;
    companyHeavyEquipmentId?: string | null;
    pitId?: string | null;
    fromPitId?: string | null;
    stockpileId?: string | null;
    domeId?: string | null;
    materialId?: string | null;
  };
};

interface IDownloadTaskResponse {
  createDownloadTasks: {
    id: string;
    entity: string;
    timeFilterType: string | null;
  };
}

export const useDownloadTask = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDownloadTaskResponse) => void;
}) => {
  return useMutation<IDownloadTaskResponse, IDownloadTaskRequest>(
    MUTATION_DOWNLOAD_TASK,
    {
      onError,
      onCompleted,
    }
  );
};
