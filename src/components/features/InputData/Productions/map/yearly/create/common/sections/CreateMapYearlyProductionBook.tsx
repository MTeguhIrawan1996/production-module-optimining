/* eslint-disable unused-imports/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAllMapCategory } from '@/services/graphql/query/input-data-map/useReadAllMapCategory';
import { useUploadMapImage } from '@/services/restapi/input-data-map/useUploadMapImage';
import {
  globalMultipleSelectMapLocation,
  globalSelect,
  globalSelectCompanyRhf,
  globalSelectYearRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { createMapYearlyValidation } from '@/utils/form-validation/input-data-map/input-data-map-validation';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup, ControllerProps } from '@/types/global';
type FormValues = {
  mapDataCategoryId: string;
  name: string;
  companyId?: string;
  location: string[];
  year: string;
  mapImage: FileWithPath[] | null;
};
import { IconCheck, IconX } from '@tabler/icons-react';
import { shallow } from 'zustand/shallow';

import {
  IMutationMapValues,
  useCreateMap,
} from '@/services/graphql/mutation/input-data-map/useCreateMap';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import useControlPanel from '@/utils/store/useControlPanel';

const CreateMapYearlyProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const [resetYearlyMapProductionState] = useControlPanel(
    (state) => [state.resetYearlyMapProductionState],
    shallow
  );

  const [fileId, setFileId] = React.useState<string | null>(null);
  const [mapCategoryList, setMapCategoryList] = React.useState<
    Array<{
      label: string;
      value: string;
    }>
  >([]);

  useReadAllMapCategory({
    variables: {
      limit: 100,
    },
    onCompleted: (data) => {
      setMapCategoryList(
        data?.mapDataCategories.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        }) || []
      );
    },
  });

  const [executeCreate, { loading }] = useCreateMap({
    onCompleted: () => {
      sendGAEvent({
        event: 'Tambah',
        params: {
          category: 'Produksi',
          subCategory: 'Produksi - Peta',
          subSubCategory: 'Produksi - Peta - Tahunan',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('mapProduction.successYearlyCreateMessage'),
        icon: <IconCheck />,
      });
      resetYearlyMapProductionState();
      methods.reset();
      router.push('/input-data/production/map?tabs=yearly');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<
            Omit<
              IMutationMapValues,
              'fileId' | 'dateType' | 'week' | 'month' | 'companyId' | 'quarter'
            >
          >(error);
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

  const { mutateAsync: uploadMapImage, isLoading: isLoadingUpload } =
    useUploadMapImage({
      onError: (error) => {
        notifications.show({
          title: 'Error',
          message: error.message,
        });
      },
      onSuccess: (data) => {
        setFileId(data.fileId);
      },
    });

  const handleUploadMapImage = async () => {
    const { mapImage } = methods.getValues();
    try {
      await uploadMapImage({
        data: {
          file: mapImage,
        },
      });
    } catch (error) {
      return error;
    }
  };

  /* #   /**=========== Methods =========== */
  const methods = useForm<FormValues>({
    resolver: zodResolver(createMapYearlyValidation),
    defaultValues: {
      name: '',
      mapDataCategoryId: '',
      location: [],
      year: '',
      mapImage: [],
      companyId: '',
    },
    mode: 'onBlur',
  });

  const fieldRhf = React.useMemo(() => {
    const company = globalSelectCompanyRhf({
      name: 'companyId',
      label: 'company',
      withAsterisk: false,
      clearable: true,
      required: false,
      colSpan: 6,
      onChange: (value) =>
        value
          ? methods.setValue('companyId', value)
          : methods.setValue('companyId', ''),
    });

    const mapCategory = globalSelect({
      name: 'mapDataCategoryId',
      label: 'mapType',
      withAsterisk: true,
      colSpan: 6,
      data: mapCategoryList,
    });

    const name = globalText({
      colSpan: 6,
      name: 'name',
      label: 'mapName',
      withAsterisk: true,
    });
    const location = globalMultipleSelectMapLocation({
      colSpan: 6,
      name: 'location',
      label: 'location',
      withAsterisk: true,
    });

    const year = globalSelectYearRhf({
      colSpan: 6,
      name: 'year',
      label: 'year',
      withAsterisk: true,
      disabled: false,
    });

    const mapImage: ControllerProps = {
      control: 'pdf-image-dropzone',
      name: 'mapImage',
      label: 'mapFile',
      withAsterisk: true,
      description: 'mapFileDescription',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: true,
      maxFiles: 5,
      onDrop: async (value) => {
        methods.setValue('mapImage', value);
        await handleUploadMapImage();
      },
      accept: ['image/*'],
      onReject: (files) =>
        handleRejectFile<FormValues>({
          methods,
          files,
          field: 'mapImage',
        }),
    };

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.mapInformation'),
        enableGroupLabel: true,
        formControllers: [company, name, mapCategory, location, year],
      },
      {
        group: 'File Peta',
        enableGroupLabel: false,
        formControllers: [mapImage],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCategoryList]);

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationMapValues> = async (data) => {
    const { name, mapDataCategoryId, location, year, companyId } =
      methods.getValues();
    if (!fileId) {
      methods.setError('mapImage', {
        message: 'File harus Foto',
      });
      return;
    } else {
      methods.setError('mapImage', {
        message: undefined,
      });
    }
    await executeCreate({
      variables: {
        dateType: 'YEAR',
        name: name,
        mapDataCategoryId: mapDataCategoryId,
        location: location,
        year: Number(year),
        fileId: fileId || '',
        companyId: companyId === '' ? undefined : companyId,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={loading || isLoadingUpload}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/input-data/production/map?tabs=yearly'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateMapYearlyProductionBook;
