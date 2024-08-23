export interface IModalState {
  tokenModal: ITokenModal;
  informativeModal: IinformativeModal;
  sessionModal: ICloseSessionModal;
}

export interface ITokenModal {
  show: boolean;
}
export interface ICloseSessionModal {
  show: boolean;
}

export interface IinformativeModal {
  show: boolean;
  data: {
    title: string;
    content: string;
  };
}
