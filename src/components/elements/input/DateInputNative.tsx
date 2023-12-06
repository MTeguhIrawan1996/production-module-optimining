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
  maxDate = new Date(),
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const router = useRouter();
  return (
    <DatePickerInput
      icon={<IconCalendar size="1.1rem" />}
      locale={router.locale}
      valueFormat={valueFormat}
      placeholder={
        placeholder
          ? t(`commonTypography.${placeholder}`, { ns: 'default' })
          : undefined
      }
      radius="lg"
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
