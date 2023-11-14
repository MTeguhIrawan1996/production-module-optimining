import { ApolloError, gql, useQuery } from '@apollo/client';

import { IHeavyEquipmentMasterData } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentMasterData';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_NON_COMPANY_HEAVY_EQUIPMENT = gql`
  query ReadAllNonCompanyHeavyEquipment(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $excludeIds: [String!]
  ) {
    nonOwnedByCompanyHeavyEquipments(
      findAllNonOwnedByCompanyHeavyEquipmentDto: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        excludeIds: $excludeIds
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
        engineNumber
        chassisNumber
        reference {
          id
          modelName
          spec
          type {
            id
            name
            brand {
              id
              name
            }
          }
        }
        createdYear
      }
    }
  }
`;

interface INonCompanyHeavyEquipmentResponse {
  nonOwnedByCompanyHeavyEquipments: GResponse<IHeavyEquipmentMasterData>;
}

interface INonOwnedByCompanyHeavyEquipmentsRequest extends IGlobalMetaRequest {
  excludeIds: string[] | null;
}

export const useReadAllNonCompanyHeavyEquipment = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<INonOwnedByCompanyHeavyEquipmentsRequest>;
  onCompleted?: (data: INonCompanyHeavyEquipmentResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: nonOwnedByCompanyHeavyEquipmentsData,
    loading: nonOwnedByCompanyHeavyEquipmentsDataLoading,
    refetch,
  } = useQuery<
    INonCompanyHeavyEquipmentResponse,
    Partial<INonOwnedByCompanyHeavyEquipmentsRequest>
  >(READ_ALL_NON_COMPANY_HEAVY_EQUIPMENT, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    nonOwnedByCompanyHeavyEquipmentsData:
      nonOwnedByCompanyHeavyEquipmentsData?.nonOwnedByCompanyHeavyEquipments
        .data,
    nonOwnedByCompanyHeavyEquipmentsDataMeta:
      nonOwnedByCompanyHeavyEquipmentsData?.nonOwnedByCompanyHeavyEquipments
        .meta,
    nonOwnedByCompanyHeavyEquipmentsDataLoading,
    refetchNonOwnedByCompanyHeavyEquipments: refetch,
  };
};
