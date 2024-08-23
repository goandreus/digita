import React, {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {CatalogueContext} from '@contexts/CatalogueContext';
import {CatalogueItem, getCatalogue} from '@services/Catalogue';
import {ConfigGlobal} from '@global/information';
import { activateRemoteConfig } from '@utils/firebase';
import crashlytics from '@react-native-firebase/crashlytics';

interface CatalogueProviderProps {
  children: ReactNode;
}

const CatalogueProvider = ({children}: CatalogueProviderProps) => {
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);

  const asyncConfigInit = useCallback(async () => {
    crashlytics().log('Activate and fetch remote config')
    try {
      await activateRemoteConfig()
      getCatalogue({screen: 'HomeScreen'})
      .then(data => setCatalogue(data))
      .catch(error => {
        console.error(error);
      });
    } catch (error) {
      crashlytics().recordError(new Error(`Remote Values Error: ${error}`));
    }
  }, [])

  useEffect(() => {
    asyncConfigInit()
  }, [asyncConfigInit]);

  const catalogueFiltered = useMemo(() => {
    return catalogue.filter(
      catalogueItem =>
        !ConfigGlobal.hideDOITypes.includes(catalogueItem.codigo),
    );
  }, [catalogue]);

  return (
    <CatalogueContext.Provider value={catalogueFiltered}>
      {children}
    </CatalogueContext.Provider>
  );
};

export default CatalogueProvider;
