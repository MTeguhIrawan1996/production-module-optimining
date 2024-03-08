/* eslint-disable unused-imports/no-unused-vars */
import {
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  PrimaryButton,
  TextInputNative,
} from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';

import { IBargingDomePlan } from '@/services/graphql/mutation/plan/weekly/useCreateBargingTargetPlan';
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';

export type IInputGroupDomeProps = {
  addButtonOuter?: Partial<IPrimaryButtonProps>;
  deleteButtonInner?: Partial<IPrimaryButtonProps>;
  label?: string;
  bargingDomePlanIndex: number;
  uniqKey?: string | null;
  tabs?: string | null;
};

const InputGroupDome: React.FunctionComponent<IInputGroupDomeProps> = ({
  addButtonOuter,
  deleteButtonInner,
  label = 'inputGroupDomeLabel',
  bargingDomePlanIndex,
  tabs,
}) => {
  const { t } = useTranslation('default');

  const {
    label: addButtonOuterLabel = t('commonTypography.createDome'),
    ...restAddButtonOuter
  } = addButtonOuter || {};
  const {
    label: deleteButtonOuterLabel = t('commonTypography.delete'),
    ...restDeleteButtonOuter
  } = deleteButtonInner || {};

  const bargingDomePlans: IBargingDomePlan[] = useWatch({
    name: 'bargingDomePlans',
  });

  const domeId = bargingDomePlans[bargingDomePlanIndex].domeId;

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    skip: tabs !== 'bargingTargetPlan',
  });

  const { stockpileDomeMaster } = useReadOneStockpileDomeMaster({
    variables: {
      id: domeId || '',
    },
    skip: tabs !== 'bargingTargetPlan' || !domeId,
  });

  return (
    <Flex gap={22} direction="column" align="flex-end" w="100%">
      <Group spacing="xs" position="right">
        {addButtonOuter ? (
          <PrimaryButton
            // leftIcon={<IconPlus size="20px" />}
            label={addButtonOuterLabel}
            {...restAddButtonOuter}
          />
        ) : null}
      </Group>
      <Paper p={24} withBorder w="100%">
        <Stack spacing={8}>
          <SimpleGrid cols={2} mb="sm">
            <Text
              component="span"
              fw={500}
              fz={16}
              sx={{ alignSelf: 'center' }}
            >
              {t(`commonTypography.${label}`)}
            </Text>
            <Group spacing="xs" position="right">
              {deleteButtonInner ? (
                <PrimaryButton
                  color="red.5"
                  variant="light"
                  styles={(theme) => ({
                    root: {
                      border: `1px solid ${theme.colors.red[3]}`,
                    },
                  })}
                  label={deleteButtonOuterLabel}
                  {...restDeleteButtonOuter}
                />
              ) : null}
            </Group>
          </SimpleGrid>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <FormController
                control="domename-select-input"
                name={`bargingDomePlans.${bargingDomePlanIndex}.domeId`}
                label="dome"
                clearable
                searchable
                skipQuery={tabs !== 'bargingTargetPlan'}
                limit={null}
                skipSearchQuery={true}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="stockpile"
                label="stockpile"
                disabled
                defaultValue={stockpileDomeMaster?.stockpile.name || ''}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="tonByRitage"
                label="tonByRitage"
                disabled
                defaultValue={
                  stockpileDomeMaster?.monitoringStockpile.tonByRitage || ''
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="tonBySurvey"
                label="tonBySurvey"
                disabled
                defaultValue={
                  stockpileDomeMaster?.monitoringStockpile.currentTonSurvey ||
                  ''
                }
              />
            </Grid.Col>
            {elementsData?.map((obj) => {
              const value =
                stockpileDomeMaster?.monitoringStockpile.ritageSamples.additional.averageSamples.find(
                  (val) => val.element?.id === obj.id
                );
              return (
                <Grid.Col span={6} key={obj.id}>
                  <TextInputNative
                    control="text-input-native"
                    name={obj.name}
                    label={obj.name}
                    disabled
                    labelWithTranslate={false}
                    defaultValue={value?.value || ''}
                  />
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>
      </Paper>
    </Flex>
  );
};

export default InputGroupDome;
