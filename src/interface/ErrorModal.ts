export interface IErrorModal {
  isOpen: boolean;
  errorCode?: string;
  titleButton?: string;
  message: {
    title: string;
    content: string;
  };
}
