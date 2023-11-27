import {
  Group,
  LoadingOverlay,
  Paper,
  PaperProps,
  Stack,
  StackProps,
  Title,
  TitleProps,
} from '@mantine/core';
import { IconChevronLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DeterminedButton, {
  IDeterminedButtonProps,
} from '@/components/elements/button/DeterminedButton';
import NotValidButton, {
  INotValidButtonProps,
} from '@/components/elements/button/NotValidButton';
import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import RejectButton, {
  IRejectButtonProps,
} from '@/components/elements/button/RejectButton';
import ValidationButton, {
  IValidationButtonProps,
} from '@/components/elements/button/ValidationButton';
import MultipleFilter, {
  IMultipleFilterProps,
} from '@/components/elements/global/MultipleFilter';
import SearchBar, { ISerachBar } from '@/components/elements/global/SearchBar';

interface IDashboardCardProps extends PaperProps {
  children: React.ReactNode;
  title?: string;
  addButton?: IPrimaryButtonProps;
  updateButton?: IPrimaryButtonProps;
  enebleBack?: boolean;
  enebleBackBottom?: boolean;
  enebleBackBottomInner?: Partial<IPrimaryButtonProps>;
  validationButton?: IValidationButtonProps;
  notValidButton?: INotValidButtonProps;
  determinedButton?: IDeterminedButtonProps;
  rejectButton?: IRejectButtonProps;
  isLoading?: boolean;
  searchBar?: ISerachBar;
  MultipleFilter?: IMultipleFilterProps;
  paperStackProps?: StackProps;
  childrenStackProps?: StackProps;
  titleStyle?: TitleProps;
}

const DashboardCard: React.FC<IDashboardCardProps> = ({
  children,
  title,
  MultipleFilter: MultiFilter,
  enebleBack,
  enebleBackBottom,
  enebleBackBottomInner,
  determinedButton,
  addButton,
  updateButton,
  rejectButton,
  searchBar,
  isLoading,
  validationButton,
  notValidButton,
  paperStackProps,
  childrenStackProps,
  bg = 'none',
  shadow = 'none',
  withBorder,
  p = 'md',
  titleStyle,
  ...restPaper
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { label, ...rest } = addButton || {};
  const { label: labelUpdateButton = 'Update Button', ...restUpdateButton } =
    updateButton || {};
  const { order = 3, fw = 500, ...restTitleStyle } = titleStyle || {};

  return (
    <>
      <Paper
        shadow={shadow}
        p={p}
        bg={bg}
        withBorder={withBorder}
        {...restPaper}
      >
        <Stack spacing="xl" justify="center" {...paperStackProps}>
          {enebleBack && (
            <PrimaryButton
              label={t('commonTypography.back')}
              leftIcon={<IconChevronLeft size="12px" />}
              variant="subtle"
              size="xs"
              w="fit-content"
              fz="xs"
              fw={400}
              styles={() => ({
                root: {
                  border: 0,
                  paddingLeft: 8,
                  paddingRight: 8,
                },
                leftIcon: {
                  marginRight: 8,
                },
              })}
              onClick={() => router.back()}
            />
          )}
          {title || addButton || updateButton ? (
            <Group position={title ? 'apart' : 'right'}>
              {title && (
                <Title order={order} fw={fw} {...restTitleStyle}>
                  {title}
                </Title>
              )}
              <Group spacing="xs">
                {addButton && (
                  <PrimaryButton
                    leftIcon={<IconPlus size="20px" />}
                    label={label ?? ''}
                    {...rest}
                  />
                )}
                {updateButton && (
                  <PrimaryButton
                    leftIcon={<IconPencil size="20px" />}
                    label={labelUpdateButton}
                    {...restUpdateButton}
                  />
                )}
              </Group>
            </Group>
          ) : null}
          {searchBar && <SearchBar {...searchBar} />}
          <Stack {...childrenStackProps}>
            {MultiFilter ? <MultipleFilter {...MultiFilter} /> : null}
            {children}
          </Stack>
        </Stack>
        <LoadingOverlay
          visible={isLoading ?? false}
          overlayBlur={2}
          zIndex={5}
        />
        {enebleBackBottomInner ? (
          <PrimaryButton
            type="button"
            variant="outline"
            leftIcon={<IconChevronLeft size="1rem" />}
            label={t('commonTypography.back')}
            mt="lg"
            {...enebleBackBottomInner}
          />
        ) : null}
      </Paper>
      {enebleBackBottom ? (
        <Group w="100%" mt="lg" position={enebleBackBottom ? 'apart' : 'right'}>
          {enebleBackBottom ? (
            <PrimaryButton
              type="button"
              variant="outline"
              leftIcon={<IconChevronLeft size="1rem" />}
              label={t('commonTypography.back')}
              onClick={() => router.back()}
            />
          ) : null}
          <Group spacing="xs">
            {notValidButton ? (
              <NotValidButton color="red" {...notValidButton} />
            ) : null}
            {rejectButton ? (
              <RejectButton color="red" {...rejectButton} />
            ) : null}
            {validationButton ? (
              <ValidationButton {...validationButton} />
            ) : null}
            {determinedButton ? (
              <DeterminedButton {...determinedButton} />
            ) : null}
          </Group>
        </Group>
      ) : null}
    </>
  );
};

export default DashboardCard;
