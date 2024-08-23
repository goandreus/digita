import React, {ReactNode, useRef} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import SuccessModal from '@molecules/extra/SuccessModal';
import Button from '@atoms/extra/Button';
import BoxView from '@atoms/BoxView';
import {indexStyles as styles} from '../styles';
import {shareScreenshot} from '@utils/screenshot';
import {Path, Svg} from 'react-native-svg';
import {Image} from 'react-native';
import {formatPhoneNumber} from '@helpers/NumberHelper';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';

interface SuccessRefillBimProps {
  children: ReactNode;
  isOpen: boolean;
  handleGoToHome: () => void;
  onCloseModal: () => void;
}

interface PropsContent {
  viewShotRef?: any;
  formData: any;
  successModal: any;
}

const RefillContent = ({viewShotRef, formData, successModal}: PropsContent) => {
  const {data} = successModal;
  const {email, datetime, transactionId} = data;
  const {originAccount, values} = formData;

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{padding: SIZES.XXS, backgroundColor: '#FFF'}}>
      <BoxView align="center">
        <TextCustom
          text="¡Recarga exitosa!"
          color="primary-medium"
          weight="normal"
          variation="h2"
        />
        <Separator type="medium" />
        <TextCustom
          text="Monto recargado"
          color="neutral-darkest"
          weight="normal"
          variation="h4"
        />
        <TextCustom
          text={`${values.formatAmount}`}
          color="neutral-darkest"
          weight="normal"
          variation="h1"
        />
        <Separator type="xx-small" />
        <TextCustom
          text={datetime}
          color="neutral-dark"
          weight="normal"
          variation="h6"
        />
        <Separator type="medium" />
        <TouchableOpacity onPress={() => shareScreenshot(viewShotRef)}>
          <BoxView direction="row" align="center">
            <Icon
              iconName="icon_share-outline"
              size={18}
              color={'#000'}
              style={{marginHorizontal: SIZES.XS}}
            />
            <TextCustom
              text="Compartir constancia"
              color="primary-darkest"
              variation="h5"
            />
          </BoxView>
        </TouchableOpacity>
      </BoxView>
      <Separator type="medium" />
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        style={styles.block}
        justify="space-between">
        <TextCustom
          text="Recargado a"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <Separator type="xx-small" />
          <TextCustom
            text={formatPhoneNumber(values.phoneNumberBim)}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </BoxView>
      </BoxView>
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Desde"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <TextCustom
            text={originAccount?.productName}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={originAccount?.accountCode}
            color="neutral-dark"
            align="right"
            weight="normal"
            variation="h6"
          />
        </BoxView>
      </BoxView>
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Nª operación"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <TextCustom
            text={transactionId}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
        </BoxView>
      </BoxView>
      <Separator type="medium" />
      <BoxView
        direction="row"
        align="center"
        background="informative-lightest"
        p={SIZES.MD}
        style={styles.containerInfo}>
        <Icon
          name="icon_mail-blue"
          size="normal"
          fill={COLORS.Informative.Medium}
        />
        <TextCustom
          style={styles.text}
          color="informative-dark"
          variation="h6"
          lineHeight="fair"
          weight="normal"
          text={`Enviamos la constancia de tu recarga al correo ${email}`}
        />
      </BoxView>
      <Separator type="large" />
    </View>
  );
};

export const SuccessRefillBim = ({
  children,
  isOpen,
  onCloseModal,
  handleGoToHome,
}: SuccessRefillBimProps) => {
  const viewShotRef = useRef(null);

  const childrenWithExtraProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement<any>(child, {viewShotRef});
    }
    return child;
  });

  return (
    <>
      <SuccessModal isOpen={isOpen} closeModal={onCloseModal}>
        <Separator size={-90} />
        <BoxView p={SIZES.LG} background="background-lightest">
          {childrenWithExtraProps}
        </BoxView>

        <Button
          containerStyle={{
            ...styles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={handleGoToHome}
          loading={false}
          orientation="horizontal"
          type="primary"
          text={`${'Ir a inicio'}`}
          disabled={false}
        />
      </SuccessModal>

      <View
        collapsable={false}
        ref={viewShotRef}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          padding: SIZES.LG,
          backgroundColor: '#FFF',
          position: 'absolute',
          width: Dimensions.get('window').width,
          left: -Dimensions.get('screen').width,
        }}>
        <Svg
          // eslint-disable-next-line react-native/no-inline-styles
          style={{alignSelf: 'center'}}
          width="100%"
          height="150"
          viewBox="15 24 360 112"
          fill="none">
          <Path
            scaleX={1.1}
            d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
            fill="#CA005D"
          />
        </Svg>
        <Image
          source={require('@assets/images/successMan.png')}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            alignSelf: 'center',
            bottom: 95,
          }}
        />
        <Separator size={-90} />
        {children}
      </View>
    </>
  );
};

SuccessRefillBim.Content = RefillContent;
