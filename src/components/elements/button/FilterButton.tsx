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

type IMultipleFilter = {
  selectItem: SelectProps;
  col: number;
};

export interface IFilterButtonProps {
  multipleFilter?: IMultipleFilter[];
  filterButton?: Omit<IPrimaryButtonProps, 'label'>;
  onCancel?: () => void;
}

const FilterButton = ({
  multipleFilter,
  filterButton,
  onCancel,
}: IFilterButtonProps) => {
  const { t } = useTranslation('default');
  const [opened, setOpened] = React.useState(false);
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
      width={600}
      position="bottom-start"
      shadow="md"
      radius="sm"
      opened={opened}
      onChange={setOpened}
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
        <Stack>
          <Text fw={600} fz={18}>
            Filter
          </Text>
          <Grid>{multipleFilter ? selectItems : undefined}</Grid>
          <Group spacing="xs" position="right">
            <PrimaryButton
              label="Batlkan"
              variant="outline"
              onClick={() => {
                onCancel?.();
                setOpened((prev) => !prev);
              }}
            />
            <PrimaryButton label="Terapkan" {...filterButton} />
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default FilterButton;
