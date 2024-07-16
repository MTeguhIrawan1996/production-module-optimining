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
import { notifications } from '@mantine/notifications';
import { IconChevronUp } from '@tabler/icons-react';
import { IconCheck, IconX } from '@tabler/icons-react';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { useReadAllCommonDownload } from '@/services/graphql/query/download/useReadAllCommonDownload';
import { downloadTaskFn } from '@/utils/helper/downloadTask';
import { useDownloadTaskStore } from '@/utils/store/useDownloadStore';

const DownloadPanel = () => {
  const [value, setValue] = React.useState<string | null>('customization');
  const [{ downloadIds, isOpen }, setDownloadTaskStore] = useDownloadTaskStore(
    (state) => [state.downloadPanel, state.setDownloadTaskStore],
    shallow
  );

  const { data, isFetching } = useReadAllCommonDownload({
    variable: {
      ids: downloadIds || [],
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Download Gagal',
        message: 'Terjadi Kesalahan',
        icon: <IconX />,
      });
    },
    onSuccess: async (data) => {
      if (downloadIds && downloadIds?.length >= 1 && !isOpen) {
        setDownloadTaskStore({
          downloadPanel: {
            isOpen: true,
          },
        });
      }

      const tasksComplated = data.findDownloadTasks.data.filter(
        (v) => v.status === 'completed'
      );

      for (const task of tasksComplated) {
        await downloadTaskFn(task.filePath);
        notifications.show({
          color: 'green',
          title: 'Proses Download berhasil',
          message: `Data ${task.entity} sedang didownload` /* Fix Me Name File */,
          icon: <IconCheck />,
        });

        if (downloadIds) {
          const index = downloadIds && downloadIds.indexOf(task.id);
          // Hapus ID dari downloadIds setelah berhasil diunduh
          const newDownloadIds = [...downloadIds];
          newDownloadIds.splice(index, 1);

          setDownloadTaskStore({
            downloadPanel: {
              downloadIds: newDownloadIds,
            },
          });
        }
      }
    },
  });

  React.useEffect(() => {
    if (!data) {
      setDownloadTaskStore({
        downloadPanel: {
          isOpen: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Affix position={{ bottom: rem(20), right: rem(20) }}>
      <Transition transition="slide-up" mounted={isOpen || false}>
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
                      const parts = value.filePath?.split('/');
                      const fileName =
                        (parts && parts[parts.length - 1]) ||
                        '-'; /* Fix Me name file */
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
                            {(isFetching ||
                              value.status === 'progress' ||
                              value.status === 'active' ||
                              value.status === 'waiting') && (
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
                            {value.status === 'failed' ||
                              (value.status === 'stalled' && (
                                <ThemeIcon size="sm" radius="xl" color="red">
                                  <IconX />
                                </ThemeIcon>
                              ))}
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
