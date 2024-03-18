import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_MAP = gql`
  query findOne($id: String!) {
    mapData(input: { id: $id }) {
      id
      name
      year
      quarter
      month {
        id
        name
      }
      week
      dateType
      mapDataStatus {
        id
        name
        slug
      }
      file {
        id
        url
        fileName
        originalFileName
      }
      mapDataCategory {
        id
        name
      }
      mapDataLocation {
        locationId
        name
      }
      company {
        id
        name
      }
    }
  }
`;

export interface IReadOneMap {
  id: string;
  name: string;
  year: string;
  quarter: string;
  month: {
    id: string;
    name: string;
  };
  week: string;
  mapDataStatus: {
    id: string;
    name: string;
    slug: string;
  };
  dateType: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  file: {
    id: string;
    url: string;
    fileName: string;
    originalFileName: string;
  } | null;
  mapDataCategory: {
    id: string;
    name: string;
  };
  mapDataLocation: Array<{
    locationId: string;
    name: string;
  }>;
  company: {
    id: string;
    name: string;
  };
  statusMessage: string;
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
