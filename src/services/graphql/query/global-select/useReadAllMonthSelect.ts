import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_MONTH_SELECT = gql`
  query ReadAllMonthSelect {
    months {
      id
      name
    }
  }
`;

interface IMonthItem {
  id: number;
  name: string;
}

interface IReadAllMonthSelectResponse {
  months: IMonthItem[];
}

export const useReadAllMonthSelect = ({
  onCompleted,
  skip,
}: {
  onCompleted?: (data: IReadAllMonthSelectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: monthsData,
    loading: monthsDataLoading,
    refetch,
  } = useQuery<IReadAllMonthSelectResponse>(READ_ALL_MONTH_SELECT, {
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    monthsData: monthsData?.months,
    monthsDataLoading,
    refetchMonthsData: refetch,
  };
};
