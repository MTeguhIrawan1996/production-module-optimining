import { ActionIcon, Box, Tooltip } from '@mantine/core';
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
import { shallow } from 'zustand/shallow';

import { useReadAllCommonDownload } from '@/services/graphql/query/download/useReadAllCommonDownload';
import { downloadTaskFn } from '@/utils/helper/downloadTask';
import { useDownloadTaskStore } from '@/utils/store/useDownloadStore';

const DownloadPanel = () => {
  const [value, setValue] = React.useState<string | null>('customization');
  const [downloadPanel, setDownloadTaskStore] = useDownloadTaskStore(
    (state) => [state.downloadPanel, state.setDownloadTaskStore],
    shallow
  );

  const { data } = useReadAllCommonDownload({
    variable: {
      entity: 'FRONT_PIT',
      timeFilterType: 'DATE_RANGE',
      limit: 2,
      downloadIds: downloadPanel.downloadIds || [],
    },
    onSuccess: async (data) => {
      if (
        downloadPanel.downloadIds &&
        downloadPanel.downloadIds?.length >= 1 &&
        !downloadPanel.isOpen
      ) {
        setDownloadTaskStore({
          downloadPanel: {
            isOpen: true,
          },
        });
      }

      const tasksComplated = data.findDownloadTasks.data.filter(
        (v) => v.status === 'completed'
      );

      const temporaryId: string[] = [];

      for (const task of tasksComplated) {
        await downloadTaskFn(task.filePath);
        temporaryId.push(task.id);
        setDownloadTaskStore({
          downloadPanel: {
            downloadIds: [],
          },
        });
      }
    },
  });

  return (
    <Affix position={{ bottom: rem(20), right: rem(20) }}>
      <Transition transition="slide-up" mounted={downloadPanel.isOpen || false}>
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
                      Download {data?.findDownloadTasks.meta.totalData || '-'}{' '}
                      Item
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
                          setDownloadTaskStore({
                            downloadPanel: {
                              isOpen: false,
                            },
                          });
                        }}
                      >
                        <IconX size="1.5rem" />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack spacing="sm">
                    {data?.findDownloadTasks.data.map((value) => {
                      const parts = value.filePath.split('/');
                      const fileName = parts[parts.length - 1];
                      return (
                        <Group noWrap position="apart" key={value.id}>
                          <Box w="50%">
                            <Tooltip label={fileName}>
                              <Text fw={500} truncate>
                                {fileName || '-'}
                              </Text>
                            </Tooltip>
                          </Box>
                          <Group spacing="xs">
                            {value.status === 'progress' && (
                              <>
                                <Loader color="gray.5" size="sm" />
                                <IconX size="1.5rem" />
                              </>
                            )}
                            {value.status === 'completed' && (
                              <ThemeIcon size="sm" radius="xl">
                                <IconCheck />
                              </ThemeIcon>
                            )}
                            {value.status === 'failed' && (
                              <ThemeIcon size="sm" radius="xl" color="red">
                                <IconX />
                              </ThemeIcon>
                            )}
                          </Group>
                        </Group>
                      );
                    })}
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
