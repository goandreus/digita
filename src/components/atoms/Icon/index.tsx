import React, {Suspense} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';

export type SvgIconName =
  | 'icon_arrows_down'
  | 'icon_arrows_right'
  | 'icon_arrows_right_thin'
  | 'icon_arrows_top'
  | 'icon_arrow_back'
  | 'icon_send_money'
  | 'icon_chevron_right'
  | 'icon_chevron_down'
  | 'icon_phone'
  | 'icon_droplet'
  | 'icon_building'
  | 'icon_close'
  | 'icon_lock'
  | 'icon_logout'
  | 'icon_correo'
  | 'icon_token_fill'
  | 'icon_token'
  | 'icon_check'
  | 'icon_star'
  | 'icon_check_unchecked'
  | 'icon_check_checked'
  | 'icon_check_disabled'
  | 'icon_eye_on'
  | 'icon_share'
  | 'icon_share-outline'
  | 'icon_mail-blue'
  | 'icon_clock'
  | 'icon_radio-fill'
  | 'icon_eye_off'
  | 'icon_recharge-bim'
  | 'icon_recharge_phone'
  | 'icon_pay_services'
  | 'icon_pay-credits'
  | 'icon_money-bag'
  | 'icon_transfers'
  | 'icon_Interoperability'
  | 'icon_pencil'
  | 'icon_transfers'
  | 'icon_identity'
  | 'icon_selfie'
  | 'icon_identityChecked'
  | 'icon_gear'
  | 'icon_selfieChecked'
  | 'icon_cancellation'
  | 'icon_tick'
  | 'icon_littePig'
  | 'icon_arrows_top_v2'
  | 'icon_arrows_back_v2'
  | 'icon_clipboard'
  | 'icon_woman_congrats'
  | 'icon_info_bell';

export type IconName =
  | 'logo-compartamos'
  | 'success-banner'
  | 'play-arrow'
  | 'call'
  | 'place'
  | 'agency-credits'
  | 'arrow-down'
  | 'arrow-right'
  | 'arrow-down-light'
  | 'arrow-up-light'
  | 'arrow-right-disabled'
  | 'arrow-right-xs'
  | 'arrow-right-xs-disabled'
  | 'arrow-right-primary-color'
  | 'arrow-left'
  | 'arrow-left-disabled'
  | 'chain'
  | 'exclamation-circle'
  | 'exclamation-triangle'
  | 'exclamation-circle-inverted'
  | 'back-circle'
  | 'email'
  | 'info_qr'
  | 'sms'
  | 'check'
  | 'check-2'
  | 'check-success'
  | 'badge'
  | 'exchange-one'
  | 'exchange-one-outline'
  | 'exchange-one-outline-disabled'
  | 'icon_share-outline'
  | 'users'
  | 'users-outline'
  | 'users-outline-disabled'
  | 'people'
  | 'peoples-two'
  | 'wallet-one'
  | 'pig'
  | 'pig-save'
  | 'pig-outline'
  | 'pig-outline-disabled'
  | 'pig-full'
  | 'home'
  | 'left-two'
  | 'piggy-bank'
  | 'me'
  | 'bills'
  | 'hand_bills'
  | 'bill-shiny'
  | 'icon_bill_background'
  | 'coin-shiny'
  | 'percentage'
  | 'icon_mail-blue'
  | 'menu-bars'
  | 'man-products'
  | 'party-hat'
  | 'bim-recharge'
  | 'bim-recharge-outline'
  | 'pay-credits'
  | 'pay-credits-outline'
  | 'interoperability-outline'
  | 'pay-credits-primary'
  | 'transfers'
  | 'transfers-outline'
  | 'heart'
  | 'home-active'
  | 'operaciones-active'
  | 'foryou-active'
  | 'menu-active'
  | 'close-small'
  | 'copy'
  | 'share'
  | 'share-black'
  | 'share-two'
  | 'info'
  | 'eye-on'
  | 'eye-off'
  | 'check-on'
  | 'check-off'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-down-v2'
  | 'star'
  | 'star-2'
  | 'star-favorite'
  | 'vector'
  | 'star-outline'
  | 'search'
  | 'marker'
  | 'list'
  | 'three-dots'
  | 'mail'
  | 'man'
  | 'download'
  | 'protected'
  | 'warning-circle'
  // | 'share-fill'
  | 'close'
  | 'logout'
  | 'money'
  | 'money-outline'
  | 'money-outline-disabled'
  | 'money-line-credit'
  | 'money-yellow'
  | 'info-insurance'
  | 'info-insurance2'
  | 'up-date-pay'
  | 'due-pay'
  | 'icon_clock'
  | 'icon_radio-fill'
  | 'icon_money-bag'
  | 'icon_money-bag-two'
  | 'activate-token'
  | 'info-circle'
  | 'info-circle-primary'
  | 'coin-bank'
  | 'icon-tick'
  | 'icon_schedule'
  | 'icon_envelope'
  | 'icon_arrows_top'
  | 'icon-insurance'
  | 'activate-token'
  | 'icon_identity'
  | 'icon_selfie'
  | 'icon_identityChecked'
  | 'icon_selfieChecked'
  | 'icon_cellphoneWithCash'
  | 'icon_zeroSoles'
  | 'icon_selfieChecked'
  | 'icon_assessment'
  | 'icon_disbursement'
  | 'icon_run_clock'
  | 'icon_calendar_ok'
  | 'icon_handWithCoin'
  | 'icon_handHoldingCard'
  | 'icon_cash'
  | 'icon_pay_services'
  | 'icon_copy'
  | 'icon_payWithPhone'
  | 'pig_cash'
  | 'icon_payWithPhone_v2'
  | 'icon_payWithPhone_v3'
  | 'icon_wow-saving'
  | 'icon_entrepreneur-saving'
  | 'icon_tea'
  | 'icon_scroll-down'
  | 'icon_scroll-up'
  | 'icon_money-hand'
  | 'icon_transfers'
  | 'icon_pay-credits'
  | 'icon_phone-cash'
  | 'icon_wallet-sad'
  | 'icon_credits-tab'
  | 'icon_operations-tab';

