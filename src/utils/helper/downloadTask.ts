export const downloadTaskFn = async (href: string) => {
  return new Promise<void>((resolve) => {
    const parts = href.split('/');
    const fileName = parts[parts.length - 1];
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', `${fileName}`);
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);

    // Berikan waktu agar browser dapat memulai unduhan sebelum melanjutkan
    setTimeout(() => {
      resolve();
    }, 2000); // Penundaan 1 detik
  });
};
