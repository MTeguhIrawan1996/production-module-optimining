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
  ICreateHeavyEquipmentClassRequest,
  useCreateHeavyEquipmentClass,
} from '@/services/graphql/mutation/heavy-equipment-class/useCreateHeavyEquipmentClass';
import { createHeavyEquipmentClassSchema } from '@/utils/form-validation/reference-heavy-equipment-class/heavy-equipment-class';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateHeavyEquipmentClassBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [otherTypesField, setOtherTypesField] = React.useState<
    ISelectTypesHeavyEquipment[]
  >([
    {
      key: 1,
      id: '',
      name: '',
    },
  ]);

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateHeavyEquipmentClassRequest>({
    resolver: zodResolver(createHeavyEquipmentClassSchema),
    defaultValues: {
      name: '',
      heavyEquipmentTypeIds: [],
    },
    mode: 'onBlur',
  });
  const errorsHeavyEquipmentTypeIds =
    methods.formState.errors.heavyEquipmentTypeIds;

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateHeavyEquipmentClass({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipmentClass.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/reference/heavy-equipment-class');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<ICreateHeavyEquipmentClassRequest>(error);
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
  const handleSubmitForm: SubmitHandler<ICreateHeavyEquipmentClassRequest> = (
    data
  ) => {
    const { name, heavyEquipmentTypeIds } = data;
    executeCreate({
      variables: {
        name,
        heavyEquipmentTypeIds,
      },
    });
  };

  const handleAddOtherTypesField = () => {
    const lastIndex = otherTypesField.length - 1;
    const newOtherTypesField = {
      key: otherTypesField[lastIndex].key + 1,
      id: '',
      name: '',
    };
    setOtherTypesField([...otherTypesField, newOtherTypesField]);
  };

  const handleRemoveFieldTypes = (key: number) => {
    if (otherTypesField.length > 1) {
      setOtherTypesField((prev) => prev.filter((val) => val.key !== key));
      const newArray = otherTypesField
        .map((item) => (item.key === key ? '' : item.id))
        .filter((id) => id !== '');
      methods.setValue('heavyEquipmentTypeIds', newArray);
    }
  };

  const handleUpdateId = (key: number, newId: string, name: string) => {
    setOtherTypesField((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, id: newId, name } : item
      )
    );
    const newArray = otherTypesField
      .map((item) => (item.key === key ? newId : item.id))
      .filter((id) => id !== '');
    methods.setValue('heavyEquipmentTypeIds', newArray);
  };

  const handleClearId = (key: number) => {
    setOtherTypesField((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, id: '', name: '' } : item
      )
    );
    const newArray = otherTypesField
      .map((item) => (item.key === key ? '' : item.id))
      .filter((id) => id !== '');
    methods.setValue('heavyEquipmentTypeIds', newArray);
  };
  /* #endregion  /**======== Fc =========== */

  /* #   /**=========== Field =========== */
  const fieldCreateHeavyEquipmentClass = React.useMemo(() => {
    const selectedTypes: ControllerProps[] = otherTypesField.map(
      ({ id, key }) => ({
        control: 'select-heavy-equipment-types-input',
        fields: otherTypesField,
        name: 'type',
        label: 'type',
        value: id,
        withAsterisk: true,
        placeholder: t('heavyEquipment.chooseType'),
        handleSetValue: (value, name) => {
          handleUpdateId(key, value, name ?? '');
          methods.trigger('heavyEquipmentTypeIds');
        },
        handleClearValue: () => {
          handleClearId(key);
          methods.trigger('heavyEquipmentTypeIds');
        },
        deleteFieldButton: {
          onDeletedField: () => {
            handleRemoveFieldTypes(key);
          },
        },
        error:
          errorsHeavyEquipmentTypeIds && errorsHeavyEquipmentTypeIds.message,
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
        group: t('commonTypography.heavyEquipmentType'),
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: t('heavyEquipmentClass.createHeavyEquipmentClassType'),
            onClick: handleAddOtherTypesField,
          },
        },
        formControllers: selectedTypes,
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherTypesField, errorsHeavyEquipmentTypeIds]);
  /* #endregion  /**======== Field =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldCreateHeavyEquipmentClass}
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

export default CreateHeavyEquipmentClassBook;
