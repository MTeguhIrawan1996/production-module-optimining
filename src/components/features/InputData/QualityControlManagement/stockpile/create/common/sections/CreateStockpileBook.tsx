import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, SteperFormGroup } from '@/components/elements';

import { useReadOneLocationMaster } from '@/services/graphql/query/location/useReadOneLocationMaster';
import { IMutationStockpile } from '@/services/restapi/stockpile-monitoring/useCreateStockpileMonitoring';
import { globalText } from '@/utils/constants/Field/global-field';
import {
  domeNameSelect,
  stockpileNameSelect,
} from '@/utils/constants/Field/stockpile-field';

import { ControllerGroup } from '@/types/global';

const CreateStockpileBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationStockpile>({
    // resolver: zodResolver(shiftMutationValidation),
    defaultValues: {
      stockpileId: '',
      domeId: '',
      handbookId: '',
      oreSubMaterialId: '',
      openDate: undefined,
      openTime: '',
      closeDate: undefined,
      closeTime: '',
      tonSurveys: [
        {
          date: '',
          ton: '',
        },
      ],
      bargingStartDate: undefined,
      bargingStartTime: '',
      bargingFinishDate: undefined,
      bargingFinishTime: '',
      movings: [
        {
          startDate: undefined,
          startTime: '',
          finishDate: undefined,
          finishTime: '',
        },
      ],
      reopens: [
        {
          openDate: undefined,
          openTime: '',
          closeDate: undefined,
          closeTime: '',
        },
      ],
      desc: '',
      samples: [
        {
          date: undefined,
          sampleTypeId: '',
          sampleNumber: '',
          elementId: '',
          value: '',
        },
      ],
      photo: [],
    },
    mode: 'onBlur',
  });

  const domeId = methods.watch('domeId');
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  useReadOneLocationMaster({
    variables: {
      id: domeId,
    },
    skip: domeId === '',
    onCompleted: (data) => {
      methods.setValue('handbookId', data.location.handBookId);
    },
  });
  // const [executeCreate, { loading }] = useCreateShiftMaster({
  //   onCompleted: () => {
  //     notifications.show({
  //       color: 'green',
  //       title: 'Selamat',
  //       message: t('shift.successCreateMessage'),
  //       icon: <IconCheck />,
  //     });

  //     methods.reset();
  //     router.push('/master-data/shift');
  //   },
  //   onError: (error) => {
  //     if (error.graphQLErrors) {
  //       const errorArry = errorBadRequestField<IMutationStockpile>(error);
  //       if (errorArry.length) {
  //         errorArry.forEach(({ name, type, message }) => {
  //           methods.setError(name, { type, message });
  //         });
  //         return;
  //       }
  //       notifications.show({
  //         color: 'red',
  //         title: 'Gagal',
  //         message: error.message,
  //         icon: <IconX />,
  //       });
  //     }
  //   },
  // });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldItem = React.useMemo(() => {
    const stockpileNameItem = stockpileNameSelect({
      colSpan: 6,
    });
    const domeNameItem = domeNameSelect({
      colSpan: 6,
      onChange: (value) => {
        methods.setValue('domeId', value ?? '');
        methods.setValue('handbookId', '');
      },
    });
    const domeIdItem = globalText({
      name: 'handbookId',
      label: 'domeId',
      colSpan: 6,
      disabled: true,
      withAsterisk: false,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.stockpileInformation'),
        enableGroupLabel: true,
        formControllers: [stockpileNameItem, domeNameItem, domeIdItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSubmitForm: SubmitHandler<IMutationStockpile> = async (data) => {
    // await executeCreate({
    //   variables: {
    //     name: data.name,
    //     startHour: data.startHour,
    //     endHour: data.endHour,
    //   },
    // });
  };

  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <SteperFormGroup
        steps={[
          {
            name: 'Input Data Stockpile',
            fields: fieldItem,
            // nextButton: { onClick: () => console.log('next') },
            backButton: {
              onClick: () => router.back(),
            },
          },
          {
            name: 'Input Data Sample',
            fields: fieldItem,
            // nextButton: { onClick: () => console.log('next') },
            // backButton: {
            //   label: t('commonTypography.prev'),
            //   onClick: () => console.log('prev'),
            // },
          },
        ]}
        methods={methods}
        submitForm={handleSubmitForm}
      />
    </DashboardCard>
  );
};

export default CreateStockpileBook;
