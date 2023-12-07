import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationRitageOre,
  useCreateRitageOre,
} from '@/services/restapi/ritage-productions/useCreateRitageOre';
import { dateToString } from '@/utils/helper/dateToString';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import { ControllerGroup, ControllerProps } from '@/types/global';

const UploadRitageOreBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<any>({
    // resolver: zodResolver(ritageOreMutationValidation),
    defaultValues: {
      excel: [],
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

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
          message: err.response.data.message,
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
    const excelFile: ControllerProps = {
      control: 'excel-dropzone',
      name: 'excel',
      label: 'uploadDataRitage',
      description: 'uploadExcelDescription',
      maxSize: 20 * 1024 ** 2 /* 10MB */,
      multiple: false,
      onDrop: (value) => {
        methods.setValue('excel', value);
        methods.clearErrors('excel');
      },
      onReject: (files) =>
        handleRejectFile<any>({
          methods,
          files,
          field: 'excel',
        }),
    };

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.documentation'),
        formControllers: [excelFile],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    <DashboardCard
      p={0}
      childrenStackProps={{
        spacing: 0,
      }}
      downloadButton={[
        {
          label: t('ritageOre.downloadTemplateOre'),
          url: `/ore-ritages/file`,
          fileName: 'template-ore',
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `/download/references`,
          fileName: 'referensi-ore',
        },
      ]}
    >
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
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

export default UploadRitageOreBook;
