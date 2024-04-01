import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_MAP = gql`
  mutation updateMapData(
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
    $id: String!
  ) {
    updateMapData(
      input: {
        id: $id
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
  companyId: string | null;
  year: number;
  quarter?: number;
  month?: number;
  week?: number;
  id: string;
}

type IUpdateMapRequest = IMutationMapValues;

interface IUpdateLocationMasterResponse {
  updateLocation: {
    id: string;
  };
}

export const useUpdateMap = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateLocationMasterResponse) => void;
}) => {
  return useMutation<IUpdateLocationMasterResponse, IUpdateMapRequest>(
    UPDATE_MAP,
    {
      onError,
      onCompleted,
    }
  );
};
