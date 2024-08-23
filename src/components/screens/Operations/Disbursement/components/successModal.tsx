/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {Pressable, StatusBar, TouchableOpacity, View} from 'react-native';
import Separator from '@atoms/extra/Separator';
import SuccessModal from '@molecules/extra/SuccessModal';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import {indexStyles as styles} from '../styles';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {shareScreenshot} from '@utils/screenshot';
import {convertToCurrency} from '@utils/convertCurrency';
import {useUserInfo} from '@hooks/common';
import {Saving} from '@features/userInfo';
import {nameForTransfer} from '@utils/nameForTransfer';
import Tooltip from '@atoms/Tooltip';
import moment from 'moment';
import DisbursementCard from './disbursementCard';
import {IDisbursCredit} from '@interface/Credit';
import {DisbursedCreditData} from '@services/Disbursements';

interface PropsContent {
  viewShotRef?: any;
  data: IDisbursCredit;
  successData: DisbursedCreditData;
  originAccount?: Saving | null;
}

interface Props {
  children: ReactNode;
  isOpen: boolean;
  goToHome: () => void;
  showDisbursement: () => void;
}

const DisbursementContent = ({
  viewShotRef,
  originAccount,
  data,
  successData,
}: PropsContent) => {
  const {userCreditToDisburt} = useUserInfo();
  const creditPending = userCreditToDisburt;
  const arrNames = nameForTransfer(
    successData?.typeAccount! || originAccount?.productName!,
  );
  const [moreInfo, setMoreInfo] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showTooltip2, setShowTooltip2] = useState<boolean>(false);

  const total = successData.disbursedAmount + (successData.ITF ?? 0);
  const firstDayPayment = moment(data?.dateFirstPayment)
    .format('DD MMM YYYY')
    .replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip2(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip2]);

  return (
    <>
      <StatusBar backgroundColor={COLORS.Primary.Medium} />
      <View style={{padding: SIZES.XXS, backgroundColor: '#FFF'}}>
        <BoxView align="center">
          <TextCustom
            text="¡Crédito desembolsado!"
            color="primary-medium"
            weight="normal"
            variation="h2"
          />
          <TextCustom
            text="Sigue creciendo y cumpliendo tus sueños"
            color="primary-medium"
            weight="normal"
            variation="h5"
          />
          <Separator type="medium" />
          <TextCustom
            text="Monto desembolsado"
            color="neutral-darkest"
            weight="normal"
            variation="h4"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={`${creditPending?.currency} ${convertToCurrency(total)}`}
            color="neutral-darkest"
            weight="normal"
            variation="h1"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={`${successData?.dateTransaction} - ${successData?.hourTransaction}`}
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
            text="Depositado en"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <Separator type="xx-small" />
            {arrNames.map(n => (
              <TextCustom
                key={`key-${n}`}
                text={n}
                style={{marginBottom: SIZES.XXS}}
                variation="h5"
                align="right"
                lineHeight="tight"
                weight="normal"
                color="neutral-darkest"
              />
            ))}
            <TextCustom
              text={successData.disburseAccount ?? originAccount?.accountCode}
              variation="h6"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
          </BoxView>
        </BoxView>
        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <Pressable onPress={() => setShowTooltip(true)}>
            <BoxView direction="row">
              <TextCustom
                text="Cuota mensual"
                color="neutral-dark"
                weight="normal"
                variation="h5"
              />
              <View style={styles.btnTooltip}>
                <Icon
                  style={styles.iconTooltip}
                  name="info-circle"
                  size="tiny"
                  fill="#000"
                />
                {showTooltip && (
                  <Tooltip
                    width={140}
                    height={50}
                    text={'Incluye Capital + Interés\n+ Gastos asociados'}
                  />
                )}
              </View>
            </BoxView>
          </Pressable>
          <TextCustom
            text={data?.sPaymentMonth}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
        </BoxView>
        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <TextCustom
            text="Cuotas"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={creditPending?.payments}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
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
            text="Primera cuota"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={firstDayPayment}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
            />
          </BoxView>
        </BoxView>
        {moreInfo ? (
          <>
            <BoxView
              py={SIZES.LG}
              direction="row"
              align="center"
              justify="space-between"
              style={styles.block}>
              <TextCustom
                text="Día de pago"
                color="neutral-dark"
                weight="normal"
                variation="h5"
              />
              <BoxView>
                <TextCustom
                  text={`${creditPending?.payDay} de cada mes`}
                  color="neutral-darkest"
                  weight="normal"
                  variation="h5"
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
                text="TEA"
                color="neutral-dark"
                weight="normal"
                variation="h5"
              />
              <BoxView>
                <TextCustom
                  text={data?.stea}
                  color="neutral-darkest"
                  weight="normal"
                  variation="h5"
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
                text="TCEA"
                color="neutral-dark"
                weight="normal"
                variation="h5"
              />
              <BoxView>
                <TextCustom
                  text={data?.stcea}
                  color="neutral-darkest"
                  weight="normal"
                  variation="h5"
                />
              </BoxView>
            </BoxView>
            {creditPending?.insurance !== '' ? (
              <>
                <BoxView
                  py={SIZES.LG}
                  direction="row"
                  align="center"
                  justify="space-between"
                  zIndex={1}
                  style={styles.block}>
                  <Pressable onPress={() => setShowTooltip2(true)}>
                    <BoxView direction="row" align="center">
                      <TextCustom
                        text={creditPending?.insurance}
                        variation="h5"
                        lineHeight="tight"
                        weight="normal"
                        color="neutral-dark"
                      />
                      <View style={styles.btnTooltip}>
                        <Icon
                          style={styles.iconTooltip}
                          name="info-circle"
                          size="tiny"
                          fill="#000"
                        />
                        {showTooltip2 && (
                          <Tooltip
                            width={140}
                            height={60}
                            text={`Incluye el seguro\n${creditPending?.insurance}`}
                          />
                        )}
                      </View>
                    </BoxView>
                  </Pressable>
                  <BoxView>
                    <TextCustom
                      text={`${creditPending?.currency} ${convertToCurrency(
                        successData?.optionalInsurance,
                      )}`}
                      variation="h5"
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
                  zIndex={-1}
                  style={styles.block}>
                  <TextCustom
                    text="Monto total del préstamo"
                    color="neutral-dark"
                    weight="normal"
                    variation="h5"
                  />
                  <BoxView>
                    <TextCustom
                      text={creditPending?.sCreditFormat2}
                      color="neutral-darkest"
                      weight="normal"
                      variation="h5"
                    />
                  </BoxView>
                </BoxView>
              </>
            ) : null}
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
                  text={`${successData?.operationNumber}`}
                  color="neutral-darkest"
                  weight="normal"
                  variation="h5"
                />
              </BoxView>
            </BoxView>
          </>
        ) : null}
        <Separator type="small" />
        <Pressable onPress={() => setMoreInfo(!moreInfo)}>
          <BoxView direction="row" justify="center" align="center">
            <TextCustom
              text={`Ver ${moreInfo ? 'menos' : 'más'} información`}
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <Icon
              style={{marginLeft: 4}}
              name={moreInfo ? 'arrow-up-light' : 'arrow-down-light'}
              stroke={COLORS.Neutral.Medium}
              size={24}
            />
          </BoxView>
        </Pressable>
        <Separator type="large" />

        <BoxView style={styles.banner} background="background-light">
          <BoxView direction="row" align="center">
            <Icon name="icon_schedule" size={56} />
            <BoxView ml={17} flex={1}>
              <TextCustom
                variation="h5"
                text="Cronograma de pagos"
                size={18}
                color="primary-medium"
                weight="normal"
              />
              <Separator type="xx-small" />
              <TextCustom
                variation="h5"
                text={
                  'Encuéntralo en los documentos contractuales de tu crédito que te enviaremos en breve al correo:'
                }
                color="neutral-darkest"
                weight="normal"
              />
              <Separator type="x-small" />
              <TextCustom
                variation="h5"
                text={successData?.email}
                color="primary-darkest"
                weight="normal"
              />
            </BoxView>
          </BoxView>
        </BoxView>

        <Separator type="large" />
        <BoxView
          direction="row"
          align="center"
          background="informative-lightest"
          py={SIZES.MD}
          style={styles.disclaimerContainer}>
          <BoxView style={styles.disclaimerIcon}>
            <Icon
              name="exclamation-circle-inverted"
              size="x-small"
              fill={COLORS.Informative.Dark}
            />
          </BoxView>
          <TextCustom
            style={styles.disclaimerText}
            color="informative-dark"
            variation="h6"
            weight="normal"
            text="Esta operación está afecta al pago del ITF."
          />
        </BoxView>
      </View>
      <DisbursementCard
        viewShotRef={viewShotRef}
        data={{...data, ...successData}}
        originAccount={originAccount}
      />
    </>
  );
};

export const SuccessDisbursementModal = ({
  children,
  isOpen,
  goToHome,
  showDisbursement,
}: Props) => {
  const viewShotRef = useRef<any>(null);
  const childrenWithExtraProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement<any>(child, {viewShotRef});
    }
    return child;
  });
  return (
    <>
      <SuccessModal isOpen={isOpen} closeModal={goToHome} statusBarTranslucent>
        <Separator size={-110} />
        <BoxView p={SIZES.LG} background="background-lightest">
          {childrenWithExtraProps}
        </BoxView>
        <Button
          containerStyle={{
            ...styles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={showDisbursement}
          loading={false}
          orientation="horizontal"
          type="primary"
          haveBorder
          text="Ver mi desembolso"
          disabled={false}
        />
        <Separator type="medium" />
        <Button
          containerStyle={{
            ...styles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={goToHome}
          loading={false}
          orientation="horizontal"
          type="primary-inverted"
          haveBorder
          text="Ir a inicio"
          disabled={false}
        />
      </SuccessModal>
    </>
  );
};

SuccessDisbursementModal.Content = DisbursementContent;
