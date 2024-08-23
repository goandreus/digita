import {WHITE_LIST} from '@constants';

export function validateWhiteList(url: string) {
  const [, uri] = url.split('//');
  const [domain] = uri.split('/');

  if (WHITE_LIST.some(item => item === domain)) {
    return true;
  }
  return false;
}
