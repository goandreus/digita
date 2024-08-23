import React from 'react';
import {View, StyleSheet, Pressable, ImageBackground} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {useNavigation} from '@react-navigation/native';

interface CreditAdviceProps {
  amount: string;
}

const CreditAdvice = ({amount}: CreditAdviceProps) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('StartDisbursement', {
          showTokenIsActivated: false,
        })
      }>
      <ImageBackground
        source={require('@assets/images/backgroundAdvice.png')}
        imageStyle={styles.imageBacground}>
        <View style={styles.container}>
          <View>
            <Icon name="icon_money-bag" size={32} style={styles.icon} />
          </View>
          <View>
            <TextCustom
              text="Haz tu desembolso"
              variation="h5"
              color="background-lightest"
              weight="bold"
            />
            <TextCustom
              style={styles.text}
              variation="p6"
              weight="bold"
              color="background-lightest">
              Ya se encuentra listo tu crédito solicitado de
              <TextCustom
                text={` ${amount || ''}`}
                variation="h6"
                weight="bold"
                color="background-lightest"
              />
            </TextCustom>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginBottom: 8,
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageBacground: {
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#91004B',
  },
  text: {
    width: 325,
  },
  icon: {
    marginRight: 8,
  },
});

export default CreditAdvice;
