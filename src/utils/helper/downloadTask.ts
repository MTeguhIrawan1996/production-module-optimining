const validateAndDownloadFile = async (href: string | null) => {
  if (href) {
    // Periksa validitas URL dengan melakukan request HEAD
    const response = await fetch(href, { method: 'HEAD' });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const parts = href.split('/');
    const fileName = parts[parts.length - 1];
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);

    // Berikan waktu agar browser dapat memulai unduhan sebelum melanjutkan
    return new Promise((resolve) => setTimeout(resolve, 3000)); // Penundaan 2 detik
  }
};

export const downloadTaskFn = async (href: string | null) => {
  try {
    await validateAndDownloadFile(href);
  } catch (error) {
    return null;
  }
};
