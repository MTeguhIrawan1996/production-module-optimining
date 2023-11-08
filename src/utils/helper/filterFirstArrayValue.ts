export function filterFirstArrayValue<T>(values: T[], conditional: T): T[] {
  return values.reduce((result: T[], cur: T, index: number, array: T[]) => {
    if (cur === conditional && array.indexOf(conditional) === index) {
      return result;
    }
    return [...result, cur];
  }, []);
}
