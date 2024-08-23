export interface CancellationPayload {
  accountNumber: string;
  accountName: string;
}

export interface CancellationInterfaceRes {
  data: {
    email: string;
    hour: string;
    date: string;
  } | null;
  errorCode: string;
  isSuccess: boolean;
  isWarning: boolean;
  message: string;
}

export type CancellationData = CancellationInterfaceRes['data'];
