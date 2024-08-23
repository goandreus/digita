import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProp } from './types';

export default ({ color = 'black', width, height }: SvgProp) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
            <Path d="M1 19H3.4M19 19H16.6M3.4 19V1H16.6V19M3.4 19H7.6M16.6 19H12.4M7.6 19V14.2H12.4V19M7.6 19H12.4M5.8 3.4V6.4H8.8V3.4H5.8ZM11.2 3.4H14.2V6.4H11.2V3.4ZM5.8 8.8H8.8V11.8H5.8V8.8ZM11.2 8.8H14.2V11.8H11.2V8.8Z" stroke={color} strokeWidth="1.5" />
        </Svg>
    );
};


