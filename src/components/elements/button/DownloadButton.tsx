import { Icon } from '@iconify/react';
import { Button, ButtonProps } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import * as React from 'react';

import axiosClient from '@/services/restapi/axiosClient';

export type IDownloadButtonProps = {
  url: string;
  label: string;
  fileName: string;
} & ButtonProps;

const DownloadButton: React.FC<IDownloadButtonProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const axiosAuth = axiosClient();

  const {
    fz = 14,
    radius = 8,
    fw = 400,
    url,
    label,
    fileName,
    ...rest
  } = props;

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axiosAuth.get(`${url}`, {
        responseType: 'blob',
      });
      const urlObj = window.URL.createObjectURL(new Blob([response.data]));
      notifications.show({
        title: 'Selamat',
        message: 'Data berhasil diunduh',
        icon: <Icon icon="mdi:check" />,
        color: 'teal',
      });
      // Create a temporary <a> element to trigger the file download
      const link = document.createElement('a');
      link.href = urlObj;
      link.setAttribute('download', `${fileName}.xlsx`); // Set the desired file name and extension
      document.body.appendChild(link);
      link.click();
      setLoading(false);
      // Clean up the temporary URL and <a> element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setLoading(false);
      notifications.show({
        title: 'Gagal mengunduh data',
        message: error.message,
        icon: <Icon icon="mdi:alert-circle-outline" />,
        color: 'red',
      });
    }
  };

  return (
    <Button
      radius={radius}
      fw={fw}
      fz={fz}
      onClick={() => handleClick()}
      loading={loading}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default DownloadButton;
