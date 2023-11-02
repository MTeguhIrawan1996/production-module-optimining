import { Box, createStyles, Divider, Flex, Stack, Title } from '@mantine/core';
import * as React from 'react';

import {
  DashboardCard,
  KeyValueList,
  NextImageFill,
} from '@/components/elements';

const useStyles = createStyles(() => ({
  image: {
    backgroundPosition: 'center',
  },
}));

const ReadCompanyBook = () => {
  const { classes } = useStyles();
  return (
    <Stack spacing="md">
      <Title order={1} fw={500} fz={32} color="dark.4">
        PT. ABC Tbk.
      </Title>
      <DashboardCard
        title="Perusahaan"
        pb={0}
        paperStackProps={{ spacing: 0 }}
        childrenStackProps={{ spacing: 0 }}
        updateButton={{
          label: 'Edit',
        }}
      >
        <Divider my="md" />
        <Flex gap="xs">
          <Box sx={{ flex: 1.3 }}>
            <KeyValueList
              data={[
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
              ]}
              type="grid"
              keySpan={5}
              valueSpan={7}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <NextImageFill
              src="/images/_mantine-contextmenu__next_static_media_1.637fffdd.webp"
              alt="Example"
              figureProps={{
                h: 280,
                w: 280,
                radius: 'xs',
              }}
              imageClassName={classes.image}
            />
          </Box>
        </Flex>
        <Divider my="lg" />
        <Flex gap="xs">
          <Box sx={{ flex: 1.3 }}>
            <KeyValueList
              data={[
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
                { dataKey: 'example', value: 'tes' },
              ]}
              type="grid"
              keySpan={5}
              valueSpan={7}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <NextImageFill
              src="/images/_mantine-contextmenu__next_static_media_1.637fffdd.webp"
              alt="Example"
              figureProps={{
                h: 200,
                w: 280,
                radius: 'xs',
              }}
              imageClassName={classes.image}
            />
          </Box>
        </Flex>
        <Divider my="md" />
      </DashboardCard>
    </Stack>
  );
};

export default ReadCompanyBook;
