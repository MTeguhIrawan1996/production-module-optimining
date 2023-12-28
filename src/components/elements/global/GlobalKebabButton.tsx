import { ActionIcon, Center, Menu, MenuItemProps } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface IGlobalKebabButtonProps {
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
}) => {
  const { t } = useTranslation('default');
  const { label, ...restActionOther } = actionOther || {};
  return (
    <Center>
      <Menu shadow="md" width={150} position="left">
        <Menu.Target>
          <ActionIcon
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
            <Menu.Item {...actionRead}>{t('commonTypography.read')}</Menu.Item>
          ) : null}
          {actionOther ? (
            <Menu.Item {...restActionOther}>
              {t(`commonTypography.${label}`)}
            </Menu.Item>
          ) : null}
          {actionUpdate ? (
            <Menu.Item {...actionUpdate}>
              {t('commonTypography.edit')}
            </Menu.Item>
          ) : null}
          {actionDelete ? (
            <Menu.Item {...actionDelete}>
              {t('commonTypography.delete')}
            </Menu.Item>
          ) : null}
        </Menu.Dropdown>
      </Menu>
    </Center>
  );
};

export default GlobalKebabButton;
