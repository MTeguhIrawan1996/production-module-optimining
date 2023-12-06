import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationUpdateMaterialValues,
  useUpdateMaterialMaster,
} from '@/services/graphql/mutation/material/useUpdateMaterialMaster';
import { useReadOneMaterialMaster } from '@/services/graphql/query/material/useReadOneMaterialMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { materialMutationUpdateValidation } from '@/utils/form-validation/material/material-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateMaterialMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const methods = useForm<IMutationUpdateMaterialValues>({
    resolver: zodResolver(materialMutationUpdateValidation),
    defaultValues: {
      name: '',
      subMaterials: [
        {
          subMaterialId: null,
          name: '',
        },
      ],
    },
    mode: 'onBlur',
  });

  const { fields, remove, append, replace } = useFieldArray({
    name: 'subMaterials',
    control: methods.control,
  });

  const { materialMasterLoading } = useReadOneMaterialMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ material }) => {
      const subMaterials = material.subMaterials.map((val) => {
        return {
          subMaterialId: val.id,
          name: val.name,
        };
      });
      replace(
        subMaterials.length > 0
          ? subMaterials
          : { subMaterialId: null, name: '' }
      );
      methods.setValue('name', material.name);
    },
  });

  const [executeUpdate, { loading }] = useUpdateMaterialMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('material.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/material');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationUpdateMaterialValues>(error);
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

  const fieldsSubMaterial = React.useCallback(
    (_, index: number) => {
      const materialSubItem = globalText({
        colSpan: 12,
        name: `subMaterials.${index}.name`,
        label: `subMaterialType`,
        withAsterisk: true,
        value: methods.watch(`subMaterials.${index}.name`),
        onChange: (event) => {
          methods.setValue(
            `subMaterials.${index}.name`,
            event.currentTarget.value
          );
        },
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
  const fieldSubMaterialsItem = fields.map(fieldsSubMaterial);

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
        group: t('commonTypography.subMaterialType'),
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: t('material.createMaterialSub'),
            onClick: () =>
              append({
                subMaterialId: null,
                name: '',
              }),
          },
        },
        formControllers: fieldSubMaterialsItem,
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldSubMaterialsItem]);

  const handleSubmitForm: SubmitHandler<IMutationUpdateMaterialValues> = async (
    data
  ) => {
    const { name, subMaterials } = data;
    await executeUpdate({
      variables: {
        id,
        name,
        subMaterials:
          subMaterials && subMaterials?.length > 0 ? subMaterials : null,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={materialMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/material'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateMaterialMasterBook;
