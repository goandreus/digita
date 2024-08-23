import React, {createContext} from 'react';

interface OperationStackContextProps {
    disableUseFocusEffect: boolean
}

export const OperationStackContext = createContext<OperationStackContextProps>({disableUseFocusEffect: false});
