import {
  Grid,
  Group,
  Modal,
  rem,
  Stack,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Text } from '@mantine/core';
import { IconDownload, IconX } from '@tabler/icons-react';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FormController from '@/components/elements/form/FormController';
import GlobalModal from '@/components/elements/modal/GlobalModal';

import { ControllerProps } from '@/types/global';

export type IDownloadFields = {
  otherElement?: () => React.ReactNode;
  element: ControllerProps;
};

export type IDownloadDataButtonProps = {
  methods: UseFormReturn<any>;
  fields: IDownloadFields[];
  isDibaledDownload?: boolean;
  period?: string;
  isOpenModal?: boolean;
  isLoadingSubmit?: boolean;
  handleSetDefaultValue?: () => void;
  submitForm: SubmitHandler<any>;
  setIsOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
  // trackDownloadAction?: () => void;
} & IPrimaryButtonProps;

const PrimaryDownloadDataButton: React.FC<IDownloadDataButtonProps> = ({
  methods,
  submitForm,
  handleSetDefaultValue,
  fields,
  isDibaledDownload,
  period,
  setIsOpenModal,
  isLoadingSubmit,
  isOpenModal,
  ...rest
}) => {
  const [isOpenAlert, setIsOpenAlert] = React.useState<boolean>(false);

  const handleOpenModal = () => {
    if (period !== 'YEAR') {
      handleSetDefaultValue?.();
      setIsOpenModal?.((prev) => !prev);
      return;
    }
    setIsOpenAlert((prev) => !prev);
  };
  const handleCloseModal = () => {
    setIsOpenModal?.((prev) => !prev);
    methods.reset();
  };

  const handleConfirmation = () => {
    methods.handleSubmit(submitForm)();
  };

  return (
    <>
      <PrimaryButton
        variant="outline"
        leftIcon={<IconDownload size="20px" />}
        fw={500}
        onClick={handleOpenModal}
        {...rest}
      />
      <GlobalModal
        actionModal={handleCloseModal}
        isOpenModal={isOpenModal || false}
        label="Download"
        modalSize="lg"
        centered
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <Grid gutter="xs">
              {fields.map(({ element, otherElement }, index) => {
                const { key, name, colSpan, ...rest } = element;
                return (
                  <React.Fragment key={key ? key : `${index}.`}>
                    <Grid.Col span={colSpan}>
                      <FormController name={name} {...rest} />
                    </Grid.Col>
                    {otherElement ? (
                      <Grid.Col span={12} py={0}>
                        {otherElement()}
                      </Grid.Col>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </Grid>
            <Group mt="sm" spacing="xs" position="right">
              <PrimaryButton
                label="Batalkan"
                variant="outline"
                color="gray.6"
                fw={600}
                onClick={handleCloseModal}
              />
              <PrimaryButton
                label="Unduh"
                type="button"
                loading={isLoadingSubmit}
                onClick={handleConfirmation}
                disabled={isDibaledDownload}
              />
            </Group>
          </form>
        </FormProvider>
      </GlobalModal>
      <Modal
        onClose={() => setIsOpenAlert((prev) => !prev)}
        withCloseButton={false}
        opened={isOpenAlert}
        size="auto"
        centered
        styles={{
          body: {
            padding: 8,
          },
        }}
      >
        <Stack
          justify="center"
          align="center"
          spacing="xs"
          py="sm"
          px="xs"
          w={400}
        >
          <Stack align="center" spacing="xs">
            <ThemeIcon radius="100%" color="red" size={rem('2.2rem')}>
              <IconX width="80%" height="80%" />
            </ThemeIcon>
            <Title order={1} size="h6" color="gray.8" fw={700}>
              Download Gagal
            </Title>
          </Stack>
          <Text color="gray.6" fz={12} ta="center">
            Periode data tahunan tidak dapat didownload, silakan ganti ke
            periode yang lain
          </Text>
          <PrimaryButton
            label="Konfirmasi"
            fullWidth
            variant="outline"
            color="gray"
            fw={500}
            onClick={() => setIsOpenAlert((prev) => !prev)}
          />
        </Stack>
      </Modal>
    </>
  );
};

export default PrimaryDownloadDataButton;
