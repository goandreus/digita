import {createContext, useContext} from 'react';
import {CatalogueItem} from '@services/Catalogue';

export const CatalogueContext = createContext<CatalogueItem[]>([]);

export function useCatalogueContext() {
  return useContext(CatalogueContext);
}
