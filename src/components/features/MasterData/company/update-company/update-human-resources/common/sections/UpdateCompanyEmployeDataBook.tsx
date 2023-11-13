import { zodResolver } from '@hookform/resolvers/zod';
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
import { useReadOneEmployee } from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import {
  employeStatusSelect,
  globalDate,
  nip,
} from '@/utils/constants/Field/global-field';
import { createCompanyEmployeSchema } from '@/utils/form-validation/company/company-employe-validation';
import { stringToDate } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { ControllerGroup } from '@/types/global';

const UpdateCompanyEmployeDataBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const employeId = router.query?.id?.[1] as string;
  const companyId = router.query?.id?.[0] as string;

  const methods = useForm<Omit<IUpdateEmployeeDataRequest, 'id'>>({
    resolver: zodResolver(createCompanyEmployeSchema),
    defaultValues: {
      nip: '',
      statusId: '',
      entryDate: undefined,
      isStillWorking: false,
      quitDate: undefined,
    },
    mode: 'onBlur',
  });
  const isStillWorking = methods.watch('isStillWorking');

  const { employeeDataLoading } = useReadOneEmployee({
    variables: {
      id: employeId ?? '',
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      const entryDate = stringToDate(data.employee.entryDate ?? null);
      const quitDate = stringToDate(data.employee.quitDate ?? null);

      methods.setValue('nip', data.employee.nip ?? '');
      methods.setValue('statusId', data.employee.status?.id ?? '');
      methods.setValue('entryDate', entryDate);
      methods.setValue('quitDate', quitDate);
      methods.setValue('isStillWorking', data.employee.isStillWorking ?? false);
    },
  });

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
        message: t('company.successUpdateEmployeDataMessage'),
        icon: <IconCheck />,
      });
      const url = `/master-data/company/update/human-resources/${companyId}/${employeId}/?tabs=position-history`;
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
      withAsterisk: false,
      clearable: true,
    });
    const quitDateItem = globalDate({
      name: 'quitDate',
      label: 'quitDate',
      disabled: isStillWorking,
      withAsterisk: false,
      clearable: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.employeDetail'),
        enableGroupLabel: true,
        groupCheckbox: {
          onChange: () => {
            isStillWorking === true
              ? methods.setValue('isStillWorking', false)
              : methods.setValue('isStillWorking', true);
            methods.setValue('quitDate', null);
          },
          checked: isStillWorking,
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
    <DashboardCard p={0} isLoading={employeeDataLoading}>
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

export default UpdateCompanyEmployeDataBook;
