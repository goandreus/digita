import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Pressable} from 'react-native';
import Skeleton from '@molecules/Skeleton';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import {useNavigation} from '@react-navigation/native';
import BoxView from '@atoms/BoxView';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';

const MainDayToDay = ({
  affiliatedAccount,
  balance,
}: {
  affiliatedAccount: any;
  balance: string;
}) => {
  const navigation = useNavigation();
  const [isBannerLoading] = useState(false);
  const [moreMovementsPressed, setMoreMovementsPressed] = useState(false);

  return (
    <View style={styles.container}>
      {isBannerLoading ? (
        <Skeleton timing={600}>
          <View style={styles.skeleton} />
        </Skeleton>
      ) : (
        <View>
          <BoxView m={20}>
            <BoxView direction="row">
              <Icon name="icon_phone-cash" size={36} />
              <BoxView pl={10}>
                <TextCustom
                  text={'Mi día a día'}
                  variation="h2"
                  weight="normal"
                />
                <TextCustom
                  text={'Recibe pagos usando tu número celular'}
                  variation="h2"
                  size={14}
                  weight="normal"
                  color={COLORS.Primary.Darkest}
                />
              </BoxView>
            </BoxView>
            <Separator size={SIZES.MD} />
            <View style={styles.containerBalance}>
              <TextCustom
                text={'Saldo disponible'}
                variation="h2"
                size={12}
                weight="normal"
                color={COLORS.Primary.Darkest}
                align="center"
              />
              <TextCustom
                text={`${affiliatedAccount.currency} ${balance}`}
                variation="h2"
                size={20}
                weight="normal"
                align="center"
              />
            </View>
          </BoxView>
          <Pressable
            style={({pressed}) => [
              {
                backgroundColor: pressed
                  ? COLORS.Background.Light
                  : COLORS.Neutral.Lightest,
              },
              styles.footerButton,
            ]}
            onPressIn={() => setMoreMovementsPressed(true)}
            onPressOut={() => setMoreMovementsPressed(false)}
            onPress={() => {
              navigation.navigate('EntrepreneurSavingDetail', {
                from: 'MainScreen',
                title: 'Ahorros',
                accountName: affiliatedAccount.productName,
                accountNumber: affiliatedAccount.accountCode,
                cci: affiliatedAccount.accountCci,
                contable: affiliatedAccount.contable,
                currency: affiliatedAccount.currency,
                operationId: affiliatedAccount.operationUId,
                productType: affiliatedAccount.productType,
                sAvailableBalance: affiliatedAccount.sBalance,
                balance: affiliatedAccount.balance,
              });
            }}>
            <TextCustom
              text={'Ver movimientos'}
              variation="h2"
              size={16}
              weight="normal"
              color={
                moreMovementsPressed
                  ? COLORS.Primary.Medium
                  : COLORS.Primary.Darkest
              }
              align="center"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFECEC',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#222D4226',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  containerBalance: {
    backgroundColor: '#FFFFFF99',
    borderRadius: 16,
    padding: 5,
  },
  footerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  skeleton: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: '#E1E1E1',
  },
});

export default MainDayToDay;
