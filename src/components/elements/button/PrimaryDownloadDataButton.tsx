import { Grid, Group } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
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
  submitForm: SubmitHandler<any>;
  fields: IDownloadFields[];
  isDibaledDownload?: boolean;
  // trackDownloadAction?: () => void;
} & IPrimaryButtonProps;

const PrimaryDownloadDataButton: React.FC<IDownloadDataButtonProps> = ({
  methods,
  submitForm,
  fields,
  isDibaledDownload,
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
                onClick={handleConfirmation}
                disabled={isDibaledDownload}
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
