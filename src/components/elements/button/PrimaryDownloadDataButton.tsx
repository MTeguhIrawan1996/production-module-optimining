import { Grid, Group } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FormController from '@/components/elements/form/FormController';
import GlobalModal from '@/components/elements/modal/GlobalModal';

export type IDownloadDataButtonProps = {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  // trackDownloadAction?: () => void;
} & IPrimaryButtonProps;

const PrimaryDownloadDataButton: React.FC<IDownloadDataButtonProps> = ({
  methods,
  submitForm,
  ...rest
}) => {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const handleCloseModal = () => {
    setIsOpenModal((prev) => !prev);
    // methods.reset();
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
        onClick={handleCloseModal}
        {...rest}
      />
      <GlobalModal
        actionModal={handleCloseModal}
        isOpenModal={isOpenModal}
        label="Download"
        modalSize="lg"
        centered
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <Grid gutter="xs">
              <Grid.Col span={12}>
                <FormController
                  control="domename-select-input"
                  name="domeId"
                  label="period"
                  withAsterisk
                  clearable
                  searchable
                />
              </Grid.Col>
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
                label="Simpan"
                type="button"
                onClick={handleConfirmation}
                // loading={loading}
              />
            </Group>
          </form>
        </FormProvider>
      </GlobalModal>
    </>
  );
};

export default PrimaryDownloadDataButton;
