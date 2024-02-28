import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, IFile } from '@/types/global';

export interface IMonthlyMiningMapPlanData {
  id?: string | null;
  mapName: string;
  locationCategoryId: string | null;
  locationId: string | null;
  file: FileWithPath[] | null;
  serverFile: Omit<IFile, 'path'>[];
}

export interface IMutationMonthlyMiningMapPlanValues {
  miningMapPlans: IMonthlyMiningMapPlanData[];
}
export type IMonthlyMiningMapPlanNameProps =
  keyof IMutationMonthlyMiningMapPlanValues;
export type IMonthlyMiningMapPlanValueProps = IMonthlyMiningMapPlanData[];

interface IMonthlyMutationMiningMapPlanResponse {
  message: string;
}

type IPropsRequest = {
  weeklyPlanId: string;
  data: {
    name: IMonthlyMiningMapPlanNameProps;
    value: IMonthlyMiningMapPlanValueProps;
  }[];
};

const createMonthlyMiningMapPlan = async ({
  data,
  weeklyPlanId,
}: IPropsRequest) => {
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

export const useCreateMonthlyMiningMapPlan = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IMonthlyMutationMiningMapPlanResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<IMutationMonthlyMiningMapPlanValues>
  ) => unknown;
}) => {
  return useMutation<
    IMonthlyMutationMiningMapPlanResponse,
    AxiosRestErrorResponse<IMutationMonthlyMiningMapPlanValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await createMonthlyMiningMapPlan(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
