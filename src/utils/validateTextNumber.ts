export const validateTextNumber = (texto: string) => {
  const regTexto = /^[a-zA-ZÀ-ÿ0-9\ñ\Ñ]*$/;
  return regTexto.test(texto ?? '');
};
