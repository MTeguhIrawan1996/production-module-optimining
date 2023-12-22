// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/router';
// import * as React from 'react';
// import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
// import { useTranslation } from 'react-i18next';

// import { DashboardCard, SteperFormGroup } from '@/components/elements';

// import { useReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';
// import {
//   IMutationStockpile,
//   IMutationStockpileStepOne,
// } from '@/services/restapi/stockpile-monitoring/useCreateStockpileMonitoring';
// import {
//   globalDate,
//   globalText,
//   globalTimeInput,
//   materialSelect,
// } from '@/utils/constants/Field/global-field';
// import { sampleTypeSelect } from '@/utils/constants/Field/sample-house-field';
// import {
//   domeNameSelect,
//   stockpileNameSelect,
// } from '@/utils/constants/Field/stockpile-field';
// import { stockpileMonitoringMutationValidation } from '@/utils/form-validation/stockpile-monitoring/stockpile-monitoring-validation';
// import { handleRejectFile } from '@/utils/helper/handleRejectFile';

// import { ControllerGroup, ControllerProps } from '@/types/global';

// type fieldName = keyof IMutationStockpileStepOne;

// const CreateStockpileBook = () => {
//   const { t } = useTranslation('default');
//   const router = useRouter();
//   const [active, setActive] = React.useState(0);

//   /* #   /**=========== Methods =========== */
//   const methods = useForm<IMutationStockpile>({
//     resolver: zodResolver(stockpileMonitoringMutationValidation),
//     defaultValues: {
//       stockpileId: '',
//       domeId: '',
//       handbookId: '',
//       oreSubMaterialId: '',
//       openDate: undefined,
//       openTime: '',
//       closeDate: undefined,
//       closeTime: '',
//       // tonSurveys: [
//       //   {
//       //     date: '',
//       //     ton: '',
//       //   },
//       // ],
//       // bargingStartDate: undefined,
//       // bargingStartTime: '',
//       // bargingFinishDate: undefined,
//       // bargingFinishTime: '',
//       // movings: [
//       //   {
//       //     startDate: undefined,
//       //     startTime: '',
//       //     finishDate: undefined,
//       //     finishTime: '',
//       //   },
//       // ],
//       // reopens: [
//       //   {
//       //     openDate: undefined,
//       //     openTime: '',
//       //     closeDate: undefined,
//       //     closeTime: '',
//       //   },
//       // ],
//       desc: '',
//       samples: [
//         {
//           date: undefined,
//           sampleTypeId: '',
//           sampleNumber: '',
//           elements: [
//             {
//               elementId: '',
//               value: '',
//             },
//           ],
//         },
//       ],
//       photo: [],
//     },
//     mode: 'onBlur',
//   });
//   const domeId = methods.watch('domeId');
//   // eslint-disable-next-line unused-imports/no-unused-vars
//   const { fields: sampleFields } = useFieldArray({
//     name: 'samples',
//     control: methods.control,
//   });
//   /* #endregion  /**======== Methods =========== */

//   /* #   /**=========== Query =========== */
//   useReadOneStockpileDomeMaster({
//     variables: {
//       id: domeId as string,
//     },
//     skip: domeId === '' || !domeId,
//     onCompleted: (data) => {
//       methods.setValue('handbookId', data.dome.handBookId);
//     },
//   });
//   /* #endregion  /**======== Query =========== */

//   /* #   /**=========== Field =========== */
//   const fieldItemStepOne = React.useMemo(() => {
//     const stockpileNameItem = stockpileNameSelect({
//       colSpan: 6,
//       onChange: (value) => {
//         methods.setValue('stockpileId', value ?? '');
//         methods.setValue('domeId', '');
//         methods.setValue('handbookId', '');
//       },
//     });
//     const domeNameItem = domeNameSelect({
//       colSpan: 6,
//       onChange: (value) => {
//         methods.setValue('domeId', value ?? '');
//         methods.setValue('handbookId', '');
//       },
//     });
//     const domeIdItem = globalText({
//       name: 'handbookId',
//       label: 'domeId',
//       colSpan: 6,
//       disabled: true,
//       withAsterisk: false,
//     });
//     const materialSubItem = materialSelect({
//       colSpan: 6,
//       name: 'oreSubMaterialId',
//       label: 'materialType',
//       withAsterisk: true,
//       parentId: `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`,
//       isHaveParent: null,
//     });
//     const openDateItem = globalDate({
//       name: 'openDate',
//       label: 'startOpen',
//       withAsterisk: true,
//       clearable: true,
//       colSpan: 6,
//     });
//     const closeDateItem = globalDate({
//       name: 'closeDate',
//       label: 'endOpen',
//       withAsterisk: true,
//       clearable: true,
//       colSpan: 6,
//     });
//     const openTimeItem = globalTimeInput({
//       name: 'openTime',
//       label: 'openTime',
//       withAsterisk: false,
//       colSpan: 6,
//       onChange: (e) => {
//         methods.setValue('openTime', e.currentTarget.value);
//         methods.trigger('openTime');
//       },
//     });
//     const closeTimeItem = globalTimeInput({
//       name: 'closeTime',
//       label: 'closeTime',
//       withAsterisk: false,
//       colSpan: 6,
//       onChange: (e) => {
//         methods.setValue('closeTime', e.currentTarget.value);
//         methods.trigger('closeTime');
//       },
//     });
//     const desc = globalText({
//       colSpan: 12,
//       name: 'desc',
//       label: 'desc',
//       withAsterisk: false,
//     });
//     const photo: ControllerProps = {
//       control: 'image-dropzone',
//       name: 'photo',
//       label: 'photo',
//       description: 'photoDescription',
//       maxSize: 10 * 1024 ** 2 /* 10MB */,
//       multiple: false,
//       enableDeletePhoto: true,
//       onDrop: (value) => {
//         methods.setValue('photo', value);
//         methods.clearErrors('photo');
//       },
//       onReject: (files) =>
//         handleRejectFile<IMutationStockpile>({
//           methods,
//           files,
//           field: 'photo',
//         }),
//     };

