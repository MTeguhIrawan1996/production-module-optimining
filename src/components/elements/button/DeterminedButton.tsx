import { Button, ButtonProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import ModalConfirmation from '@/components/elements/modal/ModalConfirmation';

export type IDeterminedButtonProps = {
  onClickDetermined: () => Promise<void>;
} & ButtonProps;

const DeterminedButton: React.FC<IDeterminedButtonProps> = (props) => {
  const { t } = useTranslation('default');
  const [isOpenDeterminedConfirmation, setIsOpenDeterminedConfirmation] =
    React.useState<boolean>(false);

  const {
    fz = 14,
    radius = 8,
    fw = 400,
    loading,
    onClickDetermined,
    ...rest
  } = props;

  const handleDetermined = async () => {
    await onClickDetermined();
    setIsOpenDeterminedConfirmation((prev) => !prev);
  };

  return (
    <>
      <Button
        radius={radius}
        fw={fw}
        fz={fz}
        onClick={() => setIsOpenDeterminedConfirmation((prev) => !prev)}
        {...rest}
      >
        {t('commonTypography.determined')}
      </Button>
      <ModalConfirmation
        isOpenModalConfirmation={isOpenDeterminedConfirmation}
        actionModalConfirmation={() =>
          setIsOpenDeterminedConfirmation((prev) => !prev)
        }
        actionButton={{
          label: t('commonTypography.yes'),
          onClick: handleDetermined,
          loading: loading,
        }}
        backButton={{
          label: 'Batal',
        }}
        modalType={{
          type: 'default',
          title: t('commonTypography.alertTitleConfirmDetermined'),
        }}
        withDivider
      />
    </>
  );
};

export default DeterminedButton;
