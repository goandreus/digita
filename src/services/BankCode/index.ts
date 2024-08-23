import { ProductDomain } from '@global/information';
import { Fetch } from '@utils/apiFetch';
import { apiGeeStatus, createHeadersApiGee } from '@utils/firebase';
import { getToken } from '@utils/getToken';

export interface BankCodeQuery {
  data: BankCodeData;
  errorCode: string;
  isSuccess: boolean;
  isWarning: boolean;
  message: string;
}

export interface BankCodeData {
  banks: BankCode[];
}

export interface BankCode {
  bankCode: number;
  bankName: string;
}

export const getBankCodes = async () => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/banks' : '/api/transfers/banks'}`;

  const res = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    closeSessionOnError: true,
    isSecure: isAPIGee,
  })
  if (!res || res.data.isWarning) return null;

  const rawBankCodes = res.data.banks;

  const newBankCodes = new Map<number, string>();

  for (const bankCode of rawBankCodes) {
    newBankCodes.set(bankCode.bankCode, bankCode.bankName);
  }

  return newBankCodes;
};
