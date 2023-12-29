import { TimeInput, TimeInputProps } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { CommonProps } from '@/types/global';

export type ITimeInputDynamicRhfProps = {
  control: 'time-dynamic-input';
  name: string;
  labelWithTranslate?: boolean;
} & Omit<TimeInputProps, 'name'> &
  CommonProps;

const TimeInputDynamicRhf: React.FC<ITimeInputDynamicRhfProps> = ({
  name,
  control,
  label,
  placeholder,
  labelWithTranslate = true,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  return (
    <TimeInput
      {...field}
      radius={8}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={
        labelWithTranslate
          ? label
            ? t(`components.field.${label}`)
            : null
          : label
      }
      placeholder={
        placeholder
          ? t(`commonTypography.${placeholder}`, { ns: 'default' })
          : undefined
      }
      icon={<IconClock size="1rem" stroke={1.5} />}
      withSeconds
      error={
        fieldState &&
        fieldState.error && (
          <FieldErrorMessage>{fieldState.error.message}</FieldErrorMessage>
        )
      }
      {...rest}
    />
  );
};

export default TimeInputDynamicRhf;
