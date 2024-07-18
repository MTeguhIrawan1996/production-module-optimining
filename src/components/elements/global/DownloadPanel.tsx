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

import { useCancelDownloadTask } from '@/services/graphql/mutation/download/useCancelDownloadTask';
import {
  IReadAllDownloadData,
  useReadAllCommonDownload,
} from '@/services/graphql/query/download/useReadAllCommonDownload';
import { downloadTaskFn } from '@/utils/helper/downloadTask';
import { useDownloadTaskStore } from '@/utils/store/useDownloadStore';

const DownloadPanel = () => {
  const [value, setValue] = React.useState<string | null>('customization');
  const [{ downloadIds, isOpen }, setDownloadTaskStore] = useDownloadTaskStore(
    (state) => [state.downloadPanel, state.setDownloadTaskStore],
    shallow
  );

  const [currentData, setCurrentData] = React.useState<IReadAllDownloadData[]>(
    []
  );
  const runningStatus = ['progress', 'active', 'waiting'];
  const complatedStatus = ['completed'];
  const errorStatus = ['failed', 'stalled', 'removed', 'canceled'];

  useReadAllCommonDownload({
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
    onSuccess: async ({ findDownloadTasks }) => {
      if (downloadIds && downloadIds?.length >= 1 && !isOpen) {
        setDownloadTaskStore({
          downloadPanel: {
            isOpen: true,
          },
        });
      }
      const allTask = findDownloadTasks.data;

      for (const task of allTask) {
        if (runningStatus.includes(task.status)) {
          setCurrentData((prev) => {
            const prevWitoutCurrentStatus = prev.filter(
              (o) => o.id !== task.id
            );
            return [...prevWitoutCurrentStatus, task];
          });
        }
        if (complatedStatus.includes(task.status)) {
          setCurrentData((prev) => {
            const prevWitoutCurrentStatus = prev.filter(
              (o) => o.id !== task.id
            );
            return [...prevWitoutCurrentStatus, task];
          });
          notifications.show({
            color: 'green',
            title: 'Download berhasil',
            message: `Data ${task.name} berhasil didownload` /* Fix Me Name File */,
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
          if (downloadIds && downloadIds?.includes(task.id)) {
            await downloadTaskFn(task.filePath);
          }
        }
        if (errorStatus.includes(task.status)) {
          setCurrentData((prev) => {
            const prevWitoutCurrentStatus = prev.filter(
              (o) => o.id !== task.id
            );
            return [...prevWitoutCurrentStatus, task];
          });
          notifications.show({
            color: 'red',
            title: 'Download gagal',
            message: `Data ${task.name} gagal didownload` /* Fix Me Name File */,
            icon: <IconX />,
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
      }
    },
  });

  const [execute] = useCancelDownloadTask({});

  const handleCancelDownload = async (id: string) => {
    await execute({
      variables: {
        id,
      },
    });
    setCurrentData((prev) => {
      return prev.map((task) =>
        task.id === id ? { ...task, status: 'canceled' } : task
      );
    });
    if (downloadIds && downloadIds.length > 1) {
      const index = downloadIds && downloadIds.indexOf(id);
      // Hapus ID dari downloadIds setelah berhasil diunduh
      const newDownloadIds = [...downloadIds];
      newDownloadIds.splice(index, 1);

      setDownloadTaskStore({
        downloadPanel: {
          downloadIds: newDownloadIds,
        },
      });
    }
  };

  React.useEffect(() => {
    if (downloadIds && downloadIds?.length === 0) {
      setCurrentData([]);
      setDownloadTaskStore({
        downloadPanel: {
          isOpen: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                      Download {currentData.length || '-'} Item
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
                          setCurrentData([]);
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
                    {currentData.map((value) => {
                      const fileName = value.name || '-';
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
                            {runningStatus.includes(value.status) && (
                              <Loader color="gray.5" size="sm" />
                            )}
                            {value.status === 'progress' && (
                              <ActionIcon
                                component="span"
                                onClick={() => handleCancelDownload(value.id)}
                              >
                                <IconX size="1.5rem" />
                              </ActionIcon>
                            )}
                            {value.status === 'completed' && (
                              <ThemeIcon size="sm" radius="xl">
                                <IconCheck />
                              </ThemeIcon>
                            )}
                            {errorStatus.includes(value.status) && (
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
