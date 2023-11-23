import { decode, encode } from 'js-base64';

export const encodeFc = (data: object) => {
  const value = encode(JSON.stringify(data));

  return value;
};

export const decodeFc = <T>(data: string) => {
  const value = decode(data);
  const obj: T = JSON.parse(value);
  return obj;
};
