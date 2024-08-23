import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgProp} from './types';

export default ({color = 'black', width, height, style}: SvgProp) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" style={style}>
            <Path d="M17.1 20.6842H21.5V17.5263L27 22.2632L21.5 27V23.8421H17.1V20.6842ZM24.8 7H7.2C6.61652 7 6.05694 7.2218 5.64437 7.61662C5.23178 8.01143 5 8.54691 5 9.10526V21.7368C5 22.2952 5.23178 22.8307 5.64437 23.2255C6.05694 23.6203 6.61652 23.8421 7.2 23.8421H14.9V21.7368H7.2V11.2105L16 16.4737L24.8 11.2105V17.5263H27V9.10526C27 8.54691 26.7682 8.01143 26.3556 7.61662C25.9431 7.2218 25.3835 7 24.8 7ZM16 14.3684L7.2 9.10526H24.8L16 14.3684Z" fill={color} />
        </Svg>
    );
};
