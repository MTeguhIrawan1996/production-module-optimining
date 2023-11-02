import { Group } from '@mantine/core';
import * as React from 'react';

import {
  DashboardCard,
  ModalConfirmation,
  PrimaryButton,
  SelectionButtonModal,
} from '@/components/elements';

const ModalComponentsBook = () => {
  const [isOpenDefaultConfirmation, setIsDefaultConfirmation] =
    React.useState<boolean>(false);
  const [isOpenAlertConfirmation, setIsAlertConfirmation] =
    React.useState<boolean>(false);
  const [isOpenEditConfirmation, setIsEditConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);

  return (
    <DashboardCard
      shadow="md"
      withBorder
      title="Modal Komponen"
      paperStackProps={{ spacing: 'xs' }}
    >
      <Group spacing="xs">
        <PrimaryButton
          label="Modal Default"
          color="red"
          onClick={() => setIsDefaultConfirmation((prev) => !prev)}
        />
        <PrimaryButton
          label="Modal alert"
          onClick={() => setIsAlertConfirmation((prev) => !prev)}
        />
        <PrimaryButton
          label="Modal Confirm Edit"
          onClick={() => setIsEditConfirmation((prev) => !prev)}
          color="blue"
        />
        <PrimaryButton
          label="Selection Button Modal"
          onClick={() => setIsOpenSelectionModal((prev) => !prev)}
          color="grape"
        />
      </Group>
      <ModalConfirmation
        isOpenModalConfirmation={isOpenDefaultConfirmation}
        actionModalConfirmation={() =>
          setIsDefaultConfirmation((prev) => !prev)
        }
        actionButton={{
          label: 'Ya Hapus',
          color: 'red',
        }}
        backButton={{
          label: 'Batal',
        }}
        modalType={{
          type: 'default',
          title: 'a',
          description: 'Setelah Anda menyetujui, semua data  akan terhapus',
        }}
        withDivider
      />
      <ModalConfirmation
        isOpenModalConfirmation={isOpenAlertConfirmation}
        actionModalConfirmation={() => setIsAlertConfirmation((prev) => !prev)}
        actionButton={{
          label: 'Setuju',
          color: 'red',
        }}
        modalType={{
          type: 'alert',
          title: 'Peringatan',
          description:
            'Apabila data ini dihapus, maka akan berpengaruh kepada data lain yang berkaitan dengan data ini',
        }}
      />
      <ModalConfirmation
        isOpenModalConfirmation={isOpenEditConfirmation}
        actionModalConfirmation={() => setIsEditConfirmation((prev) => !prev)}
        actionButton={{
          label: 'Ya',
          color: 'red',
        }}
        modalType={{
          type: 'default',
          title: 'Apakah Anda yakin ingin mengedit?',
        }}
        modalHeader={{
          pt: 'xs',
          pb: 'md',
        }}
        // withDivider
      />
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: 'Tambah Data Baru',
        }}
        secondButton={{
          label: 'Pilih Data yang sudah ada',
        }}
      />
    </DashboardCard>
  );
};

export default ModalComponentsBook;
