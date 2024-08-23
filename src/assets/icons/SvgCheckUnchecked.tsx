import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { SvgProp } from './types';

export default ({ color = 'black', width, height, style }: SvgProp) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" style={style}>
            <Circle cx="8" cy="8" r="7.5" fill="none" stroke={color} />
        </Svg>
    );
};
