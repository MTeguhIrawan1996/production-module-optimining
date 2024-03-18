import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_MONTH_SELECT = gql`
  query ReadAllMonth2Select($year: Float, $quarter: Float) {
    month2s(findAllMonthInput: { year: $year, quarter: $quarter }) {
      month
      detail {
        startWeek
        endWeek
      }
    }
  }
`;

interface IMonthItem {
  month: number;
  detail: {
    startWeek: string;
    endWeek: string;
  };
}

interface IReadAllMonth2selectResponse {
  month2s: IMonthItem[];
}

interface IMonth2Request {
  year: number | null;
  month: number | null;
}

export const useReadAllMonth2Select = ({
  onCompleted,
  skip,
  variables,
}: {
  variables?: Partial<IMonth2Request>;
  onCompleted?: (data: IReadAllMonth2selectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: month2sData,
    loading: month2sDataLoading,
    refetch,
  } = useQuery<IReadAllMonth2selectResponse, Partial<IMonth2Request>>(
    READ_ALL_MONTH_SELECT,
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
    month2sData: month2sData?.month2s,
    month2sDataLoading,
    refetchMonth2sData: refetch,
  };
};
