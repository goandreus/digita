function formatNumberWithCommas(number: number) {
  const isInteger = Number.isInteger(number);
  const parts = number.toString().split('.');

  if (parts.length === 1) {
    parts.push('00');
  } else if (parts[1].length === 1) {
    parts[1] += '0';
  }

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (isInteger && parts.length === 1) {
    parts.push('00');
  }

  return parts.join('.');
}

export default formatNumberWithCommas;
