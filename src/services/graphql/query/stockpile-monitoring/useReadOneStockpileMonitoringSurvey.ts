import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_SURVEY = gql`
  query ReadOneStockpileMonitoringSurvey(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpileSurvey(
      findAllMonitoringStockpileSurveyInput: {
        page: $page
        limit: $limit
        orderBy: $orderBy
        orderDir: $orderDir
        monitoringStockpileId: $id
      }
    ) {
      meta {
        currentPage
        totalAllData
        totalData
        totalPage
      }
      data {
        id
        date
        ton
        volume
      }
    }
  }
`;

interface IReadOneStockpileMonitoringSurvey {
  id: string;
  date: string | null;
  ton: number | null;
  volume: number | null;
}

interface IReadOneStockpileMonitoringSurveyResponse {
  monitoringStockpileSurvey: GResponse<IReadOneStockpileMonitoringSurvey>;
}

interface IReadOneStockpileMonitoringSurveyRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneStockpileMonitoringSurvey = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringSurveyRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringSurveyResponse) => void;
}) => {
  const {
    data: monitoringStockpileSurvey,
    loading: monitoringStockpileSurveyLoading,
  } = useQuery<
    IReadOneStockpileMonitoringSurveyResponse,
    IReadOneStockpileMonitoringSurveyRequest
  >(READ_ONE_STOCKPILE_MONITORING_SURVEY, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    monitoringStockpileSurvey:
      monitoringStockpileSurvey?.monitoringStockpileSurvey,
    monitoringStockpileSurveyLoading,
  };
};
