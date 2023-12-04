import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneBlockPitMaster } from '@/services/graphql/query/block/useReadOneBlockPitMaster';
import {
  IMutationRitageOre,
  useCreateRitageOre,
} from '@/services/restapi/ritage-productions/useCreateRitageOre';
import {
  employeeSelect,
  globalDate,
  globalNumberInput,
  globalText,
  globalTimeInput,
  heavyEquipmentSelect,
  locationSelect,
  materialSelect,
  pitSelect,
  weatherSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import {
  domeNameSelect,
  stockpileNameSelect,
} from '@/utils/constants/Field/stockpile-field';
import { ritageOreMutationValidation } from '@/utils/form-validation/ritage/ritage-ore-validation';
import { countTonByRitage } from '@/utils/helper/countTonByRitage';
import { dateToString } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { hourDiff } from '@/utils/helper/hourDiff';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const CreateRitageOreBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [newFromTime, setNewFromTime] = useDebouncedState<string>('', 400);
  const [newArriveTime, setNewArriveTime] = useDebouncedState<string>('', 400);
  const [newBulkSamplingDensity, setNewBulkSamplingDensity] =
    useDebouncedState<string>('', 400);
  const [newBucketVolume, setNewBucketVolume] = useDebouncedState<string>(
    '',
    400
  );

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationRitageOre>({
    resolver: zodResolver(ritageOreMutationValidation),
    defaultValues: {
      date: undefined,
      checkerFromId: '',
      checkerFromPosition: '',
      checkerToId: '',
      checkerToPosition: '',
      shiftId: '',
      companyHeavyEquipmentId: '',
      materialId: '',
      subMaterialId: '',
      fromTime: '',
      arriveTime: '',
      ritageDuration: '',
      block: '',
      weatherId: '',
      fromPitId: '',
      fromFrontId: '',
      fromGridId: '',
      fromSequenceId: '',
      fromElevationId: '',
      fromLevel: '',
      toLevel: '',
      stockpileId: '',
      domeId: '',
      closeDome: false,
      bulkSamplingDensity: '',
      bucketVolume: '',
      tonByRitage: '',
      sampleNumber: '',
      desc: '',
      photos: [],
      isRitageProblematic: false,
      companyHeavyEquipmentChangeId: '',
    },
    mode: 'onBlur',
  });
  const fromPitId = methods.watch('fromPitId');
  const photos = methods.watch('photos');
  const isRitageProblematic = methods.watch('isRitageProblematic');
  const closeDome = methods.watch('closeDome');

  React.useEffect(() => {
    const ritageDuration = hourDiff(newFromTime, newArriveTime);
    const amount = countTonByRitage(newBucketVolume, newBulkSamplingDensity);
    methods.setValue('tonByRitage', `${!amount ? '' : amount}`);
    methods.setValue('date', new Date());
    methods.setValue('ritageDuration', ritageDuration ?? '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFromTime, newArriveTime, newBulkSamplingDensity, newBucketVolume]);

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  useReadOneBlockPitMaster({
    variables: {
      id: fromPitId as string,
    },
    skip: fromPitId === '' || !fromPitId,
    onCompleted: ({ pit }) => {
      methods.setValue('block', pit.block.name);
    },
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { mutate, isLoading } = useCreateRitageOre({
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
          message: err.message,
          icon: <IconX />,
        });
      }
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageOre.successCreateMessage'),
        icon: <IconCheck />,
      });
      router.push('/input-data/production/data-ritage?tabs=ore');
      methods.reset();
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */

  const fieldRhf = React.useMemo(() => {
    const date = globalDate({
      name: 'date',
      label: 'date',
      withAsterisk: true,
      clearable: true,
      colSpan: 12,
    });
    const fromCheckerName = employeeSelect({
      colSpan: 6,
      name: 'checkerFromId',
      label: 'fromCheckerName',
      withAsterisk: true,
    });
    const fromCheckerPosition = globalText({
      name: 'checkerFromPosition',
      label: 'fromCheckerPosition',
      colSpan: 6,
      withAsterisk: false,
    });
    const toCheckerName = employeeSelect({
      colSpan: 6,
      name: 'checkerToId',
      label: 'toCheckerName',
      withAsterisk: false,
    });
    const toCheckerPosition = globalText({
      colSpan: 6,
      name: 'checkerToPosition',
      label: 'toCheckerPosition',
      withAsterisk: false,
    });
    const shiftItem = shiftSelect({
      colSpan: 6,
      name: 'shiftId',
    });
    const hullNumber = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentId',
      label: 'heavyEquipmentCode',
      withAsterisk: true,
      categorySlug: 'dump-truck',
    });
    const hullNumberSubstitution = heavyEquipmentSelect({
      colSpan: 6,
      name: 'companyHeavyEquipmentChangeId',
      label: 'heavyEquipmentCodeSubstitution',
      withAsterisk: true,
      categorySlug: 'dump-truck',
    });
    const materialItem = materialSelect({
      colSpan: 6,
      name: 'materialId',
      label: 'materialType',
      withAsterisk: true,
      includeIds: [`${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`],
      onChange: (value) => {
        methods.setValue('materialId', value ?? '');
        methods.setValue('subMaterialId', '');
        methods.trigger('materialId');
      },
    });
    const materialSubItem = materialSelect({
      colSpan: 6,
      name: 'subMaterialId',
      label: 'subMaterialType',
      withAsterisk: true,
      parentId: `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`,
      isHaveParent: null,
    });
    const fromTime = globalTimeInput({
      name: 'fromTime',
      label: 'fromTime',
      withAsterisk: true,
      colSpan: 6,
      onChange: (e) => {
        methods.setValue('fromTime', e.currentTarget.value);
        setNewFromTime(e.currentTarget.value);
        methods.trigger('fromTime');
      },
    });
    const arriveTime = globalTimeInput({
      name: 'arriveTime',
      label: 'arriveTime',
      withAsterisk: false,
      colSpan: 6,
      onChange: (e) => {
        methods.setValue('arriveTime', e.currentTarget.value);
        setNewArriveTime(e.currentTarget.value);
        methods.trigger('arriveTime');
      },
    });
    const ritageDurationItem = globalText({
      name: 'ritageDuration',
      label: 'ritageDuration',
      colSpan: 6,
      disabled: true,
      withAsterisk: false,
    });
    const weatherItem = weatherSelect({
      colSpan: 6,
      name: 'weatherId',
    });
    const pitItem = pitSelect({
      colSpan: 6,
      name: 'fromPitId',
      label: 'fromPit',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('fromPitId', value ?? '');
        methods.setValue('block', '');
        methods.trigger('fromPitId');
      },
    });
    const frontItem = locationSelect({
      colSpan: 6,
      name: 'fromFrontId',
      label: 'fromFront',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_FRONT_ID}`,
    });
    const block = globalText({
      colSpan: 6,
      name: 'block',
      label: 'block',
      withAsterisk: false,
      disabled: true,
    });
    const gridItem = locationSelect({
      colSpan: 6,
      name: 'fromGridId',
      label: 'fromGrid',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_GRID_ID}`,
    });
    const sequenceItem = locationSelect({
      colSpan: 6,
      name: 'fromSequenceId',
      label: 'fromSequence',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_SEQUENCE_ID}`,
    });
    const elevasiItem = locationSelect({
      colSpan: 6,
      name: 'fromElevationId',
      label: 'fromElevasi',
      withAsterisk: false,
      categoryId: `${process.env.NEXT_PUBLIC_ELEVASI_ID}`,
    });
    const fromLevel = globalText({
      colSpan: 6,
      name: 'fromLevel',
      label: 'fromLevel',
      withAsterisk: false,
    });
    const toLevel = globalText({
      colSpan: 6,
      name: 'toLevel',
      label: 'toLevel',
      withAsterisk: false,
    });
    const stockpileItem = stockpileNameSelect({
      colSpan: 6,
      name: 'stockpileId',
      label: 'stockpileName',
      withAsterisk: false,
    });
    const domeItem = domeNameSelect({
      colSpan: 6,
      name: 'domeId',
      label: 'domeName',
      stockpileId: null,
      withAsterisk: false,
    });
    const bulkSamplingDensityItem = globalNumberInput({
      colSpan: 6,
      name: 'bulkSamplingDensity',
      label: 'bulkSamplingDensity',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('bulkSamplingDensity', value);
        setNewBulkSamplingDensity(`${value}`);
        methods.trigger('bulkSamplingDensity');
      },
    });
    const bucketVolumeItem = globalNumberInput({
      colSpan: 6,
      name: 'bucketVolume',
      label: 'bucketVolume',
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('bucketVolume', value);
        setNewBucketVolume(`${value}`);
        methods.trigger('bucketVolume');
      },
    });
    const tonByRitageItem = globalText({
      colSpan: 6,
      name: 'tonByRitage',
      label: 'tonByRitage',
      withAsterisk: false,
      disabled: true,
    });
    const sampleNumberItem = globalText({
      colSpan: 6,
      name: 'sampleNumber',
      label: 'sampleNumber',
      withAsterisk: false,
    });
    const desc = globalText({
      colSpan: 12,
      name: 'desc',
      label: 'desc',
      withAsterisk: false,
    });

    const photo: ControllerProps = {
      control: 'image-dropzone',
      name: 'photos',
      label: 'documentation',
      description: 'photoDescription5',
      maxSize: 10 * 1024 ** 2 /* 10MB */,
      multiple: true,
      maxFiles: 5,
      enableDeletePhoto: true,
      onDrop: (value) => {
        if (photos) {
          if (value.length + photos.length > 5) {
            methods.setError('photos', {
              type: 'manual',
              message: 'Jumlah foto melebihi batas maksimal',
            });
            return;
          }
          methods.setValue('photos', [...photos, ...value]);
          methods.clearErrors('photos');
          return;
        }
        methods.setValue('photos', value);
        methods.clearErrors('photos');
      },
      onReject: (files) =>
        handleRejectFile<IMutationRitageOre>({
          methods,
          files,
          field: 'photos',
        }),
    };

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.date'),
        formControllers: [date],
      },
      {
        group: t('commonTypography.checkerInformation'),
        enableGroupLabel: true,
        formControllers: [
          fromCheckerName,
          fromCheckerPosition,
          toCheckerName,
          toCheckerPosition,
          shiftItem,
          materialItem,
          materialSubItem,
          hullNumber,
          hullNumberSubstitution,
          weatherItem,
        ],
      },
      {
        group: t('commonTypography.ritageDuration'),
        enableGroupLabel: true,
        formControllers: [fromTime, arriveTime, ritageDurationItem],
      },
      {
        group: t('commonTypography.location'),
        enableGroupLabel: true,
        formControllers: [
          pitItem,
          frontItem,
          block,
          gridItem,
          sequenceItem,
          elevasiItem,
        ],
      },
      {
        group: t('commonTypography.level'),
        enableGroupLabel: true,
        formControllers: [fromLevel, toLevel],
      },
      {
        group: t('commonTypography.arrive'),
        enableGroupLabel: true,
        groupCheckbox: {
          onChange: () => {
            closeDome === true
              ? methods.setValue('closeDome', false)
              : methods.setValue('closeDome', true);
          },
          label: t('commonTypography.closeDome'),
        },
        formControllers: [stockpileItem, domeItem],
      },
      {
        group: t('commonTypography.detail'),
        enableGroupLabel: true,
        formControllers: [
          bulkSamplingDensityItem,
          bucketVolumeItem,
          tonByRitageItem,
          sampleNumberItem,
        ],
      },
      {
        group: t('commonTypography.desc'),
        formControllers: [desc],
      },
      {
        group: t('commonTypography.documentation'),
        formControllers: [photo],
      },
    ];

    isRitageProblematic ? field : field[1].formControllers.splice(8, 1);

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos, closeDome, isRitageProblematic]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationRitageOre> = (data) => {
    const values = objectToArrayValue(data);
    const dateValue = ['date'];
    const numberValue = ['bucketVolume', 'bulkSamplingDensity'];
    const manipulateValue = values.map((val) => {
      if (dateValue.includes(val.name)) {
        const date = dateToString(val.value);
        return {
          name: val.name,
          value: date,
        };
      }
      if (numberValue.includes(val.name)) {
        return {
          name: val.name,
          value: `${val.value}`,
        };
      }
      return {
        name: val.name,
        value: val.value,
      };
    });
    mutate({
      data: manipulateValue,
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        switchProps={{
          label: 'problemRitage',
          switchItem: {
            checked: isRitageProblematic,
            onChange: (value) =>
              methods.setValue(
                'isRitageProblematic',
                value.currentTarget.checked
              ),
          },
        }}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
        }}
        backButton={{
          onClick: () =>
            router.push('/input-data/production/data-ritage?tabs=ore'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateRitageOreBook;
