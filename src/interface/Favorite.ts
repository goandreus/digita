export interface IFavorite {
  beneficiaryName: string;
  concept: string;
  ctaProCom: string;
  destinationBank: number;
  destinationCCI: null | string;
  documentCountry: number;
  documentNumber: string;
  documentNumberBeneficiary: string;
  documentType: number;
  documentTypeBeneficiary: string;
  firstSurnameBeneficiary: string;
  highDate: Date;
  highUser: string;
  isLocal: boolean;
  modificationDate: Date;
  ownAccount: boolean;
  registryId: number;
  secondSurnameBeneficiary: string;
}

export interface IFavoriteDTO {
  isLocal: boolean;
  concept: string;
  destinationCCI?: string;
  ownAccount: boolean;
  documentTypeBeneficiary?: string;
  documentNumberBeneficiary?: string;
  beneficiaryName?: string;
  firstSurnameBeneficiary?: string;
  secondSurnameBeneficiary?: string;
  compartamosBeneficiaryAccount?: string;
}

export interface IFavoriteUpdate extends Partial<IFavoriteDTO> {
  registryId: number;
}
