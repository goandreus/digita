export interface IUser {
  document?: {
    type: number;
    number: string;
  };
  firstName?: string;
  secret?: string;
  token?: string;
  hasActiveToken?: boolean;
  tokenIsInCurrentDevice?: boolean;
  seedId?: string;
  cellphoneNumber?: string;
  personId?: string;
}
