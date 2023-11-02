import {
  Flex,
  FlexProps,
  Radio,
  RadioGroupProps,
  RadioProps,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

export type IRadioInputProps = {
  control: 'radio-input';
  name: string;
  radioComponent: RadioProps[];
  radioComponentWrapper?: FlexProps;
} & Omit<RadioGroupProps, 'name' | 'children'>;

const RadioInputRhf: React.FC<IRadioInputProps> = ({
  name,
  control,
  radioComponent,
  radioComponentWrapper,
  label,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const {
    direction = 'row',
    gap = 'xl',
    mb = 4,
    ...restRadioComponentWrapper
  } = radioComponentWrapper || {};

  return (
    <Radio.Group
      {...field}
      data-control={control}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      label={label ? t(`components.field.${label}`) : null}
      error={
        fieldState &&
        fieldState.error && (
          <FieldErrorMessage>{fieldState.error.message}</FieldErrorMessage>
        )
      }
      {...rest}
    >
      <Flex
        direction={direction}
        gap={gap}
        mb={mb}
        {...restRadioComponentWrapper}
      >
        {radioComponent?.map((value, i) => (
          <Radio
            key={i}
            size="xs"
            styles={(theme) => ({
              label: {
                paddingLeft: theme.spacing.xs,
              },
              radio: {
                cursor: 'pointer',
              },
            })}
            {...value}
          />
        ))}
      </Flex>
    </Radio.Group>
  );
};

export default RadioInputRhf;
