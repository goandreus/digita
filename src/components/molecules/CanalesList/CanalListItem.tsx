import React, {Fragment} from 'react';
import {View} from 'react-native';

import Icon from '@atoms/Icon';
import Button from '@atoms/Button';
import TextCustom from '@atoms/TextCustom';
import { Canal } from 'src/interface/Canal';


const CanalListItem = ({place}: {place: Canal}) => {
  return (
    <Fragment>
      <View
        style={{
          padding: 26,
          flexDirection: 'row',
        }}>
        <Icon name="marker" size="normal" style={{marginRight: 9}} />
        <View>
          <TextCustom
            weight="bold"
            variation="small"
            text={place.properties.category}
          />
          <TextCustom
            weight="bold"
            variation="small"
            text={place.properties.name}
          />
          <TextCustom variation="small" text={place.properties.address} />
          <TextCustom
            variation="small"
            text="Estamos a 1.63 km de tu posición."
            style={{marginBottom: 4}}
          />

          <Button
            text="Ver"
            type="primary"
            orientation="vertical"
            onPress={() => {}}
            containerStyle={{
              width: 60,
              height: 22,
              minHeight: 22,
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
          />
        </View>
      </View>
    </Fragment>
  );
};

export default CanalListItem;
