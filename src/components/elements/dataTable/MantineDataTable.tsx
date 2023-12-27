import { Box, createStyles, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DataTable, DataTableProps } from 'mantine-datatable';
import * as React from 'react';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import NextImageFill from '@/components/elements/global/NextImageFill';
import GlobalPagination, {
  IPaginationProps,
} from '@/components/elements/pagination/GlobalPagination';

import { EmptyStateImage } from '@/utils/constants/image';

const useStyles = createStyles((theme) => ({
  header: {
    '&& th': {
      backgroundColor: theme.colors.gray[1],
      color: theme.colors.dark[6],
      fontWeight: 500,
      fontSize: 16,
    },
  },
  figure: {
    width: 280,
    height: 280,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
  },
  image: {
    backgroundPosition: 'center',
  },
}));

interface IEmptyStateProps {
  actionButton?: IPrimaryButtonProps;
  title: string;
}

interface IMantineDataTableProps<T> {
  tableProps: DataTableProps<T>;
  emptyStateProps?: IEmptyStateProps;
  paginationProps?: IPaginationProps;
}

export default function MantineDataTable<T>({
  tableProps,
  emptyStateProps,
  paginationProps,
}: IMantineDataTableProps<T>) {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const {
    fetching,
    loaderBackgroundBlur = 2,
    fontSize = 12,
    horizontalSpacing = 'xs',
    verticalSpacing = 'xs',
    borderRadius = 6,
    shadow = 'xs',
    highlightOnHover = true,
    withBorder = true,
    withColumnBorders = false,
    borderColor = theme.colors.gray[3],
    rowBorderColor = theme.colors.gray[3],
    verticalAlignment = 'center',
    defaultColumnProps,
    minHeight = 520,
    ...rest
  } = tableProps;

  return (
    <Stack w="100%" sx={{ zIndex: 1 }}>
      <DataTable
        className={classes.header}
        loaderBackgroundBlur={loaderBackgroundBlur}
        fetching={fetching}
        shadow={shadow}
        withBorder={withBorder}
        withColumnBorders={withColumnBorders}
        borderRadius={borderRadius}
        borderColor={borderColor}
        rowBorderColor={rowBorderColor}
        fontSize={fontSize}
        horizontalSpacing={horizontalSpacing}
        verticalSpacing={verticalSpacing}
        verticalAlignment={verticalAlignment}
        highlightOnHover={highlightOnHover}
        minHeight={
          tableProps.records && tableProps.records?.length < 1
            ? minHeight
            : fetching
            ? 280
            : minHeight !== 520
            ? minHeight
            : 140
        }
        defaultColumnProps={{
          textAlignment: 'center',
          ...defaultColumnProps,
        }}
        defaultColumnRender={(row, _, accessor) => {
          const data = row[accessor as keyof typeof row];
          return data ? data : '-';
        }}
        noRecordsIcon={<></>}
        noRecordsText=""
        emptyState={
          tableProps.records && tableProps.records?.length < 1
            ? ((
                <Stack align="center" spacing="xs" py="md" sx={{ zIndex: 10 }}>
                  <NextImageFill
                    alt="EmptyState"
                    src={EmptyStateImage}
                    figureClassName={classes.figure}
                  />
                  <Stack spacing="xs" align="center">
                    <Text fw={700} fz={26} color="dark.4" align="center">
                      {emptyStateProps?.title}
                    </Text>
                    {emptyStateProps && emptyStateProps?.actionButton ? (
                      <Box
                        sx={{
                          pointerEvents: 'auto',
                        }}
                      >
                        <PrimaryButton
                          leftIcon={<IconPlus size="20px" />}
                          {...emptyStateProps?.actionButton}
                        />
                      </Box>
                    ) : null}
                  </Stack>
                </Stack>
              ) as any)
            : null
        }
        {...rest}
      />
      {tableProps.records &&
      tableProps.records.length > 0 &&
      paginationProps ? (
        <GlobalPagination {...paginationProps} />
      ) : null}
    </Stack>
  );
}
