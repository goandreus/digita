import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

export default ({color = '#CA005D', width = 18, height = 18}: SvgProp) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M.75 5.084h14.005l-3.449 3.09.921.826 5.023-4.5L12.227 0l-.921.826 3.45 3.09H.75v1.168z"
        fill={color}
      />
      <Path
        d="M17 12.916H3.495l3.449-3.09L6.022 9 1 13.5 6.022 18l.922-.826-3.45-3.09H17v-1.168z"
        fill={color}
      />
    </Svg>
  );
};
