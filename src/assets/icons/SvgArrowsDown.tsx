import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

export default ({color = 'black', width, height, style}: SvgProp) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={style}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0303 8.46967C17.7374 8.17678 17.2626 8.17678 16.9697 8.46967L11.5 13.9393L6.03033 8.46967C5.73744 8.17678 5.26256 8.17678 4.96967 8.46967C4.67678 8.76256 4.67678 9.23744 4.96967 9.53033L10.9697 15.5303C11.2626 15.8232 11.7374 15.8232 12.0303 15.5303L18.0303 9.53033C18.3232 9.23744 18.3232 8.76256 18.0303 8.46967Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
