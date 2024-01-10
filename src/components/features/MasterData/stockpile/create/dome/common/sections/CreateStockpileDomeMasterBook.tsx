import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationStockpileDomeValues,
  useCreateStockpileDomeMaster,
} from '@/services/graphql/mutation/stockpile-master/useCreateStockpileDomeMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { stockpileDomeMutationValidation } from '@/utils/form-validation/stockpile/stockpile-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateStockpileDomeMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationStockpileDomeValues>({
    resolver: zodResolver(stockpileDomeMutationValidation),
    defaultValues: {
      domes: [
        {
          name: '',
          handBookId: '',
        },
      ],
    },
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    name: 'domes',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateStockpileDomeMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpile.successCreateDomeMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(`/master-data/stockpile/read/${id}`);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationStockpileDomeValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldItem = React.useCallback(
    (
      val: FieldArrayWithId<IMutationStockpileDomeValues, 'domes', 'id'>,
      index: number
    ) => {
      const domeId = globalText({
        name: `domes.${index}.handBookId`,
        label: 'domeId',
        colSpan: 6,
        key: `domes.${index}.handBookId.${val.id}`,
      });
      const domeName = globalText({
        name: `domes.${index}.name`,
        label: 'domeName',
        colSpan: 6,
        key: `domes.${index}.name.${val.id}`,
      });

      const field: ControllerGroup = {
        group: t('commonTypography.dome'),
        enableGroupLabel: true,
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {
              fields.length > 1 ? remove(index) : null;
            },
          },
        },
        formControllers: [domeId, domeName],
      };
      return field;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  );
  const arrayField = fields.map(fieldItem);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationStockpileDomeValues> = async (
    data
  ) => {
    await executeCreate({
      variables: {
        stockpileId: id,
        domes: data.domes,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={arrayField}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        outerButton={{
          label: t('stockpile.createStockpileDome'),
          onClick: () =>
            append({
              name: '',
              handBookId: '',
            }),
        }}
        backButton={{
          onClick: () => router.push(`/master-data/stockpile/read/${id}`),
        }}
      />
    </DashboardCard>
  );
};

export default CreateStockpileDomeMasterBook;
