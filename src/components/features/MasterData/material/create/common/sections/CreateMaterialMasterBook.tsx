import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationMaterialValues,
  useCreateMaterialMaster,
} from '@/services/graphql/mutation/material/useCreateMaterialMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { materialMutationValidation } from '@/utils/form-validation/material/material-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateMaterialMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationMaterialValues>({
    resolver: zodResolver(materialMutationValidation),
    defaultValues: {
      name: '',
      subMaterials: [],
    },
    mode: 'onBlur',
  });
  const { fields, remove, append } = useFieldArray({
    name: 'subMaterials',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

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
  const fieldsSubMaterial = React.useCallback(
    (_, index: number) => {
      const materialSubItem = globalText({
        colSpan: 12,
        name: `subMaterials.${index}.name`,
        label: 'materialSub',
        withAsterisk: true,
        deleteButtonField: {
          onClick: () => {
            remove(index);
          },
        },
      });

      return materialSubItem;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  );
  const fieldElementsItem = fields.map(fieldsSubMaterial);

  const fieldItem = React.useMemo(() => {
    const materialTypeItem = globalText({
      name: 'name',
      label: 'materialType',
      colSpan: 12,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.material'),
        enableGroupLabel: true,
        formControllers: [materialTypeItem],
      },
      {
        group: t('commonTypography.materialSub'),
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: t('material.createMaterialSub'),
            onClick: () =>
              append({
                name: '',
              }),
          },
        },
        formControllers: [...fieldElementsItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldElementsItem]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationMaterialValues> = async (
    data
  ) => {
    const { name, subMaterials } = data;

    await executeCreate({
      variables: {
        name,
        subMaterials:
          subMaterials && subMaterials.length > 0 ? subMaterials : null,
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
