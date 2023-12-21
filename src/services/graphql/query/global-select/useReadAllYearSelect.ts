import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_YEAR_SELECT = gql`
  query ReadAllYearSelect {
    years
  }
`;

interface IReadAllYearSelectResponse {
  years: number[];
}

export const useReadAllYearSelect = ({
  onCompleted,
  skip,
}: {
  onCompleted?: (data: IReadAllYearSelectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: yearsData,
    loading: yearsDataLoading,
    refetch,
  } = useQuery<IReadAllYearSelectResponse>(READ_ALL_YEAR_SELECT, {
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    yearsData: yearsData?.years,
    yearsDataLoading,
    refetchYears: refetch,
  };
};
