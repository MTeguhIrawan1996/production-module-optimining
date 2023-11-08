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
} from '@mantine/dropzone';
import { IconPhoto } from '@tabler/icons-react';
import { IconUpload, IconX } from '@tabler/icons-react';
import * as React from 'react';
import { useController, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextButton from '@/components/elements/button/TextButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';
import NextImageFill from '@/components/elements/global/NextImageFill';

import { CommonProps, IFile } from '@/types/global';

export type IImageInputDropzoneRhfProps = {
  control: 'image-dropzone';
  name: string;
  label?: string;
  description?: string;
  withAsterisk?: boolean;
  enableDeletePhoto?: boolean;
  serverPhotos?: Partial<IFile>[] | null;
  deletedPhotoIds?: string[];
  handleDeleteServerPhotos?: (id: string) => void;
} & Omit<DropzoneProps, 'name' | 'children'> &
  CommonProps;

const useStyles = createStyles(() => ({
  image: {
    backgroundPosition: 'center',
  },
}));

const ImageInputDropzoneRhf: React.FC<IImageInputDropzoneRhfProps> = ({
  name,
  control,
  description,
  label,
  withAsterisk,
  enableDeletePhoto,
  serverPhotos,
  deletedPhotoIds,
  handleDeleteServerPhotos,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const ACCEPTED_MIME_TYPES = [...IMAGE_MIME_TYPE];
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { field, fieldState } = useController({
    name,
  });
  const { replace } = useFieldArray({ name });

  const handleRemoveImage = (key: string) => {
    const newFilterFile = field.value?.filter((val: File) => val.name !== key);
    if (newFilterFile) replace(newFilterFile);
  };

  const handleDeleteServerPhotosId = (id: string) => {
    handleDeleteServerPhotos?.(id);
  };

  const ImageMemoLocal = React.useMemo(() => {
    const previewsLocal: JSX.Element[] = field.value?.map(
      (file: FileWithPath, index: number) => {
        return (
          <Stack key={index} align="center" spacing="xs">
            <NextImageFill
              alt={file.name}
              src={URL.createObjectURL(file)}
              figureProps={{
                w: '100%',
                h: 160,
                radius: 'sm',
              }}
              imageClassName={classes.image}
            />
            {enableDeletePhoto ? (
              <TextButton
                label={t('commonTypography.delete', { ns: 'default' })}
                color="red"
                buttonProps={{
                  onClick: () => handleRemoveImage(file.name),
                }}
              />
            ) : null}
          </Stack>
        );
      }
    );

    return previewsLocal;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const ImageMemoServer = React.useMemo(() => {
    if (serverPhotos) {
      const previewsServer: JSX.Element[] = serverPhotos
        ?.filter(
          (file) => !deletedPhotoIds?.some((idDelete) => idDelete === file.id)
        )
        .map((file, index: number) => {
          return (
            <Stack key={index} align="center" spacing="xs">
              <NextImageFill
                alt={file.fileName ?? ''}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${file.url}`}
                figureProps={{
                  w: '100%',
                  h: 160,
                  radius: 'sm',
                }}
                imageClassName={classes.image}
              />
              {enableDeletePhoto ? (
                <TextButton
                  label={t('commonTypography.delete', { ns: 'default' })}
                  color="red"
                  buttonProps={{
                    onClick: () => handleDeleteServerPhotosId(file?.id ?? ''),
                  }}
                />
              ) : null}
            </Stack>
          );
        });
      return previewsServer;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverPhotos, deletedPhotoIds]);

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
          data-control={control}
          name={name}
          accept={ACCEPTED_MIME_TYPES}
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
                <IconPhoto
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
        cols={4}
        breakpoints={[
          { maxWidth: 'sm', cols: 1 },
          { maxWidth: 'md', cols: 2 },
        ]}
        mt={ImageMemoLocal?.length > 0 ? 'sm' : 0}
      >
        {ImageMemoServer}
        {ImageMemoLocal}
      </SimpleGrid>
    </Stack>
  );
};

export default ImageInputDropzoneRhf;
