import {Fetch} from '@utils/apiFetch';
import {TokenManager} from '@managers/TokenManager';

export type CatalogueItemTipoType = 'A' | 'N';
export type CatalogueItemPrecisionType = 0 | 1;

export interface CatalogueItem {
  codigo: number;
  descripcion: string;
  descripcionCorta: 'DNI' | 'CE';
  longitud: number;
  precision: CatalogueItemPrecisionType;
  tipo: CatalogueItemTipoType;
}

export const getCatalogue = async ({
  screen,
  user,
}: {
  screen: string;
  user?: string;
}): Promise<CatalogueItem[]> | never => {
  await TokenManager.getInstance().getToken('TOKEN_INIT');

  return [
    {
      codigo: 1,
      descripcion: 'Doc. Nacional de Identidad',
      descripcionCorta: 'DNI',
      longitud: 8,
      precision: 1,
      tipo: 'N',
    },
  ];
};
