import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationBlockPitValues,
  useCreateBlockPitMaster,
} from '@/services/graphql/mutation/block/useCreateBlockPitMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { blockPitMutationValidation } from '@/utils/form-validation/block/block-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateBlockPitMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationBlockPitValues>({
    resolver: zodResolver(blockPitMutationValidation),
    defaultValues: {
      pits: [
        {
          name: '',
          handBookId: '',
        },
      ],
    },
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    name: 'pits',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateBlockPitMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('block.successCreatePitMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(`/master-data/block/read/${id}`);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationBlockPitValues>(error);
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
    (_, index: number) => {
      const pitId = globalText({
        name: `pits.${index}.handBookId`,
        label: 'pitId',
        colSpan: 6,
      });
      const pitName = globalText({
        name: `pits.${index}.name`,
        label: 'pitName',
        colSpan: 6,
      });

      const field: ControllerGroup = {
        group: t('commonTypography.pit'),
        enableGroupLabel: true,
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {
              fields.length > 1 ? remove(index) : null;
            },
          },
        },
        formControllers: [pitId, pitName],
      };
      return field;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  );
  const arrayField = fields.map(fieldItem);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationBlockPitValues> = async (
    data
  ) => {
    await executeCreate({
      variables: {
        blockId: id,
        pits: data.pits,
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
          label: t('block.createBlockPit'),
          onClick: () =>
            append({
              name: '',
              handBookId: '',
            }),
        }}
        backButton={{
          onClick: () => router.push(`/master-data/block/read/${id}`),
        }}
      />
    </DashboardCard>
  );
};

export default CreateBlockPitMasterBook;
