import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadAllFrontProductionData } from '@/services/graphql/query/front-production/useReadAllFrontProduction';
import { IHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { formatDate } from '@/utils/helper/dateFormat';

import { IGroupingDetail, IStatus } from '@/types/global';

export const READ_ONE_FRONT_PRODUCTION = gql`
  query ReadOneFrontProduction($id: String!) {
    frontData(id: $id) {
      id
      date
      material {
        id
        name
      }
      front {
        id
        name
      }
      companyHeavyEquipment {
        id
        hullNumber
        heavyEquipment {
          class {
            id
            name
          }
        }
      }
      type
      pit {
        id
        name
        block {
          id
          name
        }
      }
      dome {
        id
        name
      }
      grid {
        id
        name
      }
      elevation {
        id
        name
      }
      x
      y
      statusMessage
      status {
        id
        name
        color
      }
    }
  }
`;

interface IReadOneFrontProductionData extends IReadAllFrontProductionData {
  id: string;
  date: string | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
  front: Pick<ILocationsData, 'id' | 'name'> | null;
  companyHeavyEquipment: IHeavyEquipmentCompany | null;
  type: string;
  pit: {
    id: string;
    name: string;
    block: {
      id: string;
      name: string;
    };
  } | null;
  dome: {
    id: string;
    name: string;
  } | null;
  elevation: {
    id: string;
    name: string;
  } | null;
  grid: {
    id: string;
    name: string;
  } | null;
  x: number | null;
  y: number | null;
  statusMessage: string | null;
  status: IStatus | null;
}

interface IReadOneFrontProductionResponse {
  frontData: IReadOneFrontProductionData;
}

interface IReadOneFrontProductionRequest {
  id: string;
}

export const useReadOneFrontProduction = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneFrontProductionRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneFrontProductionResponse) => void;
}) => {
  const { data: frontData, loading: frontDataLoading } = useQuery<
    IReadOneFrontProductionResponse,
    IReadOneFrontProductionRequest
  >(READ_ONE_FRONT_PRODUCTION, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  const isDomeType = frontData?.frontData.type === 'dome';

  const dome = {
    name: 'location',
    value: frontData?.frontData.dome?.name,
  };

  const itemValueFrontInformation = [
    {
      name: 'front',
      value: frontData?.frontData.front?.name,
    },
    {
      name: 'heavyEquipmentCode',
      value: frontData?.frontData.companyHeavyEquipment?.hullNumber,
    },
    {
      name: 'material',
      value: frontData?.frontData.material?.name,
    },
  ];

  const itemValueFrontInformationDomeType = [
    ...itemValueFrontInformation,
    dome,
  ];

  const grouping: IGroupingDetail[] = [
    {
      group: 'date',
      withDivider: false,
      enableTitle: false,
      itemValue: [
        {
          name: 'date',
          value: formatDate(frontData?.frontData.date),
        },
      ],
    },
    {
      group: 'frontInformation',
      withDivider: true,
      enableTitle: true,
      itemValue: [
        ...(isDomeType
          ? itemValueFrontInformationDomeType
          : itemValueFrontInformation),
      ],
    },
    {
      group: 'location',
      withDivider: true,
      enableTitle: true,
      itemValue: [
        {
          name: 'pit',
          value: frontData?.frontData.pit?.name,
        },
        {
          name: 'block',
          value: frontData?.frontData.pit?.block.name,
        },
        {
          name: 'grid',
          value: frontData?.frontData.grid?.name,
        },
        {
          name: 'elevation',
          value: frontData?.frontData.elevation?.name,
        },
      ],
    },
    {
      group: 'coordinate',
      withDivider: false,
      enableTitle: true,
      itemValue: [
        {
          name: 'coordinateX',
          value: `${frontData?.frontData.x}`,
        },
        {
          name: 'coordinateY',
          value: `${frontData?.frontData.y}`,
        },
      ],
    },
  ];

  const fileteredGroupingIsDome = grouping.filter(
    (val) => val.group !== 'location'
  );

  return {
    frontData: frontData?.frontData,
    frontDataGrouping: isDomeType ? fileteredGroupingIsDome : grouping,
    frontDataLoading,
  };
};
