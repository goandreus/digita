import _ from 'lodash';

export const sanitizeBase64 = (image: string): string => {
  let temp: string = image;
  temp = temp.replace(/\r\n|\n|\r/gm, '');
  return temp;
};
