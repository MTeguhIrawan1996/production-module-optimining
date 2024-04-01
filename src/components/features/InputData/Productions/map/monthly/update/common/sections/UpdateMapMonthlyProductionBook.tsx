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
import { useReadOneMap } from '@/services/graphql/query/input-data-map/useReadOneMap';
import { useUploadMapImage } from '@/services/restapi/input-data-map/useUploadMapImage';
import {
  globalDropzonePdfOrImageRhf,
  globalMultipleSelectMapLocation,
  globalSelect,
  globalSelectCompanyRhf,
  globalSelectMonthRhf,
  globalSelectYearRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { createMapMonthlyValidation } from '@/utils/form-validation/input-data-map/input-data-map-validation';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { IFile } from '@/types/global';
import { ControllerGroup } from '@/types/global';

type FormValues = {
  mapDataCategoryId: string;
  name: string;
  companyId: string | null;
  location: string[];
  year: string;
  month: string;
  mapImage: FileWithPath[] | null;
};

import { IconCheck, IconX } from '@tabler/icons-react';

import {
  IMutationMapValues,
  useUpdateMap,
} from '@/services/graphql/mutation/input-data-map/useUpdateMap';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

const UpdateMapMonthlyProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  const [fileId, setFileId] = React.useState<string | null>(null);
  const [serverPhotos, setServerPhotos] = React.useState<
    Omit<IFile, 'path'>[] | null
  >([]);
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

  const { mapDataLoading } = useReadOneMap({
    variables: {
      id: router.query.id as string,
    },
    onCompleted: (data) => {
      methods.setValue('name', data?.mapData.name);
      methods.setValue('mapDataCategoryId', data?.mapData.mapDataCategory.id);
      methods.setValue(
        'location',
        data?.mapData.mapDataLocation.map((item) => item.locationId)
      );
      methods.setValue('year', String(data?.mapData.year));
      methods.setValue('month', String(data?.mapData.month.id));
      methods.setValue('companyId', data.mapData.company?.id ?? null);
      setServerPhotos([data.mapData.file as Omit<IFile, 'path'>]);
      setFileId(data?.mapData.file?.id as string);
    },
  });

  const [executeUpdate, { loading }] = useUpdateMap({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('mapProduction.successUpdateMapMonthly'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/input-data/production/map?tabs=monthly');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<
            Omit<
              IMutationMapValues,
              'fileId' | 'dateType' | 'week' | 'quarter' | 'companyId' | 'id'
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
      const res = await uploadMapImage({
        data: {
          file: mapImage,
        },
      });
      setFileId(res.fileId);
    } catch (error) {
      return error;
    }
  };

  /* #   /**=========== Methods =========== */
  const methods = useForm<FormValues>({
    resolver: zodResolver(createMapMonthlyValidation),
    defaultValues: {
      name: '',
      mapDataCategoryId: '',
      location: [],
      year: '',
      mapImage: [],
      month: '',
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
      colSpan: 6,
      required: false,
      onChange: (value) =>
        value
          ? methods.setValue('companyId', value)
          : methods.setValue('companyId', null),
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

    const month = globalSelectMonthRhf({
      colSpan: 6,
      name: 'month',
      label: 'month',
      withAsterisk: true,
      disabled: false,
    });
    const mapImage = globalDropzonePdfOrImageRhf({
      colSpan: 12,
      name: 'mapImage',
      label: 'mapFile',
      withAsterisk: true,
      description: 'photoDescription',
      dropzoneDescription: 'formatImageDesc',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      serverFile: serverPhotos ? serverPhotos : undefined,
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
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.mapInformation'),
        enableGroupLabel: true,
        formControllers: [company, name, mapCategory, location, year, month],
      },
      {
        group: 'File Peta',
        enableGroupLabel: false,
        formControllers: [mapImage],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCategoryList, serverPhotos]);

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<FormValues> = async () => {
    const { name, mapDataCategoryId, location, year, companyId, month } =
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
    await executeUpdate({
      variables: {
        dateType: 'MONTH',
        name: name,
        mapDataCategoryId: mapDataCategoryId,
        location: location,
        year: Number(year),
        month: Number(month),
        fileId: fileId || '',
        companyId: companyId,
        id: router.query.id as string,
      },
    });
  };

  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard
      p={0}
      isLoading={loading || isLoadingUpload || mapDataLoading}
    >
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/input-data/production/map?tabs=monthly'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateMapMonthlyProductionBook;
