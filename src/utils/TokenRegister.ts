type TypeToken = 'LOGIN';

export class TokenRegister {
  static tokens: Record<TypeToken, string | null> = {
    LOGIN: null,
  };

  static getToken(type: TypeToken): string | null {
    return this.tokens[type];
  }

  static updateToken(type: TypeToken, value: string | null): boolean {
    this.tokens[type] = value;
    return true;
  }
}
