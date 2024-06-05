import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';
import { IHeavyEquipmentClassValues } from '@/components/features/Reference/heavy-equipment-class/create/common/sections/CreateHeavyEquipmentClassBook';

import { useUpdateHeavyEquipmentClass } from '@/services/graphql/mutation/heavy-equipment-class/useUpdateHeavyEquipmentClass';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadOneHeavyEquipmentClass';
import {
  globalSelectReferenceRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { classHeavyEquipmentMutationValidation } from '@/utils/form-validation/reference-heavy-equipment-class/heavy-equipment-class';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateHeavyEquipmentClassBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  /* #   /**=========== Methods =========== */
  const methods = useForm<IHeavyEquipmentClassValues>({
    resolver: zodResolver(classHeavyEquipmentMutationValidation),
    defaultValues: {
      name: '',
      heavyEquipmentReference: [
        {
          id: null,
        },
      ],
    },
    mode: 'onBlur',
  });
  const { fields, remove, append } = useFieldArray({
    name: 'heavyEquipmentReference',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { heavyEquipmentClassDataLoading } = useReadOneHeavyEquipmentClass({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ heavyEquipmentClass }) => {
      const idsArray = heavyEquipmentClass.heavyEquipmentReferences.map(
        (item) => ({ id: item.id })
      );
      methods.setValue('name', heavyEquipmentClass.name);
      if (idsArray.length > 0) {
        methods.setValue('heavyEquipmentReference', idsArray);
      }
    },
  });

  const [executeUpdate, { loading }] = useUpdateHeavyEquipmentClass({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Kelas Alat Berat',
          account: userAuthData?.email ?? '',
        },
      });
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
          errorBadRequestField<IHeavyEquipmentClassValues>(error);
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
  const handleSubmitForm: SubmitHandler<IHeavyEquipmentClassValues> = (
    data
  ) => {
    const { name, heavyEquipmentReference } = data;
    const filterHeavyEquipment = heavyEquipmentReference.filter((v) => v.id);
    const normalizationData = filterHeavyEquipment.map((val) => val.id);
    executeUpdate({
      variables: {
        id,
        name,
        heavyEquipmentReferenceIds: normalizationData as string[],
      },
    });
  };
  /* #endregion  /**======== Fc =========== */

  /* #   /**=========== Field =========== */
  const fieldHeavyEquipmentClass = React.useMemo(() => {
    const className = globalText({
      name: 'name',
      label: 'heavyEquipmentClass',
      colSpan: 12,
    });
    const selectModelItem = fields.map((val, index) => {
      const modelHeavyEquipmentItem = globalSelectReferenceRhf({
        colSpan: 12,
        name: `heavyEquipmentReference.${index}.id`,
        label: `model`,
        key: val.id,
        withAsterisk: true,
        deleteButtonField: {
          onClick: () => {
            fields.length > 1 ? remove(index) : null;
          },
        },
      });

      return modelHeavyEquipmentItem;
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.heavyEquipmentClass'),
        formControllers: [className],
      },
      {
        group: t('commonTypography.heavyEquipmentModel'),
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: t('heavyEquipmentClass.createHeavyEquipmentClassModel'),
            onClick: () =>
              append({
                id: null,
              }),
          },
        },
        formControllers: selectModelItem,
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);
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
