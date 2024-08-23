import React from 'react';
import {Pressable, View} from 'react-native';
import TextCustom from '@atoms/TextCustom';
import Icon, {IconName} from '@atoms/Icon';
import {COLORS, Colors} from '@theme/colors';

interface ProductTitleProps {
  title: string;
  iconName: IconName;
  showMore?: boolean;
  bree?: boolean;
  size?: number;
  marginRight?: number;
  action?: () => void;
}

const ProductTitle = ({
  title,
  iconName,
  showMore,
  bree,
  size,
  marginRight,
  action,
}: ProductTitleProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          style={{marginRight: marginRight ?? 4}}
          name={iconName}
          size={size ?? 'small'}
          fill="#CA005D"
        />
        <TextCustom
          text={title}
          variation={bree ? 'h2' : 'p'}
          weight={bree ? 'normal' : 'bold'}
          size={18}
          color={COLORS.Primary.Medium}
        />
      </View>
      {showMore && (
        <View style={{flexDirection: 'row'}}>
          <Pressable
            onPress={action}
            style={{flexDirection: 'row', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
              <TextCustom
                text="Ver todo"
                variation="h2"
                weight="normal"
                size={14}
                color={COLORS.Primary.Dark}
              />
              <Icon
                name="arrow-right-primary-color"
                fill="#A2004A"
                size="tiny"
                style={{marginLeft: 6}}
              />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ProductTitle;
