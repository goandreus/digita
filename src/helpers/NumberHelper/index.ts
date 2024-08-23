export const formatAmount = (amount: number | string) => {
  const newAmount = Number(amount);
  const formatedAmount = new Intl.NumberFormat('en-EN', {}).format(newAmount);
  if (!String(newAmount).includes('.')) {
    return String(formatedAmount) + '.00';
  }
  return formatedAmount;
};

export const formatDate = (date: string, time: string) => {
  const newDate = date.split('-');
  const newTime = time.split(':');
  const year = Number(newDate[0]);
  const month = Number(newDate[1]);
  const day = Number(newDate[2]);
  const hour = Number(newTime[0]);
  const formatedDate = new Date(Date.UTC(year, month, day, hour));
  const result = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(formatedDate);
  return result;
};

export const formatPhoneNumber = (value: string) => {
  // Eliminar todos los caracteres no numéricos del valor ingresado
  const cleanedValue = value.replace(/\D/g, '');

  // Dividir el valor en grupos de tres dígitos separados por espacios
  const formattedValue = cleanedValue.replace(/(\d{3})(?=\d)/g, '$1 ');

  return formattedValue;
};
