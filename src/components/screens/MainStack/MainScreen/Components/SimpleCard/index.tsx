import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {COLORS} from '@theme/colors';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import TextTitleValue from '@atoms/extra/TextTitleValue';
import Icon from '@atoms/Icon';
import {useNavigation} from '@react-navigation/native';
import {
  getIsProcessingPaymentContribution,
  getMemberRoleAndGroupCode,
  saveDataGroupCollection,
  getURLGroupCollection,
} from '@services/GroupCollection';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigations/types';
import ModalBottom from '@atoms/ModalBottom';
import Button from '@atoms/extra/Button';
import SVGContributionPending from '@assets/images/contribution-pending.svg';
import {validateWhiteList} from '@utils/validateWhiteList';
import {getRemoteValue} from '@utils/firebase';
import {getToken} from '@utils/getToken';

export interface SimpleCardProps {
  title: string;
  installmentState?: string;
  dueDate?: string;
  style?: ViewStyle;
  operationId: number;
  clientName?: string;
  documentNumber?: string;
  groupInstallmentAmount?: string;
  quotasNumber?: number;
}

const SimpleCard = ({
  title,
  installmentState,
  dueDate,
  style,
  operationId,
  clientName,
  documentNumber,
  groupInstallmentAmount,
  quotasNumber,
}: SimpleCardProps) => {
  const styles = getStyles();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [open, setOpen] = useState(false);
  const showMore = getRemoteValue('trx_credit_group_payments').asBoolean();

  const handleSeeMore = async () => {
    const {groupCode, role} = await getMemberRoleAndGroupCode();
    const isSuccess = await saveDataGroupCollection({
      token: getToken() ?? '',
      memberRole: role,
      operationID: `${operationId}`,
      groupCode: `${groupCode}`,
      dueDate: dueDate ?? '',
      quota: title,
      clientName: clientName ?? '',
      identityDocument: documentNumber ?? '',
      groupQuotaAmount: groupInstallmentAmount ?? '',
      quotasNumber: `${quotasNumber ?? 0}`,
    });

    if (!isSuccess) return;

    const url = await getURLGroupCollection();

    if (!validateWhiteList(url)) {
      return;
    }

    const isProcessing = await getIsProcessingPaymentContribution(groupCode);
    if (isProcessing) {
      setOpen(!open);
    } else {
      navigation.navigate('WebViewScreen', {url});
    }
  };

  return (
    <>
      <ModalBottom open={open} onRequestClose={() => {}}>
        <View>
          <View style={styles.popUpImage}>
            <SVGContributionPending />
          </View>
          <View style={styles.popUpTitle}>
            <TextCustom variation="h3" align="center" color="primary-dark">
              ¡Estamos procesando
            </TextCustom>
            <TextCustom variation="h3" align="center" color="primary-dark">
              el registro de aportes de tu grupo!
            </TextCustom>
          </View>
          <View style={styles.popUpText}>
            <TextCustom variation="p0" align="center">
              Recibimos el registro de aportes de tu grupo. Cuando terminemos de
              procesarlo te enviaremos un mensaje de texto.
            </TextCustom>
          </View>
          <View>
            <Button
              onPress={() => {
                setOpen(!open);
              }}
              text="Entendido"
              type="primary"
            />
          </View>
        </View>
      </ModalBottom>
      <View style={{...styles.container, ...style}}>
        <BoxView style={styles.cardTitle}>
          <TextCustom text={title} variation="h4" color="neutral-darkest" />
          <BoxView>
            {showMore ? (
              <TouchableWithoutFeedback onPress={() => handleSeeMore()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextCustom
                    text={'Ver más'}
                    variation="h5"
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
            ) : (
              <></>
            )}
          </BoxView>
        </BoxView>
        <BoxView style={styles.cardInfo}>
          <TextTitleValue
            text1="Día de pago"
            text2={dueDate ?? ''}
            text1Variation="h5"
            text2Variation="h0"
            text1Color="neutral-dark"
            text2Color={
              dueDate === 'Ayer' || dueDate === 'Hoy' || dueDate === 'Mañana'
                ? 'error-medium'
                : 'neutral-darkest'
            }
            directionFlex="column"
            style={{alignItems: 'flex-start'}}
          />
          <BoxView direction="row" mr={32}>
            <TextTitleValue
              text1="Estado"
              text2={installmentState ?? ''}
              text1Variation="h5"
              text2Variation="h0"
              text1Color="neutral-dark"
              text2Color={
                installmentState !== 'Vencido'
                  ? 'secondary-medium'
                  : 'error-medium'
              }
              directionFlex="column"
              style={{marginRight: 8, alignItems: 'flex-start'}}
            />
            {installmentState === 'Al día' ? (
              <Icon name={'badge'} size={38} fill="#000" />
            ) : (
              <BoxView px={8} />
            )}
          </BoxView>
        </BoxView>

        {installmentState === 'Vencida' && (
          <BoxView style={styles.cardError}>
            <Icon
              name={'icon_money-bag-two'}
              size={20}
              fill="red"
              style={{marginRight: 8}}
            />
            <TextCustom
              text={'Falta completar el total de la cuota grupal'}
              variation="h6"
              weight="normal"
              color="primary-darkest"
            />
          </BoxView>
        )}
      </View>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      marginBottom: SIZES.XL,
      borderRadius: SIZES.XS,
      overflow: 'hidden',

      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 7.68,

      elevation: 5,
    },
    cardTitle: {
      padding: SIZES.MD,
      backgroundColor: COLORS.Background.Light,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardInfo: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      padding: SIZES.LG,
      backgroundColor: COLORS.Background.Lightest,
    },
    cardError: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.XS,
      backgroundColor: COLORS.Error.Lightest,
      flexDirection: 'row',
    },
    dataIn: {
      marginRight: SIZES.XXL,
    },
    popUpTitle: {
      marginTop: SIZES.LG,
      marginBottom: 12,
    },
    popUpText: {
      marginTop: 12,
      marginBottom: SIZES.LG,
    },
    popUpImage: {
      alignItems: 'center',
    },
  });

  return stylesBase;
};

export default SimpleCard;
