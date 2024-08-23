import {View, StatusBar, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {COLORS} from '@theme/colors';
import {TermsAndConditionsScreenProps} from '@navigations/types';
import Pdf from 'react-native-pdf';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import {DocumentsURL} from '@global/information';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import {getRemoteValue} from '@utils/firebase';
import NativeConfig from 'react-native-config';

export const TermsAndConditions = ({
  route,
  navigation,
}: TermsAndConditionsScreenProps) => {
  const {type, otherType} = route?.params;

  let terms_conds: string[];
  switch (otherType) {
    case 'INTEROP_TRANSACTION':
      terms_conds = getRemoteValue('terms_conds_interop')
        .asString()
        .split('<br>');
      break;
    case 'ENTREPRENEUR_OPENING':
      terms_conds = getRemoteValue('terms_conds_open_sav_entrpnr')
        .asString()
        .split('<br>');
      break;
    default:
      terms_conds = [];
  }

  const uri = {
    CREDIT_INSURANCE: DocumentsURL.CreditInsurance,
    ACCOUNT_OPENING: DocumentsURL.AccountOpening,
    INDIVIDUAL_INSURANCE: DocumentsURL.IndividualInsurance,
    ECONOMIC_INSURANCE: DocumentsURL.EconomicInsurance,
    DATAUSE_CONSENT: DocumentsURL.DataUseConsent,
    INTEROPERABILITY_CONSENT: getRemoteValue(
      'terms_conds_interop_url',
    ).asString(),
    GROUP_CREDIT_SHORT: DocumentsURL.GroupCreditShortFrec,
    GROUP_CREDIT_LONG: DocumentsURL.GroupCreditLongFrec,
    GROUP_INSURANCE: DocumentsURL.GroupInsurance,
    ENTREPRENEUR_ACCOUNT_CONTRACT: getRemoteValue(
      'contract_savings_url',
    ).asString(),
    ENTREPRENEUR_ACCOUNT_INFO: getRemoteValue(
      'book_open_sav_entrpnr_url',
    ).asString(),
    WOW_ACCOUNT_INFO: DocumentsURL.WOWACCOUNTINFO,
    LINE_CREDIT_CONTRACT: DocumentsURL.LineCreditContract,
    LINE_CREDIT_DISBURSE: DocumentsURL.LineCreditDisburse,
  };

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={COLORS.Transparent}
      />
      <View style={styles.headerBorder}>
        <HeaderStack
          canGoBack={navigation.canGoBack()}
          onBack={() => navigation.goBack()}
          title={'Términos y Condiciones'}
        />
      </View>
      <View style={styles.container}>
        {type ? (
          <Pdf
            trustAllCerts={false}
            source={{
              uri: uri[type],
              cache: true,
            }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        ) : otherType ? (
          <BoxView style={styles.content}>
            <ScrollView>
              {terms_conds.map((item, index) => (
                <BoxView key={item + index} direction="row" mb={16}>
                  <BoxView style={styles.viñeta} />
                  <TextCustom
                    align="justify"
                    text={item}
                    variation="p5"
                    color="neutral-darkest"
                    weight="normal"
                    style={styles.text}
                  />
                </BoxView>
              ))}
            </ScrollView>
          </BoxView>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerBorder: {
    borderTopWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.01)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 22,
  },
  pdf: {
    flex: 1,
    width: '100%',
    /* height: Dimensions.get('window').height / 2, */
  },
  content: {
    marginTop: 12,
    width: '90%',
    paddingLeft: 20,
    paddingRight: 24,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  viñeta: {
    height: 6,
    width: 6,
    borderRadius: 50,
    backgroundColor: 'black',
    marginTop: 6,
    marginRight: 8,
  },
  text: {
    paddingRight: 24,
  },
});
