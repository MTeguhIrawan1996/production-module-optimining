import { ApolloError, gql, useQuery } from '@apollo/client';

import { IHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { IEmployeesData } from '@/services/graphql/query/master-data-company/useReadAllEmploye';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { IShiftsData } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import { IFile, IStatus } from '@/types/global';

export const READ_ONE_ORE_RITAGE = gql`
  query ReadOneOreRitage($id: String!) {
    oreRitage(id: $id) {
      id
      date
      checkerFrom {
        id
        humanResource {
          name
        }
      }
      checkerFromPosition
      checkerTo {
        id
        humanResource {
          id
          name
        }
      }
      checkerToPosition
      shift {
        id
        name
      }
      companyHeavyEquipment {
        id
        hullNumber
      }
      companyHeavyEquipmentChange {
        id
        hullNumber
      }
      material {
        id
        name
      }
      subMaterial {
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
      fromFront {
        id
        name
      }
      fromBlock {
        id
        name
      }
      fromGrid {
        id
        name
      }
      fromSequence {
        id
        name
      }
      fromElevation {
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
      bulkSamplingDensity
      bucketVolume
      tonByRitage
      sampleNumber
      desc
      photos {
        id
        originalFileName
        url
        fileName
      }
      status {
        id
        name
      }
      statusMessage
    }
  }
`;

type IChecker = {
  id: string;
} & Pick<IEmployeesData, 'humanResource'>;

export interface IReadOneOreRitage {
  id: string;
  checkerFrom: IChecker | null;
  checkerFromPosition: string | null;
  checkerTo: IChecker | null;
  checkerToPosition: string | null;
  shift: Pick<IShiftsData, 'id' | 'name'> | null;
  companyHeavyEquipment: Pick<
    IHeavyEquipmentCompany,
    'id' | 'hullNumber'
  > | null;
  companyHeavyEquipmentChange: Pick<
    IHeavyEquipmentCompany,
    'id' | 'hullNumber'
  > | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
  subMaterial: Pick<IMaterialsData, 'id' | 'name'> | null;
  fromAt: Date | string | null;
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
  fromFront: {
    id: string;
    name: string;
  } | null;
  fromBlock: {
    id: string;
    name: string;
  } | null;
  fromGrid: {
    id: string;
    name: string;
  } | null;
  fromSequence: {
    id: string;
    name: string;
  } | null;
  fromElevation: {
    id: string;
    name: string;
  } | null;
  fromLevel: string | null;
  toLevel: string | null;
  stockpile: Pick<IStockpilesData, 'id' | 'name'> | null;
  dome: Pick<IStockpilesData, 'id' | 'name'> | null;
  bucketVolume: number | null;
  bulkSamplingDensity: number | null;
  tonByRitage: number | null;
  sampleNumber: string | null;
  desc: string | null;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
  status: IStatus | null;
  statusMessage: string | null;
}

interface IReadOneOreRitageResponse {
  oreRitage: IReadOneOreRitage;
}

interface IReadOneOreRitageRequest {
  id: string;
}

export const useReadOneOreRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneOreRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneOreRitageResponse) => void;
}) => {
  const { data: oreRitage, loading: oreRitageLoading } = useQuery<
    IReadOneOreRitageResponse,
    IReadOneOreRitageRequest
  >(READ_ONE_ORE_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    oreRitage: oreRitage?.oreRitage,
    oreRitageLoading,
  };
};
