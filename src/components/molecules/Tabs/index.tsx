import {View} from 'react-native';
import React, {createContext, ReactElement, useCallback, useState} from 'react';

interface TabProps {
  children?: ReactElement | ReactElement[];
}

interface TabState {
  activeTab: number;
  numberTabs: number | null;
}

interface TabContextValue extends TabState {
  setTabActive: (activeTab: number) => void;
  setNumberTabs: (numberTabs: number) => void;
}

export const TabContext = createContext<TabContextValue>({
  activeTab: 0,
  numberTabs: null,
  setTabActive: () => {},
  setNumberTabs: () => {},
});

const Tabs = ({children}: TabProps) => {
  const [stateTab, setStateTab] = useState<TabState>({
    activeTab: 0,
    numberTabs: null,
  });

  const setTabActive = useCallback((activeTab: number) => {
    setStateTab(prevState => ({...prevState, activeTab}));
  }, []);

  const setNumberTabs = useCallback((numberTabs: number) => {
    setStateTab(prevState => ({...prevState, numberTabs}));
  }, []);

  return (
    <TabContext.Provider value={{...stateTab, setTabActive, setNumberTabs}}>
      <View>{children}</View>
    </TabContext.Provider>
  );
};

export default Tabs;
