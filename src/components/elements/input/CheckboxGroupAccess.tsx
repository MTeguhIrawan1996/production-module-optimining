import {
  Checkbox,
  CheckboxGroupProps,
  CheckboxProps,
  Flex,
  FlexProps,
  Paper,
  PaperProps,
} from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

export type ICheckboxGroupAccessProps = {
  control: 'checkbox-group-access';
  name: string;
  checkboxWrapper?: PaperProps;
  checkboxComponent: CheckboxProps[];
  checkboxComponentWrapper?: FlexProps;
} & Omit<CheckboxGroupProps, 'name' | 'children'>;

const CheckboxGroupAccess: React.FC<ICheckboxGroupAccessProps> = ({
  name,
  label,
  checkboxComponent,
  checkboxWrapper,
  checkboxComponentWrapper,
  ...rest
}) => {
  const { t } = useTranslation('default');
  const { field, fieldState } = useController({ name });
  const {
    withBorder = true,
    shadow = 'xs',
    p = 'md',
    ...restCheckboxWrapper
  } = checkboxWrapper || {};
  const {
    direction = 'column',
    gap = 'xs',
    ...restCheckboxComponentWrapper
  } = checkboxComponentWrapper || {};

  return (
    <Paper
      withBorder={withBorder}
      shadow={shadow}
      p={p}
      {...restCheckboxWrapper}
    >
      <Checkbox.Group
        {...field}
        label={t(`managementRole.field.${label}`)}
        labelProps={{
          style: {
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 16,
          },
        }}
        error={
          fieldState &&
          fieldState.error && (
            <FieldErrorMessage>{fieldState.error.message}</FieldErrorMessage>
          )
        }
        {...rest}
      >
        <Flex direction={direction} gap={gap} {...restCheckboxComponentWrapper}>
          {checkboxComponent?.map(
            ({ value, label, ...restCheckboxComponents }, index) => (
              <Checkbox
                radius={2}
                value={value}
                label={t(`commonTypography.${label}`, {})}
                key={index}
                {...restCheckboxComponents}
              />
            )
          )}
        </Flex>
      </Checkbox.Group>
    </Paper>
  );
};

export default CheckboxGroupAccess;
