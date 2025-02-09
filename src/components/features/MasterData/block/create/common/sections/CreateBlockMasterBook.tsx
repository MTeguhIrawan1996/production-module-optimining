import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationBlockValues,
  useCreateBlockMaster,
} from '@/services/graphql/mutation/block/useCreateBlockMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { globalText } from '@/utils/constants/Field/global-field';
import { blockMutationValidation } from '@/utils/form-validation/block/block-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import useControlPanel from '@/utils/store/useControlPanel';

import { ControllerGroup } from '@/types/global';

const CreateBlockMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const [resetBlockState] = useControlPanel(
    (state) => [state.resetBlockState],
    shallow
  );

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationBlockValues>({
    resolver: zodResolver(blockMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
    },
    mode: 'onBlur',
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateBlockMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Tambah',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Block',
          account: userAuthData?.email ?? '',
        },
      });

      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('block.successCreateMessage'),
        icon: <IconCheck />,
      });
      resetBlockState();
      methods.reset();
      router.push('/master-data/block');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationBlockValues>(error);
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
    const blockId = globalText({
      name: 'handBookId',
      label: 'blockId',
      colSpan: 6,
    });
    const blockName = globalText({
      name: 'name',
      label: 'blockName',
      colSpan: 6,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.block'),
        enableGroupLabel: true,
        formControllers: [blockId, blockName],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationBlockValues> = async (
    data
  ) => {
    const { name, handBookId } = data;
    await executeCreate({
      variables: {
        name,
        handBookId,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/block'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateBlockMasterBook;
