import {
  createStyles,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
  PDF_MIME_TYPE,
} from '@mantine/dropzone';
import { IconUpload, IconX } from '@tabler/icons-react';
import { IconFileUpload } from '@tabler/icons-react';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';
import NextImageFill from '@/components/elements/global/NextImageFill';

import { CommonProps, IFile } from '@/types/global';

export type IPdfOrInputDropzoneRhfProps = {
  control: 'pdf-image-dropzone';
  name: string;
  label?: string;
  description?: string;
  withAsterisk?: boolean;
  serverFile?: Partial<IFile>[] | null;
  dropzoneDescription?: 'formatImageDesc' | 'formatPdfOrImageDesc';
} & Omit<DropzoneProps, 'name' | 'children'> &
  CommonProps;

const useStyles = createStyles(() => ({
  image: {
    objectFit: 'cover',
    backgroundPosition: 'center',
  },
}));

const PdfOrImageInputDropzoneRhf: React.FC<IPdfOrInputDropzoneRhfProps> = ({
  name,
  control,
  description,
  label,
  withAsterisk,
  serverFile,
  dropzoneDescription = 'formatImageDesc',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { classes } = useStyles();
  const ACCEPTED_MIME_TYPES = [...PDF_MIME_TYPE, ...IMAGE_MIME_TYPE];
  const theme = useMantineTheme();
  const { field, fieldState } = useController({
    name,
  });
  const localFile: FileWithPath[] = field.value;

  const previewLocal = React.useMemo(() => {
    if (localFile && localFile.length > 0) {
      const item: JSX.Element[] = localFile.map(
        (file: FileWithPath, index: number) => {
          const isImage = IMAGE_MIME_TYPE.includes(file.type as any);
          const fileUrl = URL.createObjectURL(file);
          if (isImage) {
            return (
              <Stack key={index} spacing="xs">
                <NextImageFill
                  alt={file.name}
                  src={fileUrl}
                  figureProps={{
                    h: 400,
                    w: '100%',
                  }}
                  imageClassName={classes.image}
                />
                <Text
                  component="span"
                  align="center"
                  fw={400}
                  fz={12}
                  color="gray.6"
                  truncate
                >
                  {file.name}
                </Text>
              </Stack>
            );
          }
          return (
            <Stack key={index} spacing="xs">
              <iframe
                style={{
                  width: '100%',
                  height: 400,
                  borderRadius: 8,
                  borderWidth: 4,
                }}
                src={fileUrl}
                loading="lazy"
              />
              <Text
                component="span"
                align="center"
                fw={400}
                fz={12}
                color="gray.6"
                truncate
              >
                {file.name}
              </Text>
            </Stack>
          );
        }
      );
      return item;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFile]);

  const previewServer = React.useMemo(() => {
    if (serverFile && serverFile?.length > 0) {
      const item: JSX.Element[] = serverFile.map((file, index: number) => {
        const isImage = IMAGE_MIME_TYPE.includes(file.mime as any);
        if (isImage) {
          return (
            <Stack key={index} spacing="xs">
              <NextImageFill
                alt={file.originalFileName || ''}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${file.url}`}
                figureProps={{
                  h: 400,
                  w: '100%',
                }}
                imageClassName={classes.image}
              />
              <Text
                component="span"
                align="center"
                fw={400}
                fz={12}
                color="gray.6"
                truncate
              >
                {file.originalFileName}
              </Text>
            </Stack>
          );
        }

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
      });
      return item;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverFile]);

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
              <Flex direction="column" gap={4} justify="center" align="center">
                <IconFileUpload
                  size="40px"
                  stroke={1.5}
                  color={theme.colors.dark[3]}
                />
                <Text fz={14} color="brand.5" fw={600}>
                  {t(`components.fieldDescription.dragAndDropFile`)}
                </Text>
                <Text component="span" fz={12} fw={500} color="gray.5">
                  {t(`components.fieldDescription.${dropzoneDescription}`)}
                </Text>
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
        mt={
          (previewLocal && previewLocal?.length > 0) ||
          (previewServer && previewServer?.length > 0)
            ? 'sm'
            : 0
        }
      >
        {previewServer}
        {previewLocal}
      </SimpleGrid>
    </Stack>
  );
};

export default PdfOrImageInputDropzoneRhf;
