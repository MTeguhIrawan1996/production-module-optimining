import { DatePickerInput, DatePickerInputProps } from '@mantine/dates';
import * as React from 'react';

type IDateInputProps = DatePickerInputProps;

const DateInputCustom: React.FC<IDateInputProps> = (props) => {
  return (
    <DatePickerInput
      locale="id"
      valueFormat="DD MMMM YYYY"
      radius={8}
      labelProps={{ style: { fontWeight: 600 } }}
      {...props}
    />
  );
};

export default DateInputCustom;
