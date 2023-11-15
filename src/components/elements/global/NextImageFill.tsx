import { createStyles, Paper, PaperProps } from '@mantine/core';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

export interface INextImageFillProps extends ImageProps {
  figureClassName?: string;
  figureProps?: PaperProps;
  imageClassName?: string;
}

const useStyles = createStyles(() => ({
  image: {
    objectFit: 'cover',
    backgroundPosition: 'center',
  },
}));

export default function NextImageFill({
  src,
  alt,
  imageClassName,
  figureClassName,
  figureProps,
  quality = 100,
  placeholder = 'empty',
  loading = 'lazy',
  ...rest
}: INextImageFillProps) {
  const { classes, cx } = useStyles();
  const [isLoading, setLoading] = React.useState(true);
  const {
    pos = 'relative',
    h = 200,
    w = 200,
    ...figureRest
  } = figureProps || {};

  return (
    <Paper
      pos={pos}
      h={h}
      w={w}
      sx={{
        overflow: 'hidden',
      }}
      className={cx(
        isLoading && 'animated-pulse figureBgAnimation',
        figureClassName
      )}
      {...figureRest}
    >
      <Image
        src={src}
        quality={quality}
        alt={alt}
        fill
        className={cx(
          classes.image,
          'duration-700 ease-in-out',
          isLoading ? 'blur-xl' : ' blur-0',
          imageClassName
        )}
        placeholder={placeholder}
        loading={loading}
        onLoadingComplete={() => setLoading(false)}
        sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
        {...rest}
      />
    </Paper>
  );
}
