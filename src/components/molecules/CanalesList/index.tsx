import React, {useMemo} from 'react';
import {View} from 'react-native';
import CanalListItem from './CanalListItem';


const CanalesList = ({placeIds}: {placeIds: string[]}) => {

  return (
    <View style={{backgroundColor: 'white'}}>
      {placeIds.map(id => (
        <CanalListItem key={id} place={{}} />
      ))}
    </View>
  );
};

export default React.memo(CanalesList);
