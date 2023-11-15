import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  ICreateCompanyHumanResource,
  useCreateCompanyHumanResource,
} from '@/services/restapi/company/useCreateCompanyHumanResource';
import {
  bloodTypeSelect,
  contact,
  dob,
  educationDegree,
  email,
  fullname,
  ganderRadio,
  globalText,
  identityNumber,
  identityRadio,
  isWniRadio,
  marriageStatusSelect,
  nameAlias,
  pob,
  provinceSelect,
  regencySelect,
  relegionSelect,
  resusSelect,
  subdistrictSelect,
  villageSelect,
} from '@/utils/constants/Field/global-field';
import { createHumanResourcesSchema } from '@/utils/form-validation/human-resources/human-resources-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateCompanyHumanResourcesBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const methods = useForm<Omit<ICreateCompanyHumanResource, 'id'>>({
    resolver: zodResolver(createHumanResourcesSchema),
    defaultValues: {
      name: '',
      alias: '',
      isWni: '',
      identityTypeId: '',
      identityNumber: '',
      pob: '',
      dob: undefined,
      gender: '',
      religionId: '',
      educationDegree: '',
      marriageStatusId: '',
      provinceId: '',
      regencyId: '',
      subdistrictId: '',
      villageId: '',
      address: '',
      isAddressSameWithDomicile: 'false',
      domicileProvinceId: '',
      domicileRegencyId: '',
      domicileSubdistrictId: '',
      domicileVillageId: '',
      domicileAddress: '',
      phoneNumber: '',
      email: '',
      bloodType: '',
      resus: '',
      photo: [],
      identityPhoto: [],
    },
    mode: 'onBlur',
  });
  const isAddressSameWithDomicile = methods.watch('isAddressSameWithDomicile');
  const provinceId = methods.watch('provinceId');
  const regencyId = methods.watch('regencyId');
  const subdistrictId = methods.watch('subdistrictId');
  const domicileProvinceId = methods.watch('domicileProvinceId');
  const domicileRegencyId = methods.watch('domicileRegencyId');
  const domicileSubdistrictId = methods.watch('domicileSubdistrictId');

  /* #   /**=========== Query =========== */
  const { mutate, isLoading } = useCreateCompanyHumanResource({
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
    onSuccess: ({ data }) => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('humanResources.successCreateMessage'),
        icon: <IconCheck />,
      });
      const companyId = router.query?.id?.[0];
      const url = `/master-data/company/create/human-resources/${companyId}/${data.id}/?tabs=employe-data`;
      router.push(url, undefined, { shallow: true });
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldHumanResources = React.useMemo(() => {
    const marriageStatusItem = marriageStatusSelect({});
    const relegionItem = relegionSelect({});
    const address = globalText({
      name: 'address',
      label: 'address',
      withAsterisk: true,
      colSpan: 12,
    });
    const domicileAddress = globalText({
      name: 'domicileAddress',
      label: 'address',
      withAsterisk: true,
      colSpan: 12,
    });
    const provinceItem = provinceSelect({
      onChange: (value) => {
        methods.setValue('provinceId', value ?? '');
        methods.setValue('regencyId', '');
        methods.setValue('subdistrictId', '');
        methods.setValue('villageId', '');
        methods.trigger('provinceId');
      },
    });
    const regencyItem = regencySelect({
      provinceId,
      onChange: (value) => {
        methods.setValue('regencyId', value ?? '');
        methods.setValue('subdistrictId', '');
        methods.setValue('villageId', '');
        methods.trigger('regencyId');
      },
    });
    const subdistrictItem = subdistrictSelect({
      provinceId,
      regencyId,
      onChange: (value) => {
        methods.setValue('subdistrictId', value ?? '');
        methods.setValue('villageId', '');
        methods.trigger('subdistrictId');
      },
    });
    const villageItem = villageSelect({
      provinceId,
      regencyId,
      subdistrictId,
    });
    const identityItem = identityRadio({});

    const domicileProvinceItem = provinceSelect({
      name: 'domicileProvinceId',
      onChange: (value) => {
        methods.setValue('domicileProvinceId', value ?? '');
        methods.setValue('domicileRegencyId', '');
        methods.setValue('domicileSubdistrictId', '');
        methods.setValue('domicileVillageId', '');
        methods.trigger('domicileProvinceId');
      },
    });
    const domicileRegencyItem = regencySelect({
      name: 'domicileRegencyId',
      provinceId: domicileProvinceId,
      onChange: (value) => {
        methods.setValue('domicileRegencyId', value ?? '');
        methods.setValue('domicileSubdistrictId', '');
        methods.setValue('domicileVillageId', '');
        methods.trigger('domicileRegencyId');
      },
    });
    const domicileSubdistrictItem = subdistrictSelect({
      name: 'domicileSubdistrictId',
      provinceId: domicileProvinceId,
      regencyId: domicileRegencyId,
      onChange: (value) => {
        methods.setValue('domicileSubdistrictId', value ?? '');
        methods.setValue('domicileVillageId', '');
        methods.trigger('domicileSubdistrictId');
      },
    });
    const domicileVillageItem = villageSelect({
      name: 'domicileVillageId',
      provinceId: domicileProvinceId,
      regencyId: domicileRegencyId,
      subdistrictId: domicileSubdistrictId,
    });

    const photo: ControllerProps = {
      control: 'image-dropzone',
      name: 'photo',
      label: 'photo',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      onDrop: (value) => {
        methods.setValue('photo', value);
        methods.clearErrors('photo');
      },
      onReject: (files) => {
        handleRejectFile<Omit<ICreateCompanyHumanResource, 'id'>>({
          methods,
          files,
          field: 'photo',
        });
      },
    };
    const identityPhoto: ControllerProps = {
      control: 'image-dropzone',
      name: 'identityPhoto',
      label: 'identityPhoto',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      onDrop: (value) => {
        methods.setValue('identityPhoto', value);
        methods.clearErrors('identityPhoto');
      },
      onReject: (files) => {
        handleRejectFile<Omit<ICreateCompanyHumanResource, 'id'>>({
          methods,
          files,
          field: 'identityPhoto',
        });
      },
    };
    const domicileGroup: ControllerGroup = {
      group: t('commonTypography.domicile'),
      enableGroupLabel: true,
      formControllers: [
        domicileProvinceItem,
        domicileRegencyItem,
        domicileSubdistrictItem,
        domicileVillageItem,
        domicileAddress,
      ],
    };

    const field: ControllerGroup[] = [
      {
        group: t('humanResources.humanResourcesIdentity'),
        enableGroupLabel: true,
        formControllers: [
          { ...fullname, colSpan: 6 },
          { ...nameAlias, colSpan: 6, withAsterisk: false },
          isWniRadio,
          identityItem,
          { ...identityNumber, colSpan: 6 },
          { ...pob, colSpan: 6 },
          { ...dob, colSpan: 6 },
          ganderRadio,
          relegionItem,
          educationDegree,
          marriageStatusItem,
        ],
      },
      {
        group: t('commonTypography.address'),
        enableGroupLabel: true,
        groupCheckbox: {
          onChange: () => {
            isAddressSameWithDomicile === 'true'
              ? methods.setValue('isAddressSameWithDomicile', 'false')
              : methods.setValue('isAddressSameWithDomicile', 'true');
          },
          label: t('commonTypography.checkboxAddressDomicile'),
        },
        formControllers: [
          provinceItem,
          regencyItem,
          subdistrictItem,
          villageItem,
          address,
        ],
      },
      domicileGroup,
      {
        group: t('commonTypography.contact'),
        enableGroupLabel: true,
        formControllers: [contact, { ...email, colSpan: 6 }],
      },
      {
        group: t('commonTypography.bloodType'),
        enableGroupLabel: true,
        formControllers: [bloodTypeSelect, resusSelect],
      },
      {
        group: t('commonTypography.document'),
        enableGroupLabel: true,
        formControllers: [photo, identityPhoto],
      },
    ];

    isAddressSameWithDomicile === 'true' ? field.splice(2, 1) : field;

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAddressSameWithDomicile,
    provinceId,
    regencyId,
    subdistrictId,
    domicileProvinceId,
    domicileRegencyId,
    domicileSubdistrictId,
  ]);
  /* #endregion  /**======== Field =========== */

  const handleSubmitForm: SubmitHandler<
    Omit<ICreateCompanyHumanResource, 'id'>
  > = (data) => {
    const outputArray = Object.keys(data).map((key) => ({
      name: key,
      value: data[key],
    }));
    mutate({
      companyId: router.query?.id?.[0] as string,
      data: outputArray,
    });
  };
  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldHumanResources}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default CreateCompanyHumanResourcesBook;
