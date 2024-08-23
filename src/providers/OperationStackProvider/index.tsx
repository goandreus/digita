import { OperationStackContext } from '@contexts/OperationStackContext';
import React, {ReactNode, useEffect, useMemo, useState} from 'react';

interface OperationStackProviderProps {
  children: ReactNode;
}

const OperationStackProvider = ({children}: OperationStackProviderProps) => {
 
  return (
    <OperationStackContext.Provider value={{
        disableUseFocusEffect: false
    }}>
      {children}
    </OperationStackContext.Provider>
  );
};

export default OperationStackProvider;
