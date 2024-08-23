import {authenticationAccess} from '@services/User';
import { getRemoteValue } from '@utils/firebase';
export class TokenManager {
  private static instance: TokenManager;
  private TOKEN_INIT: string | undefined;
  private TOKEN_BIOMETRY: string | undefined;
  private TOKEN_TRACKING: string | undefined;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public updateToken = (
    type: 'TOKEN_BIOMETRY' | 'TOKEN_TRACKING',
    value: string,
  ): void => {
    switch (type) {
      case 'TOKEN_BIOMETRY':
        this.TOKEN_BIOMETRY = value;
        break;
      case 'TOKEN_TRACKING':
        this.TOKEN_TRACKING = value;
        break;
    }
  };

  public getToken = async (
    type: 'TOKEN_INIT' | 'TOKEN_BIOMETRY' | 'TOKEN_TRACKING',
  ): Promise<string> => {
    switch (type) {
      case 'TOKEN_INIT': {
        if (this.TOKEN_INIT === undefined) {
          const res = await authenticationAccess();
          this.TOKEN_INIT = res.token;
        }
        return this.TOKEN_INIT;
        break;
      }
      case 'TOKEN_BIOMETRY': {
        if (this.TOKEN_BIOMETRY === undefined)
          throw new Error('No se obtuvo el token_biometry.');
        else return this.TOKEN_BIOMETRY;
        break;
      }
      case 'TOKEN_TRACKING': {
        if (this.TOKEN_TRACKING === undefined)
          throw new Error('No se obtuvo el token_tracking.');
        else return this.TOKEN_TRACKING;
        break;
      }
    }
  };

  public async resetToken(
    type: 'TOKEN_INIT' | 'TOKEN_BIOMETRY' | 'TOKEN_TRACKING',
  ): Promise<string | undefined> {
    switch (type) {
      case 'TOKEN_INIT': {
        const res = await authenticationAccess();
        this.TOKEN_INIT = res.token;
        return this.TOKEN_INIT;
      }

      default:
        return this.TOKEN_INIT;
    }
  }
}
