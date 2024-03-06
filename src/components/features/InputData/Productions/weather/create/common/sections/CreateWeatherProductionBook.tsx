import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationWeatherProductionValues,
  useCreateWeatherProduction,
} from '@/services/graphql/mutation/weather-production/useCreateWeatherProduction';
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
import { dateToString } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateWeatherProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

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
    remove: removeWeatherConditionFields,
    append: appendWeatherConditionFields,
  } = useFieldArray({
    name: 'weatherDataConditions',
    control: methods.control,
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateWeatherProduction({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weatherProd.successCreateMessage'),
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

  /* #   /**=========== Field =========== */
  const weatherGroup = React.useCallback(
    (
      val: FieldArrayWithId<
        IMutationWeatherProductionValues,
        'weatherDataConditions',
        'id'
      >,
      index: number
    ) => {
      const startTimeItem = globalTimeInput({
        name: `weatherDataConditions.${index}.startTime`,
        label: 'startTime',
        withAsterisk: true,
        colSpan: 6,
        key: `weatherDataConditions.${index}.startTime.${val.id}`,
      });
      const endTimeItem = globalTimeInput({
        name: `weatherDataConditions.${index}.finishTime`,
        label: 'endTime',
        withAsterisk: true,
        colSpan: 6,
        key: `weatherDataConditions.${index}.finishTime.${val.id}`,
      });
      const rainfallItem = globalNumberInput({
        name: `weatherDataConditions.${index}.rainfall`,
        label: 'rainfall',
        colSpan: 6,
        withAsterisk: false,
        key: `weatherDataConditions.${index}.rainfall.${val.id}`,
        formatter: (value) =>
          !Number.isNaN(parseFloat(value)) ? `${value} mm` : '',
      });
      const weatherConditionItem = weatherConditionSelect({
        name: `weatherDataConditions.${index}.conditionId`,
        key: `weatherDataConditions.${index}.conditionId.${val.id}`,
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
      positionId: `${process.env.NEXT_PUBLIC_EMPLOYEE_CHECKER_ID}`,
    });
    const locationCategoryItem = locationCategorySelect({
      clearable: true,
      withAsterisk: true,
      name: 'locationCategoryId',
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
  }, [locationCategoryId, weatherGroupItem]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationWeatherProductionValues
  > = async (data) => {
    const date = dateToString(data.date ?? null);

    const newWeatherConditions = data.weatherDataConditions.map((item) => ({
      ...item,
      rainfall: item.rainfall === '' ? null : item.rainfall,
    }));

    await executeCreate({
      variables: {
        date,
        checkerId: data.checkerId,
        locationCategoryId: data.locationCategoryId,
        locationId: data.locationId,
        weatherDataConditions: newWeatherConditions,
        desc: data.desc,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/input-data/production/data-weather'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateWeatherProductionBook;
