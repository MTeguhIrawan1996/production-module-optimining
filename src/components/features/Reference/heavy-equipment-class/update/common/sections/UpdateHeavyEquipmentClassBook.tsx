import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';
import { ISelectTypesHeavyEquipment } from '@/components/elements/input/SelectHeavyEquipmentTypesInput';

import {
  IUpdateHeavyEquipmentClassRequest,
  useUpdateHeavyEquipmentClass,
} from '@/services/graphql/mutation/heavy-equipment-class/useUpdateHeavyEquipmentClass';
import { useReadOneHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadOneHeavyEquipmentClass';
import { createHeavyEquipmentClassSchema } from '@/utils/form-validation/reference-heavy-equipment-class/heavy-equipment-class';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup, ControllerProps } from '@/types/global';

const UpdateHeavyEquipmentClassBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [otherModelField, setOtherModelField] = React.useState<
    ISelectTypesHeavyEquipment[]
  >([
    {
      key: 1,
      id: '',
      name: '',
    },
  ]);

  /* #   /**=========== Methods =========== */
  const methods = useForm<Omit<IUpdateHeavyEquipmentClassRequest, 'id'>>({
    resolver: zodResolver(createHeavyEquipmentClassSchema),
    defaultValues: {
      name: '',
      heavyEquipmentReferenceIds: [],
    },
    mode: 'onBlur',
  });
  const errorsHeavyEquipmentReferenceIds =
    methods.formState.errors.heavyEquipmentReferenceIds;

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { heavyEquipmentClassDataLoading } = useReadOneHeavyEquipmentClass({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ heavyEquipmentClass }) => {
      const newOtherModel = heavyEquipmentClass.heavyEquipmentReferences.map(
        (val, i) => {
          return {
            key: i + 1,
            id: val.id,
            name: val.modelName,
          };
        }
      );
      const idsArray = heavyEquipmentClass.heavyEquipmentReferences.map(
        (item) => item.id
      );
      methods.setValue('name', heavyEquipmentClass.name);
      methods.setValue('heavyEquipmentReferenceIds', idsArray);
      setOtherModelField(newOtherModel);
    },
  });

  const [executeUpdate, { loading }] = useUpdateHeavyEquipmentClass({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipmentClass.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/reference/heavy-equipment-class');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<Omit<IUpdateHeavyEquipmentClassRequest, 'id'>>(
            error
          );
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

  /* #   /**=========== Fc =========== */
  const handleSubmitForm: SubmitHandler<IUpdateHeavyEquipmentClassRequest> = (
    data
  ) => {
    const { name, heavyEquipmentReferenceIds } = data;
    executeUpdate({
      variables: {
        id,
        name,
        heavyEquipmentReferenceIds,
      },
    });
  };

  const handleAddOtherModelField = () => {
    const lastIndex = otherModelField.length - 1;
    const newOtherModelField = {
      key: otherModelField[lastIndex].key + 1,
      id: '',
      name: '',
    };
    setOtherModelField([...otherModelField, newOtherModelField]);
  };

  const handleRemoveFieldModels = (key: number) => {
    if (otherModelField.length > 1) {
      setOtherModelField((prev) => prev.filter((val) => val.key !== key));
      const newArray = otherModelField
        .map((item) => (item.key === key ? '' : item.id))
        .filter((id) => id !== '');
      methods.setValue('heavyEquipmentReferenceIds', newArray);
    }
  };

  const handleUpdateId = (key: number, newId: string, name: string) => {
    setOtherModelField((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, id: newId, name } : item
      )
    );
    const newArray = otherModelField
      .map((item) => (item.key === key ? newId : item.id))
      .filter((id) => id !== '');
    methods.setValue('heavyEquipmentReferenceIds', newArray);
  };

  const handleClearId = (key: number) => {
    setOtherModelField((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, id: '', name: '' } : item
      )
    );
    const newArray = otherModelField
      .map((item) => (item.key === key ? '' : item.id))
      .filter((id) => id !== '');
    methods.setValue('heavyEquipmentReferenceIds', newArray);
  };
  /* #endregion  /**======== Fc =========== */

  /* #   /**=========== Field =========== */
  const fieldHeavyEquipmentClass = React.useMemo(() => {
    const selectedModels: ControllerProps[] = otherModelField.map(
      ({ id, key }) => ({
        control: 'select-heavy-equipment-reference-input',
        fields: otherModelField,
        name: 'model',
        label: 'model',
        value: id,
        withAsterisk: true,
        placeholder: t('commonTypography.chooseModel'),
        handleSetValue: (value, name) => {
          handleUpdateId(key, value, name ?? '');
          methods.trigger('heavyEquipmentReferenceIds');
        },
        handleClearValue: () => {
          handleClearId(key);
          methods.trigger('heavyEquipmentReferenceIds');
        },
        deleteFieldButton: {
          onDeletedField: () => {
            handleRemoveFieldModels(key);
          },
        },
        error:
          errorsHeavyEquipmentReferenceIds &&
          errorsHeavyEquipmentReferenceIds.message,
        nothingFound: null,
      })
    );

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.heavyEquipmentClass'),
        formControllers: [
          {
            control: 'text-input',
            name: 'name',
            label: 'heavyEquipmentClass',
            withAsterisk: true,
          },
        ],
      },
      {
        group: t('commonTypography.heavyEquipmentModel'),
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: t('heavyEquipmentClass.createHeavyEquipmentClassModel'),
            onClick: handleAddOtherModelField,
          },
        },
        formControllers: selectedModels,
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherModelField, errorsHeavyEquipmentReferenceIds]);
  /* #endregion  /**======== Field =========== */

  return (
    <DashboardCard p={0} isLoading={heavyEquipmentClassDataLoading}>
      <GlobalFormGroup
        field={fieldHeavyEquipmentClass}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/reference/heavy-equipment-class'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateHeavyEquipmentClassBook;
