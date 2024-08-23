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
        d="M5.96967 15.5303C6.26256 15.8232 6.73744 15.8232 7.03033 15.5303L12.5 10.0607L17.9697 15.5303C18.2626 15.8232 18.7374 15.8232 19.0303 15.5303C19.3232 15.2374 19.3232 14.7626 19.0303 14.4697L13.0303 8.46967C12.7374 8.17678 12.2626 8.17678 11.9697 8.46967L5.96967 14.4697C5.67678 14.7626 5.67678 15.2374 5.96967 15.5303Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
