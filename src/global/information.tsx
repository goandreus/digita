import { bool } from "yup";

const ConfigGlobal = {
  hideDOITypes: [2, 9], // 1: DNI, 2: CEm 9:RUC
};

enum Information {
  PhoneContact = '013135000',
  PhoneContactFormatted = '01 313 5000',
  PhoneContactFormattedPretty = '(01) 313 5000',
  PhoneContactFormattedSimple = '01 3135000',
  LandingPage = 'https://www.compartamos.com.pe/Peru',
  TermsAndConditions = 'https://www.compartamos.com.pe/Peru/terminos-y-condiciones',
  PrivacyPolicies = 'https://www.compartamos.com.pe/wcm/connect/a32c7daf-7a58-486b-8a2e-3f8c1b029fe0/Politica+de+Privacidad+de+datos+personales.pdf?MOD=AJPERES',
  AffiliationTerms = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/Constancia.pdf',
  Agencies = 'https://www.compartamos.com.pe/Peru/Agencias',
  KnowMoreLineCredit = 'https://www.compartamos.com.pe/Peru/Credito/CreditoNegocio/Linea-de-credito',
}

enum DocumentsURL {
  AccountOpening = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/contrato_cuenta_ahorros.pdf',
  EntrepreneurAccountOpeningContractDev = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/contrato_pasivos.pdf',
  EntrepreneurAccountOpeningContractQa = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/contrato_pasivos.pdf',
  EntrepreneurAccountOpeningInfoDev = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/cartilla_emprendedor_v_2_0.pdf',
  EntrepreneurAccountOpeningInfotQa = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/cartilla_emprendedor_v_2_0.pdf',
  CreditInsurance = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/contrato_prestamo_menor_cuantia.pdf',
  IndividualInsurance = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/certificado_sp_individual_cf_bd.pdf',
  EconomicInsurance = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/certificado_sp_individual_economico_cf_bd.pdf',
  DataUseConsent = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/constancia_datos_personales.pdf',
  InteroperabilityTermsConditions = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-dev/tyc_interoperabilidad_v1_5.pdf',
  GroupCreditShortFrec = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/contrato_cg_y_certificado_sd_catorcenal.pdf',
  GroupCreditLongFrec = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/contrato_cg_y_certificado_sd_mensual.pdf',
  GroupInsurance = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/certi_sp_grupal.pdf',
  LineCreditContract = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/contrato_prestamo_lineacredito.pdf',
  LineCreditDisburse = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/contrato-disposicionlineacredito.pdf',
  WOWACCOUNTINFO = 'https://storage.googleapis.com/cf-bkt-bancadigital-public-qa/cartilla_wow.pdf',
}

enum ProductDomain {
  authentication = '/channels/party-authentication/api-authentication/v1',
  credits = '/products/loans-and-deposits/api-loan/v1',
  account = '/apiexp/channels-specific/ebranch-operations/api-accounts/v1',
  onboarding = '/channels/party-authentication/api-onboarding/v1',
  creditsApiGee = '/channels/specific-ebranch-operations/api-credits/v1',
  payments = '/apiexp/channels-specific/ebranch-operations/api-payments/v1',
  transfer = '/channels/specific-ebranch-operations/api-transfers/v1',
  customer = '/channels/specific-ebranch-operations/api-customers/v1',
  utils = '/channels/specific-ebranch-operations/api-utils/v1'
}

const ErrorResponse = {
  UNCONTROLLED: '-1',
  CHANGE_ACCOUNT: '494',
  BLOCKED: '102',
};

export {Information, DocumentsURL, ProductDomain, ConfigGlobal, ErrorResponse};
