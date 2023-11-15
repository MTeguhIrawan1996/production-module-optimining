import { Flex, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  PDF_MIME_TYPE,
} from '@mantine/dropzone';
import { IconUpload, IconX } from '@tabler/icons-react';
import { IconFileUpload } from '@tabler/icons-react';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { CommonProps, IFile } from '@/types/global';

export type IPdfInputDropzoneRhfProps = {
  control: 'pdf-dropzone';
  name: string;
  label?: string;
  description?: string;
  withAsterisk?: boolean;
  serverDocument?: Partial<IFile>[] | null;
} & Omit<DropzoneProps, 'name' | 'children'> &
  CommonProps;

const PdfInputDropzoneRhf: React.FC<IPdfInputDropzoneRhfProps> = ({
  name,
  control,
  description,
  label,
  withAsterisk,
  serverDocument,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const ACCEPTED_MIME_TYPES = [...PDF_MIME_TYPE];
  const theme = useMantineTheme();
  const { field, fieldState } = useController({
    name,
  });

  const previewsMemo: JSX.Element[] = React.useMemo(() => {
    const item = field.value?.map((file: FileWithPath, index: number) => {
      const fileUrl = URL.createObjectURL(file);
      return (
        <iframe
          style={{
            width: '100%',
            height: 400,
            borderRadius: 8,
            borderWidth: 4,
          }}
          src={fileUrl}
          key={index}
          loading="lazy"
        />
      );
    });
    return item;
  }, [field.value]);

  const previewServer = React.useMemo(() => {
    if (serverDocument) {
      const previewsServer: JSX.Element[] = serverDocument.map(
        (file, index: number) => {
          return (
            <iframe
              style={{
                width: '100%',
                height: 400,
                borderRadius: 8,
                borderWidth: 4,
              }}
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${file.url}`}
              key={index}
              loading="lazy"
            />
          );
        }
      );
      return previewsServer;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverDocument]);

  return (
    <Stack spacing={8}>
      <Stack spacing={8}>
        {label && (
          <Text component="label" fw={400} fz={16} sx={{ lineHeight: '1.55' }}>
            {t(`components.field.${label}`)}
            {withAsterisk && (
              <Text component="span" color="red" aria-hidden="true">
                {' '}
                *
              </Text>
            )}
          </Text>
        )}
        {description && (
          <Text component="span" fw={400} fz={14} color="gray.6">
            {t(`components.fieldDescription.${description}`)}
          </Text>
        )}
        <Dropzone
          accept={ACCEPTED_MIME_TYPES}
          data-control={control}
          name={name}
          sx={(theme) => ({
            border: `1px solid ${theme.colors.gray[3]}`,
            '&[data-accept]': {
              color: theme.white,
              backgroundColor: theme.colors.blue[6],
            },
          })}
          radius="xs"
          {...rest}
        >
          <Stack justify="center" align="center" mih={120}>
            <Dropzone.Accept>
              <IconUpload
                size="3.2rem"
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === 'dark' ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size="3.2rem"
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Flex direction="column" justify="center" align="center">
                <IconFileUpload
                  size="40px"
                  stroke={1.5}
                  color={theme.colors.dark[3]}
                />
              </Flex>
            </Dropzone.Idle>
          </Stack>
        </Dropzone>
        {fieldState && fieldState.error && (
          <FieldErrorMessage color="red">
            {fieldState.error.message}
          </FieldErrorMessage>
        )}
      </Stack>
      <SimpleGrid
        cols={1}
        mt={previewsMemo?.length > 0 || previewServer ? 'sm' : 0}
      >
        {previewServer}
        {previewsMemo}
      </SimpleGrid>
    </Stack>
  );
};

export default PdfInputDropzoneRhf;
