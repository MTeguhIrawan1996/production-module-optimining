import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import {
  GResponse,
  IElementWithValue,
  IGlobalMetaRequest,
  IGlobalTimeFIlter,
  IStatus,
} from '@/types/global';

export const READ_ALL_SAMPLE_HOUSE_LAB = gql`
  query ReadAllSampleHouseLab(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $sampleTypeId: String
    $shiftId: String
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    houseSampleAndLabs(
      findAllHouseSampleAndLabInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        sampleTypeId: $sampleTypeId
        shiftId: $shiftId
        timeFilterType: $timeFilterType
        timeFilter: $timeFilter
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
        laboratoriumName
        sampleDate
        shift {
          id
          name
        }
        sampleNumber
        sampleName
        sampleType {
          id
          name
        }
        sampler {
          id
          humanResource {
            id
            name
          }
        }
        gradeControl {
          id
          humanResource {
            id
            name
          }
        }
        locationCategory {
          id
          name
        }
        location {
          id
          name
        }
        locationName
        sampleEnterLabAt
        gradeControlElements {
          value
          element {
            id
            name
          }
        }
        elements {
          value
          element {
            id
            name
          }
        }
        status {
          id
          name
          color
        }
      }
    }
  }
`;

export interface IHouseSampleAndLabsData {
  id: string;
  laboratoriumName: string;
  sampleDate: string | null;
  shift: {
    id: string;
    name: string;
  } | null;
  sampleNumber: string;
  sampleName: string;
  sampleType: {
    id: string;
    name: string;
  } | null;
  sampler: {
    id: string;
    humanResource: {
      id: string;
      name: string;
    } | null;
  } | null;
  gradeControl: {
    id: string;
    humanResource: {
      id: string;
      name: string;
    } | null;
  } | null;
  locationCategory: {
    id: string;
    name: string;
  } | null;
  location: {
    id: string;
    name: string;
  } | null;
  locationName: string | null;
  sampleEnterLabAt: string | null;
  gradeControlElements: IElementWithValue[] | null;
  elements: IElementWithValue[] | null;
  status: IStatus | null;
}

interface IHouseSampleAndLabsResponse {
  houseSampleAndLabs: GResponse<IHouseSampleAndLabsData>;
}

export interface IHouseSampleAndLabsRequest extends IGlobalMetaRequest {
  sampleTypeId: string | null;
  shiftId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllSampleHouseLab = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IHouseSampleAndLabsRequest>;
  onCompleted?: (data: IHouseSampleAndLabsResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: houseSampleAndLabsData,
    loading: houseSampleAndLabsDataLoading,
    refetch,
  } = useQuery<
    IHouseSampleAndLabsResponse,
    Partial<IHouseSampleAndLabsRequest>
  >(READ_ALL_SAMPLE_HOUSE_LAB, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
  });

  return {
    houseSampleAndLabsData: houseSampleAndLabsData?.houseSampleAndLabs.data,
    houseSampleAndLabsDataMeta: houseSampleAndLabsData?.houseSampleAndLabs.meta,
    houseSampleAndLabsDataLoading,
    refetchHouseSampleAndLabs: refetch,
  };
};
