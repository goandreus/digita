import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

const SvgLock = ({color = 'black', width, height, style}: SvgProp) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      style={style}>
      <Path
        d="M16.0606 7.5H3.93935C3.60494 7.5 3.33333 7.78011 3.33333 8.125V16.875C3.33333 17.2199 3.60494 17.5 3.93935 17.5H16.0606C16.3951 17.5 16.6667 17.2199 16.6667 16.875V8.125C16.6667 7.78011 16.3951 7.5 16.0606 7.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.5 7.5V5C7.5 4.33668 7.76354 3.70094 8.23224 3.23224C8.70094 2.76354 9.33668 2.5 10 2.5C10.6633 2.5 11.2991 2.76354 11.7678 3.23224C12.2365 3.70094 12.5 4.33668 12.5 5V7.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SvgLock;
