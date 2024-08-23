// import {useAppSelector} from '@hooks/useAppSelector';
import {TokenRegister} from './TokenRegister';
import jwtDecode from 'jwt-decode';

export const getToken = (): string | null => {
  // const token = useAppSelector(state => state.lastUser.token);
  return TokenRegister.getToken('LOGIN');
};

export const getDecodeToken = () => {
  const token = getToken();
  return token ? (jwtDecode(token) as {exp: number}) : null;
};
