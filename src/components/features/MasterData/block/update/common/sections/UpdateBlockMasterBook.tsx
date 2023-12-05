import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationBlockValues } from '@/services/graphql/mutation/block/useCreateBlockMaster';
import { useUpdateBlockMaster } from '@/services/graphql/mutation/block/useUpdateBlockMaster';
import { useReadOneBlockMaster } from '@/services/graphql/query/block/useReadOneBlockMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { blockMutationValidation } from '@/utils/form-validation/block/block-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateBlockMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const methods = useForm<IMutationBlockValues>({
    resolver: zodResolver(blockMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
    },
    mode: 'onBlur',
  });

  const { blockMasterLoading } = useReadOneBlockMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ block }) => {
      methods.setValue('name', block.name);
      methods.setValue('handBookId', block.handBookId);
    },
  });

  const [executeUpdate, { loading }] = useUpdateBlockMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('block.successUpdateMessage'),
        icon: <IconCheck />,
      });
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

  const handleSubmitForm: SubmitHandler<IMutationBlockValues> = async (
    data
  ) => {
    const { name, handBookId } = data;
    await executeUpdate({
      variables: {
        id,
        name,
        handBookId,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={blockMasterLoading}>
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

export default UpdateBlockMasterBook;
