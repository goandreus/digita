import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProp } from './types';

export default ({ color = 'black', width, height }: SvgProp) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
            <Path d="M10 2.2417L14.7167 6.95837C15.6495 7.89054 16.2848 9.07842 16.5424 10.3717C16.8 11.6651 16.6682 13.0057 16.1638 14.2242C15.6593 15.4426 14.8048 16.484 13.7084 17.2168C12.612 17.9495 11.3229 18.3406 10.0042 18.3406C8.68544 18.3406 7.39633 17.9495 6.29991 17.2168C5.20349 16.484 4.349 15.4426 3.84455 14.2242C3.34009 13.0057 3.20833 11.6651 3.46591 10.3717C3.7235 9.07842 4.35888 7.89054 5.29166 6.95837L10 2.2417Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};


