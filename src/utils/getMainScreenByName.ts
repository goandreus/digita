export const getMainScreenByName = (name: string) => {
  if (name === 'Main') return 'MainScreen';
  if (name === 'MainOperations') return 'Transfers';

  return name;
};
