import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProp } from './types';

const SvgSearchClose = ({
    color = 'black',
    width,
    height,
}: SvgProp) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M11.999 22C17.5219 22 21.999 17.5228 21.999 12C21.999 6.47715 17.5219 2 11.999 2C6.47618 2 1.99902 6.47715 1.99902 12C1.99902 17.5228 6.47618 22 11.999 22Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14.999 9L8.99902 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8.99902 9L14.999 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};

export default SvgSearchClose;