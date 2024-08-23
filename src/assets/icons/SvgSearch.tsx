import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProp } from './types';

const SvgSearch = ({
    color = 'black',
    width,
    height,
}: SvgProp) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21 20.9999L16.65 16.6499" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};

export default SvgSearch;