import { Text, TextProps } from '@mantine/core';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';

import useComponentsStyle from '@/styles/Global/components';

// import useComponentsStyle from '@/styles/Global/components';

export type PrimaryLinkProps = {
  href: string;
  openNewTab?: boolean;
  className?: string;
  label?: string;
  nextLinkProps?: Omit<LinkProps, 'href'> & React.ComponentPropsWithRef<'a'>;
} & TextProps;

const PrimaryLink = React.forwardRef<HTMLAnchorElement, PrimaryLinkProps>(
  ({ href, openNewTab, className, label, nextLinkProps, ...rest }, ref) => {
    const { classes, cx } = useComponentsStyle();

    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith('/') && !href.startsWith('#');

    if (!isNewTab) {
      return (
        <Link href={href} ref={ref} {...nextLinkProps}>
          <Text
            component="span"
            className={cx(classes.primaryLink, className)}
            {...rest}
          >
            {label}
          </Text>
        </Link>
      );
    }

    return (
      <a ref={ref} target="_blank" rel="noopener noreferrer" href={href}>
        <Text
          component="span"
          className={cx(classes.primaryLink, className)}
          {...rest}
        >
          {label}
        </Text>
      </a>
    );
  }
);

export default PrimaryLink;
