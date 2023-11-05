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
  const [otherTypesField, setOtherTypesField] = React.useState<
    ISelectTypesHeavyEquipment[]
  >([
    {
      key: 1,
      id: '',
    },
  ]);

  /* #   /**=========== Methods =========== */
  const methods = useForm<Omit<IUpdateHeavyEquipmentClassRequest, 'id'>>({
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
  const { heavyEquipmentClassDataLoading } = useReadOneHeavyEquipmentClass({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ heavyEquipmentClass }) => {
      const newOtherTypes = heavyEquipmentClass.heavyEquipmentTypes.map(
        (val, i) => {
          return {
            key: i + 1,
            id: val.id,
          };
        }
      );
      const idsArray = heavyEquipmentClass.heavyEquipmentTypes.map(
        (item) => item.id
      );
      methods.setValue('name', heavyEquipmentClass.name);
      methods.setValue('heavyEquipmentTypeIds', idsArray);
      setOtherTypesField(newOtherTypes);
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
      methods.reset();
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
    const { name, heavyEquipmentTypeIds } = data;
    executeUpdate({
      variables: {
        id,
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

  const handleUpdateId = (key: number, newId: string) => {
    setOtherTypesField((prevData) =>
      prevData.map((item) => (item.key === key ? { ...item, id: newId } : item))
    );
    const newArray = otherTypesField
      .map((item) => (item.key === key ? newId : item.id))
      .filter((id) => id !== '');
    methods.setValue('heavyEquipmentTypeIds', newArray);
  };

  const handleClearId = (key: number) => {
    setOtherTypesField((prevData) =>
      prevData.map((item) => (item.key === key ? { ...item, id: '' } : item))
    );
    const newArray = otherTypesField
      .map((item) => (item.key === key ? '' : item.id))
      .filter((id) => id !== '');
    methods.setValue('heavyEquipmentTypeIds', newArray);
  };
  /* #endregion  /**======== Fc =========== */

  /* #   /**=========== Field =========== */
  const fieldHeavyEquipmentClass = React.useMemo(() => {
    const selectedTypes: ControllerProps[] = otherTypesField.map(
      ({ id, key }) => ({
        control: 'select-heavy-equipment-types-input',
        fields: otherTypesField,
        name: 'type',
        label: 'type',
        value: id,
        withAsterisk: true,
        placeholder: t('heavyEquipment.chooseType'),
        handleSetValue: (value) => {
          handleUpdateId(key, value);
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
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateHeavyEquipmentClassBook;
