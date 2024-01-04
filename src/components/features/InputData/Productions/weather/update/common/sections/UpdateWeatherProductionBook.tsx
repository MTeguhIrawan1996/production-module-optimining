import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationWeatherProductionValues } from '@/services/graphql/mutation/weather-production/useCreateWeatherProduction';
import { useUpdateWeatherProduction } from '@/services/graphql/mutation/weather-production/useUpdateWeatherProduction';
import { useReadOneWeatherProduction } from '@/services/graphql/query/weather-production/useReadOneWeatherProduction';
import {
  employeeSelect,
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  locationCategorySelect,
  locationSelect,
  weatherConditionSelect,
} from '@/utils/constants/Field/global-field';
import { weatherProductionMutationValidation } from '@/utils/form-validation/weather-production/weather-production-validation';
import { formatDate2 } from '@/utils/helper/dateFormat';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateWeatherProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationWeatherProductionValues>({
    resolver: zodResolver(weatherProductionMutationValidation),
    defaultValues: {
      date: undefined,
      checkerId: '',
      locationCategoryId: '',
      locationId: '',
      desc: '',
      weatherDataConditions: [
        {
          conditionId: '',
          startTime: '',
          finishTime: '',
          rainfall: '',
        },
      ],
    },
    mode: 'onBlur',
  });
  const locationCategoryId = methods.watch('locationCategoryId');

  const {
    fields: weatherConditionFields,
    replace: replaceWeatherConditionFields,
    remove: removeWeatherConditionFields,
    append: appendWeatherConditionFields,
  } = useFieldArray({
    name: 'weatherDataConditions',
    control: methods.control,
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { weatherData, weatherDataLoading } = useReadOneWeatherProduction({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ weatherData }) => {
      const date = stringToDate(weatherData.date ?? null);
      const weatherDataConditions = weatherData.weatherDataConditions.map(
        (val) => {
          const startTime = formatDate2(val.startAt, 'HH:mm:ss');
          const finishTime = formatDate2(val.finishAt, 'HH:mm:ss');
          return {
            conditionId: val.condition?.id ?? '',
            startTime: startTime ?? '',
            finishTime: finishTime ?? '',
            rainfall: val.rainfall,
          };
        }
      );
      replaceWeatherConditionFields(weatherDataConditions);
      methods.setValue('date', date);
      methods.setValue('checkerId', weatherData.checker?.id ?? '');
      methods.setValue(
        'locationCategoryId',
        weatherData.locationCategory?.id ?? ''
      );
      methods.setValue('locationId', weatherData.location?.id ?? '');
      methods.setValue('desc', weatherData.desc ?? '');
    },
  });

  const [executeUpdate, { loading }] = useUpdateWeatherProduction({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weatherProd.successUpdateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/input-data/production/data-weather');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationWeatherProductionValues>(error);
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

  // console.log(methods.watch());

  /* #   /**=========== Field =========== */
  const weatherGroup = React.useCallback(
    (_, index: number) => {
      const startTimeValue = methods.watch(
        `weatherDataConditions.${index}.startTime`
      );
      const endTimeValue = methods.watch(
        `weatherDataConditions.${index}.finishTime`
      );
      const rainfallValue = methods.watch(
        `weatherDataConditions.${index}.rainfall`
      );
      const weatherConditionId = methods.watch(
        `weatherDataConditions.${index}.conditionId`
      );

      const startTimeItem = globalTimeInput({
        name: `weatherDataConditions.${index}.startTime`,
        label: 'startTime',
        withAsterisk: true,
        value: startTimeValue,
        colSpan: 6,
      });
      const endTimeItem = globalTimeInput({
        name: `weatherDataConditions.${index}.finishTime`,
        label: 'endTime',
        withAsterisk: true,
        value: endTimeValue,
        colSpan: 6,
      });
      const rainfallItem = globalNumberInput({
        name: `weatherDataConditions.${index}.rainfall`,
        label: 'rainfall',
        value: rainfallValue,
        colSpan: 6,
        withAsterisk: false,
      });
      const weatherConditionItem = weatherConditionSelect({
        name: `weatherDataConditions.${index}.conditionId`,
        value: weatherConditionId,
      });
      const group: ControllerGroup = {
        group: t('commonTypography.weather'),
        enableGroupLabel: true,
        formControllers: [
          weatherConditionItem,
          startTimeItem,
          endTimeItem,
          rainfallItem,
        ],
        actionOuterGroup: {
          addButton:
            index === 0
              ? {
                  label: t('commonTypography.createWeather'),
                  onClick: () => {
                    appendWeatherConditionFields({
                      conditionId: '',
                      startTime: '',
                      finishTime: '',
                      rainfall: '',
                    });
                  },
                }
              : undefined,
        },
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () => {
              weatherConditionFields.length > 1
                ? removeWeatherConditionFields(index)
                : null;
            },
          },
        },
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weatherConditionFields]
  );

  const weatherGroupItem = weatherConditionFields.map(weatherGroup);

  const fieldRhf = React.useMemo(() => {
    const date = globalDate({
      name: 'date',
      label: 'date',
      withAsterisk: true,
      clearable: true,
      colSpan: 12,
    });
    const checkerNameItem = employeeSelect({
      colSpan: 6,
      name: 'checkerId',
      label: 'checkerName',
      withAsterisk: true,
      defaultValue: weatherData?.checker?.id,
      labelValue: weatherData?.checker?.humanResource.name,
      // positionId: `${process.env.NEXT_PUBLIC_EMPLOYEE_CHECKER_ID}`,
    });
    const locationCategoryItem = locationCategorySelect({
      clearable: true,
      withAsterisk: true,
      name: 'locationCategoryId',
      defaultValue: weatherData?.locationCategory?.id,
      labelValue: weatherData?.locationCategory?.name,
      onChange: (value) => {
        methods.setValue('locationCategoryId', value ?? '');
        methods.setValue('locationId', '');
        methods.trigger('locationCategoryId');
      },
    });
    const newLocationCategoryId =
      locationCategoryId === '' ? null : locationCategoryId;
    const locationItem = locationSelect({
      colSpan: 6,
      name: 'locationId',
      label: 'location',
      withAsterisk: true,
      disabled: !newLocationCategoryId,
      categoryId: locationCategoryId,
      defaultValue: weatherData?.location?.id,
      labelValue: weatherData?.location?.name,
    });

    const desc = globalText({
      colSpan: 12,
      name: 'desc',
      label: 'desc',
      withAsterisk: false,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.date'),
        formControllers: [date],
      },
      {
        group: t('commonTypography.checkerInformation'),
        enableGroupLabel: true,
        formControllers: [checkerNameItem, locationCategoryItem, locationItem],
      },
      ...weatherGroupItem,
      {
        group: t('commonTypography.desc'),
        formControllers: [desc],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationCategoryId, weatherGroupItem, weatherData]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationWeatherProductionValues
  > = async (data) => {
    const date = dateToString(data.date ?? null);

    await executeUpdate({
      variables: {
        id,
        date,
        checkerId: data.checkerId,
        locationCategoryId: data.locationCategoryId,
        locationId: data.locationId,
        weatherDataConditions: data.weatherDataConditions,
        desc: data.desc,
      },
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={weatherDataLoading}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          type: 'button',
          onClick: () => setIsOpenConfirmation((prev) => !prev),
        }}
        backButton={{
          onClick: () => router.push('/input-data/production/data-weather'),
        }}
        modalConfirmation={{
          isOpenModalConfirmation: isOpenConfirmation,
          actionModalConfirmation: () => setIsOpenConfirmation((prev) => !prev),
          actionButton: {
            label: t('commonTypography.yes'),
            type: 'button',
            onClick: handleConfirmation,
            loading: loading,
          },
          backButton: {
            label: 'Batal',
          },
          modalType: {
            type: 'default',
            title: t('commonTypography.alertTitleConfirmUpdate'),
          },
          withDivider: true,
        }}
      />
    </DashboardCard>
  );
};

export default UpdateWeatherProductionBook;
