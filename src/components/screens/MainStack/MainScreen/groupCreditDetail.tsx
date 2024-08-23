import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {useUserInfo} from '@hooks/common';
import Skeleton from '@molecules/Skeleton';
import {COLORS, Colors} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import React, {useEffect, useState} from 'react';
import {
  Share,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {GroupCreditDetailProps} from '@navigations/types';
import {CreditDetailInterface} from '@services/Accounts';
import {getCreditDetail} from '@services/CreditLine';
import GroupCreditsTemplate from '@templates/extra/GroupCreditsTemplate';
import Separator from '@atoms/extra/Separator';
import SummaryCard from './Components/SummaryCard';
import DetailCard from './Components/DetailCard';
import SimpleCard from './Components/SimpleCard';
import ModalBottom from '@atoms/ModalBottom';
import Button from '@atoms/extra/Button';
import {getIsProcessingPaymentContribution} from '@services/GroupCollection';

const GroupCreditDetail = ({navigation, route}: GroupCreditDetailProps) => {
  const {accountNumber, currency, productName} = route?.params;

  const [open, setOpen] = useState(false);

  const styles = getStyles();
  const goBack = () => navigation.goBack();

  const [creditDetail, setCreditDetail] =
    useState<CreditDetailInterface | null>(null);
  const {user} = useUserInfo();
  const person = user?.person;
  const [isQuotaOverdue, setIsQuotaOverdue] = useState(false);

  const getAccountDetail = async () => {
    const creditDetailData = await getCreditDetail({
      accountCode: Number(accountNumber),
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    });
    setCreditDetail(creditDetailData);
  };

  useEffect(() => {
    getAccountDetail();
  }, []);

  useEffect(() => {
    if (creditDetail && creditDetail.groupOverdueAmount !== 0) {
      if (!creditDetail?.expirationDateString.includes('Hoy')) {
        setIsQuotaOverdue(true);
        const operationID = Number(creditDetail?.groupAccountId ?? 0);
        getIsProcessingPaymentContribution(operationID).then(isProcessing => {
          if (!isProcessing) {
            setOpen(true);
          }
        });
      } else {
        setIsQuotaOverdue(false);
      }
    }
  }, [creditDetail]);

  const handleShare = () => {
    Share.share({
      message: `N° de crédito ${creditDetail?.groupAccountId}`,
    });
  };

  const handleConstancy = () => {
    let quotaTitle = `Cuota ${(creditDetail?.groupFeeNumber ?? 0) - 1}`;
    if (creditDetail?.groupFeeNumber ?? 0 < 10) {
      quotaTitle = `Cuota 0${(creditDetail?.groupFeeNumber ?? 0) - 1}`;
    }
    navigation.navigate('GroupCollectionConstancy', {
      quotaTitle,
      groupName: `${creditDetail?.GroupName}`,
      creditNumber: `${creditDetail?.groupAccountId}`,
    });
  };

  const currentInstallment = creditDetail?.groupFeeNumber
    ? creditDetail?.groupFeeNumber
    : 1;
  const installmentTitle =
    currentInstallment < 10
      ? `Cuota 0${currentInstallment}`
      : `Cuota ${currentInstallment}`;

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <GroupCreditsTemplate
        headerTitle="Detalle crédito grupal"
        goBack={goBack}
        canGoBack={true}>
        {creditDetail ? (
          <BoxView>
            <BoxView style={styles.mainContainer}>
              <BoxView direction="row" justify="space-between" align="flex-end">
                <BoxView>
                  <TextCustom
                    color="primary-medium"
                    variation="h3"
                    weight="bold"
                    lineHeight="tight"
                    text={productName}
                    style={{letterSpacing: 0.2, marginBottom: 4}}
                  />
                  <TextCustom
                    color="neutral-darkest"
                    variation="h5"
                    weight="normal"
                    lineHeight="tight"
                    text={`N° de crédito ${creditDetail?.groupAccountId}`}
                  />
                </BoxView>
                <BoxView>
                  <TouchableWithoutFeedback onPress={handleShare}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="share-two"
                        size={12}
                        color={'#000'}
                        style={{marginRight: SIZES.XS}}
                      />
                      <TextCustom
                        color="primary-darkest"
                        variation="h6"
                        weight="normal"
                        lineHeight="tight"
                        text="Compartir"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </BoxView>
              </BoxView>
              <Separator size={SIZES.MD} />
              <SummaryCard
                title={'Deuda grupal actual'}
                subtitle={'Total del crédito'}
                groupCapitalOriginal={creditDetail?.sgroupCapitalOriginal}
                groupAmountBalanceCapital={
                  creditDetail?.sgroupAmountBalanceCapital
                }
                groupInstallmentAmount={creditDetail?.sgroupInstallmentAmount}
                currency={currency}
                quota={creditDetail?.groupFeeNumber}
                quotasNumber={creditDetail?.groupTotalFeeNumber}
                dueDate={creditDetail?.expirationDateString}
              />
              <Separator size={SIZES.XS} />
              <DetailCard
                title={'Detalle de mi crédito'}
                individualCapitalOriginal={
                  creditDetail?.sindividualCapitalOriginal
                }
                individualAmountBalanceCapital={
                  creditDetail?.sindividualAmountBalanceCapital
                }
                individualInstallmentAmount={
                  creditDetail?.sindividualInstallmentAmount
                }
                installmentState={
                  creditDetail?.individualOverdueAmount !== 0
                    ? 'Vencido'
                    : 'Al día'
                }
                currency={'S/'}
              />
              <Separator size={SIZES.XL} />
            </BoxView>
            <Separator size={SIZES.XS * 5} />
            <BoxView px={24}>
              <TextCustom
                color="neutral-darkest"
                variation="h4"
                weight="normal"
                lineHeight="tight"
                text="¿Cómo va mi grupo?"
              />
              <Separator size={SIZES.MD} />
              <BoxView>
                <SimpleCard
                  title={installmentTitle}
                  dueDate={creditDetail?.expirationDateString}
                  installmentState={isQuotaOverdue ? 'Vencido' : 'Por Pagar'}
                  operationId={+creditDetail?.groupAccountId}
                  clientName={person?.names}
                  documentNumber={person?.documentNumber}
                  groupInstallmentAmount={creditDetail?.sgroupInstallmentAmount}
                  quotasNumber={creditDetail?.groupTotalFeeNumber}
                />
              </BoxView>
              {creditDetail?.groupFeeNumber > 1 && (
                <>
                  <BoxView
                    direction="column"
                    style={styles.cardFeePaidContainer}>
                    <BoxView direction="row" style={styles.cardFeePaidTitle}>
                      <TextCustom
                        text={
                          creditDetail?.groupFeeNumber < 10
                            ? `Cuota 0${creditDetail?.groupFeeNumber - 1}`
                            : `Cuota ${creditDetail?.groupFeeNumber - 1}`
                        }
                        variation="h4"
                        color="neutral-darkest"
                      />
                    </BoxView>
                    <BoxView
                      direction="row"
                      align="center"
                      style={styles.cardFeePaid}>
                      <BoxView direction="column">
                        <TextCustom
                          text="Estado"
                          variation="h5"
                          color="neutral-dark"
                        />
                        <BoxView direction="row">
                          <TextCustom
                            text={'Pagado'}
                            variation="h0"
                            color="success-medium"
                          />
                          <Icon name="badge" size={18} />
                        </BoxView>
                      </BoxView>
                      <TouchableWithoutFeedback onPress={handleConstancy}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TextCustom
                            text="Ver constancia"
                            variation="h4"
                            color="primary-medium"
                            style={{marginRight: 4, paddingBottom: 2}}
                          />
                          <Icon
                            iconName={'icon_arrows_right'}
                            size={16}
                            color={COLORS.Primary.Medium}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </BoxView>
                  </BoxView>
                </>
              )}
            </BoxView>
            <ModalBottom open={open} onRequestClose={() => {}}>
              <View>
                <BoxView align="center">
                  <Icon name="due-pay" size={110} color="#000" />
                </BoxView>
                <BoxView align="center" my={16}>
                  <TextCustom
                    variation="h3"
                    align="center"
                    color="primary-dark">
                    ¡Cuota pendiente de pago!
                  </TextCustom>
                </BoxView>
                <BoxView align="center" mt={8} mb={16}>
                  <TextCustom variation="p0" align="center">
                    Tu cuota grupal no ha sido pagada.
                  </TextCustom>
                  <TextCustom variation="p0" align="center">
                    Si alguien del grupo tiene problemas para
                  </TextCustom>
                  <TextCustom variation="p0" align="center">
                    enviar su cuota, todos pueden apoyar
                  </TextCustom>
                  <TextCustom variation="p0" align="center">
                    dando la
                    <TextCustom variation="p0" weight="bold">
                      {' cuota solidaria.'}
                    </TextCustom>
                  </TextCustom>
                </BoxView>
                <BoxView align="center" mt={16} mb={32}>
                  <TextCustom variation="p0">
                    No pagar afecta la calificación del grupo.
                  </TextCustom>
                </BoxView>
                <View>
                  <Button
                    onPress={() => {
                      setOpen(false);
                    }}
                    text="Entendido"
                    type="primary"
                  />
                </View>
              </View>
            </ModalBottom>
          </BoxView>
        ) : (
          <BoxView>
            <Skeleton timing={600}>
              <View style={{...styles.skeleton, height: 60}} />
              <View style={{...styles.skeleton, height: 200}} />
              <View style={{...styles.skeleton, height: 60, marginTop: 12}} />
            </Skeleton>
          </BoxView>
        )}
      </GroupCreditsTemplate>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.Error.Lightest,
      paddingHorizontal: SIZES.LG,
      paddingTop: SIZES.XS * 4,
    },
    skeleton: {
      marginTop: 24,
      marginLeft: 16,
      width: '90%',
      height: 60,
      borderRadius: 8,
      backgroundColor: '#E1E1E1',
    },
    cardFeePaidTitle: {
      paddingHorizontal: SIZES.MD,
      paddingVertical: SIZES.MD,
      backgroundColor: COLORS.Background.Light,
      borderTopLeftRadius: SIZES.MD,
      borderTopRightRadius: SIZES.MD,
      justifyContent: 'space-between',
    },
    cardFeePaid: {
      paddingHorizontal: SIZES.MD,
      paddingVertical: SIZES.LG,
      borderBottomRightRadius: SIZES.MD,
      justifyContent: 'space-between',
    },
    cardFeePaidContainer: {
      backgroundColor: '#fff',
      borderRadius: SIZES.MD,
      overflow: 'hidden',

      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 7.68,

      elevation: 2,
      marginBottom: SIZES.XS,
    },
  });

  return stylesBase;
};

export default GroupCreditDetail;
