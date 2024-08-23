import React, {useEffect, useState} from 'react';
import SavingsTemplate from '@templates/SavingsTemplate';
import {TouchableOpacity, View} from 'react-native';
import TextCustom from '@atoms/TextCustom';
import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import {getUserCredits} from '@services/User';
import Skeleton from '@molecules/Skeleton';

const ProductDetail = ({name, description, amount, currency, action}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
      }}
      onPress={action}>
      <TextCustom
        style={{width: '30%'}}
        text={name}
        variation="p"
        weight="bold"
        size={16}
      />
      <View style={{marginLeft: 70, width: '40%'}}>
        <TextCustom text={description} variation="p" weight="bold" size={14} />
        <TextCustom
          color="#665F59"
          text={`${currency} ${amount}`}
          variation="p"
          weight="bold"
          size={14}
        />
      </View>
      <View>
        <Icon name="arrow-right" size="tiny" fill="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const MyCredits = ({navigation, route}) => {
  const [individualCredits, setIndividualCredits] = useState<any | null>(null);

  const getIndividualCredits = async () => {
    const individualCredits = await getUserCredits({
      personUid: route?.params?.personUId,
    });
    setIndividualCredits(individualCredits.individualCredits);
  };

  useEffect(() => {
    getIndividualCredits();
  }, []);

  return (
    <SavingsTemplate title="Mis Créditos" action={() => navigation.goBack()}>
      {individualCredits ? (
        <>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="wallet-one" size="small" fill="#fff" />
            <TextCustom
              style={{marginLeft: 8}}
              text="Mis Créditos Individuales"
              variation="p"
              color={Colors.Primary}
              weight="bold"
            />
          </View>
          {individualCredits.map((credit, index) => {
            return (
              <ProductDetail
                key={index}
                name={credit.productName}
                description={'Crédito desembolsado'}
                currency={credit.currency}
                amount={credit.sDisbursedCapital}
                action={async () => {
                  navigation.navigate('CreditsDetail', {
                    status: credit.status,
                    productName: credit.productName,
                    advancePercentage: credit.advancePercentage,
                    disbursedCapital: credit.sDisbursedCapital,
                    disbursedCapitalAmount: credit.disbursedCapital,
                    currency: credit.currency,
                    accountNumber: credit.accountCode,
                    capitalCanceled: credit.sCapitalAmount,
                    capitalCanceledAmount: credit.capitalAmount,
                    isPunished: credit.isPunished,
                    type: 'Individual',
                  });
                }}
              />
            );
          })}
        </>
      ) : (
        <Skeleton timing={600}>
          <View
            style={{
              width: '25%',
              height: 24,
              borderRadius: 8,
              marginTop: 24,
              backgroundColor: '#E1E1E1',
            }}
          />
          <View
            style={{
              width: '100%',
              height: 36,
              borderRadius: 36,
              marginTop: 24,
              backgroundColor: '#E1E1E1',
            }}
          />
          <View
            style={{
              width: '100%',
              height: 36,
              borderRadius: 36,
              marginTop: 24,
              backgroundColor: '#E1E1E1',
            }}
          />
        </Skeleton>
      )}
    </SavingsTemplate>
  );
};

export default MyCredits;
