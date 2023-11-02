import { DatePickerInput, DatePickerInputProps } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

export type IDateInputProps = {
  control: 'date-input';
  name: string;
} & Omit<DatePickerInputProps, 'name'>;

const DateInputRhf: React.FC<IDateInputProps> = ({
  control,
  name,
  valueFormat = 'DD MMMM YYYY',
  label,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  return (
    <DatePickerInput
      {...field}
      icon={<IconCalendar size="1.1rem" />}
      locale="id"
      valueFormat={valueFormat}
      radius={8}
      label={label ? t(`components.field.${label}`) : null}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
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

export default DateInputRhf;
