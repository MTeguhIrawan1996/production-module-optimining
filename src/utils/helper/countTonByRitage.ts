export const countTonByRitage = (
  value1: string | number | null,
  value2: string | number | null
) => {
  if (value1 && value2) {
    const amount = Number(value1) * Number(value2);
    return amount.toFixed(2);
  }
  return null;
};
