import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationMaterialValues,
  useCreateMaterialMaster,
} from '@/services/graphql/mutation/material/useCreateMaterialMaster';
import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { globalSelect, globalText } from '@/utils/constants/Field/global-field';
import { materialMutationValidation } from '@/utils/form-validation/material/material-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { ControllerGroup } from '@/types/global';

const CreateMaterialMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationMaterialValues>({
    resolver: zodResolver(materialMutationValidation),
    defaultValues: {
      name: '',
      parentId: null,
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { materialsData } = useReadAllMaterialsMaster({
    variables: {
      limit: 10,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
  });

  const [executeCreate, { loading }] = useCreateMaterialMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('material.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/master-data/material');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationMaterialValues>(error);
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
  const { uncombinedItem } = useFilterItems({
    data: materialsData ?? [],
  });
  const fieldItem = React.useMemo(() => {
    const materialTypeItem = globalText({
      name: 'name',
      label: 'materialType',
      colSpan: 6,
    });
    const materialSubItem = globalSelect({
      colSpan: 6,
      name: 'parentId',
      label: 'materialSub',
      data: uncombinedItem,
      placeholder: 'chooseMaterialSub',
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.material'),
        enableGroupLabel: true,
        formControllers: [materialTypeItem, materialSubItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uncombinedItem]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationMaterialValues> = async (
    data
  ) => {
    const { name, parentId } = data;

    await executeCreate({
      variables: {
        name,
        parentId,
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
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default CreateMaterialMasterBook;
