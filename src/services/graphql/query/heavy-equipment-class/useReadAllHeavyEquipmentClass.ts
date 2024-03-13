import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_CLASS = gql`
  query ReadAllHeavyEquipmentClass(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String # $typeId: String
  ) {
    heavyEquipmentClasses(
      findAllHeavyEquipmentClassInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        # typeId: $typeId
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
        heavyEquipmentReferences {
          id
          modelName
          type {
            id
            name
            brand {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export interface IHeavyEquipmentClassData {
  id: string;
  name: string;
  heavyEquipmentReferences: {
    id: string;
    modelName: string;
    type: {
      id: string;
      name: string;
      brand: {
        id: string;
        name: string;
      };
    };
  }[];
}

interface IHeavyEquipmentClassResponse {
  heavyEquipmentClasses: GResponse<IHeavyEquipmentClassData>;
}

interface IHeavyEquipmentClassRequest extends Partial<IGlobalMetaRequest> {
  typeId?: string | null;
}

export const useReadAllHeavyEquipmentClass = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: IHeavyEquipmentClassRequest;
  onCompleted?: (data: IHeavyEquipmentClassResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: heavyEquipmentClassesData,
    loading: heavyEquipmentClassesDataLoading,
    refetch,
  } = useQuery<IHeavyEquipmentClassResponse, IHeavyEquipmentClassRequest>(
    READ_ALL_HEAVY_EQUIPMENT_CLASS,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
    }
  );

  return {
    heavyEquipmentClassesData:
      heavyEquipmentClassesData?.heavyEquipmentClasses.data,
    heavyEquipmentClassesDataMeta:
      heavyEquipmentClassesData?.heavyEquipmentClasses.meta,
    heavyEquipmentClassesDataLoading,
    refetchHeavyEquipmentClasses: refetch,
  };
};
