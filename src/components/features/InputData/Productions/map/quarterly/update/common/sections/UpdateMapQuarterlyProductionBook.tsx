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
  globalMultipleSelectMapLocation,
  globalSelect,
  globalSelectCompanyRhf,
  globalSelectYearRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { createMapQuarterValidation } from '@/utils/form-validation/input-data-map/input-data-map-validation';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { IFile } from '@/types/global';
import { ControllerGroup, ControllerProps } from '@/types/global';

type FormValues = {
  mapDataCategoryId: string;
  name: string;
  companyId?: string;
  location: string[];
  year: string;
  quarter: string;
  mapImage: FileWithPath[] | null;
};

import { IconCheck, IconX } from '@tabler/icons-react';

import {
  IMutationMapValues,
  useUpdateMap,
} from '@/services/graphql/mutation/input-data-map/useUpdateMap';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

const UpdateMapQuarterlyProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  const [fileId, setFileId] = React.useState<string | null>(null);
  const [serverPhotos, setServerPhotos] = React.useState<
    Omit<IFile, 'mime' | 'path'>[] | null
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
      methods.setValue('quarter', String(data?.mapData.quarter));
      methods.setValue('companyId', data?.mapData.company.id);
      setServerPhotos([data.mapData.file as Omit<IFile, 'mime' | 'path'>]);
      setFileId(data?.mapData.file?.id as string);
    },
  });

  const [executeUpdate, { loading }] = useUpdateMap({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('mapProduction.successUpdateMapQuarterly'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/input-data/production/map?tabs=quarterly');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<
            Omit<
              IMutationMapValues,
              'fileId' | 'dateType' | 'month' | 'week' | 'companyId' | 'id'
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
    resolver: zodResolver(createMapQuarterValidation),
    defaultValues: {
      name: '',
      mapDataCategoryId: '',
      location: [],
      year: '',
      mapImage: [],
      quarter: '',
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
      withAsterisk: false,
      disabled: false,
    });

    const quarter = globalSelect({
      colSpan: 6,
      name: 'quarter',
      label: 'quarter',
      withAsterisk: false,
      disabled: false,
      data: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
        {
          label: '4',
          value: '4',
        },
      ],
    });
    const mapImage: ControllerProps = {
      control: 'pdf-image-dropzone',
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
    };

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.mapInformation'),
        enableGroupLabel: true,
        formControllers: [company, name, mapCategory, location, year, quarter],
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
  const handleSubmitForm: SubmitHandler<FormValues> = async () => {
    const { name, mapDataCategoryId, location, year, companyId, quarter } =
      methods.getValues();
    await executeUpdate({
      variables: {
        dateType: 'QUARTER',
        name: name,
        mapDataCategoryId: mapDataCategoryId,
        location: location,
        year: Number(year),
        quarter: Number(quarter),
        fileId: fileId || '',
        companyId: companyId === '' ? undefined : companyId,
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
          onClick: () =>
            router.push('/input-data/production/map?tabs=quarterly'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateMapQuarterlyProductionBook;
