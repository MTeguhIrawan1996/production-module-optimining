function convertToBool(value: string): boolean {
  return value === 'Y' ? true : false;
}

function convertToBoolString(value: boolean): string {
  return value ? 'Y' : 'N';
}

export { convertToBool, convertToBoolString };
