import { Progress, Transition } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneUploadFileTRK } from '@/services/graphql/query/file/useReadOneUploadFile';
import { useUploadFileHeavyEquipmentProduction } from '@/services/restapi/heavy-equipment-production/useUploadFileHeavyEquipmentProduction';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import {
  ControllerGroup,
  ControllerProps,
  ICreateFileProps,
} from '@/types/global';

const UploadHeavyEquipmentProductionBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [isDirtyFile, setIsDirtyFile] = React.useState<boolean>(false);
  const [fileId, setFileId] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [dataFiald, setfaildData] = React.useState<unknown[]>([]);

  /* #   /**=========== Methods =========== */
  const methods = useForm<ICreateFileProps>({
    defaultValues: {
      file: [],
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const { data } = useReadOneUploadFileTRK({
    variable: {
      id: fileId as string,
    },
    onSuccess: (data) => {
      if (data.processed === data.total) {
        setfaildData(data.failedData);
        setIsDirtyFile(false);
        setDisabled((prev) => !prev);
      }
    },
  });

  const { mutate, isLoading } = useUploadFileHeavyEquipmentProduction({
    onError: (err) => {
      setDisabled((prev) => !prev);
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
    onSuccess: (data) => {
      setFileId(data.data.id);
      setMounted(true);
      setDisabled((prev) => !prev);
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: data.message,
        icon: <IconCheck />,
      });
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldRhf = React.useMemo(() => {
    const excelFile: ControllerProps = {
      control: 'excel-dropzone',
      name: 'file',
      label: 'uploadData',
      description: 'uploadExcelDescription',
      maxSize: 100 * 1024 ** 2 /* 10MB */,
      multiple: false,
      faildData: dataFiald,
      disabled: disabled,
      usedWhere: 'heavy-equipment-prod',
      onDrop: (value) => {
        methods.setValue('file', value);
        setIsDirtyFile(true);
        setfaildData([]);
        setMounted(false);
        methods.clearErrors('file');
      },
      onReject: (files) =>
        handleRejectFile<ICreateFileProps>({
          methods,
          files,
          field: 'file',
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
  }, [disabled, dataFiald]);
  /* #endregion  /**======== Field =========== */

  const renderProgress = React.useMemo(() => {
    if (data) {
      const total = data.total ?? 0;
      const process = data.processed ?? 0;
      const percentage = (process / total) * 100;
      const mathPercentage = Math.round(percentage);
      return (
        <Transition
          mounted={mounted}
          transition="slide-left"
          duration={300}
          timingFunction="ease"
        >
          {(styles) => (
            <Progress
              style={styles}
              sections={[
                {
                  value: mathPercentage,
                  color: 'brand.6',
                  className: mathPercentage === 100 ? '' : 'animated-pulse',
                  label: `${mathPercentage}% Completed`,
                },
              ]}
              size="xl"
              radius="xl"
              mt="md"
            />
          )}
        </Transition>
      );
    }
  }, [data, mounted]);

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<ICreateFileProps> = (data) => {
    const values = objectToArrayValue(data);
    const utcOffset = dayjs().utcOffset() / 60;

    mutate({
      data: values,
      utcOffset: `${utcOffset}`,
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
          label: t('heavyEquipmentProd.downloadTemplate'),
          url: `/heavy-equipment-datas/file`,
          fileName: `template`,
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `/download/references`,
          fileName: `referensi`,
        },
      ]}
    >
      {renderProgress}
      <GlobalFormGroup
        field={fieldRhf}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: isLoading,
          disabled: disabled || !isDirtyFile,
        }}
        backButton={{
          disabled: disabled,
          onClick: () =>
            router.push('/input-data/production/data-heavy-equipment'),
        }}
      />
    </DashboardCard>
  );
};

export default UploadHeavyEquipmentProductionBook;
