// eslint-disable-next-line unused-imports/no-unused-imports
import { DatePickerInputProps } from '@mantine/dates';

declare module '@mantine/dates' {
  interface DatePickerInputProps {
    placeholder?: string | undefined;
  }
}
