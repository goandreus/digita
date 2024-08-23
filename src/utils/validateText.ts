export const validateText = (texto: string) => {
  const regTexto = /^[a-zA-ZÀ-ÿ \ñ\Ñ\ ]*$/;
  return regTexto.test(texto ?? '');
};
