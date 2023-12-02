import { Button, ButtonProps } from '@mantine/core';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';

export type LinkButtonProps = {
  href: string;
  openNewTab?: boolean;
  label?: string;
  nextLinkProps?: Omit<LinkProps, 'href'> & React.ComponentPropsWithRef<'a'>;
  buttonProps?: ButtonProps &
    Omit<React.ComponentPropsWithRef<'button'>, 'color'>;
};

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ href, openNewTab, label, nextLinkProps, buttonProps }, ref) => {
    const {
      fz = 14,
      radius = 8,
      fw = 400,
      ref: refButton,
      ...restButton
    } = buttonProps || {};

    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith('/') && !href.startsWith('#');

    if (!isNewTab) {
      return (
        <Link href={href} ref={ref} {...nextLinkProps}>
          <Button
            radius={radius}
            fw={fw}
            fz={fz}
            ref={refButton}
            {...restButton}
          >
            {label}
          </Button>
        </Link>
      );
    }

    return (
      <a ref={ref} target="_blank" rel="noopener noreferrer" href={href}>
        <Button radius={radius} fw={fw} fz={fz} ref={refButton} {...restButton}>
          {label}
        </Button>
      </a>
    );
  }
);

export default LinkButton;
