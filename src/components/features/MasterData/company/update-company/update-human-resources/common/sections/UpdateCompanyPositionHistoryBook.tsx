import { zodResolver } from '@hookform/resolvers/zod';
import { Paper } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IUpdateEmployeePositionsRequest,
  useUpdateCompanyPositionHistory,
} from '@/services/graphql/mutation/master-data-company/useUpdateCompanyPositionHistory';
import { useReadOneEmployee } from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import {
  divisionSelectRhf,
  globalDate,
  positionSelectRhf,
} from '@/utils/constants/Field/global-field';
import { createCompanyPositionHistroySchema } from '@/utils/form-validation/company/company-employe-validation';
import { dateToString, stringToDate } from '@/utils/helper/dateToString';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateCompanyPositionHistoryBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const employeId = router.query?.id?.[1] as string;
  const companyId = router.query?.id?.[0] as string;
  const methods = useForm<
    Pick<IUpdateEmployeePositionsRequest, 'positionHistories'>
  >({
    resolver: zodResolver(createCompanyPositionHistroySchema),
    defaultValues: {
      positionHistories: [
        {
          positionId: '',
          divisionId: '',
          isStill: false,
          startDate: undefined,
          endDate: undefined,
        },
      ],
    },
    mode: 'onSubmit',
  });

  const { fields, append, remove, update } = useFieldArray({
    name: 'positionHistories',
    control: methods.control,
  });
  const positionHistories = methods.watch('positionHistories');

  const { employeeDataLoading } = useReadOneEmployee({
    variables: {
      id: employeId,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      if (data && data.employee.positionHistories.length > 0) {
        data.employee.positionHistories.map((val, index) => {
          const startDate = stringToDate(val.startDate ?? null);
          const endDate = stringToDate(val.endDate ?? null);
          const value = {
            positionId: val.position.id,
            divisionId: val.division.id,
            isStill: val.isStill,
            startDate: startDate,
            endDate: endDate,
          };
          update(index, value);
        });
      }
    },
  });

  const [executeUpdate, { loading }] = useUpdateCompanyPositionHistory({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('company.successUpdatePositionHistoryMessage'),
        icon: <IconCheck />,
      });

      const url = `/master-data/company/read/${companyId}`;
      router.push(url, undefined, { shallow: true });
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<
            Pick<IUpdateEmployeePositionsRequest, 'positionHistories'>
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

  const arrayField = fields.map((val, index) => {
    const positionItem = positionSelectRhf({
      name: `positionHistories.${index}.positionId`,
      colSpan: 6,
      dropdownPosition: 'bottom',
      withAsterisk: true,
      key: `positionHistories.${index}.positionId.${val.id}`,
    });
    const divisionItem = divisionSelectRhf({
      name: `positionHistories.${index}.divisionId`,
      colSpan: 6,
      dropdownPosition: 'bottom',
      withAsterisk: true,
      key: `positionHistories.${index}.divisionId.${val.id}`,
    });
    const startDateItem = globalDate({
      name: `positionHistories.${index}.startDate`,
      label: 'dateOfOffice',
      colSpan: 6,
      key: `positionHistories.${index}.startDate.${val.id}`,
    });
    const endDateItem = globalDate({
      name: `positionHistories.${index}.endDate`,
      label: 'dateComplateOffice',
      withAsterisk: false,
      colSpan: 6,
      disabled: positionHistories[index].isStill,
      key: `positionHistories.${index}.endDate.${val.id}`,
    });
    const group: ControllerGroup = {
      group: t('commonTypography.positionDetail'),
      enableGroupLabel: true,
      actionGroup: {
        deleteButton: {
          label: t('commonTypography.delete'),
          onClick: () => {
            fields.length > 1 ? remove(index) : null;
          },
        },
      },
      groupCheckbox: {
        onChange: () => {
          positionHistories[index].isStill === true
            ? methods.setValue(`positionHistories.${index}.isStill`, false)
            : methods.setValue(`positionHistories.${index}.isStill`, true);
          methods.setValue(`positionHistories.${index}.endDate`, null);
        },
        checked: methods.watch(`positionHistories.${index}.isStill`),
        label: t('commonTypography.isStillOffice'),
      },
      formControllers: [positionItem, divisionItem, startDateItem, endDateItem],
    };
    return group;
  });

  const handleSubmitForm: SubmitHandler<
    Pick<IUpdateEmployeePositionsRequest, 'positionHistories'>
  > = async (data) => {
    const positionHistory = data.positionHistories.map((val) => {
      const data = {
        positionId: val.positionId,
        divisionId: val.divisionId,
        startDate: dateToString(val.startDate ?? null),
        isStill: val.isStill,
        endDate: dateToString(val.endDate ?? null),
      };
      return data;
    });

    await executeUpdate({
      variables: {
        id: employeId,
        positionHistories: positionHistory,
      },
    });
  };

  return (
    <DashboardCard p={0} isLoading={employeeDataLoading}>
      {!employeeDataLoading ? (
        <GlobalFormGroup
          field={arrayField}
          methods={methods}
          submitForm={handleSubmitForm}
          submitButton={{
            label: t('commonTypography.save'),
            loading: loading,
          }}
          outerButton={{
            label: t('commonTypography.createHistory'),
            onClick: () =>
              append({
                positionId: '',
                divisionId: '',
                startDate: undefined,
                isStill: false,
                endDate: undefined,
              }),
          }}
          backButton={{
            onClick: () =>
              router.push(`/master-data/company/read/${companyId}`),
          }}
        />
      ) : (
        <Paper h={400} w="100%" mt="md" />
      )}
    </DashboardCard>
  );
};

export default UpdateCompanyPositionHistoryBook;
