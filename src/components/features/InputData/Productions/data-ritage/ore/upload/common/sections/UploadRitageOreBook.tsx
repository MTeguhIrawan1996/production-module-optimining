import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { useReadOneUploadFileTRK } from '@/services/graphql/query/file/useReadOneUploadFile';
import { useUploadFileRitageOre } from '@/services/restapi/ritage-productions/useUploadFileRitageOre';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';

import {
  ControllerGroup,
  ControllerProps,
  ICreateFileProps,
} from '@/types/global';

const UploadRitageOreBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [isDirtyFile, setIsDirtyFile] = React.useState<boolean>(false);
  const [fileId, setFileId] = React.useState<string | null>(null);

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
  });

  const { mutate, isLoading } = useUploadFileRitageOre({
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
    onSuccess: (data) => {
      setFileId(data.data.id);
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
      maxSize: 20 * 1024 ** 2 /* 10MB */,
      multiple: false,
      dataFaild: data?.uploadFileData.failedData,
      onDrop: (value) => {
        methods.setValue('file', value);
        setIsDirtyFile(true);
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
  }, [data]);
  /* #endregion  /**======== Field =========== */

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
          disabled: !isDirtyFile,
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
