import React from 'react';
import {Path, Svg} from 'react-native-svg';

const EmptyHeader = () => {
  return (
    <Svg
      // eslint-disable-next-line react-native/no-inline-styles
      style={{alignSelf: 'center'}}
      width="100%"
      height="150"
      viewBox="15 24 360 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        scaleX={1.1}
        d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
        fill="#CA005D"
      />
    </Svg>
  );
};

export default EmptyHeader;
