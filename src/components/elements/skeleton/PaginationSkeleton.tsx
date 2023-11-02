import { Grid, Group, Skeleton } from '@mantine/core';
import React from 'react';

export default function PaginationSkeleton() {
  // const mediumScreen = useMediaQuery(`(min-width: 768px`);

  return (
    <Grid>
      {/* {mediumScreen && (
        <Grid.Col sm={3}>
          <Group align="center" h="100%">
            <Skeleton width={80} height={16} radius="xl" />
          </Group>
        </Grid.Col>
      )} */}
      <Grid.Col span={12}>
        <Group position="right" spacing={10}>
          <Skeleton width={30} height={30} radius={4} />
          <Skeleton width={30} height={30} radius={4} />
          <Skeleton width={30} height={30} radius={4} />
          <Skeleton width={30} height={30} radius={4} />
          <Skeleton width={30} height={30} radius={4} />
        </Group>
      </Grid.Col>
    </Grid>
  );
}
