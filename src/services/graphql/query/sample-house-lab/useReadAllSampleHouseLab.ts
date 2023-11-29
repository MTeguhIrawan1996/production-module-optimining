import { ApolloError, gql, useQuery } from '@apollo/client';

import {
  GResponse,
  IElementWithValue,
  IGlobalMetaRequest,
  IStatus,
} from '@/types/global';

export const READ_ALL_SAMPLE_HOUSE_LAB = gql`
  query ReadAllSampleHouseLab(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    houseSampleAndLabs(
      findAllHouseSampleAndLabInput: {
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
        location
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
  location: string | null;
  sampleEnterLabAt: string | null;
  gradeControlElements: IElementWithValue[] | null;
  elements: IElementWithValue[] | null;
  status: IStatus | null;
}

interface IHouseSampleAndLabsResponse {
  houseSampleAndLabs: GResponse<IHouseSampleAndLabsData>;
}

export const useReadAllSampleHouseLab = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IHouseSampleAndLabsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: houseSampleAndLabsData,
    loading: houseSampleAndLabsDataLoading,
    refetch,
  } = useQuery<IHouseSampleAndLabsResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_SAMPLE_HOUSE_LAB,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    houseSampleAndLabsData: houseSampleAndLabsData?.houseSampleAndLabs.data,
    houseSampleAndLabsDataMeta: houseSampleAndLabsData?.houseSampleAndLabs.meta,
    houseSampleAndLabsDataLoading,
    refetchHouseSampleAndLabs: refetch,
  };
};
