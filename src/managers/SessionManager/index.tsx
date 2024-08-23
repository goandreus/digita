export class SessionManager {
  private static instance: SessionManager;
  private _onError?: () => void;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public onError = (callback: () => void) => {
    this._onError = callback;
  };

  public fireError = () => {
    if (this._onError !== undefined) this._onError();
  };
}
