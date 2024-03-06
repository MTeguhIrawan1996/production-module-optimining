import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IWeeklyProductionTargetPlanData } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';

export type IInputSRCalculationProps = {
  name: string;
  labelWithTranslate?: boolean;
  indexOfValue: number;
  calculationSelected: string;
  mutationType?: string;
} & Omit<NumberInputProps, 'name'>;

const InputSRCalculation = ({
  name,
  label,
  labelWithTranslate = true,
  precision = 2,
  hideControls = true,
  indexOfValue,
  calculationSelected,
  mutationType,
  ...rest
}: IInputSRCalculationProps) => {
  const value: IWeeklyProductionTargetPlanData[] = useWatch({
    name: 'productionTargetPlans',
  });
  const { setValue } = useFormContext();
  const { t } = useTranslation('allComponents');
  const { field } = useController({ name });

  const totalValueMemo = React.useMemo(() => {
    const otqArray = [
      `${process.env.NEXT_PUBLIC_MATERIAL_OB_ID}`,
      `${process.env.NEXT_PUBLIC_MATERIAL_TOPSOIL_ID}`,
      `${process.env.NEXT_PUBLIC_MATERIAL_QUARRY_ID}`,
    ];
    const otqMaterial = value.filter((v) =>
      otqArray.includes(v.materialId || '')
    );
    const oreFind = value.find(
      (v) => v.materialId === `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`
    );
    const lgoFind = value.find(
      (v) => v.materialId === `${process.env.NEXT_PUBLIC_MATERIAL_LGO_ID}`
    );

    const totalValueOtq = otqMaterial.reduce((acc: number, curr) => {
      if (Array.isArray(otqMaterial)) {
        const currRate =
          curr.weeklyProductionTargets[indexOfValue][calculationSelected] || 0;
        return (acc += currRate);
      }
      return acc;
    }, 0);

    // RUMUS SR
    if (
      oreFind &&
      oreFind?.weeklyProductionTargets[indexOfValue][calculationSelected]
    ) {
      const lgoValue =
        lgoFind?.weeklyProductionTargets[indexOfValue][calculationSelected] ||
        0;
      const oreValue =
        oreFind.weeklyProductionTargets[indexOfValue][calculationSelected] || 0;
      const oreMinLgo = oreValue - lgoValue;
      if (oreMinLgo) return (totalValueOtq + lgoValue) / oreMinLgo;
      return 0;
    }
  }, [indexOfValue, calculationSelected, value]);

  React.useEffect(() => {
    if (mutationType !== 'read') {
      setValue(`${name}`, totalValueMemo || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalValueMemo, name]);

  return (
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
      {...rest}
    />
  );
};

export default InputSRCalculation;
