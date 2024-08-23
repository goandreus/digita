import React from 'react';
import PopUp from '@atoms/PopUp';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import Button from '@atoms/Button';
import {StyleSheet} from 'react-native';

interface Props {
  showModal: boolean;
  showRefillModal: boolean;
  showModalToken: boolean;
  closeModal: () => void;
  closeModalToken: () => void;
  closeRefillModal: () => void;
  onActivateToken: () => Promise<void>;
}

const PopUpSection = ({
  showModal,
  showRefillModal,
  showModalToken,
  onActivateToken,
  closeModal,
  closeRefillModal,
  closeModalToken,
}: Props) => {
  return (
    <>
      <PopUp open={showModal}>
        <TextCustom
          weight="normal"
          variation="h2"
          text="¡Recuerda!"
          color={Colors.Paragraph}
          size={20}
        />
        <Separator type="small" />
        <TextCustom
          weight="normal"
          variation="p"
          text={`Para realizar una transferencia, tu cuenta de origen debe estar habilitada para realizar transferencias y debes contar con saldo suficiente.\nRevisa las condiciones de tus cuentas en nuestra página web o consulta nuestra central telefónica (01) 313 5000.`}
          color={Colors.Paragraph}
          align="center"
        />
        <Separator type="medium" />
        <Button
          text="Entiendo"
          type="primary"
          orientation="horizontal"
          onPress={closeModal}
          containerStyle={styles.btnContainer}
        />
      </PopUp>
      <PopUp open={showRefillModal}>
        <TextCustom
          weight="normal"
          variation="h2"
          text="¡Recuerda!"
          color={Colors.Paragraph}
          size={20}
        />
        <Separator type="small" />
        <TextCustom
          weight="normal"
          variation="p"
          text={`Para realizar una transferencia, tu cuenta de origen debe estar habilitada para realizar transferencias y debes contar con saldo suficiente.\nRevisa las condiciones de tus cuentas en nuestra página web o consulta nuestra central telefónica (01) 313 5000.`}
          color={Colors.Paragraph}
          align="center"
        />
        <Separator type="medium" />
        <Button
          text="Entiendo"
          type="primary"
          orientation="horizontal"
          onPress={closeRefillModal}
          containerStyle={styles.btnContainer}
        />
      </PopUp>
      <PopUp animationOutTiming={1} open={showModalToken}>
        <TextCustom
          align="center"
          color="#665F59"
          variation="h0"
          weight="normal"
          size={18}
          text="¡Recuerda!"
        />
        <Separator type="small" />
        <TextCustom
          align="center"
          color="#83786F"
          variation="p"
          text="Necesitas activar tu Token digital y tener habilitadas tus cuentas de ahorro para poder realizar operaciones."
        />
        <Separator size={24} />
        <Button
          containerStyle={{width: '100%'}}
          type="primary"
          text="Activar Token"
          onPress={onActivateToken}
          orientation="horizontal"
        />
        <Separator type="small" />
        <TextCustom
          size={16}
          align="center"
          color="#83786F"
          variation="link"
          text="Ahora no"
          onPress={closeModalToken}
        />
      </PopUp>
    </>
  );
};

export default PopUpSection;

const styles = StyleSheet.create({
  btnContainer: {
    width: '75%',
    justifyContent: 'center',
  },
});
