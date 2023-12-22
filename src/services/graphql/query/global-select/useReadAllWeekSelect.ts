import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_WEEK_SELECT = gql`
  query ReadAllWeekSelect($year: Float) {
    weeks(findAllWeekInput: { year: $year })
  }
`;

interface IReadAllWeekSelectResponse {
  weeks: number[];
}

interface IWeekRequest {
  year: number | null;
}

export const useReadAllWeekSelect = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IWeekRequest>;
  onCompleted?: (data: IReadAllWeekSelectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: weeksData,
    loading: weeksDataLoading,
    refetch,
  } = useQuery<IReadAllWeekSelectResponse, Partial<IWeekRequest>>(
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
    weeksData: weeksData?.weeks,
    weeksDataLoading,
    refetchWeeksData: refetch,
  };
};