//     const field: ControllerGroup[] = [
//       {
//         group: t('commonTypography.stockpileInformation'),
//         enableGroupLabel: true,
//         formControllers: [
//           stockpileNameItem,
//           domeNameItem,
//           domeIdItem,
//           materialSubItem,
//         ],
//       },
//       {
//         group: t('commonTypography.time'),
//         enableGroupLabel: true,
//         formControllers: [
//           openDateItem,
//           closeDateItem,
//           openTimeItem,
//           closeTimeItem,
//         ],
//       },
//       {
//         group: t('commonTypography.desc'),
//         formControllers: [desc],
//       },
//       {
//         group: t('commonTypography.documentation'),
//         formControllers: [photo],
//       },
//     ];

//     return field;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fieldItemStepTwo = React.useMemo(() => {
//     const date = globalDate({
//       name: 'date',
//       label: 'sampleDate2',
//       withAsterisk: false,
//       clearable: true,
//       colSpan: 12,
//     });
//     const sampleTypesItem = sampleTypeSelect({
//       colSpan: 6,
//       withAsterisk: false,
//       label: 'sampleType2',
//     });
//     const field: ControllerGroup[] = [
//       {
//         group: t('commonTypography.sampleInformation'),
//         enableGroupLabel: true,
//         formControllers: [date, sampleTypesItem],
//       },
//     ];

//     return field;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* #endregion  /**======== Field =========== */

//   /* #   /**=========== HandleSubmitFc =========== */

//   const nextStep = async () => {
//     const fieldStepOneName: fieldName[] = [
//       'closeDate',
//       'closeTime',
//       'domeId',
//       'handbookId',
//       'desc',
//       'openDate',
//       'openTime',
//       'oreSubMaterialId',
//       'photo',
//       'stockpileId',
//     ];
//     const output = await methods.trigger(fieldStepOneName, {
//       shouldFocus: true,
//     });

//     if (!output) return;
//     setActive((current) => (current < 2 ? current + 1 : current));
//   };

//   const prevStep = () =>
//     setActive((current) => (current > 0 ? current - 1 : current));

//   // eslint-disable-next-line unused-imports/no-unused-vars
//   const handleSubmitForm: SubmitHandler<IMutationStockpile> = async (data) => {
//     // await executeCreate({
//     //   variables: {
//     //     name: data.name,
//     //     startHour: data.startHour,
//     //     endHour: data.endHour,
//     //   },
//     // });
//   };

//   /* #endregion  /**======== HandleSubmitFc =========== */

//   return (
//     <DashboardCard p={0}>
//       <SteperFormGroup
//         active={active}
//         setActive={setActive}
//         steps={[
//           {
//             name: 'Input Data Stockpile',
//             fields: fieldItemStepOne,
//             nextButton: { onClick: nextStep },
//             backButton: {
//               onClick: () => router.back(),
//             },
//           },
//           {
//             name: 'Input Data Sample',
//             fields: fieldItemStepTwo,
//             prevButton: {
//               onClick: prevStep,
//             },
//             submitButton: {
//               label: t('commonTypography.save'),
//               // loading: isLoading,
//             },
//             // nextButton: { onClick: () => console.log('next') },
//             // backButton: {
//             //   label: t('commonTypography.prev'),
//             //   onClick: () => console.log('prev'),
//             // },
//           },
//         ]}
//         methods={methods}
//         submitForm={handleSubmitForm}
//       />
//     </DashboardCard>
//   );
// };

// export default CreateStockpileBook;
