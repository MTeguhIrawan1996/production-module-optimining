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
  globalSelectWeekRhf,
  globalSelectYearRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { createMapWeeklyValidation } from '@/utils/form-validation/input-data-map/input-data-map-validation';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { IFile } from '@/types/global';
import { ControllerGroup } from '@/types/global';

type FormValues = {
  mapDataCategoryId: string;
  name: string;
  companyId: string | null;
  location: string[];
  year: string;
  week: string;
  mapImage: FileWithPath[] | null;
};

import { IconCheck, IconX } from '@tabler/icons-react';

import {
  IMutationMapValues,
  useUpdateMap,
} from '@/services/graphql/mutation/input-data-map/useUpdateMap';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

const UpdateMapWeeklyProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

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

  const { mapData, mapDataLoading } = useReadOneMap({
    variables: {
      id: router.query.id as string,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('name', data.mapData.name);
      methods.setValue('mapDataCategoryId', data.mapData.mapDataCategory?.id);
      methods.setValue(
        'location',
        data.mapData.mapDataLocation.map((item) => item.locationId)
      );
      methods.setValue('year', String(data.mapData.year));
      methods.setValue('week', String(data.mapData.week));
      methods.setValue('companyId', data.mapData.company?.id ?? null);
      setServerPhotos([data.mapData.file]);
      setFileId(data.mapData.file.id as string);
    },
  });

  const [executeUpdate, { loading }] = useUpdateMap({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Produksi',
          subCategory: 'Produksi - Peta',
          subSubCategory: 'Produksi - Peta - Mingguan',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('mapProduction.successUpdateMapWeekly'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/input-data/production/map?tabs=weekly');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<
            Omit<
              IMutationMapValues,
              'fileId' | 'dateType' | 'month' | 'quarter' | 'companyId' | 'id'
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
    resolver: zodResolver(createMapWeeklyValidation),
    defaultValues: {
      name: '',
      mapDataCategoryId: '',
      location: [],
      year: '',
      mapImage: [],
      week: '',
      companyId: null,
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

    const week = globalSelectWeekRhf({
      colSpan: 6,
      name: 'week',
      label: 'week',
      withAsterisk: true,
      disabled: false,
    });

    const mapImage = globalDropzonePdfOrImageRhf({
      colSpan: 12,
      name: 'mapImage',
      label: 'mapFile',
      multiple: false,
      withAsterisk: true,
      description: 'photoDescription',
      dropzoneDescription: 'formatImageDesc',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      key: 'ada',
      serverFile: serverPhotos,
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
        formControllers: [company, name, mapCategory, location, year, week],
      },
      {
        group: 'File Peta',
        enableGroupLabel: false,
        formControllers: [mapImage],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCategoryList, serverPhotos, fileId, mapData]);

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<FormValues> = async () => {
    const { name, mapDataCategoryId, location, year, companyId, week } =
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
        dateType: 'WEEK',
        name: name,
        mapDataCategoryId: mapDataCategoryId,
        location: location,
        year: Number(year),
        week: Number(week),
        fileId: fileId || '',
        companyId: companyId,
        id: router.query.id as string,
      },
    });
  };

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
          onClick: () => router.push('/input-data/production/map?tabs=weekly'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateMapWeeklyProductionBook;
