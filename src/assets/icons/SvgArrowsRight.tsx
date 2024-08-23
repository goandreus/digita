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
        d="M8.46967 18.0303C8.17678 17.7374 8.17678 17.2626 8.46967 16.9697L13.9393 11.5L8.46967 6.03033C8.17678 5.73744 8.17678 5.26256 8.46967 4.96967C8.76256 4.67678 9.23744 4.67678 9.53033 4.96967L15.5303 10.9697C15.8232 11.2626 15.8232 11.7374 15.5303 12.0303L9.53033 18.0303C9.23744 18.3232 8.76256 18.3232 8.46967 18.0303Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
