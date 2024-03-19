import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_WEEK_SELECT = gql`
  query ReadAllWeek2s($year: Float, $month: Float) {
    week2s(findAllWeekInput: { year: $year, month: $month }) {
      week
      detail {
        startDate
        endDate
      }
    }
  }
`;

interface IWeek2Data {
  week: number;
  detail: {
    startDate: string;
    endDate: string;
  };
}
interface IReadAllWeek2sResponse {
  week2s: IWeek2Data[];
}

interface IWeekRequest {
  year: number | null;
  month: number | null;
}

export const useReadAllWeek2s = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IWeekRequest>;
  onCompleted?: (data: IReadAllWeek2sResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: week2sData,
    loading: week2sDataLoading,
    refetch,
  } = useQuery<IReadAllWeek2sResponse, Partial<IWeekRequest>>(
    READ_ALL_WEEK_SELECT,
    {
      variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-first',
    }
  );

  return {
    week2sData: week2sData?.week2s,
    week2sDataLoading,
    refetchWeek2sData: refetch,
  };
};
