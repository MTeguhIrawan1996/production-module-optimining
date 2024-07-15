import { ActionIcon } from '@mantine/core';
import {
  Accordion,
  Affix,
  Group,
  Loader,
  Paper,
  rem,
  Stack,
  Text,
  ThemeIcon,
  Transition,
} from '@mantine/core';
import { IconChevronUp } from '@tabler/icons-react';
import { IconCheck, IconX } from '@tabler/icons-react';
import * as React from 'react';

import { useReadAllCommonDownload } from '@/services/graphql/query/download/useReadAllCommonDownload';

const DownloadPanel = () => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string | null>('customization');

  useReadAllCommonDownload({
    variable: {
      entity: 'FRONT_PIT',
      timeFilterType: 'DATE_RANGE',
    },
    onSuccess: (data) => {
      // eslint-disable-next-line no-console
      console.log(data);
    },
  });
  return (
    <Affix position={{ bottom: rem(20), right: rem(20) }}>
      <Transition transition="slide-up" mounted={open}>
        {(transitionStyles) => (
          <Paper shadow="xs" p={0} radius="md" w={400} style={transitionStyles}>
            <Accordion
              value={value}
              onChange={setValue}
              style={transitionStyles}
              variant="contained"
              defaultValue="customization"
              chevron={false}
              styles={{
                label: {
                  padding: 6,
                },
                control: {
                  padding: 6,
                },
                content: {
                  paddingTop: 6,
                  paddingBottom: 6,
                  paddingRight: 12,
                  paddingLeft: 12,
                },
                chevron: {
                  display: 'none',
                },
              }}
            >
              <Accordion.Item value="customization">
                <Accordion.Control>
                  <Group noWrap position="apart">
                    <Text fw={600} fz={18}>
                      Download 3 Item
                    </Text>
                    <Group spacing="xs">
                      <IconChevronUp
                        size="1.5rem"
                        style={{
                          transform: value ? `rotate(180deg)` : 'none',
                          transition: 'transform 300ms ease',
                        }}
                      />
                      <ActionIcon
                        component="span"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen((prev) => !prev);
                        }}
                      >
                        <IconX size="1.5rem" />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack spacing="sm">
                    <Group noWrap position="apart">
                      <Text fw={500}>Data Front.Doc</Text>
                      <Group spacing="xs">
                        <Loader color="gray.5" size="sm" />
                        <IconX size="1.5rem" />
                        <ThemeIcon size="sm" radius="xl">
                          <IconCheck />
                        </ThemeIcon>
                        <ThemeIcon size="sm" radius="xl" color="red">
                          <IconX />
                        </ThemeIcon>
                      </Group>
                    </Group>
                    <Group noWrap position="apart">
                      <Text fw={500}>Data Front.Doc</Text>
                      <Group spacing="xs">
                        <Loader color="gray.5" size="sm" />
                        <IconX size="1.5rem" />
                        <ThemeIcon size="sm" radius="xl">
                          <IconCheck />
                        </ThemeIcon>
                        <ThemeIcon size="sm" radius="xl" color="red">
                          <IconX />
                        </ThemeIcon>
                      </Group>
                    </Group>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Paper>
        )}
      </Transition>
    </Affix>
  );
};

export default DownloadPanel;
