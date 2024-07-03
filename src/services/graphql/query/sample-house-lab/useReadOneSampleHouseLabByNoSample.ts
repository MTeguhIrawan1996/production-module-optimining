import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IHouseSampleAndLabsData } from '@/services/graphql/query/sample-house-lab/useReadAllSampleHouseLab';

export const READ_ONE_SAMPLE_HOUSE_LAB_BY_NUMBER_SAMPLE = gql`
  query ReadOneSampleHouseLabByNumberSample($sampleNumber: String!) {
    houseSampleAndLabBySampleNumber(sampleNumber: $sampleNumber) {
      id
      sampleDate
      sampleNumber
      sampleName
      sampleType {
        id
        name
      }
      elements {
        value
        element {
          id
          name
        }
      }
    }
  }
`;

interface IReadOneSampleHouseLabByNumberSampleResponse {
  houseSampleAndLabBySampleNumber: IHouseSampleAndLabsData;
}

interface IReadOneSampleHouseLabByNumberSampleRequest {
  sampleNumber: string;
}

export const useReadOneSampleHouseLabByNumberSample = ({
  variables,
  skip,
  onCompleted,
  onError,
  fetchPolicy = 'cache-first',
}: {
  variables: IReadOneSampleHouseLabByNumberSampleRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneSampleHouseLabByNumberSampleResponse) => void;
  onError?: ({ graphQLErrors }: ApolloError) => void;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: houseSampleAndLab,
    loading: houseSampleAndLabLoading,
    called,
    refetch,
  } = useQuery<
    IReadOneSampleHouseLabByNumberSampleResponse,
    IReadOneSampleHouseLabByNumberSampleRequest
  >(READ_ONE_SAMPLE_HOUSE_LAB_BY_NUMBER_SAMPLE, {
    variables,
    onError: onError,
    onCompleted: onCompleted,
    skip,
    fetchPolicy,
  });

  return {
    houseSampleAndLab: houseSampleAndLab?.houseSampleAndLabBySampleNumber,
    houseSampleAndLabLoading,
    refetch,
    called,
  };
};
