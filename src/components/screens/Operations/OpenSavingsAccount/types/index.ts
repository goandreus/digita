export type AccountType = 'entrepreneur' | 'wow' | '';
export interface ThirdStepPropsInterface {
  accountType: AccountType;
  term1: boolean;
  term2: boolean;
  handleTerm1: () => void;
  handleTerm2: () => void;
  goTermsAndConditions: () => void;
  departments: Places;
  provinces: Places;
  selectedDepartment: Place;
  selectedProvince: Place;
  selectDepartment: (department: any) => Promise<void>;
  selectProvince: (province: any) => void;
  rCode: string;
  rCodeValidation: CustomErr;
  handleRCode: (recommendationCode: string) => void;
}

export type CustomErr = {
  error: boolean;
  errorMessage: string;
};

export type Places = Place[];

export type Place =
  | {
      description: string;
      id: number;
    }
  | {};
