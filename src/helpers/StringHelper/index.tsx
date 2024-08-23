import _ from 'lodash';
import emojiRegex from 'emoji-regex';

const _emojiRegex = emojiRegex();

type hideWithCharType = 'phone' | 'email';
type formatType = 'phone' | 'email';
type encourageType = 'numeric' | 'aplhanumeric' | 'email' | 'password';

export const formatString = (type: formatType, text: string, hid: boolean = false, includeSpaces: boolean = false) => {
  switch (type) {
    case 'phone':
      if(hid)return text.slice(0,2) + "****" + text.slice(6,9);
      else {
        if(includeSpaces)return text.slice(0,3) + " " + text.slice(3,6) + " " + text.slice(6,9);
        else return text;
      }
    case 'email':
      if(hid){
        const chunks = text.split("@");
        return (chunks[0].slice(0,2) + '***' + chunks[0].slice(-2) + "@***" + chunks[1].slice(-6)).toLocaleLowerCase();
      }
      else return text.toLocaleLowerCase();
  }
}

export const hideWithChar = (
  type: hideWithCharType,
  text: string,
  char: string = '*',
): string => {
  const fillWithChar = (text: string, char: string) => {
    const textLength = text.length;
    const textPart = textLength / 3;
    return text.replace(
      text.substring(textPart, textPart * 2),
      char.repeat(textPart),
    );
  };

  let hid = text;

  switch (type) {
    case 'phone':
      hid = fillWithChar(text, char);
      break;
    case 'email':
      {
        const sides = _.split(text, '@', 2);
        const hideSideFirst = fillWithChar(sides[0], char);
        const hideSideSecond = fillWithChar(sides[1], char);
        hid = `${hideSideFirst}@${hideSideSecond}`;
      }
      break;
  }

  return hid;
};

export const encourage = (text: string, type: encourageType): string => {
  let encouraged: string;
  switch (type) {
    case 'numeric':
      encouraged = text.replace(/[^0-9]/g, '');
      break;
    case 'aplhanumeric':
      encouraged = text.replace(/[^a-z0-9]/gi, '');
      break;
    case 'email':
      encouraged = text.replace(/\s/g, '');
      break;
    case 'password':
      encouraged = text.replace(/\s/g, '');
      encouraged = encouraged.replace(_emojiRegex, '');
      break;
  }
  return encouraged;
};

export const capitalizeFull = (text: string) => {
  const capitalizer = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return text.split(' ').map(capitalizer).join(' ')
};