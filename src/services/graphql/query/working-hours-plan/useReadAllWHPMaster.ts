import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_WHP_MASTER = gql`
  query ReadAllWHP(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    workingHourPlans(
      findAllWorkingHourPlanInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        activityName
      }
    }
  }
`;

interface IWorkingHourPlansData {
  id: string;
  activityName: string;
}

interface IWorkingHourPlansResponse {
  workingHourPlans: GResponse<IWorkingHourPlansData>;
}

export const useReadAllWHPsMaster = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IWorkingHourPlansResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: workingHourPlansData,
    loading: workingHourPlansDataLoading,
    refetch,
  } = useQuery<IWorkingHourPlansResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_WHP_MASTER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-and-network',
    }
  );

  const workingHoursPlansModified =
    workingHourPlansData?.workingHourPlans.data.map((val) => {
      return {
        name: val.activityName ?? '',
        id: val.id ?? '',
      };
    });

  return {
    workingHoursPlansModified,
    workingHourPlansData: workingHourPlansData?.workingHourPlans.data,
    workingHourPlansDataMeta: workingHourPlansData?.workingHourPlans.meta,
    workingHourPlansDataLoading,
    refetchWorkingHourPlans: refetch,
  };
};
