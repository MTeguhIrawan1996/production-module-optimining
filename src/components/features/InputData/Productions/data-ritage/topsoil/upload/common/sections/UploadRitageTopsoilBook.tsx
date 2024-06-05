import { Progress, Transition } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneUploadFileTRK } from '@/services/graphql/query/file/useReadOneUploadFile';
import { useUploadFileRitageTopsoil } from '@/services/restapi/ritage-productions/topsoil/useUploadFileRitageTopsoil';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import {
  ControllerGroup,
  ControllerProps,
  ICreateFileProps,
} from '@/types/global';

const UploadRitageTopsoilBook = () => {
  const { t } = useTranslation('default');
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
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

  const { mutate, isLoading } = useUploadFileRitageTopsoil({
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
      sendGAEvent({
        event: 'Tambah',
        params: {
          category: 'Produksi',
          subSubCategory: 'Produksi - Data Ritase - Topsoil - Simpan Unggah',
          subCategory: 'Produksi - Data Ritase - Topsoil',
          account: userAuthData?.email ?? '',
        },
      });
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
      label: 'uploadDataRitage',
      description: 'uploadExcelDescription',
      maxSize: 100 * 1024 ** 2 /* 20MB */,
      multiple: false,
      faildData: dataFiald,
      disabled: disabled,
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
          label: t('ritageTopsoil.downloadTemplateTopsoil'),
          url: `/topsoil-ritages/file`,
          fileName: 'template-topsoil',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Topsoil - Template Input',
                subCategory: 'Produksi - Data Ritase - Topsoil',
                account: userAuthData?.email ?? '',
              },
            });
          },
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `/download/references`,
          fileName: 'referensi-topsoil',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Topsoil - Template Referensi',
                subCategory: 'Produksi - Data Ritase - Topsoil',
                account: userAuthData?.email ?? '',
              },
            });
          },
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
            router.push('/input-data/production/data-ritage?tabs=topsoil'),
        }}
      />
    </DashboardCard>
  );
};

export default UploadRitageTopsoilBook;
