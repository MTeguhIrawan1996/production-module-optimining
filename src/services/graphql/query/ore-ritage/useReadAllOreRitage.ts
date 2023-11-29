import { ApolloError, gql, useQuery } from '@apollo/client';

import { IHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { IEmployeesData } from '@/services/graphql/query/master-data-company/useReadAllEmploye';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { IShiftsData } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_RITAGE_ORE = gql`
  query ReadAllRitageOre(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
  ) {
    oreRitages(
      findAllOreRitageInput: {
        page: $page
        limit: $limit
        date: $date
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
        checkerFrom {
          id
          humanResource {
            id
            name
          }
        }
        checkerTo {
          id
          humanResource {
            id
            name
          }
        }
        shift {
          id
          name
        }
        companyHeavyEquipment {
          id
          hullNumber
        }
        material {
          id
          name
        }
        fromAt
        arriveAt
        duration
        weather {
          id
          name
        }
        fromPit {
          id
          name
        }
        fromLevel
        toLevel
        stockpile {
          id
          name
        }
        dome {
          id
          name
        }
        bucketVolume
        tonByRitage
        sampleNumber
        desc
        status {
          id
          name
          color
        }
      }
    }
  }
`;

type ICheckerFrom = {
  id: string;
} & Pick<IEmployeesData, 'humanResource'>;

type ICheckerTo = {
  id: string;
} & Pick<IEmployeesData, 'humanResource'>;

interface IOreRitagesData {
  id: string;
  checkerFrom: ICheckerFrom | null;
  checkerTo: ICheckerTo | null;
  shift: Pick<IShiftsData, 'id' | 'name'> | null;
  companyHeavyEquipment: Pick<
    IHeavyEquipmentCompany,
    'id' | 'hullNumber'
  > | null;
  fromAt: Date | string | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
  arriveAt: Date | string | null;
  duration: number | null;
  weather: {
    id: string;
    name: string;
  } | null;
  fromPit: {
    id: string;
    name: string;
  } | null;
  fromLevel: string | null;
  toLevel: string | null;
  stockpile: Pick<IStockpilesData, 'id' | 'name'> | null;
  dome: Pick<IStockpilesData, 'id' | 'name'> | null;
  bucketVolume: number | null;
  tonByRitage: number | null;
  sampleNumber: string | null;
  desc: string | null;
  status: IStatus | null;
}

interface IOreRitagesResponse {
  oreRitages: GResponse<IOreRitagesData>;
}

interface IOreRitagesRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
}

export const useReadAllRitageOre = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IOreRitagesRequest;
  onCompleted?: (data: IOreRitagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: oreRitagesData,
    loading: oreRitagesDataLoading,
    refetch,
  } = useQuery<IOreRitagesResponse, IOreRitagesRequest>(READ_ALL_RITAGE_ORE, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    oreRitagesData: oreRitagesData?.oreRitages.data,
    oreRitagesDataMeta: oreRitagesData?.oreRitages.meta,
    oreRitagesDataLoading,
    refetchOreRitages: refetch,
  };
};
