import { Flex, FlexProps, Radio, RadioGroupProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllIdentityType } from '@/services/graphql/query/global-select/useReadAllIdentitiyType';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IIdentityTypesRadioInputProps = {
  control: 'identity-radio-input';
  name: string;
  radioComponentWrapper?: FlexProps;
} & Omit<RadioGroupProps, 'name' | 'children'> &
  CommonProps;

const IdentityRadioInputRhf: React.FC<IIdentityTypesRadioInputProps> = ({
  name,
  control,
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

  const { identityTypesData } = useReadAllIdentityType({
    variables: {
      limit: 15,
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: identityTypesData ?? [],
  });

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
        {uncombinedItem?.map((value, i) => (
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

export default IdentityRadioInputRhf;
