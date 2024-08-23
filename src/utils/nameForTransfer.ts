export const nameForTransfer = (name: string) => {
  let tempName = '';
  const names = name.split(' ');
  const arrNames: string[] = [];

  for (const [i, n] of names.entries()) {
    const str = tempName + n;
    const isValid = str.length < 30;

    // Menos de 30 y no es el utimo
    if (isValid && names.length - 1 !== i) {
      tempName = str + ' ';
      continue;
    }

    // Menos de 30 y es el ultimo
    if (isValid && names.length - 1 === i) {
      arrNames.push(str.trim());
      continue;
    }

    // Mas de 30 y es el ultimo
    if (!isValid && names.length - 1 === i) {
      arrNames.push(tempName.trim(), n);
      continue;
    }

    // Mas de 30 y no es el ultimo
    arrNames.push(tempName.trim());
    tempName = n + ' ';
  }

  return arrNames;
};
