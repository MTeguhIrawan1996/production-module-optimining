import { Icon } from '@iconify/react';
import { Grid, Group, Popover, Select, Text } from '@mantine/core';
import { Button } from '@mantine/core';
import { Stack } from '@mantine/core';
import { SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import InputControllerNative from '@/components/elements/form/InputControllerNative';

import { InputControllerNativeProps } from '@/types/global';

export type IMultipleFilter = {
  selectItem: SelectProps;
  col: number;
  prefix?: string;
};

export type IFilterDateWithSelect = {
  selectItem: InputControllerNativeProps;
  col: number;
  prefix?: string;
  otherElement?: () => React.ReactNode;
};

export interface IFilterButtonProps {
  multipleFilter?: IMultipleFilter[];
  filterDateWithSelect?: IFilterDateWithSelect[];
  filterButton?: Omit<IPrimaryButtonProps, 'label'>;
}

const FilterButton = ({
  multipleFilter,
  filterDateWithSelect,
  filterButton,
}: IFilterButtonProps) => {
  const { t } = useTranslation('default');
  const [opened, setOpened] = React.useState(false);

  const { onClick: onClickFilter, ...restFilterButton } = filterButton || {};
  const renderSelectItem = React.useCallback(
    ({ selectItem, col }: IMultipleFilter, index: number) => {
      const { label, placeholder, ...rest } = selectItem;
      return (
        <Grid.Col span={col} key={index}>
          <Select
            labelProps={{
              style: { fontWeight: 500, fontSize: 14, marginBottom: 8 },
            }}
            label={label ? t(`commonTypography.${label}`) : null}
            placeholder={
              placeholder
                ? t(`commonTypography.${placeholder}`, { ns: 'default' })
                : undefined
            }
            {...rest}
          />
        </Grid.Col>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectItems = multipleFilter?.map(renderSelectItem);

  return (
    <Popover
      width={550}
      position="bottom-start"
      shadow="md"
      radius="sm"
      opened={opened}
      onChange={setOpened}
      zIndex={4}
    >
      <Popover.Target>
        <Button
          leftIcon={<Icon icon="bi:filter" fontSize={22} />}
          variant="outline"
          color="gray.5"
          fw={600}
          sx={(theme) => ({
            color: theme.colors.dark[9],
          })}
          onClick={() => setOpened((prev) => !prev)}
        >
          Filter
        </Button>
      </Popover.Target>
      <Popover.Dropdown p="sm">
        <Stack spacing="xs">
          <Text fw={600} fz={18}>
            Filter
          </Text>
          <Grid gutter="xs">
            {multipleFilter ? selectItems : null}
            {filterDateWithSelect
              ? filterDateWithSelect?.map(
                  ({ selectItem, col, otherElement }, key) => (
                    <React.Fragment key={`${selectItem.name}.${key}`}>
                      <Grid.Col span={col}>
                        <InputControllerNative {...selectItem} />
                      </Grid.Col>
                      {otherElement ? (
                        <Grid.Col span={12} py={0}>
                          {otherElement()}
                        </Grid.Col>
                      ) : null}
                    </React.Fragment>
                  )
                )
              : null}
          </Grid>
          <Group spacing="xs" position="right">
            <PrimaryButton
              label="Batalkan"
              variant="outline"
              onClick={() => {
                setOpened((prev) => !prev);
              }}
            />
            <PrimaryButton
              label="Terapkan"
              onClick={(e) => {
                setOpened((prev) => !prev);
                onClickFilter?.(e);
              }}
              {...restFilterButton}
            />
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default FilterButton;
