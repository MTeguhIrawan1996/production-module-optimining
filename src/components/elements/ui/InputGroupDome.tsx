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
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  PrimaryButton,
  TextInputNative,
} from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';

dayjs.extend(isoWeek);

export type IInputGroupDomeProps = {
  addButtonOuter?: Partial<IPrimaryButtonProps>;
  deleteButtonInner?: Partial<IPrimaryButtonProps>;
  label?: string;
  bargingDomePlanIndex: number;
  uniqKey?: string | null;
  domeId?: string;
  tabs?: string;
};

const InputGroupDome: React.FunctionComponent<IInputGroupDomeProps> = ({
  addButtonOuter,
  deleteButtonInner,
  label = 'material',
  bargingDomePlanIndex,
  domeId,
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

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
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
                skipSeacrhQuary={false}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="stockpile"
                label="stockpile"
                disabled
                // defaultValue={`${weeklyPlanData?.year ?? ''}`}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="tonByRitage"
                label="tonByRitage"
                disabled
                // defaultValue={`${weeklyPlanData?.year ?? ''}`}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="tonBySurvey"
                label="tonBySurvey"
                disabled
                // defaultValue={`${weeklyPlanData?.year ?? ''}`}
              />
            </Grid.Col>
            {elementsData?.map((obj) => {
              return (
                <Grid.Col span={6} key={obj.id}>
                  <TextInputNative
                    control="text-input-native"
                    name={obj.name}
                    label={obj.name}
                    disabled
                    labelWithTranslate={false}
                    // defaultValue={`${weeklyPlanData?.year ?? ''}`}
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