export type IconSize =
  | 'tiny'
  | 'small'
  | 'x-small'
  | 'normal'
  | 'large'
  | 'x-large'
  | 'extra-large';

interface IconProps {
  name: IconName;
  size: IconSize | number;
  fill?: string;
  color?: string;
  stroke?: string;
  style?: StyleProp<ViewStyle>;
}

interface SvgIconProps {
  iconName: SvgIconName;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

const Icon = (props: IconProps | SvgIconProps) => {
  const {width, height} =
    typeof props.size === 'number'
      ? {width: props.size, height: props.size}
      : getSize(props.size);

  if (isSvgIcon(props)) {
    const IconCustom = getIconV2(props.iconName);
    return (
      <Suspense fallback={null}>
        <IconCustom
          width={width}
          height={height}
          color={props.color}
          style={props.style}
        />
      </Suspense>
    );
  } else {
    const IconCustom = getIconV1(props.name);
    return (
      <Suspense fallback={null}>
        <IconCustom
          width={width}
          height={height}
          fill={props.fill}
          color={props.color}
          style={props.style}
          stroke={props.stroke}
        />
      </Suspense>
    );
  }
};

const isSvgIcon = (props: IconProps | SvgIconProps): props is SvgIconProps => {
  if ((props as SvgIconProps).iconName !== undefined) return true;
  return false;
};

const getIconV2 = (name: SvgIconName) => {
  switch (name) {
    case 'icon_arrows_down':
      return SvgArrowsDown;
    case 'icon_arrows_right':
      return SvgArrowsRight;
    case 'icon_arrows_right_thin':
      return SvgArrowsRightThin;
    case 'icon_arrows_top':
      return SvgArrowsTop;
    case 'icon_close':
      return SvgClose;
    case 'icon_lock':
      return SvgLock;
    case 'icon_send_money':
      return SvgSendMoney;
    case 'icon_building':
      return SvgBuilding;
    case 'icon_droplet':
      return SvgDroplet;
    case 'icon_phone':
      return SvgPhone;
    case 'icon_chevron_right':
      return SvgChevronRight;
    case 'icon_chevron_down':
      return SvgChevronDown;
    case 'icon_logout':
      return SvgLogout;
    case 'icon_token':
      return SvgToken;
    case 'icon_token_fill':
      return SvgTokenFill;
    case 'icon_check':
      return SvgCheck;
    case 'icon_star':
      return SVGStar;
    case 'icon_eye_on':
      return SvgEyeOn;
    case 'icon_eye_off':
      return SvgEyeOff;
    case 'icon_arrow_back':
      return SvgArrowBack;
    case 'icon_share':
      return SVGShare;
    case 'icon_share-outline':
      return SVGShareOutline;
    case 'icon_check_checked':
      return SvgCheckChecked;
    case 'icon_check_unchecked':
      return SvgCheckUnchecked;
    case 'icon_check_disabled':
      return SvgCheckDisabled;
    case 'icon_mail-blue':
      return SVGMailBlue;
    case 'icon_clock':
      return SVGClock;
    case 'icon_radio-fill':
      return SVGRadioFill;
    case 'icon_recharge-bim':
      return SvgRegargeBim;
    case 'icon_recharge_phone':
      return SvgRechargePhone;
    case 'icon_pay_services':
      return SvgPayServices;
    case 'icon_correo':
      return SvgCorreo;
    case 'icon_pay-credits':
      return SvgPayCredits;
    case 'icon_transfers':
      return SvgTransfers;
    case 'icon_Interoperability':
      return SvgInteroperability;
    case 'icon_pencil':
      return SvgPencil;
    case 'icon_money-bag':
      return SvgMoneyBag;
    case 'icon_identity':
      return SvgIconIdentity;
    case 'icon_selfie':
      return SvgIconSelfie;
    case 'icon_identityChecked':
      return SvgIconIdentityChecked;
    case 'icon_selfieChecked':
      return SvgIconSelfieChecked;
    case 'icon_gear':
      return SvgIconGear;
    case 'icon_cancellation':
      return SvgIconCancellation;
    case 'icon_tick':
      return SvgTick;
    case 'icon_littePig':
      return SvgIconLittlePig;
    case 'icon_clipboard':
      return SvgIconClipBoard;
    case 'icon_arrows_top_v2':
      return SvgArrowsTopV2;
    case 'icon_arrows_back_v2':
      return SvgArrowBackV2;
    case 'icon_woman_congrats':
      return SvgWomanCongrats;
    case 'icon_info_bell':
      return SvgInfoBell;
  }
};

const getIconV1 = (name: IconName) => {
  switch (name) {
    case 'logo-compartamos':
      return SVGPLogoCVompartamos;
    case 'success-banner':
      return SVGSuccessBanner;
    case 'play-arrow':
      return SVGPlayArrow;
    case 'icon_share-outline':
      return SVGShareOutline;
    case 'place':
      return SVGPlace;
    case 'call':
      return SVGCall;
    case 'vector':
      return SvgVector;
    case 'agency-credits':
      return SVGAgencyCredits;
    case 'arrow-down':
      return SVGArrowDown;
    case 'arrow-down-light':
      return SvgIconArrowDownLight;
    case 'arrow-up-light':
      return SvgIconArrowUpLight;
    case 'arrow-right':
      return SVGArrowRight;
    case 'arrow-right-disabled':
      return SVGArrowRightDisabled;
    case 'arrow-right-xs':
      return SVGArrowRightXs;
    case 'arrow-right-xs-disabled':
      return SVGArrowRightXsDisabled;
    case 'arrow-left':
      return SVGArrowLeft;
    case 'arrow-left-disabled':
      return SVGArrowLeftDisabled;
    case 'chain':
      return SVGChain;
    case 'exclamation-circle':
      return SVGExclamationCircle;
    case 'exclamation-triangle':
      return SVGExclamationTriangle;
    case 'exclamation-circle-inverted':
      return SVGExclamationCircleInverted;
    case 'back-circle':
      return SVGBackCircle;
    case 'sms':
      return SVGSms;
    case 'email':
      return SVGEmail;
    case 'info_qr':
      return SVGInfoQR;
    case 'check':
      return SVGCheck;
    case 'check-2':
      return SVGCheckTwo;
    case 'check-success':
      return SVGCheckSuccess;
    case 'badge':
      return SVGBadge;
    case 'exchange-one':
      return SVGBExchangeOne;
    case 'exchange-one-outline':
      return SVGBExchangeOneOutline;
    case 'exchange-one-outline-disabled':
      return SVGBExchangeOneOutlineDisabled;
    case 'users':
      return SVGBUsers;
    case 'users-outline':
      return SVGBUsersOutline;
    case 'users-outline-disabled':
      return SVGBUsersOutlineDisabled;
    case 'people':
      return SVGBPeople;
    case 'peoples-two':
      return SVGBPeoplesTwo;
    case 'wallet-one':
      return SVGBWalletOne;
    case 'pig':
      return SVGPig;
    case 'pig-save':
      return SVGPigSave;
    case 'pig-outline':
      return SVGPigOutline;
    case 'pig-outline-disabled':
      return SVGPigOutlineDisabled;
    case 'pig-full':
      return SVGPigFull;
    case 'home':
      return SVGHome;
    case 'left-two':
      return SVGLeftTwo;
    case 'piggy-bank':
      return SVGPiggyBank;
    case 'me':
      return SVGMe;
    case 'heart':
      return SVGHeart;
    case 'man':
      return SVGMan;
    case 'man-products':
      return SVGManProducts;
    case 'menu-bars':
      return SVGMenuBar;
    case 'bills':
      return SVGBills;
    case 'hand_bills':
      return SVGHandBills;
    case 'bill-shiny':
      return SVGBillShiny;
    case 'icon_bill_background':
      return SvgBillBackground;
    case 'coin-shiny':
      return SVGCoinsShiny;
    case 'percentage':
      return SVGPercentage;
    case 'party-hat':
      return SVGPartyHat;
    case 'bim-recharge':
      return SVGRechargeBim;
    case 'bim-recharge-outline':
      return SVGRechargeBimOutline;
    case 'pay-credits':
      return SVGPayCredits;
    case 'pay-credits-outline':
      return SVGPayCreditsOutline;
    case 'interoperability-outline':
      return SvgPayInteroperability;
    case 'pay-credits-primary':
      return SVGPayCreditsPrimary;
    case 'transfers':
      return SVGTransfers;
    case 'transfers-outline':
      return SVGTransfersOutline;
    case 'home-active':
      return SVGHomeActive;
    case 'operaciones-active':
      return SVGOperacionesActive;
    case 'foryou-active':
      return SVGForYouActive;
    case 'menu-active':
      return SVGMenu;
    case 'close-small':
      return SVGCloseSmall;
    case 'copy':
      return SVGCopy;
    case 'share':
      return SVGShare;
    case 'share-black':
      return SVGShareBlack;
    case 'share-two':
      return SVGShareTwo;
    case 'info':
      return SVGInfo;
    case 'eye-on':
      return SVGEyeOn;
    case 'eye-off':
      return SVGEyeOff;
    case 'check-on':
      return SVGCheckOn;
    case 'check-off':
      return SVGCheckOff;
    case 'star':
      return SVGStar;
    case 'star-2':
      return SVGStarTwo;
    case 'star-favorite':
      return SVGStarFavorite;
    case 'star-outline':
      return SVGStarOutline;
    case 'close':
      return SVGClose;
    case 'icon_radio-fill':
      return SVGRadioFill;
    case 'chevron-right':
      return ({stroke, fill, ...rest}: SvgProps) => (
        <SVGChevronRight stroke={fill} fill={fill} {...rest} />
      );
    case 'chevron-down-v2':
      return SVGChevronDownV2;
    case 'chevron-down':
      return SVGChevronDown;
    case 'search':
      return SVGSearch;
    case 'list':
      return SVGList;
    case 'marker':
      return SVGMarker;
    case 'three-dots':
      return SVGThreeDots;
    case 'download':
      return SVGDownload;
    case 'mail':
      return SVGMail;
    case 'money':
      return SVGMoney;
    case 'money-outline':
      return SVGMoneyOutline;
    case 'money-outline-disabled':
      return SVGMoneyOutlineDisabled;
    case 'money-line-credit':
      return SVGMoneyLineCredit;
    case 'money-yellow':
      return SVGMoneyYellow;
    case 'info-insurance':
      return SVGInfoInsurance;
    case 'info-insurance2':
      return SVGInfoInsurance2;
    case 'up-date-pay':
      return SVGUpDatePay;
    case 'due-pay':
      return SVGDuePay;
    case 'icon_mail-blue':
      return SVGMailBlue;
    case 'protected':
      return SVGProtected;
    case 'warning-circle':
      return SVGWarningCircle;
    case 'icon_clock':
      return SVGClock;
    case 'logout':
      return ({stroke, fill, ...rest}: SvgProps) => (
        <SVGLogout stroke={fill} fill={fill} {...rest} />
      );
    case 'activate-token':
      return ({stroke, fill, ...rest}: SvgProps) => (
        <SVGActivateToken stroke={fill} fill={fill} {...rest} />
      );
    case 'icon_money-bag':
      return SvgMoneyBag;
    case 'icon_money-bag-two':
      return SvgMoneyBagTwo;
    case 'info-circle':
      return SvgInfoCircle;
    case 'info-circle-primary':
      return SvgInfoCirclePrimary;
    case 'coin-bank':
      return SvgCoinBank;
    case 'icon-tick':
      return SvgIconTick;
    case 'icon-insurance':
      return SvgIconInsurance;
    case 'icon_schedule':
      return SvgIconSchedule;
    case 'icon_envelope':
      return SvgIconEnvelope;
    case 'icon_arrows_top':
      return SvgArrowsTop;
    case 'icon_identity':
      return SvgIconIdentity;
    case 'icon_selfie':
      return SvgIconSelfie;
    case 'icon_identityChecked':
      return SvgIconIdentityChecked;
    case 'icon_selfieChecked':
      return SvgIconSelfieChecked;
    case 'icon_cellphoneWithCash':
      return SvgIconCellphoneWithCash;
    case 'icon_zeroSoles':
      return SvgIconZeroSoles;
    case 'icon_assessment':
      return SvgIconAssessment;
    case 'icon_disbursement':
      return SvgIconDisbursement;
    case 'icon_run_clock':
      return SvgIconRunClock;
    case 'icon_calendar_ok':
      return SvgIconCalendarOk;
    case 'icon_cash':
      return SvgIconCash;
    case 'icon_pay_services':
      return SvgPayServices;
    case 'icon_copy':
      return SvgIconCopy;
    case 'icon_payWithPhone':
      return SvgIconPayWithPhone;
    case 'icon_payWithPhone_v2':
      return SvgIconPayWithPhoneV2;
    case 'icon_payWithPhone_v3':
      return SvgIconPayWithPhoneV3;
    case 'arrow-right-primary-color':
      return SvgArrowRightPrimaryColor;
    case 'pig_cash':
      return SvgPigCash;
    case 'icon_wow-saving':
      return SvgWowSaving;
    case 'icon_entrepreneur-saving':
      return SvgEntrepreneurSaving;
    case 'icon_tea':
      return SvgIconTea;
    case 'icon_money-hand':
      return SvgIconMoneyHand;
    case 'icon_scroll-down':
      return SvgIconScrollDown;
    case 'icon_scroll-up':
      return SvgIconScrollUp;
    case 'icon_transfers':
      return SvgTransfers;
    case 'icon_pay-credits':
      return SvgPayCredits;
    case 'icon_phone-cash':
      return SvgIconPhoneCash;
    case 'icon_wallet-sad':
      return SvgIconWalletSad;
    case 'icon_credits-tab':
      return SvgIconCreditsTab;
    case 'icon_operations-tab':
      return SvgIconOperationsTab;
  }
};

const getSize = (size: IconSize) => {
  let width: number;
  let height: number;

  switch (size) {
    case 'tiny':
      width = 16;
      height = 16;
      break;
    case 'x-small':
      width = 22;
      height = 22;
      break;
    case 'small':
      width = 24;
      height = 24;
      break;
    case 'normal':
      width = 32;
      height = 32;
      break;
    case 'large':
      width = 40;
      height = 40;
      break;
    case 'x-large':
      width = 56;
      height = 56;
      break;
    case 'extra-large':
      width = 100;
      height = 100;
      break;
  }

  return {width, height};
};

const SVGPLogoCVompartamos = React.lazy(
  () => import('@assets/icons/logo-compartamos.svg'),
);
const SVGSuccessBanner = React.lazy(
  () => import('@assets/images/success-banner.svg'),
);
const SVGPlayArrow = React.lazy(() => import('@assets/icons/play-arrow.svg'));
const SVGCall = React.lazy(() => import('@assets/icons/call.svg'));
const SVGPlace = React.lazy(() => import('@assets/icons/place.svg'));
const SVGAgencyCredits = React.lazy(
  () => import('@assets/icons/agency-credits.svg'),
);
const SVGArrowDown = React.lazy(() => import('@assets/icons/arrow-down.svg'));
const SVGArrowLeft = React.lazy(() => import('@assets/icons/arrow-left.svg'));
const SVGArrowLeftDisabled = React.lazy(
  () => import('@assets/icons/arrow-left-disabled.svg'),
);
const SVGArrowRight = React.lazy(() => import('@assets/icons/arrow-right.svg'));
const SVGArrowRightDisabled = React.lazy(
  () => import('@assets/icons/arrow-right-disabled.svg'),
);
const SVGArrowRightXs = React.lazy(
  () => import('@assets/icons/arrow-right-xs.svg'),
);
const SVGArrowRightXsDisabled = React.lazy(
  () => import('@assets/icons/arrow-right-xs-disabled.svg'),
);
const SVGChain = React.lazy(() => import('@assets/icons/chain.svg'));
const SVGExclamationCircle = React.lazy(
  () => import('@assets/icons/exclamation-circle.svg'),
);
const SVGExclamationCircleInverted = React.lazy(
  () => import('@assets/icons/exclamation-circle-inverted.svg'),
);
const SVGExclamationTriangle = React.lazy(
  () => import('@assets/icons/exclamation-triangle.svg'),
);
const SVGBackCircle = React.lazy(() => import('@assets/icons/back-circle.svg'));
const SVGSms = React.lazy(() => import('@assets/icons/sms.svg'));
const SVGEmail = React.lazy(() => import('@assets/icons/email.svg'));
const SVGInfoQR = React.lazy(() => import('@assets/icons/info_qr.svg'));
const SVGCheck = React.lazy(() => import('@assets/icons/check.svg'));
const SVGBadge = React.lazy(() => import('@assets/icons/badge.svg'));
const SVGBExchangeOne = React.lazy(
  () => import('@assets/icons/exchange-one.svg'),
);
const SVGBExchangeOneOutline = React.lazy(
  () => import('@assets/icons/exchange-one-outline.svg'),
);
const SVGBExchangeOneOutlineDisabled = React.lazy(
  () => import('@assets/icons/exchange-one-outline-disabled.svg'),
);
const SVGBUsers = React.lazy(() => import('@assets/icons/users.svg'));
const SVGBUsersOutline = React.lazy(
  () => import('@assets/icons/users-outline.svg'),
);
const SVGBUsersOutlineDisabled = React.lazy(
  () => import('@assets/icons/users-outline-disabled.svg'),
);
const SVGBPeople = React.lazy(() => import('@assets/icons/people.svg'));
const SVGBPeoplesTwo = React.lazy(
  () => import('@assets/icons/peoples-two.svg'),
);
const SVGRadioFill = React.lazy(
  () => import('@assets/icons/icon_radio-fill.svg'),
);
const SVGBWalletOne = React.lazy(() => import('@assets/icons/wallet-one.svg'));
const SVGPig = React.lazy(() => import('@assets/icons/pig.svg'));
const SVGPigSave = React.lazy(() => import('@assets/icons/pig-save.svg'));
const SVGPigOutline = React.lazy(() => import('@assets/icons/pig-outline.svg'));
const SVGPigOutlineDisabled = React.lazy(
  () => import('@assets/icons/pig-outline-disabled.svg'),
);
const SVGPigFull = React.lazy(() => import('@assets/icons/pig-full-icon.svg'));
const SVGPiggyBank = React.lazy(() => import('@assets/icons/piggy-bank.svg'));
const SVGMe = React.lazy(() => import('@assets/icons/me.svg'));
const SVGPartyHat = React.lazy(() => import('@assets/icons/party-hat.svg'));
const SVGRechargeBim = React.lazy(
  () => import('@assets/icons/bim-recharge.svg'),
);
const SVGRechargeBimOutline = React.lazy(
  () => import('@assets/icons/bim-recharge-outline.svg'),
);
const SVGPayCredits = React.lazy(() => import('@assets/icons/pay-credits.svg'));
const SVGPayCreditsOutline = React.lazy(
  () => import('@assets/icons/pay-credits-outline.svg'),
);
const SVGPayCreditsPrimary = React.lazy(
  () => import('@assets/icons/pay-credits-primary.svg'),
);
const SVGTransfers = React.lazy(() => import('@assets/icons/transfers.svg'));
const SvgBillBackground = React.lazy(
  () => import('@assets/icons/icon_bill_background.svg'),
);
const SVGTransfersOutline = React.lazy(
  () => import('@assets/icons/transfers-outline.svg'),
);

const SVGHome = React.lazy(() => import('@assets/icons/home.svg'));
const SVGLeftTwo = React.lazy(() => import('@assets/icons/left-two.svg'));
const SVGHeart = React.lazy(() => import('@assets/icons/heart.svg'));
const SVGMenuBar = React.lazy(() => import('@assets/icons/menu-bars.svg'));
const SVGBills = React.lazy(() => import('@assets/icons/bills.svg'));
const SVGHandBills = React.lazy(() => import('@assets/icons/hand_bills.svg'));
const SVGBillShiny = React.lazy(() => import('@assets/icons/bill-shiny.svg'));
const SVGCoinsShiny = React.lazy(() => import('@assets/icons/coin-shiny.svg'));
const SVGPercentage = React.lazy(() => import('@assets/icons/percentage.svg'));
const SVGHomeActive = React.lazy(() => import('@assets/icons/home-active.svg'));
const SVGOperacionesActive = React.lazy(
  () => import('@assets/icons/operaciones-active.svg'),
);
const SVGForYouActive = React.lazy(
  () => import('@assets/icons/foryou-active.svg'),
);
const SVGMenu = React.lazy(() => import('@assets/icons/menu-active.svg'));
const SVGCloseSmall = React.lazy(() => import('@assets/icons/close-small.svg'));
const SVGCopy = React.lazy(() => import('@assets/icons/copy.svg'));
const SVGShare = React.lazy(() => import('@assets/icons/share-outline.svg'));
const SVGShareOutline = React.lazy(
  () => import('@assets/icons/share-outline.svg'),
);
const SVGShareBlack = React.lazy(() => import('@assets/icons/share-black.svg'));
const SVGShareTwo = React.lazy(() => import('@assets/icons/share-two.svg'));
const SVGMailBlue = React.lazy(() => import('@assets/icons/correo.svg'));
const SVGMan = React.lazy(() => import('@assets/icons/man.svg'));
const SVGManProducts = React.lazy(
  () => import('@assets/icons/man-products.svg'),
);
const SVGClock = React.lazy(() => import('@assets/icons/clock.svg'));
const SVGInfo = React.lazy(() => import('@assets/icons/info.svg'));
const SVGEyeOn = React.lazy(() => import('@assets/icons/eye-on.svg'));
const SVGEyeOff = React.lazy(() => import('@assets/icons/eye-off.svg'));

const SVGCheckOn = React.lazy(() => import('@assets/icons/check-on.svg'));
const SVGCheckOff = React.lazy(() => import('@assets/icons/check-off.svg'));
const SVGCheckTwo = React.lazy(() => import('@assets/icons/check-2.svg'));
const SVGCheckSuccess = React.lazy(
  () => import('@assets/icons/check-success.svg'),
);
const SVGStar = React.lazy(() => import('@assets/icons/star.svg'));
const SVGStarTwo = React.lazy(() => import('@assets/icons/star-2.svg'));
const SVGStarFavorite = React.lazy(
  () => import('@assets/icons/star-favorite.svg'),
);
const SVGStarOutline = React.lazy(
  () => import('@assets/icons/star-outline.svg'),
);
const SvgDroplet = React.lazy(() => import('@assets/icons/SvgDroplet'));
const SvgPhone = React.lazy(() => import('@assets/icons/SvgPhone'));
const SvgBuilding = React.lazy(() => import('@assets/icons/SvgBuilding'));
const SvgSendMoney = React.lazy(() => import('@assets/icons/SvgSendMoney'));
const SvgChevronRight = React.lazy(
  () => import('@assets/icons/SvgChevronRight'),
);
const SvgChevronDown = React.lazy(() => import('@assets/icons/SvgChevronDown'));
const SVGChevronRight = React.lazy(
  () => import('@assets/icons/chevron-right.svg'),
);

const SVGChevronDown = React.lazy(() => import('@assets/icons/down.svg'));
const SVGChevronDownV2 = React.lazy(
  () => import('@assets/icons/chevron-down.svg'),
);
const SVGSearch = React.lazy(() => import('@assets/icons/search.svg'));
const SVGList = React.lazy(() => import('@assets/icons/list.svg'));
const SVGMarker = React.lazy(() => import('@assets/icons/marker.svg'));
const SVGThreeDots = React.lazy(() => import('@assets/icons/three-dots.svg'));
const SVGDownload = React.lazy(() => import('@assets/icons/download.svg'));
const SVGMail = React.lazy(() => import('@assets/icons/mail.svg'));
const SVGMoney = React.lazy(() => import('@assets/icons/money.svg'));
const SVGMoneyOutline = React.lazy(
  () => import('@assets/icons/money-outline.svg'),
);
const SVGMoneyOutlineDisabled = React.lazy(
  () => import('@assets/icons/money-outline-disabled.svg'),
);

const SVGMoneyLineCredit = React.lazy(
  () => import('@assets/icons/money-line-credit.svg'),
);

const SVGMoneyYellow = React.lazy(
  () => import('@assets/icons/money-yellow.svg'),
);
const SVGInfoInsurance = React.lazy(
  () => import('@assets/icons/info-insurance.svg'),
);
const SVGInfoInsurance2 = React.lazy(
  () => import('@assets/icons/info-insurance2.svg'),
);

const SVGUpDatePay = React.lazy(() => import('@assets/icons/up-date-pay.svg'));
const SVGDuePay = React.lazy(() => import('@assets/icons/due-pay.svg'));
const SVGClose = React.lazy(() => import('@assets/icons/close.svg'));

const SVGProtected = React.lazy(() => import('@assets/icons/protected.svg'));
const SVGWarningCircle = React.lazy(
  () => import('@assets/icons/warning-circle.svg'),
);
const SVGLogout = React.lazy(() => import('@assets/icons/logout.svg'));
const SVGActivateToken = React.lazy(
  () => import('@assets/icons/activate-token.svg'),
);
const SvgInfoCircle = React.lazy(() => import('@assets/icons/info-circle.svg'));
const SvgInfoCirclePrimary = React.lazy(
  () => import('@assets/icons/info-circle-primary.svg'),
);

const SvgArrowsDown = React.lazy(() => import('@assets/icons/SvgArrowsDown'));
const SvgArrowsRight = React.lazy(() => import('@assets/icons/SvgArrowsRight'));
const SvgArrowsRightThin = React.lazy(
  () => import('@assets/icons/SvgArrowsRightThin'),
);
const SvgArrowsTop = React.lazy(() => import('@assets/icons/SvgArrowsTop'));
const SvgArrowBack = React.lazy(() => import('@assets/icons/SvgArrowBack'));
const SvgClose = React.lazy(() => import('@assets/icons/SvgClose'));
const SvgLock = React.lazy(() => import('@assets/icons/SvgLock'));
const SvgLogout = React.lazy(() => import('@assets/icons/SvgLogout'));
const SvgTokenFill = React.lazy(() => import('@assets/icons/SvgTokenFill'));
const SvgToken = React.lazy(() => import('@assets/icons/SvgToken'));
const SvgCorreo = React.lazy(() => import('@assets/icons/SvgCorreo'));
const SvgCheck = React.lazy(() => import('@assets/icons/SvgCheck'));
const SvgEyeOn = React.lazy(() => import('@assets/icons/SvgEyeOn'));
const SvgEyeOff = React.lazy(() => import('@assets/icons/SvgEyeOff'));
const SvgCheckChecked = React.lazy(
  () => import('@assets/icons/SvgCheckChecked'),
);
const SvgCheckUnchecked = React.lazy(
  () => import('@assets/icons/SvgCheckUnchecked'),
);
const SvgCheckDisabled = React.lazy(
  () => import('@assets/icons/SvgCheckDisabled'),
);
const SvgRegargeBim = React.lazy(() => import('@assets/icons/SvgRechargeBim'));
const SvgPayInteroperability = React.lazy(
  () => import('@assets/icons/SvgInteroperabilityOutLine.svg'),
);
const SvgRechargePhone = React.lazy(
  () => import('@assets/icons/SvgRechargePhone'),
);
const SvgPayServices = React.lazy(() => import('@assets/icons/SvgPayServices'));
const SvgPayCredits = React.lazy(() => import('@assets/icons/SvgPayCredits'));
const SvgTransfers = React.lazy(() => import('@assets/icons/SvgTransfers'));
const SvgInteroperability = React.lazy(
  () => import('@assets/icons/SvgInteroperability'),
);
const SvgMoneyBag = React.lazy(
  () => import('@assets/icons/icon_money-bag.svg'),
);
const SvgMoneyBagTwo = React.lazy(
  () => import('@assets/icons/icon_money-bag-two.svg'),
);
const SvgPencil = React.lazy(() => import('@assets/icons/SvgPencil'));
const SvgCoinBank = React.lazy(() => import('@assets/icons/coin-bank.svg'));
const SvgIconTick = React.lazy(() => import('@assets/icons/icon-tick.svg'));
const SvgTick = React.lazy(() => import('@assets/icons/SvgTick'));
const SvgIconInsurance = React.lazy(
  () => import('@assets/icons/insurance.svg'),
);
const SvgIconCancellation = React.lazy(
  () => import('@assets/icons/cancellation.svg'),
);
const SvgIconSchedule = React.lazy(
  () => import('@assets/icons/icon_schedule.svg'),
);
const SvgIconEnvelope = React.lazy(
  () => import('@assets/icons/icon_envelope.svg'),
);
const SvgIconArrowUpLight = React.lazy(
  () => import('@assets/icons/arrow-up-light.svg'),
);
const SvgIconArrowDownLight = React.lazy(
  () => import('@assets/icons/arrow-down-light.svg'),
);
const SvgIconIdentity = React.lazy(
  () => import('@assets/icons/icon_identity.svg'),
);
const SvgIconSelfie = React.lazy(() => import('@assets/icons/icon_selfie.svg'));
const SvgIconIdentityChecked = React.lazy(
  () => import('@assets/icons/icon_identityChecked.svg'),
);
const SvgIconSelfieChecked = React.lazy(
  () => import('@assets/icons/icon_selfieChecked.svg'),
);

const SvgIconAssessment = React.lazy(
  () => import('@assets/icons/icon_assessment.svg'),
);
const SvgIconDisbursement = React.lazy(
  () => import('@assets/icons/icon_disbursement.svg'),
);
const SvgIconRunClock = React.lazy(
  () => import('@assets/icons/icon_run_clock.svg'),
);
const SvgIconCalendarOk = React.lazy(
  () => import('@assets/icons/icon_calendar_ok.svg'),
);
const SvgIconGear = React.lazy(() => import('@assets/icons/icon_gear.svg'));
const SvgIconLittlePig = React.lazy(
  () => import('@assets/icons/icon_littlePig.svg'),
);
const SvgIconCellphoneWithCash = React.lazy(
  () => import('@assets/icons/icon_cellphoneWithCash.svg'),
);
const SvgIconZeroSoles = React.lazy(
  () => import('@assets/icons/icon_zeroSoles.svg'),
);
const SvgIconCash = React.lazy(() => import('@assets/icons/icon_cash.svg'));
const SvgIconCopy = React.lazy(() => import('@assets/icons/icon_copy.svg'));
const SvgIconClipBoard = React.lazy(
  () => import('@assets/icons/icon_clipboard.svg'),
);
const SvgIconPayWithPhone = React.lazy(
  () => import('@assets/icons/icon_pay-with-phone.svg'),
);
const SvgIconPayWithPhoneV2 = React.lazy(
  () => import('@assets/icons/icon_payWithPhone_v2.svg'),
);
const SvgIconPayWithPhoneV3 = React.lazy(
  () => import('@assets/icons/icon_payWithPhone_v3.svg'),
);

const SvgVector = React.lazy(() => import('@assets/icons/vector.svg'));
const SvgArrowRightPrimaryColor = React.lazy(
  () => import('@assets/icons/arrow-right-primary-color.svg'),
);
const SvgPigCash = React.lazy(() => import('@assets/icons/pig-cash.svg'));
const SvgArrowsTopV2 = React.lazy(
  () => import('@assets/icons/icon_arrows_top_v2.svg'),
);
const SvgArrowBackV2 = React.lazy(
  () => import('@assets/icons/icon_arrows_back_v2.svg'),
);
const SvgWowSaving = React.lazy(() => import('@assets/icons/wow-saving.svg'));
const SvgEntrepreneurSaving = React.lazy(
  () => import('@assets/icons/entrepreneur-saving.svg'),
);
const SvgIconTea = React.lazy(() => import('@assets/icons/icon_tea.svg'));
const SvgIconMoneyHand = React.lazy(
  () => import('@assets/icons/icon_money-hand.svg'),
);
const SvgIconScrollDown = React.lazy(
  () => import('@assets/icons/icon_scroll-down.svg'),
);
const SvgIconScrollUp = React.lazy(
  () => import('@assets/icons/icon_scroll-up.svg'),
);
const SvgIconPhoneCash = React.lazy(
  () => import('@assets/icons/icon_phone-cash.svg'),
);
const SvgIconWalletSad = React.lazy(
  () => import('@assets/icons/icon_wallet-sad.svg'),
);
const SvgIconCreditsTab = React.lazy(
  () => import('@assets/icons/icon_credits-tab.svg'),
);
const SvgIconOperationsTab = React.lazy(
  () => import('@assets/icons/icon_operations-tab.svg'),
);

const SvgWomanCongrats = React.lazy(
  () => import('@assets/icons/icon_woman_congrats.svg'),
);

const SvgInfoBell = React.lazy(
  () => import('@assets/icons/icon_info_bell.svg'),
);

export default Icon;
