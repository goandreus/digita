import React from 'react';
import {TextStyle, View} from 'react-native';
import {ColorType} from '@theme/colors';
import TextCustom from '@atoms/extra/TextCustom';

type BreeTextVariation = 'h0' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type AmorSansVariation = 'p0' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
type TextCustomVariation = BreeTextVariation | AmorSansVariation;

type DirectionFlexType = 'row' | 'column'
type TextCustomWeight = 'normal' | 'bold';

interface TextTitleValueProps {
  text1: string;
  text2: string;
  text1Variation?: TextCustomVariation;
  text2Variation?: TextCustomVariation;
  text1Color?: ColorType;
  text2Color?: ColorType;
  text1weight?: TextCustomWeight;
  text2weight?: TextCustomWeight;
  directionFlex?: DirectionFlexType;
  marginRight?: number; 
  style?: TextStyle;

}

const TextTitleValue = ({
  text1,
  text2,
  text1Variation,
  text2Variation,
  text1Color,
  text2Color,
  text1weight = 'normal',
  text2weight = 'normal',
  directionFlex = 'row',
  marginRight = 2,
  style,
}: TextTitleValueProps) => {
  return (
    <View style={{ flexDirection: directionFlex, alignItems: 'center' , ...style }}>
      <TextCustom 
        text={text1}
        variation={text1Variation}
        color={text1Color}
        weight={text1weight}
        style={{marginRight: directionFlex === 'row' ? marginRight : 0}}
      />
      <TextCustom 
        text={text2}
        variation={text2Variation}
        color={text2Color}
        weight={text2weight}
      />
    </View>
  );
};

export default TextTitleValue;
