import React, {useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import Icon from '@atoms/Icon';
import Input from '@atoms/Input';
import {isEmpty} from '@utils/isEmpty';
import useToggle from '@hooks/useToggle';
import TextCustom from '@atoms/TextCustom';
import { getRemoteValue } from '@utils/firebase';

interface Data {
  accountName: string;
}

interface DataProps {
  data: Data;
  enable: boolean;
  error: string;
}

interface Props {
  style?: StyleProp<ViewStyle>;
  accountToFavorite: DataProps;
  handleToggle: () => void;
  handleChangeText: (text: string) => void;
}

export const useAddAccountToFavorite = () => {
  const {isOpen, onToggle} = useToggle();
  const [error, setError] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleToggle = () => {
    onToggle();
    setError('');
    setAccountName('');
  };

  const handleChangeText = (text: string) => {
    setAccountName(text);
    setError(isEmpty(text) ? 'Este campo es obligatorio' : '');
  };

  return {
    accountToFavorite: {
      enable: isOpen,
      ok: !isEmpty(accountName),
      data: {accountName},
      error: error,
    },
    handleToggle,
    handleChangeText,
  };
};

const AddAccountToFavorite = ({
  style,
  accountToFavorite,
  handleChangeText,
  handleToggle,
}: Props) => {
  const hasFavorites = getRemoteValue('active_favs').asBoolean()
  return (
  <>
    {hasFavorites && (
      <View style={style}>
        <Pressable
          onPress={handleToggle}
          style={[
            styles.btn_wrapper,
            accountToFavorite.enable ? styles.btn_wrapper_open : null,
          ]}>
          <Icon
            size={20}
            style={styles.btn_wrapper_icon}
            name={accountToFavorite.enable ? 'star' : 'star-outline'}
          />
          <TextCustom
            size={16}
            variation="p"
            weight="normal"
            color="#83786F"
            text="Agregar a Mis Favoritos"
          />
        </Pressable>

        {accountToFavorite.enable && (
          <>
            <TextCustom
              size={16}
              weight="bold"
              variation="p"
              color="#83786F"
              style={styles.label}
              text="¿Cuál es el nombre para tu favorito?"
            />
            <Input
              placeholder="Ingresa el nombre de tu favorito"
              value={accountToFavorite.data.accountName}
              errorMessage={accountToFavorite.error}
              onChange={handleChangeText}
              haveError={!isEmpty(accountToFavorite.error)}
            />
          </>
        )}
      </View>
    )}
  </>
  )
};

export default AddAccountToFavorite;

const styles = StyleSheet.create({
  label: {marginBottom: 4},
  btn_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn_wrapper_open: {marginBottom: 20},
  btn_wrapper_icon: {marginRight: 9.5},
});
