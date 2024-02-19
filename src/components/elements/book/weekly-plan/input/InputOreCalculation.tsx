import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IWeeklyProductionTargetPlanData } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';

export type IInputOreCalculationProps = {
  name: string;
  labelWithTranslate?: boolean;
  indexOfValue: number;
  calculationSelected: string;
} & Omit<NumberInputProps, 'name'>;

const InputOreCalculation = ({
  name,
  label,
  labelWithTranslate = true,
  precision = 2,
  hideControls = true,
  indexOfValue,
  calculationSelected,
  ...rest
}: IInputOreCalculationProps) => {
  const value: IWeeklyProductionTargetPlanData[] = useWatch({
    name: 'productionTargetPlans',
  });
  const { setValue } = useFormContext();
  const { t } = useTranslation('allComponents');
  const { field } = useController({ name });

  const totalValueMemo = React.useMemo(() => {
    const oreSubMaterial = value.filter((v) => !v.isPerent);
    const totalValue = oreSubMaterial.reduce((acc: number, curr) => {
      if (Array.isArray(oreSubMaterial)) {
        const currRate =
          curr.weeklyProductionTargets[indexOfValue][calculationSelected] || 0;
        return (acc += currRate);
      }
      return acc;
    }, 0);
    return totalValue;
  }, [indexOfValue, calculationSelected, value]);

  React.useEffect(() => {
    setValue(`${name}`, totalValueMemo || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalValueMemo, name]);

  return (
    // <Tooltip
    //   label={fieldState?.error?.message || ''}
    //   hidden={fieldState && fieldState.error ? false : true}
    //   color="red"
    //   position="right"
    // >
    <MantineNumberInput
      {...field}
      radius={8}
      hideControls={hideControls}
      labelProps={{
        style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
      }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      label={
        labelWithTranslate
          ? label
            ? t(`components.field.${label}`)
            : null
          : label
      }
      parser={(value) => value.replace(/\s|,/g, '.')}
      precision={precision}
      // error={fieldState && fieldState.error ? true : false}
      {...rest}
    />
    // </Tooltip>
  );
};

export default InputOreCalculation;
