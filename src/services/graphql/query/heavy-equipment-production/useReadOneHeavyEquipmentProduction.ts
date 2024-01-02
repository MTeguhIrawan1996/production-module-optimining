import { ApolloError, gql, useQuery } from '@apollo/client';

import { IShiftsData } from '@/services/graphql/query/shift/useReadAllShiftMaster';

import { IStatus } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT_PRODUCTION = gql`
  query ReadOneHeavyEquipmentProduction($id: String!) {
    heavyEquipmentData(id: $id) {
      id
      date
      companyHeavyEquipment {
        id
        hullNumber
        heavyEquipment {
          id
          engineNumber
          reference {
            id
            type {
              id
              name
            }
          }
        }
      }
      shift {
        id
        name
      }
      foreman {
        id
        nip
        humanResource {
          id
          name
        }
      }
      operator {
        id
        nip
        humanResource {
          id
          name
        }
      }
      workDuration
      workStartAt
      workFinishAt
      loseTimes {
        id
        totalDuration
        workingHourPlan {
          id
          activityName
          slug
        }
        details {
          duration
          startAt
          finishAt
        }
      }
      status {
        id
        name
      }
      statusMessage
      desc
    }
  }
`;

interface IReadOneHeavyEquipmentProduction {
  id: string;
  date: string | null;
  companyHeavyEquipment: {
    id: string;
    hullNumber: string | null;
    heavyEquipment: {
      id: string;
      reference: {
        id: string;
        type: {
          id: string;
          name: string;
        };
      };
    };
  };
  shift: Pick<IShiftsData, 'id' | 'name'> | null;
  foreman: {
    id: string;
    nip: string | null;
    humanResource: {
      id: string;
      name: string;
    };
  };
  operator: {
    id: string;
    nip: string | null;
    humanResource: {
      id: string;
      name: string;
    };
  };
  status: IStatus | null;
  statusMessage: string | null;
  workStartAt: string | null;
  workFinishAt: string | null;
  workDuration: number | null;
  loseTimes:
    | {
        id: string;
        totalDuration: number | null;
        workingHourPlan: {
          id: string;
          activityName: string;
          slug: string;
        } | null;
        details:
          | {
              duration: number | null;
              startAt: string | null;
              finishAt: string | null;
            }[]
          | null;
      }[]
    | null;
  desc: string | null;
}

interface IReadOneHeavyEquipmentProductionResponse {
  heavyEquipmentData: IReadOneHeavyEquipmentProduction;
}

interface IReadOneHeavyEquipmentProductionRequest {
  id: string;
}

export const useReadOneHeavyEquipmentProduction = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneHeavyEquipmentProductionRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneHeavyEquipmentProductionResponse) => void;
}) => {
  const { data: heavyEquipmentData, loading: heavyEquipmentDataLoading } =
    useQuery<
      IReadOneHeavyEquipmentProductionResponse,
      IReadOneHeavyEquipmentProductionRequest
    >(READ_ONE_HEAVY_EQUIPMENT_PRODUCTION, {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    });

  return {
    heavyEquipmentData: heavyEquipmentData?.heavyEquipmentData,
    heavyEquipmentDataLoading,
  };
};
