import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

const SvgRechargePhone = ({
  color = '#CA005D',
  width = 14,
  height = 20,
}: SvgProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 22" fill="none">
      <Path
        d="M12.5 16.8865H1.47852V3.15168H12.5V6.2085V13.2085V16.8865ZM9 19.8297H5V18.8486H9V19.8297ZM11 0.208496H3C2.20435 0.208496 1.44129 0.51858 0.87868 1.07053C0.316071 1.62249 0 2.3711 0 3.15168V18.8486C0 19.6292 0.316071 20.3778 0.87868 20.9298C1.44129 21.4817 2.20435 21.7918 3 21.7918H11C11.7956 21.7918 12.5587 21.4817 13.1213 20.9298C13.6839 20.3778 14 19.6292 14 18.8486V13.2085V9.7085V6.2085V3.15168C14 2.3711 13.6839 1.62249 13.1213 1.07053C12.5587 0.51858 11.7956 0.208496 11 0.208496Z"
        fill={color}
      />
    </Svg>
  );
};

export default SvgRechargePhone;
