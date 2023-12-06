import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneHumanResource } from '@/services/graphql/query/master-data-human-resources/useReadOneHumanResource';
import { ICreateHumanResourceValues } from '@/services/restapi/human-resource/useCreateHumanResource';
import {
  IUpdateHumanResourceValues,
  useUpdateHumanResource,
} from '@/services/restapi/human-resource/useUpdateHumanResource';
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
import { stringToDate } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup, ControllerProps, IFile } from '@/types/global';

const UpdateHumanResourcesBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const id = router.query.id as string;
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
  const methods = useForm<Omit<IUpdateHumanResourceValues, 'id'>>({
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
  const { humanResourceData, humanResourceDataLoading } =
    useReadOneHumanResource({
      variables: {
        id,
      },
      skip: !router.isReady,
      onCompleted: (data) => {
        const date = stringToDate(data.humanResource.dob ?? null);
        methods.setValue('name', data.humanResource.name);
        methods.setValue('alias', data.humanResource.alias ?? '');
        methods.setValue('isWni', `${data.humanResource.isWni}`);
        methods.setValue(
          'identityTypeId',
          data.humanResource.identityType?.id ?? ''
        );
        methods.setValue('identityNumber', data.humanResource.identityNumber);
        methods.setValue('pob', data.humanResource.pob ?? '');
        methods.setValue('dob', date);
        methods.setValue('gender', data.humanResource.gender);
        methods.setValue('religionId', data.humanResource.religion?.id ?? '');
        methods.setValue(
          'educationDegree',
          data.humanResource.educationDegree ?? ''
        );
        methods.setValue(
          'marriageStatusId',
          data.humanResource.marriageStatus?.id ?? ''
        );
        methods.setValue('provinceId', data.humanResource.province?.id ?? '');
        methods.setValue('regencyId', data.humanResource.regency?.id ?? '');
        methods.setValue(
          'subdistrictId',
          data.humanResource.district?.id ?? ''
        );
        methods.setValue('villageId', data.humanResource.village?.id ?? '');
        methods.setValue('address', data.humanResource.address);
        methods.setValue(
          'isAddressSameWithDomicile',
          `${data.humanResource.isAddressSameWithDomicile}`
        );
        methods.setValue(
          'domicileProvinceId',
          data.humanResource.domicileProvince?.id ?? ''
        );
        methods.setValue(
          'domicileRegencyId',
          data.humanResource.domicileRegency?.id ?? ''
        );
        methods.setValue(
          'domicileSubdistrictId',
          data.humanResource.domicileDistrict?.id ?? ''
        );
        methods.setValue(
          'domicileVillageId',
          data.humanResource.domicileVillage?.id ?? ''
        );
        methods.setValue(
          'domicileAddress',
          data.humanResource.domicileAddress ?? ''
        );
        methods.setValue('phoneNumber', data.humanResource.phoneNumber);
        methods.setValue('email', data.humanResource.email);
        methods.setValue('bloodType', data.humanResource.bloodType ?? '');
        methods.setValue('resus', data.humanResource.resus ?? '');
        if (data.humanResource.photo) {
          setServerPhotos([data.humanResource.photo]);
        }
        if (data.humanResource.identityPhoto) {
          setServerPhotosIdentity([data.humanResource.identityPhoto]);
        }
      },
    });
  const { mutate, isLoading } = useUpdateHumanResource({
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
      router.push('/master-data/human-resources');
      methods.reset();
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
      defaultValue: humanResourceData?.province?.id,
      labelValue: humanResourceData?.province?.name,
      onChange: (value) => {
        methods.setValue('provinceId', value ?? '');
        methods.setValue('regencyId', '');
        methods.setValue('subdistrictId', '');
        methods.setValue('villageId', '');
        methods.trigger('provinceId');
      },
    });
    const regencyItem = regencySelect({
      provinceId: provinceId ?? '',
      defaultValue: humanResourceData?.regency?.id,
      labelValue: humanResourceData?.regency?.name,
      onChange: (value) => {
        methods.setValue('regencyId', value ?? '');
        methods.setValue('subdistrictId', '');
        methods.setValue('villageId', '');
        methods.trigger('regencyId');
      },
    });
    const subdistrictItem = subdistrictSelect({
      provinceId: provinceId ?? '',
      regencyId: regencyId ?? '',
      defaultValue: humanResourceData?.district?.id,
      labelValue: humanResourceData?.district?.name,
      onChange: (value) => {
        methods.setValue('subdistrictId', value ?? '');
        methods.setValue('villageId', '');
        methods.trigger('subdistrictId');
      },
    });
    const villageItem = villageSelect({
      defaultValue: humanResourceData?.village?.id,
      labelValue: humanResourceData?.village?.name,
      provinceId: provinceId ?? '',
      regencyId: regencyId ?? '',
      subdistrictId: subdistrictId ?? '',
    });
    const identityItem = identityRadio({});

    const domicileProvinceItem = provinceSelect({
      defaultValue: humanResourceData?.domicileProvince?.id,
      labelValue: humanResourceData?.domicileProvince?.name,
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
      defaultValue: humanResourceData?.domicileRegency?.id,
      labelValue: humanResourceData?.domicileRegency?.name,
      onChange: (value) => {
        methods.setValue('domicileRegencyId', value ?? '');
        methods.setValue('domicileSubdistrictId', '');
        methods.setValue('domicileVillageId', '');
        methods.trigger('domicileRegencyId');
      },
    });
    const domicileSubdistrictItem = subdistrictSelect({
      name: 'domicileSubdistrictId',
      defaultValue: humanResourceData?.domicileDistrict?.id,
      labelValue: humanResourceData?.domicileDistrict?.name,
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
      defaultValue: humanResourceData?.domicileVillage?.id,
      labelValue: humanResourceData?.domicileVillage?.name,
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
        handleRejectFile<IUpdateHumanResourceValues>({
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
        handleRejectFile<ICreateHumanResourceValues>({
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
          checked: isAddressSameWithDomicile === 'true' ? true : false,
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
    humanResourceData,
    serverPhotos,
    deletedPhotoIds,
    serverPhotosIdentity,
    deletedPhotoIdentityIds,
  ]);
  /* #endregion  /**======== Field =========== */

  const handleSubmitForm: SubmitHandler<ICreateHumanResourceValues> = (
    data
  ) => {
    const outputArray = Object.keys(data).map((key) => ({
      name: key,
      value: data[key],
    }));
    const deletedPhoto = serverPhotos && serverPhotos?.length === 0;
    const deletedIdentityPhoto =
      serverPhotosIdentity && serverPhotosIdentity.length === 0;
    mutate({
      id,
      data: outputArray,
      deletedPhoto: deletedPhoto,
      deletedIdentityPhoto: deletedIdentityPhoto,
    });
  };
  return (
    <DashboardCard p={0} isLoading={humanResourceDataLoading}>
      <GlobalFormGroup
        field={fieldHumanResources}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/human-resources'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateHumanResourcesBook;
