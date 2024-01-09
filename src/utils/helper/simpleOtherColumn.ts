import { t } from 'i18next';
import { DataTableColumn } from 'mantine-datatable';

interface IProps<T> {
  data?: T[];
  exclude?: string[];
}

export const simpleOtherColumn = <T extends object>({
  data,
  exclude = [''],
}: IProps<T>) => {
  const modifiedArray =
    data && data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          accessor: key,
        }))
      : [];

  const otherColumn = modifiedArray
    ?.filter((val) => !exclude.includes(val.accessor))
    .map((val) => {
      const column: DataTableColumn<T> = {
        accessor: `${val.accessor}`,
        title: t(`commonTypography.${val.accessor}`),
        width: val.accessor === 'date' ? 160 : undefined,
      };
      return column;
    });

  return otherColumn;
};
