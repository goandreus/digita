import {Dimensions, ScaledSize} from 'react-native';

const ScreenSize: ScaledSize = Dimensions.get('window');
const SEPARATOR_BASE = ScreenSize.height * 0.01;

enum Layout {
  ContentMarginHorizontal = '12%',
  ModalMarginHorizontal = '8%',
}

const SIZES = {
  XXS: 4,
  XS: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 64,
};

export {ScreenSize, Layout, SEPARATOR_BASE, SIZES};
