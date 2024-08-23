import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

export default ({color = 'black', width, height, style}: SvgProp) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 6 13"
      fill="none"
      style={style}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.808 5.979L1.136.716C.864.428.448.428.192.716a.827.827 0 000 1.06L4.4 6.5.192 11.225c-.256.305-.256.772 0 1.06.256.287.672.287.944 0l4.672-5.246c.256-.305.256-.773 0-1.06z"
        fill={color}
      />
    </Svg>
  );
};
