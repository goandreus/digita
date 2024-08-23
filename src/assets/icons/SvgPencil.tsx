import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

export default ({color = '#CA005D', width = 12, height = 12}: SvgProp) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11.888 2.821L9.178.112a.383.383 0 00-.541 0L7.003 1.746l-.001.002L.799 7.95a.382.382 0 00-.105.195L.008 11.54a.383.383 0 00.451.451l3.396-.686a.381.381 0 00.195-.105l7.838-7.838a.383.383 0 000-.542zM4.862 9.305L2.695 7.138 7.273 2.56 9.44 4.727 4.862 9.305zM3.59 10.578l-2.716.55.549-2.717.731-.732L4.32 9.847l-.73.73zm6.393-6.393L7.815 2.018 8.908.925l2.167 2.167-1.093 1.093z"
        fill={color}
      />
    </Svg>
  );
};
