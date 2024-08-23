export interface SecondStepPropsInterface {
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
}

export type Places = Place[];

export type Place =
  | {
      description: string;
      id: number;
    }
  | {};
