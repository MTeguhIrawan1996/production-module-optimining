import * as React from 'react';

import { PrimaryDownloadDataButton } from '@/components/elements';
import { IDownloadDataButtonProps } from '@/components/elements/button/PrimaryDownloadDataButton';

interface IDownloadButtonFrontProps extends IDownloadDataButtonProps {}

const DownloadButtonFront: React.FC<IDownloadButtonFrontProps> = (props) => {
  return <PrimaryDownloadDataButton {...props} />;
};

export default DownloadButtonFront;
