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
import {
  divisionSelectRhf,
  globalDate,
  positionSelectRhf,
} from '@/utils/constants/Field/global-field';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateCompanyPositionHistoryBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const employeId = router.query?.id?.[1] as string;
  const [isStill, setIsStill] = React.useState<boolean>(false);
  const methods = useForm<
    Pick<IUpdateEmployeePositionsRequest, 'positionHistories'>
  >({
    defaultValues: {
      positionHistories: [
        {
          positionId: '',
          divisionId: '',
          startDate: null,
          endDate: null,
        },
      ],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'positionHistories',
    control: methods.control,
  });

  const [executeUpdate, { loading }] = useUpdateCompanyPositionHistory({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('company.successCreatePositionHistoryMessage'),
        icon: <IconCheck />,
      });
      const companyId = router.query?.id?.[0];
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

  const fieldEmployeData = React.useMemo(() => {
    const arrayField = fields.map((field, index) => {
      const positionItem = positionSelectRhf({
        name: `positionHistories.${index}.positionId`,
        colSpan: 6,
        dropdownPosition: 'bottom',
      });
      const divisionItem = divisionSelectRhf({
        name: `positionHistories.${index}.divisionId`,
        colSpan: 6,
        dropdownPosition: 'bottom',
      });
      const startDateItem = globalDate({
        name: `positionHistories.${index}.startDate`,
        label: 'dateOfOffice',
        colSpan: 6,
      });
      const endDateItem = globalDate({
        name: `positionHistories.${index}.endDate`,
        label: 'dateComplateOffice',
        withAsterisk: false,
        colSpan: 6,
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
            setIsStill((prev) => !prev);
          },
          label: t('commonTypography.isStillOffice'),
        },
        formControllers: [
          positionItem,
          divisionItem,
          startDateItem,
          endDateItem,
        ],
      };
      return group;
    });

    return arrayField;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, isStill]);

  const handleSubmitForm: SubmitHandler<
    Pick<IUpdateEmployeePositionsRequest, 'positionHistories'>
  > = async (data) => {
    const positionHistory = data.positionHistories.map((val) => {
      const data = {
        positionId: val.positionId,
        divisionId: val.divisionId,
        startDate: val.startDate ?? '',
        isStill: isStill,
        endDate: val.endDate ?? '',
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
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={fieldEmployeData}
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
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default CreateCompanyPositionHistoryBook;
