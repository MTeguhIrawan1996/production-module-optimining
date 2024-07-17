import {
  IDownloadBargingProductionValues,
  IDownloadOreProductionValues,
} from '@/services/graphql/mutation/download/useDownloadTask';

type IDefaultValue =
  | IDownloadOreProductionValues
  | IDownloadBargingProductionValues;

type ICommon = {
  label: string;
  entity: string;
  defaultValues?: IDefaultValue | null;
};
export interface IRitageConditional {
  ore: ICommon;
  ob: ICommon;
  quarry: ICommon;
  barging: ICommon;
  topsoil: ICommon;
}

export type RitageType = keyof IRitageConditional;
