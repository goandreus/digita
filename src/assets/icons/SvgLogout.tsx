import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

export default ({color = 'black', width, height, style}: SvgProp) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      style={style}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.875 2.5C1.875 2.15482 2.15482 1.875 2.5 1.875H9.99654C10.3417 1.875 10.6215 2.15482 10.6215 2.5C10.6215 2.84518 10.3417 3.125 9.99654 3.125H3.125V16.875H10C10.3452 16.875 10.625 17.1548 10.625 17.5C10.625 17.8452 10.3452 18.125 10 18.125H2.5C2.15482 18.125 1.875 17.8452 1.875 17.5V2.5Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3081 5.80806C13.5521 5.56398 13.9479 5.56398 14.1919 5.80806L17.9419 9.55806C18.186 9.80214 18.186 10.1979 17.9419 10.4419L14.1919 14.1919C13.9479 14.436 13.5521 14.436 13.3081 14.1919C13.064 13.9479 13.064 13.5521 13.3081 13.3081L16.6161 10L13.3081 6.69194C13.064 6.44786 13.064 6.05214 13.3081 5.80806Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.04167 9.99654C6.04167 9.65136 6.32149 9.37154 6.66667 9.37154H17.5C17.8452 9.37154 18.125 9.65136 18.125 9.99654C18.125 10.3417 17.8452 10.6215 17.5 10.6215H6.66667C6.32149 10.6215 6.04167 10.3417 6.04167 9.99654Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
