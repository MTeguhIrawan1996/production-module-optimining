import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationUpdateBlockPitValues,
  useUpdateBlockPitMaster,
} from '@/services/graphql/mutation/block/useUpdateBlockPitMaster';
import { useReadOneBlockPitMaster } from '@/services/graphql/query/block/useReadOneBlockPitMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateBlockPitMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const blockId = router.query?.id?.[0] as string;
  const pitId = router.query?.id?.[1] as string;

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationUpdateBlockPitValues>({
    // resolver: zodResolver(blockPitMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { blockPitMasterLoading } = useReadOneBlockPitMaster({
    variables: {
      id: pitId,
    },
    skip: !router.isReady,
    onCompleted: ({ pit }) => {
      methods.setValue('name', pit.name);
      methods.setValue('handBookId', pit.handBookId);
    },
  });

  const [executeCreate, { loading }] = useUpdateBlockPitMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('block.successUpdatePitMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(`/master-data/block/read/${blockId}`);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<unknown>(error);
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
  const fieldItem = React.useMemo(() => {
    const pitId = globalText({
      name: 'handBookId',
      label: 'pitId',
      colSpan: 6,
    });
    const pitName = globalText({
      name: 'name',
      label: 'pitName',
      colSpan: 6,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.pit'),
        enableGroupLabel: true,
        formControllers: [pitId, pitName],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationUpdateBlockPitValues> = async (
    data
  ) => {
    await executeCreate({
      variables: {
        id: pitId,
        blockId: blockId,
        handBookId: data.handBookId,
        name: data.name,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={blockPitMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push(`/master-data/block/read/${blockId}`),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateBlockPitMasterBook;
