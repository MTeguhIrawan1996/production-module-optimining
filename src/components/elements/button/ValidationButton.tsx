import { Button, ButtonProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import ModalConfirmation from '@/components/elements/modal/ModalConfirmation';

export type IValidationButtonProps = {
  onClickValid: () => Promise<void>;
} & ButtonProps;

const ValidationButton: React.FC<IValidationButtonProps> = (props) => {
  const { t } = useTranslation('default');
  const [isOpenValidationConfirmation, setIsOpenValidationConfirmation] =
    React.useState<boolean>(false);

  const {
    fz = 14,
    radius = 8,
    fw = 400,
    loading,
    onClickValid,
    ...rest
  } = props;

  const handleValid = async () => {
    await onClickValid();
    setIsOpenValidationConfirmation((prev) => !prev);
  };

  return (
    <>
      <Button
        radius={radius}
        fw={fw}
        fz={fz}
        onClick={() => setIsOpenValidationConfirmation((prev) => !prev)}
        {...rest}
      >
        {t('commonTypography.validation')}
      </Button>
      <ModalConfirmation
        isOpenModalConfirmation={isOpenValidationConfirmation}
        actionModalConfirmation={() =>
          setIsOpenValidationConfirmation((prev) => !prev)
        }
        actionButton={{
          label: t('commonTypography.yes'),
          onClick: handleValid,
          loading: loading,
        }}
        backButton={{
          label: 'Batal',
        }}
        modalType={{
          type: 'default',
          title: t('commonTypography.alertTitleConfirmValid'),
        }}
        withDivider
      />
    </>
  );
};

export default ValidationButton;
