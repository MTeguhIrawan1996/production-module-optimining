import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_SAMPLE_TYPE = gql`
  query ReadAllSampleType(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    sampleTypes(
      findAllSampleTypeInput: {
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
        name
      }
    }
  }
`;

export interface ISampleTypesData {
  id: string;
  name: string;
}

interface ISampleTypesResponse {
  sampleTypes: GResponse<ISampleTypesData>;
}

export const useReadAllSampleType = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: ISampleTypesResponse) => void;
  skip?: boolean;
}) => {
  const { data: sampleTypesdata, loading: sampleTypesLoading } = useQuery<
    ISampleTypesResponse,
    Partial<IGlobalMetaRequest>
  >(READ_ALL_SAMPLE_TYPE, {
    variables: variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
    skip,
  });

  return {
    sampleTypesdata: sampleTypesdata?.sampleTypes.data,
    sampleTypesMeta: sampleTypesdata?.sampleTypes.meta,
    sampleTypesLoading,
  };
};
