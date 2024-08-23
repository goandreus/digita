export const validateAccount = (destinationAccount: string) => {
  const regex = /^[0-9]*$/;
  return regex.test(destinationAccount);
};

export const containsOnlyZeros = (str: string) => {
  return str.split('').every(char => char === '0');
};
