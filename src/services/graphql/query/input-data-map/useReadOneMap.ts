import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_MAP = gql`
  query findOne($id: String!) {
    mapData(id: $id) {
      id
      name
      year
      quarter
      month
      week
      dateType
      status
      file {
        id
        url
      }
    }
  }
`;

export interface IReadOneMap {
  id: string;
  name: string;
  year: string;
  quarter: string;
  month: string;
  week: string;
  dateType: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  status: 'WAITING_FOR_CONFIRMATION' | 'VALID' | 'INVALID' | 'ACCEPTED';
  file: {
    id: string;
    url: string;
  } | null;
}

export interface IReadOneMapResponse {
  mapData: IReadOneMap;
}

export interface IReadOneMapRequest {
  id: string;
}

export const useReadOneMap = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneMapRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneMapResponse) => void;
}) => {
  const { data: mapData, loading: mapDataLoading } = useQuery<
    IReadOneMapResponse,
    IReadOneMapRequest
  >(READ_ONE_MAP, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    mapData: mapData?.mapData,
    mapDataLoading,
  };
};
