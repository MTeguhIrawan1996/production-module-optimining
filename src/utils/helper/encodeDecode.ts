export const encodeFc = async (data: object) => {
  const stream = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  }).stream();
  const compressedReadableStream = (stream as any).pipeThrough(
    new CompressionStream('gzip')
  );
  const compressedBlob = await new Response(compressedReadableStream).blob();
  const compressedArrayBuffer = await compressedBlob.arrayBuffer();
  const compressed = Buffer.from(compressedArrayBuffer).toString('base64');
  return compressed;
};

export const decodeFc = async <T>(data: string) => {
  const compressedBuffer = Buffer.from(data, 'base64');
  const stream = new Blob([compressedBuffer], {
    type: 'application/json',
  }).stream();
  const compressedReadableStream = (stream as any).pipeThrough(
    new DecompressionStream('gzip')
  );
  const blob = await new Response(compressedReadableStream).blob();
  const arrayBuffer = await blob.arrayBuffer();
  const string = Buffer.from(arrayBuffer).toString();
  const obj: T = JSON.parse(string);
  return obj;
};
