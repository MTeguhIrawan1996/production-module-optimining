import { DatePickerInput, DatePickerInputProps } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export type IDateInputNativeProps = {
  control: 'date-input-native';
} & DatePickerInputProps;

const DateInputNative: React.FC<IDateInputNativeProps> = ({
  control,
  valueFormat = 'DD MMMM YYYY',
  placeholder = 'DD MMMM YYYY',
  label,
  maxDate,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const router = useRouter();
  return (
    <DatePickerInput
      radius="sm"
      icon={<IconCalendar size="1.1rem" />}
      locale={router.locale}
      valueFormat={valueFormat}
      placeholder={
        placeholder
          ? t(`commonTypography.${placeholder}`, { ns: 'default' })
          : undefined
      }
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
      label={label ? t(`components.field.${label}`) : null}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      maxDate={maxDate}
      {...rest}
    />
  );
};

export default DateInputNative;
