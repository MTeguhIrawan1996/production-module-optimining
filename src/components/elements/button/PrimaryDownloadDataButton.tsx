import { IconDownload } from '@tabler/icons-react';
import * as React from 'react';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';

export type IDownloadDataButtonProps = {
  // trackDownloadAction?: () => void;
} & IPrimaryButtonProps;

const PrimaryDownloadDataButton: React.FC<IDownloadDataButtonProps> = (
  props
) => {
  return (
    <PrimaryButton
      variant="outline"
      leftIcon={<IconDownload size="20px" />}
      fw={500}
      {...props}
    />
  );
};

export default PrimaryDownloadDataButton;
