import { SimpleGrid, Stack, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import NextImageFill from '@/components/elements/global/NextImageFill';

type IImageProps = {
  type: string;
  fileName: string;
  src: string;
  alt: string;
};

interface IGlobalHeaderDetailProps {
  data: IImageProps[];
  title?: string;
}

const GlobalHeaderDetail: React.FC<IGlobalHeaderDetailProps> = ({
  data,
  title,
}) => {
  const { t } = useTranslation('default');

  return (
    <Stack pt={32} spacing="sm">
      <Text fz={24} fw={600} color="brand">
        {t(`commonTypography.${title}`)}
      </Text>
      {data.length ? (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'xs', cols: 1 },
            { maxWidth: 'sm', cols: 2 },
            { maxWidth: 'md', cols: 3 },
          ]}
        >
          {data.map(({ type, src, fileName, alt }, i) => (
            <Stack spacing={8} key={i} justify="flex-end">
              <Text component="span" fw={400} fz={20} color="dark.3">
                {type === '' ? '' : t(`commonTypography.${type}`)}
              </Text>
              <NextImageFill
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${src}`}
                figureProps={{
                  w: '100%',
                }}
                alt={alt}
              />
              <Text
                component="span"
                align="center"
                fw={400}
                fz={12}
                color="dark.5"
              >
                {fileName}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      ) : (
        <Text color="gray.6">{t(`commonTypography.documentNotFound`)}</Text>
      )}
    </Stack>
  );
};

export default GlobalHeaderDetail;
