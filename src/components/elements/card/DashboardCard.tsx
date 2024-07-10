import {
  Badge,
  Group,
  LoadingOverlay,
  Paper,
  PaperProps,
  SegmentedControl,
  SegmentedControlProps,
  Stack,
  StackProps,
  Title,
  TitleProps,
} from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DeterminedButton, {
  IDeterminedButtonProps,
} from '@/components/elements/button/DeterminedButton';
import DownloadButton, {
  IDownloadButtonProps,
} from '@/components/elements/button/DownloadButton';
import FilterButton, {
  IFilterButtonProps,
} from '@/components/elements/button/FilterButton';
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
import SearchBar, { ISerachBar } from '@/components/elements/global/SearchBar';

interface IDashboardCardProps extends PaperProps {
  children: React.ReactNode;
  filter?: IFilterButtonProps;
  filterBadge?: {
    value: string[] | null;
    resetButton: Omit<IPrimaryButtonProps, 'label'>;
  };
  title?: string;
  addButton?: IPrimaryButtonProps;
  updateButton?: IPrimaryButtonProps;
  enebleBack?: boolean;
  enebleBackBottomOuter?: Partial<IPrimaryButtonProps>;
  enebleBackBottomInner?: Partial<IPrimaryButtonProps>;
  validationButton?: IValidationButtonProps;
  notValidButton?: INotValidButtonProps;
  determinedButton?: IDeterminedButtonProps;
  rejectButton?: IRejectButtonProps;
  isLoading?: boolean;
  searchBar?: ISerachBar;
  paperStackProps?: StackProps;
  childrenStackProps?: StackProps;
  titleStyle?: TitleProps;
  downloadButton?: IDownloadButtonProps[];
  segmentedControl?: SegmentedControlProps;
}

const DashboardCard: React.FC<IDashboardCardProps> = ({
  children,
  title,
  filter,
  filterBadge,
  enebleBack,
  enebleBackBottomOuter,
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
  downloadButton,
  segmentedControl,
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
        <Stack spacing="md" justify="center" {...paperStackProps}>
          {enebleBack && (
            <PrimaryButton
              label={t('commonTypography.back')}
              // leftIcon={<IconChevronLeft size="12px" />}
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
          {segmentedControl ? (
            <SegmentedControl
              w={220}
              size="sm"
              radius={4}
              {...segmentedControl}
            />
          ) : null}
          <Group position={title ? 'apart' : 'right'}>
            {title && (
              <Title order={order} fw={fw} {...restTitleStyle}>
                {title}
              </Title>
            )}
            <Stack spacing="xs" w={filter || searchBar ? '100%' : undefined}>
              <Group position="apart">
                <Group spacing="xs">
                  {filter ? <FilterButton {...filter} /> : undefined}
                  {searchBar && <SearchBar w={440} {...searchBar} />}
                </Group>
                <Group spacing="xs">
                  {addButton && (
                    <PrimaryButton
                      // leftIcon={<IconPlus size="20px" />}
                      label={label ?? ''}
                      {...rest}
                    />
                  )}
                  {updateButton && (
                    <PrimaryButton
                      // leftIcon={<IconPencil size="20px" />}
                      label={labelUpdateButton}
                      {...restUpdateButton}
                    />
                  )}
                </Group>
              </Group>
              {filterBadge && filterBadge.value ? (
                <Group position="left" spacing={6} w="100%">
                  {filterBadge.value.map((v, i) => (
                    <Badge
                      key={i}
                      bg="gray.1"
                      color="gray"
                      c="gray.7"
                      tt="unset"
                      fw={500}
                    >
                      {v}
                    </Badge>
                  ))}
                  <PrimaryButton
                    label="Reset Filter"
                    variant="transparent"
                    color="red"
                    size="xs"
                    px={0}
                    fw={500}
                    fz={12}
                    sx={{
                      color: 'red',
                    }}
                    {...filterBadge.resetButton}
                  />
                </Group>
              ) : null}
            </Stack>
          </Group>

          <Stack {...childrenStackProps}>
            {downloadButton && downloadButton.length > 0 ? (
              <Group px="md">
                {downloadButton.map((obj, i) => (
                  <DownloadButton
                    leftIcon={<IconDownload size="20px" />}
                    url={obj.url}
                    label={obj.label}
                    fileName={obj.fileName}
                    key={i}
                    trackDownloadAction={obj.trackDownloadAction}
                  />
                ))}
              </Group>
            ) : null}
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
            // leftIcon={<IconChevronLeft size="1rem" />}
            label={t('commonTypography.back')}
            mt="lg"
            {...enebleBackBottomInner}
          />
        ) : null}
      </Paper>
      {enebleBackBottomOuter ? (
        <Group
          w="100%"
          mt="lg"
          position={enebleBackBottomOuter ? 'apart' : 'right'}
        >
          <PrimaryButton
            type="button"
            variant="outline"
            // leftIcon={<IconChevronLeft size="1rem" />}
            label={t('commonTypography.back')}
            {...enebleBackBottomOuter}
          />
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
