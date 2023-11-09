import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IUpdateEmployeeDataRequest,
  useUpdateCompanyEmployeeData,
} from '@/services/graphql/mutation/master-data-company/useUpdateCompanyEmployeData';
import { useReadAllEmployeStatus } from '@/services/graphql/query/global-select/useReadAllEmployeStatus';
import {
  employeStatusSelect,
  globalDate,
  nip,
} from '@/utils/constants/Field/global-field';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { ControllerGroup } from '@/types/global';

const CreateCompanyEmployeDataBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const employeId = router.query?.id?.[1] as string;

  const methods = useForm<Omit<IUpdateEmployeeDataRequest, 'id'>>({
    // resolver: zodResolver(createHumanResourcesSchema),
    defaultValues: {
      // id: {{employee_id}},
      nip: '',
      statusId: '',
      entryDate: undefined,
      isStillWorking: false,
      quitDate: undefined,
    },
    mode: 'onBlur',
  });

  const isStillWorking = methods.watch('isStillWorking');

  const { employeeStatusesData } = useReadAllEmployeStatus({
    variables: {
      limit: null,
    },
  });
  const { uncombinedItem: employeStatusFilter } = useFilterItems({
    data: employeeStatusesData ?? [],
  });

  const [executeUpdate, { loading }] = useUpdateCompanyEmployeeData({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('company.successCreateEmployeDataMessage'),
        icon: <IconCheck />,
      });
      const companyId = router.query?.id?.[0];
      const url = `/master-data/company/create/human-resources/${companyId}/${employeId}/?tabs=position-history`;
      router.push(url, undefined, { shallow: true });
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<Omit<IUpdateEmployeeDataRequest, 'id'>>(error);
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

  const fieldEmployeData = React.useMemo(() => {
    const employeStatusItem = employeStatusSelect({
      data: employeStatusFilter,
      placeholder: 'chooseEmployeStatus',
      colSpan: 6,
    });
    const entryDateItem = globalDate({
      name: 'entryDate',
      label: 'entryDate',
    });
    const quitDateItem = globalDate({
      name: 'quitDate',
      label: 'quitDate',
      disabled: isStillWorking,
      withAsterisk: false,
    });
    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.employeDetail'),
        enableGroupLabel: true,
        groupCheckbox: {
          onChange: () => {
            methods.setValue('isStillWorking', !isStillWorking);
          },
          label: t('commonTypography.isStillWorking'),
        },
        formControllers: [nip, employeStatusItem, entryDateItem, quitDateItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeStatusFilter, isStillWorking]);

  const handleSubmitForm: SubmitHandler<
    Omit<IUpdateEmployeeDataRequest, 'id'>
  > = async (data) => {
    await executeUpdate({
      variables: { ...data, id: employeId },
    });
  };
  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldEmployeData}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default CreateCompanyEmployeDataBook;
