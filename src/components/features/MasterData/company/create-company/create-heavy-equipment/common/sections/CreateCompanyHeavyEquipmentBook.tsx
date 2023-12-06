import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneHeavyEquipmentReference } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipment';
import {
  ICreateHeavyEquipmentCompanyValues,
  useCreateHeavyEquipmentCompany,
} from '@/services/restapi/heavy-equipment/useCreateHeavyEquipmentCompany';
import {
  brandSelect,
  classSelect,
  eligibilityStatusSelect,
  globalDate,
  globalText,
  modelSelect,
  typeSelect,
} from '@/utils/constants/Field/global-field';
import { createHeavyEquipmentCompanySchema } from '@/utils/form-validation/master-heavy-equipment/heavy-equipment-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateCompanyHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const url = `/master-data/company/read/${id}`;

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateHeavyEquipmentCompanyValues>({
    resolver: zodResolver(createHeavyEquipmentCompanySchema),
    defaultValues: {
      hullNumber: '',
      engineNumber: '',
      chassisNumber: '',
      brandId: '',
      referenceId: '',
      typeId: '',
      specification: '',
      vehicleNumber: '',
      classId: '',
      eligibilityStatusId: '',
      createdYear: '',
      startDate: undefined,
      endDate: undefined,
      isStill: false,
      vehicleNumberPhoto: [],
      photos: [],
    },
    mode: 'onBlur',
  });
  const brandId = methods.watch('brandId');
  const typeId = methods.watch('typeId');
  const isStill = methods.watch('isStill');
  const photos = methods.watch('photos');
  const referenceId = methods.watch('referenceId');

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const { mutate, isLoading } = useCreateHeavyEquipmentCompany({
    onError: (err) => {
      if (err.response) {
        const errorArry = errorRestBadRequestField(err);
        if (errorArry?.length) {
          errorArry?.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: err.response.data.message,
          icon: <IconX />,
        });
      }
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipment.successCreateCompanyMessage'),
        icon: <IconCheck />,
      });
      router.push(url);
      methods.reset();
    },
  });

  useReadOneHeavyEquipmentReference({
    variables: {
      id: referenceId,
    },
    skip: referenceId === '',
    onCompleted: (data) => {
      methods.setValue(
        'specification',
        data.heavyEquipmentReference.spec ?? ''
      );
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldCreateHeavyEquipment = React.useMemo(() => {
    const hullNumber = globalText({
      name: `hullNumber`,
      label: 'heavyEquipmentCode',
      colSpan: 6,
    });
    const engineNumber = globalText({
      name: `engineNumber`,
      label: 'engineNumber',
      colSpan: 6,
    });
    const frameNumber = globalText({
      name: 'chassisNumber',
      label: 'frameNumber',
      colSpan: 6,
    });
    const specification = globalText({
      name: 'specification',
      label: 'specHeavyEquipment',
      colSpan: 6,
      withAsterisk: false,
      disabled: true,
    });
    const vehicleNumber = globalText({
      name: 'vehicleNumber',
      label: 'vehicleNumberOrRegirstrationNumber',
      colSpan: 6,
      withAsterisk: true,
    });
    const createdYear = globalText({
      name: 'createdYear',
      label: 'productionYear',
      colSpan: 6,
    });
    const brandItem = brandSelect({
      label: 'brandHeavyEquipment',
      onChange: (value) => {
        methods.setValue('brandId', value ?? '');
        methods.setValue('typeId', '');
        methods.setValue('referenceId', '');
        methods.setValue('specification', '');
        methods.trigger('brandId');
      },
    });
    const typeItem = typeSelect({
      label: 'typeHeavyEquipment',
      brandId,
      onChange: (value) => {
        methods.setValue('typeId', value ?? '');
        methods.setValue('referenceId', '');
        methods.setValue('specification', '');
        methods.trigger('typeId');
      },
    });
    const modelItem = modelSelect({
      label: 'modelHeavyEquipment',
      name: 'referenceId',
      brandId,
      typeId,
      onChange: (value) => {
        methods.setValue('referenceId', value ?? '');
        methods.setValue('specification', '');
        methods.trigger('referenceId');
      },
    });
    const classItem = classSelect({
      label: 'class',
    });
    const eligibilityStatusItem = eligibilityStatusSelect({});

    const startDateItem = globalDate({
      name: 'startDate',
      label: 'startDate',
      colSpan: 6,
    });
    const endDateItem = globalDate({
      name: 'endDate',
      label: 'endDate',
      withAsterisk: false,
      colSpan: 6,
      disabled: isStill,
    });

    const vehicleNumberPhoto: ControllerProps = {
      control: 'image-dropzone',
      name: 'vehicleNumberPhoto',
      label: 'vehicleDocument',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      onDrop: (value) => {
        methods.setValue('vehicleNumberPhoto', value);
        methods.clearErrors('vehicleNumberPhoto');
      },
      onReject: (files) =>
        handleRejectFile<ICreateHeavyEquipmentCompanyValues>({
          methods,
          files,
          field: 'vehicleNumberPhoto',
        }),
    };
    const imageInput: ControllerProps = {
      control: 'image-dropzone',
      name: 'photos',
      label: 'photo',
      description: 'photoDescription5',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: true,
      maxFiles: 5,
      enableDeletePhoto: true,
      onDrop: (value) => {
        if (photos) {
          if (value.length + photos.length > 5) {
            methods.setError('photos', {
              type: 'manual',
              message: 'Jumlah foto melebihi batas maksimal',
            });
            return;
          }
          methods.setValue('photos', [...photos, ...value]);
          methods.clearErrors('photos');
          return;
        }
        methods.setValue('photos', value);
        methods.clearErrors('photos');
      },
      onReject: (files) =>
        handleRejectFile<ICreateHeavyEquipmentCompanyValues>({
          methods,
          files,
          field: 'photos',
        }),
    };
    const field: ControllerGroup[] = [
      {
        group: t('heavyEquipment.informationHeavyEquipmentMaster'),
        enableGroupLabel: true,
        groupCheckbox: {
          onChange: () => {
            isStill === true
              ? methods.setValue('isStill', false)
              : methods.setValue('isStill', true);
            methods.setValue('endDate', null);
          },
          label: t('commonTypography.stillInUse'),
        },
        formControllers: [
          hullNumber,
          engineNumber,
          frameNumber,
          brandItem,
          typeItem,
          modelItem,
          specification,
          vehicleNumber,
          classItem,
          eligibilityStatusItem,
          createdYear,
          startDateItem,
          endDateItem,
        ],
      },
      {
        group: t('commonTypography.document'),
        enableGroupLabel: true,
        formControllers: [vehicleNumberPhoto, imageInput],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId, typeId, isStill, photos]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateHeavyEquipmentCompanyValues> = (
    data
  ) => {
    const values = objectToArrayValue(data);
    mutate({
      companyId: id,
      data: values,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldCreateHeavyEquipment}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () => router.push(url),
        }}
      />
    </DashboardCard>
  );
};

export default CreateCompanyHeavyEquipmentBook;
