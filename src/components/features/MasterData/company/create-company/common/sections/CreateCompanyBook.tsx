import { zodResolver } from '@hookform/resolvers/zod';
import { createStyles } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  ICompanyMutationValues,
  useCreateCompany,
} from '@/services/restapi/company/useCreateCompanyMasterData';
import {
  businessTypesSelact,
  companyPermissionTypesSelact,
  companyTypesSelact,
} from '@/utils/constants/Field/company-field';
import {
  globalDate,
  globalText,
  provinceSelect,
  regencySelect,
  subdistrictSelect,
  villageSelect,
} from '@/utils/constants/Field/global-field';
import { companyMutationValidation } from '@/utils/form-validation/company/company-mutation-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const useStyles = createStyles(() => ({
  image: {
    objectFit: 'contain',
    backgroundPosition: 'center',
  },
}));

const CreateCompanyBook = () => {
  const { classes } = useStyles();
  const { t } = useTranslation('default');
  const router = useRouter();
  const [companyPermissionType, setCompanyPermissionType] =
    React.useState<string>('');

  const methods = useForm<ICompanyMutationValues>({
    resolver: zodResolver(companyMutationValidation),
    defaultValues: {
      name: '',
      alias: '',
      typeId: '',
      businessTypeId: '',
      provinceId: '',
      regencyId: '',
      subdistrictId: '',
      villageId: '',
      address: '',
      email1: '',
      phoneNumber1: '',
      email2: '',
      phoneNumber2: '',
      faxNumber: '',
      code: '',
      nib: '',
      logo: [],
      permissionTypeId: '',
      permissionTypeNumber: '',
      permissionTypeDate: undefined,
      permissionTypeDocument: [],
    },
    mode: 'onBlur',
  });
  const permissionTypeId = methods.watch('permissionTypeId');
  const provinceId = methods.watch('provinceId');
  const regencyId = methods.watch('regencyId');
  const subdistrictId = methods.watch('subdistrictId');

  const { mutate, isLoading } = useCreateCompany({
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
        message: t('company.successCreateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/company');
      methods.reset();
    },
  });

  const createCompanyField = React.useMemo(() => {
    const name = globalText({
      name: 'name',
      label: 'companyName',
      colSpan: 6,
    });
    const alias = globalText({
      name: 'alias',
      label: 'companyAlias',
      colSpan: 6,
      withAsterisk: false,
    });
    const address = globalText({
      name: 'address',
      label: 'address',
      colSpan: 12,
    });
    const contact1 = globalText({
      name: 'phoneNumber1',
      label: 'contactNumberOne',
    });
    const contact2 = globalText({
      name: 'phoneNumber2',
      label: 'contactNumberTwo',
      withAsterisk: false,
    });
    const email1 = globalText({
      name: 'email1',
      label: 'emailOne',
      withAsterisk: true,
    });
    const email2 = globalText({
      name: 'email2',
      label: 'emailTwo',
      withAsterisk: false,
    });
    const faxNumber = globalText({
      name: 'faxNumber',
      label: 'faxNumber',
      withAsterisk: false,
      colSpan: 12,
    });
    const companyCode = globalText({
      name: 'code',
      label: 'companyCode',
      withAsterisk: false,
      colSpan: 12,
    });
    const nib = globalText({
      name: 'nib',
      label: 'nib',
      withAsterisk: true,
      colSpan: 12,
    });
    const companyTypeItem = companyTypesSelact({
      withAsterisk: true,
    });
    const businessTypeItem = businessTypesSelact({
      withAsterisk: true,
    });
    const companyPermissionItem = companyPermissionTypesSelact({
      colSpan: 12,
      withAsterisk: true,
      onSearchChange: setCompanyPermissionType,
      onChange: (value) => {
        methods.setValue('permissionTypeId', value ?? '');
        methods.setValue('permissionTypeNumber', '');
        methods.setValue('permissionTypeDate', null);
        methods.setValue('permissionTypeDocument', []);
        methods.trigger('permissionTypeId');
      },
    });
    const permissionTypeNumber = globalText({
      name: 'permissionTypeNumber',
      label: `number${companyPermissionType}`,
      withAsterisk: true,
      colSpan: 6,
    });
    const permissionTypeDate = globalDate({
      name: 'permissionTypeDate',
      label: `date${companyPermissionType}`,
      withAsterisk: true,
      colSpan: 6,
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
      provinceId: provinceId ?? '',
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
      onChange: (value) => {
        methods.setValue('subdistrictId', value ?? '');
        methods.setValue('villageId', '');
        methods.trigger('subdistrictId');
      },
    });
    const villageItem = villageSelect({
      provinceId: provinceId ?? '',
      regencyId: regencyId ?? '',
      subdistrictId: subdistrictId ?? '',
    });
    const companyLogo: ControllerProps = {
      control: 'image-dropzone',
      name: 'logo',
      label: 'companyLogo',
      description: 'photoDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: false,
      enableDeletePhoto: true,
      imageProps: {
        imageClassName: classes.image,
      },
      onDrop: (value) => {
        methods.setValue('logo', value);
        methods.clearErrors('logo');
      },
      onReject: (files) => {
        handleRejectFile<ICompanyMutationValues>({
          methods,
          files,
          field: 'logo',
        });
      },
    };
    const fileInput: ControllerProps = {
      control: 'pdf-dropzone',
      name: 'permissionTypeDocument',
      label: 'uploadPdf',
      withAsterisk: false,
      description: 'uploadPdfDescription',
      maxSize: 10 * 1024 ** 2,
      multiple: false,
      onDrop: (value) => {
        methods.setValue('permissionTypeDocument', value);
        methods.clearErrors('permissionTypeDocument');
      },
      onReject: (files) =>
        handleRejectFile<ICompanyMutationValues>({
          methods,
          files,
          field: 'permissionTypeDocument',
        }),
    };

    const bussinesPermit = [
      permissionTypeNumber,
      permissionTypeDate,
      fileInput,
    ];

    const field: ControllerGroup[] = [
      {
        group: t('company.identityCompany'),
        enableGroupLabel: true,
        formControllers: [name, alias, companyTypeItem, businessTypeItem],
      },
      {
        group: t('commonTypography.address'),
        enableGroupLabel: true,
        formControllers: [
          provinceItem,
          regencyItem,
          subdistrictItem,
          villageItem,
          address,
        ],
      },
      {
        group: t('commonTypography.contact'),
        enableGroupLabel: true,
        formControllers: [contact1, contact2, email1, email2],
      },
      {
        group: 'CompanyCode',
        formControllers: [faxNumber, companyCode, nib],
      },
      {
        group: 'Image',
        formControllers: [companyLogo],
      },
      {
        group: t('commonTypography.companyPermissionType'),
        enableGroupLabel: true,
        formControllers: [
          companyPermissionItem,
          ...(permissionTypeId ? bussinesPermit : []),
        ],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    permissionTypeId,
    companyPermissionType,
    provinceId,
    regencyId,
    subdistrictId,
  ]);

  const handleSubmitForm: SubmitHandler<ICompanyMutationValues> = (data) => {
    const values = objectToArrayValue(data);
    mutate({
      data: values,
    });
  };
  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={createCompanyField}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/company'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateCompanyBook;
