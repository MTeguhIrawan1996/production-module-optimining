import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

interface IMiningMapPlanData {
  id?: string | null;
  mapName: string;
  locationCategoryId: string | null;
  locationId: string | null;
  file: FileWithPath[] | null;
}

export interface IMutationMiningMapPlanValues {
  miningMapPlans: IMiningMapPlanData[];
}
export type IMiningMapPlanNameProps = keyof IMutationMiningMapPlanValues;
export type IMiningMapPlanValueProps = IMiningMapPlanData[];

interface IMutationMiningMapPlanResponse {
  message: string;
}

type IPropsRequest = {
  weeklyPlanId: string;
  data: {
    name: IMiningMapPlanNameProps;
    value: IMiningMapPlanValueProps;
  }[];
};

const createMiningMapPlan = async ({ data, weeklyPlanId }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  data.forEach(({ value }) => {
    if (value) {
      value.forEach((obj, i) => {
        if (obj.id) {
          bodyFormData.append(`miningMapPlans[${i}][id]`, obj.id);
        }
        bodyFormData.append(`miningMapPlans[${i}][mapName]`, obj.mapName);
        bodyFormData.append(
          `miningMapPlans[${i}][locationCategoryId]`,
          obj.locationCategoryId || ''
        );
        bodyFormData.append(
          `miningMapPlans[${i}][locationId]`,
          obj.locationId || ''
        );
        obj.file?.forEach((fObj) => {
          bodyFormData.append(`miningMapPlans[${i}][file]`, fObj);
        });
      });
    }
  });

  const response = await axiosAuth.patch(
    `/plans/${weeklyPlanId}/mining-plans/weekly`,
    bodyFormData
  );
  return response?.data;
};

export const useCreateMiningMapPlan = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IMutationMiningMapPlanResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<IMutationMiningMapPlanValues>
  ) => unknown;
}) => {
  return useMutation<
    IMutationMiningMapPlanResponse,
    AxiosRestErrorResponse<IMutationMiningMapPlanValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await createMiningMapPlan(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
