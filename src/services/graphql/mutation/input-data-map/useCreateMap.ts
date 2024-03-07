import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MAP = gql`
  mutation createMapData(
    $name: String!
    $dateType: MapDataDate!
    $fileId: String!
    $mapDataCategoryId: String!
    $location: [String!]!
    $companyId: String
    $year: Float!
    $quarter: Float
    $month: Float
    $week: Float
  ) {
    createMapData(
      input: {
        name: $name
        dateType: $dateType
        fileId: $fileId
        mapDataCategoryId: $mapDataCategoryId
        location: $location
        companyId: $companyId
        year: $year
        quarter: $quarter
        month: $month
        week: $week
      }
    ) {
      id
    }
  }
`;

export interface IMutationMapValues {
  name: string;
  dateType: 'QUARTER' | 'MONTH' | 'WEEK' | 'YEAR';
  fileId: string;
  mapDataCategoryId: string;
  location: Array<string>;
  companyId?: string;
  year: number;
  quarter?: number;
  month?: number;
  week?: number;
}

type ICreateMapRequest = IMutationMapValues;

interface ICreateLocationMasterResponse {
  createLocation: {
    id: string;
  };
}

export const useCreateMap = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateLocationMasterResponse) => void;
}) => {
  return useMutation<ICreateLocationMasterResponse, ICreateMapRequest>(
    CREATE_MAP,
    {
      onError,
      onCompleted,
    }
  );
};
