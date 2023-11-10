import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneEmployee } from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import {
  IUpdateCompanyHumanResourceValues,
  useUpdateCompanyHumanResource,
} from '@/services/restapi/company/useUpdateCompanyHumanResources';
import {
  address,
  domicileAddress,
} from '@/utils/constants/Field/company-field';
import {
  bloodTypeSelect,
  contact,
  dob,
  educationDegree,
  email,
  fullname,
  ganderRadio,
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
import { stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateCompanyHumanResourcesBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const employeId = router.query?.id?.[1] as string;
  const companyId = router.query?.id?.[0] as string;
  const [serverPhotos, setServerPhotos] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = React.useState<string[]>([]);
  const [serverPhotosIdentity, setServerPhotosIdentity] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
  >([]);
  const [deletedPhotoIdentityIds, setDeletedPhotoIdentityIds] = React.useState<
    string[]
  >([]);
  const methods = useForm<Omit<IUpdateCompanyHumanResourceValues, 'id'>>({
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
  const { employeeData, employeeDataLoading } = useReadOneEmployee({
    variables: {
      id: employeId ?? '',
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      const date = stringToDate(data.employee.humanResource.dob ?? undefined);
      methods.setValue('name', data.employee.humanResource.name);
      methods.setValue('alias', data.employee.humanResource.alias ?? '');
      methods.setValue('isWni', `${data.employee.humanResource.isWni}`);
      methods.setValue(
        'identityTypeId',
        data.employee.humanResource.identityType?.id ?? ''
      );
      methods.setValue(
        'identityNumber',
        data.employee.humanResource.identityNumber
      );
      methods.setValue('pob', data.employee.humanResource.pob ?? '');
      methods.setValue('dob', date);
      methods.setValue('gender', data.employee.humanResource.gender);
      methods.setValue(
        'religionId',
        data.employee.humanResource.religion?.id ?? ''
      );
      methods.setValue(
        'educationDegree',
        data.employee.humanResource.educationDegree ?? ''
      );
      methods.setValue(
        'marriageStatusId',
        data.employee.humanResource.marriageStatus?.id ?? ''
      );
      methods.setValue(
        'provinceId',
        data.employee.humanResource.province?.id ?? ''
      );
      methods.setValue(
        'regencyId',
        data.employee.humanResource.regency?.id ?? ''
      );
      methods.setValue(
        'subdistrictId',
        data.employee.humanResource.district?.id ?? ''
      );
      methods.setValue(
        'villageId',
        data.employee.humanResource.village?.id ?? ''
      );
      methods.setValue('address', data.employee.humanResource.address);
      methods.setValue(
        'isAddressSameWithDomicile',
        `${data.employee.humanResource.isAddressSameWithDomicile}`
      );
      methods.setValue(
        'domicileProvinceId',
        data.employee.humanResource.domicileProvince?.id ?? ''
      );
      methods.setValue(
        'domicileRegencyId',
        data.employee.humanResource.domicileRegency?.id ?? ''
      );
      methods.setValue(
        'domicileSubdistrictId',
        data.employee.humanResource.domicileDistrict?.id ?? ''
      );
      methods.setValue(
        'domicileVillageId',
        data.employee.humanResource.domicileVillage?.id ?? ''
      );
      methods.setValue(
        'domicileAddress',
        data.employee.humanResource.domicileAddress ?? ''
      );
      methods.setValue('phoneNumber', data.employee.humanResource.phoneNumber);
      methods.setValue('email', data.employee.humanResource.email);
      methods.setValue(
        'bloodType',
        data.employee.humanResource.bloodType ?? ''
      );
      methods.setValue('resus', data.employee.humanResource.resus ?? '');
      if (data.employee.humanResource.photo) {
        setServerPhotos([data.employee.humanResource.photo]);
      }
      if (data.employee.humanResource.identityPhoto) {
        setServerPhotosIdentity([data.employee.humanResource.identityPhoto]);
      }
    },
  });
  const { mutate, isLoading } = useUpdateCompanyHumanResource({
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
        message: t('humanResources.successUpdateMessage'),
        icon: <IconCheck />,
      });
      const url = `/master-data/company/update/human-resources/${companyId}/${employeId}/?tabs=employe-data`;
      router.push(url, undefined, { shallow: true });
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldHumanResources = React.useMemo(() => {
    const marriageStatusItem = marriageStatusSelect({});
    const relegionItem = relegionSelect({});
    const provinceItem = provinceSelect({
      defaultValue: employeeData?.humanResource?.province?.id,
      labelValue: employeeData?.humanResource?.province?.name,
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
      defaultValue: employeeData?.humanResource?.regency?.id,
      labelValue: employeeData?.humanResource?.regency?.name,
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
      defaultValue: employeeData?.humanResource?.district?.id,
      labelValue: employeeData?.humanResource?.district?.name,
      onChange: (value) => {
        methods.setValue('subdistrictId', value ?? '');
        methods.setValue('villageId', '');
        methods.trigger('subdistrictId');
      },
    });
    const villageItem = villageSelect({
      defaultValue: employeeData?.humanResource?.village?.id,
      labelValue: employeeData?.humanResource?.village?.name,
      provinceId,
      regencyId,
      subdistrictId,
    });
    const identityItem = identityRadio({});

    const domicileProvinceItem = provinceSelect({
      defaultValue: employeeData?.humanResource?.domicileProvince?.id,
      labelValue: employeeData?.humanResource?.domicileProvince?.name,
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
      defaultValue: employeeData?.humanResource?.domicileRegency?.id,
      labelValue: employeeData?.humanResource?.domicileRegency?.name,
      onChange: (value) => {
        methods.setValue('domicileRegencyId', value ?? '');
        methods.setValue('domicileSubdistrictId', '');
        methods.setValue('domicileVillageId', '');
        methods.trigger('domicileRegencyId');
      },
    });
    const domicileSubdistrictItem = subdistrictSelect({
      name: 'domicileSubdistrictId',
      defaultValue: employeeData?.humanResource?.domicileDistrict?.id,
      labelValue: employeeData?.humanResource?.domicileDistrict?.name,
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
      defaultValue: employeeData?.humanResource?.domicileVillage?.id,
      labelValue: employeeData?.humanResource?.domicileVillage?.name,
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
      serverPhotos: serverPhotos,
      onDrop: (value) => {
        methods.setValue('photo', value);
        setServerPhotos([]);
        methods.clearErrors('photo');
      },
      deletedPhotoIds: deletedPhotoIds,
      handleDeleteServerPhotos: (id) => {
        setServerPhotos([]);
        setDeletedPhotoIds((prev) => [...prev, id]);
      },
      onReject: (files) => {
        handleRejectFile<Omit<IUpdateCompanyHumanResourceValues, 'id'>>({
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
      serverPhotos: serverPhotosIdentity,
      deletedPhotoIds: deletedPhotoIdentityIds,
      handleDeleteServerPhotos: (id) => {
        setServerPhotosIdentity([]);
        setDeletedPhotoIdentityIds((prev) => [...prev, id]);
      },
      onDrop: (value) => {
        setServerPhotosIdentity([]);
        methods.setValue('identityPhoto', value);
        methods.clearErrors('identityPhoto');
      },
      onReject: (files) => {
        handleRejectFile<Omit<IUpdateCompanyHumanResourceValues, 'id'>>({
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
          defaultChecked: isAddressSameWithDomicile === 'true' ? true : false,
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
    employeeData,
    serverPhotos,
    deletedPhotoIds,
    serverPhotosIdentity,
    deletedPhotoIdentityIds,
  ]);
  /* #endregion  /**======== Field =========== */

  const handleSubmitForm: SubmitHandler<
    Omit<IUpdateCompanyHumanResourceValues, 'id'>
  > = (data) => {
    const outputArray = Object.keys(data).map((key) => ({
      name: key,
      value: data[key],
    }));
    const deletedPhoto = serverPhotos && serverPhotos?.length === 0;
    const deletedIdentityPhoto =
      serverPhotosIdentity && serverPhotosIdentity.length === 0;
    mutate({
      companyId: companyId,
      employeId: employeId,
      deletedIdentityPhoto,
      deletedPhoto,
      data: outputArray,
    });
  };
  return (
    <DashboardCard p={0} isLoading={employeeDataLoading}>
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

export default UpdateCompanyHumanResourcesBook;
