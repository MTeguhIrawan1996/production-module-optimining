export const objectToArrayValue = <T extends object>(data: T) => {
  const values = Object.keys(data).map((key) => ({
    name: key as keyof T,
    value: data[key],
  }));

  return values;
};
