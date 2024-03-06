import {
  ActionIcon,
  Center,
  Menu,
  MenuItemProps,
  MenuProps,
  rem,
} from '@mantine/core';
import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface IGlobalKebabButtonProps extends MenuProps {
  actionRead?: MenuItemProps & React.ComponentPropsWithoutRef<'button'>;
  actionDelete?: MenuItemProps & React.ComponentPropsWithoutRef<'button'>;
  actionUpdate?: MenuItemProps & React.ComponentPropsWithoutRef<'button'>;
  actionOther?: {
    label: string;
  } & MenuItemProps &
    React.ComponentPropsWithoutRef<'button'>;
}

const GlobalKebabButton: React.FC<IGlobalKebabButtonProps> = ({
  actionRead,
  actionDelete,
  actionUpdate,
  actionOther,
  ...menuProps
}) => {
  const { t } = useTranslation('default');
  const { label, ...restActionOther } = actionOther || {};
  return (
    <Center>
      <Menu
        shadow="sm"
        width={120}
        position="left"
        radius="sm"
        styles={{
          itemLabel: {
            fontSize: rem(12),
          },
          item: {
            padding: '8px 8px',
          },
        }}
        {...menuProps}
      >
        <Menu.Target>
          <ActionIcon
            size="xs"
            radius={4}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <IconDotsVertical size="1.125rem" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {actionRead ? (
            <Menu.Item
              icon={<IconEye style={{ width: rem(14), height: rem(14) }} />}
              {...actionRead}
            >
              {t('commonTypography.read')}
            </Menu.Item>
          ) : null}
          {actionOther ? (
            <Menu.Item {...restActionOther}>
              {t(`commonTypography.${label}`)}
            </Menu.Item>
          ) : null}
          {actionUpdate ? (
            <Menu.Item
              icon={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
              {...actionUpdate}
            >
              {t('commonTypography.edit')}
            </Menu.Item>
          ) : null}
          {actionDelete ? (
            <Menu.Item
              color="red"
              icon={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
              {...actionDelete}
            >
              {t('commonTypography.delete')}
            </Menu.Item>
          ) : null}
        </Menu.Dropdown>
      </Menu>
    </Center>
  );
};

export default GlobalKebabButton;
