enum Colors {
  Primary = '#CA005D',
  PrimaryHover = '#91004B',
  Secondary = '#FFA100',
  SecondaryHover = '#D47600',
  Neutral = '#B5AEA9',
  NeutralHover = '#9C938C',
  GrayBorder = '#C4C4C4',
  GrayBackground = '#EFEFEF',
  GrayDark = '#665F59',
  Disabled = '#C4C4C4',
  Transparent = 'transparent',
  White = 'white',
  Black = 'black',
  TBlack50 = 'rgba(0,0,0,0.5)',
  TBlack10 = 'rgba(0,0,0,0.1)',
  Paragraph = '#83786F',
  Border = '#83786F',
  Placeholder = '#9A9A9A',
  DarkGray = '#665F59',
  GreenCheck = '#4CAF50',
  Error = '#ED001C',
  GrayBackgroundLight = '#F0F0F0',
}

const COLORS = {
  // Brand Colors
  Primary: {
    Lightest: '#FAE6EF',
    Light: '#EFB0CD',
    Medium: '#CA005D',
    Dark: '#A2004A',
    Darkest: '#790038',
  },
  Secondary: {
    Lightest: '#FFF6E6',
    Light: '#FFE2B0',
    Medium: '#FFA100',
    Dark: '#CC8100',
    Darkest: '#996100',
  },
  Neutral: {
    Lightest: '#FFFFFF',
    Light: '#E3E8EF',
    Medium: '#97A3B6',
    Dark: '#697385',
    Darkest: '#222D42',
  },
  Background: {
    Lightest: '#FFFFFF',
    Light: '#F6F6F9',
  },
  Transparent: 'transparent',
  // Feedback Colors
  Success: {
    Lightest: '#E6FAEC',
    Light: '#99CEA9',
    Medium: '#008428',
    Dark: '#00631E',
    Darkest: '#004214',
  },
  Informative: {
    Lightest: '#E5FEFE',
    Light: '#98F7FD',
    Medium: '#0187CB',
    Dark: '#0165AA',
    Darkest: '#003371',
  },
  Warning: {
    Lightest: '#FFF2EB',
    Light: '#FFC399',
    Medium: '#FF6900',
    Dark: '#BF4F00',
    Darkest: '#853700',
  },
  Error: {
    Lightest: '#FFECEC',
    Light: '#F4ABAB',
    Medium: '#E42525',
    Dark: '#AD1C1C',
    Darkest: '#6D1313',
  },
  Alternative: {
    Lightest: '#EDF4FF',
    Light: '#D1E2FF',
    Medium: '#0057E8',
    Dark: '#0044B5',
    Darkest: '#00286B',
  },
};

export type ColorType =
  | 'primary-lightest'
  | 'primary-light'
  | 'primary-medium'
  | 'primary-dark'
  | 'primary-darkest'
  | 'secondary-lightest'
  | 'secondary-light'
  | 'secondary-medium'
  | 'secondary-dark'
  | 'secondary-darkest'
  | 'neutral-lightest'
  | 'neutral-light'
  | 'neutral-medium'
  | 'neutral-dark'
  | 'neutral-darkest'
  | 'background-lightest'
  | 'background-light'
  | 'transparent'
  | 'success-lightest'
  | 'success-light'
  | 'success-medium'
  | 'success-dark'
  | 'success-darkest'
  | 'informative-lightest'
  | 'informative-light'
  | 'informative-medium'
  | 'informative-dark'
  | 'informative-darkest'
  | 'warning-lightest'
  | 'warning-light'
  | 'warning-medium'
  | 'warning-dark'
  | 'warning-darkest'
  | 'error-lightest'
  | 'error-light'
  | 'error-medium'
  | 'error-dark'
  | 'error-darkest'
  | 'alternative-lightest'
  | 'alternative-light'
  | 'alternative-medium'
  | 'alternative-dark'
  | 'alternative-darkest';

export const getColorByText = (color?: ColorType) => {
  switch (color) {
    case 'primary-lightest':
      return COLORS.Primary.Lightest;
    case 'primary-light':
      return COLORS.Primary.Light;
    case 'primary-medium':
      return COLORS.Primary.Medium;
    case 'primary-dark':
      return COLORS.Primary.Dark;
    case 'primary-darkest':
      return COLORS.Primary.Darkest;

    case 'secondary-lightest':
      return COLORS.Secondary.Lightest;
    case 'secondary-light':
      return COLORS.Secondary.Light;
    case 'secondary-medium':
      return COLORS.Secondary.Medium;
    case 'secondary-dark':
      return COLORS.Secondary.Dark;
    case 'secondary-darkest':
      return COLORS.Secondary.Darkest;

    case 'neutral-lightest':
      return COLORS.Neutral.Lightest;
    case 'neutral-light':
      return COLORS.Neutral.Light;
    case 'neutral-medium':
      return COLORS.Neutral.Medium;
    case 'neutral-dark':
      return COLORS.Neutral.Dark;
    case 'neutral-darkest':
      return COLORS.Neutral.Darkest;

    case 'background-lightest':
      return COLORS.Background.Lightest;
    case 'background-light':
      return COLORS.Background.Light;
    case 'transparent':
      return color;

    case 'success-lightest':
      return COLORS.Success.Lightest;
    case 'success-light':
      return COLORS.Success.Light;
    case 'success-medium':
      return COLORS.Success.Medium;
    case 'success-dark':
      return COLORS.Success.Dark;
    case 'success-darkest':
      return COLORS.Success.Darkest;

    case 'informative-lightest':
      return COLORS.Informative.Lightest;
    case 'informative-light':
      return COLORS.Informative.Light;
    case 'informative-medium':
      return COLORS.Informative.Medium;
    case 'informative-dark':
      return COLORS.Informative.Dark;
    case 'informative-darkest':
      return COLORS.Informative.Darkest;

    case 'warning-lightest':
      return COLORS.Warning.Lightest;
    case 'warning-light':
      return COLORS.Warning.Light;
    case 'warning-medium':
      return COLORS.Warning.Medium;
    case 'warning-dark':
      return COLORS.Warning.Dark;
    case 'warning-darkest':
      return COLORS.Warning.Darkest;

    case 'error-lightest':
      return COLORS.Error.Lightest;
    case 'error-light':
      return COLORS.Error.Light;
    case 'error-medium':
      return COLORS.Error.Medium;
    case 'error-dark':
      return COLORS.Error.Dark;
    case 'error-darkest':
      return COLORS.Error.Darkest;

    case 'alternative-lightest':
      return COLORS.Alternative.Lightest;
    case 'alternative-light':
      return COLORS.Alternative.Light;
    case 'alternative-medium':
      return COLORS.Alternative.Medium;
    case 'alternative-dark':
      return COLORS.Alternative.Dark;
    case 'alternative-darkest':
      return COLORS.Alternative.Darkest;

    default:
      return undefined;
  }
};

export {Colors, COLORS};
