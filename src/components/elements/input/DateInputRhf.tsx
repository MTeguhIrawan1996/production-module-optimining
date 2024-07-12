import { DatePickerInput, DatePickerInputProps } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { CommonProps } from '@/types/global';

export type IDateInputProps = {
  control: 'date-input';
  name: string;
} & Omit<DatePickerInputProps, 'name'> &
  CommonProps;

const DateInputRhf: React.FC<IDateInputProps> = ({
  control,
  name,
  valueFormat = 'DD MMMM YYYY',
  placeholder = 'DD MMMM YYYY',
  label,
  maxDate,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const router = useRouter();
  return (
    <DatePickerInput
      {...field}
      icon={<IconCalendar size="1.1rem" />}
      locale={router.locale}
      valueFormat={valueFormat}
      placeholder={placeholder}
      radius={8}
      label={label ? t(`components.field.${label}`) : null}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      maxDate={maxDate}
      styles={(theme) => ({
        input: {
          '&[data-disabled="true"]': {
            backgroundColor: theme.colors.dark[0],
            color: theme.colors.dark[6],
            '::placeholder': {
              color: theme.colors.dark[5],
            },
          },
        },
      })}
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
