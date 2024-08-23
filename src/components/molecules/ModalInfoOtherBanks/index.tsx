import React from 'react';
import Button from '@atoms/Button';
import TextCustom from '@atoms/TextCustom';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '@theme/colors';
import Icon from '@atoms/Icon';

interface Props {
  open: boolean;
  onClose: () => void;
}

const FIGMA_WIDTH = 360;
const WIDTH = Dimensions.get('screen').width;

const normalize = (y: number) => (y / FIGMA_WIDTH) * WIDTH;

const TEXT_SIZE = normalize(14);
const MODAL_WIDTH = normalize(320);
const COL_ONE_WIDTH = normalize(120);
const COL_TWO_WIDTH = normalize(144);
const PADDING_EXTERNO = normalize(28);
const PADDING_INTERNO = normalize(12);

const ModalInfoOtherBanks = ({open, onClose}: Props) => {
  return (
    <Modal isVisible={open} animationOutTiming={1} onBackButtonPress={onClose}>
      <View style={styles.wrapper}>
        <View style={styles.btn_close}>
          <Pressable onPress={onClose}>
            <Icon name="close-small" size="small" fill="#000" />
          </Pressable>
        </View>

        <TextCustom
          size={normalize(16)}
          variation="p"
          weight="bold"
          align="center"
          text="Horario para transferencias"
          style={{marginBottom: 8}}
        />
        <TextCustom
          size={normalize(16)}
          variation="p"
          align="center"
          text="Nuestras transferencias diferidas se realizan de lunes a viernes"
          style={{marginBottom: 20}}
        />

        {/* TABLE */}
        <View style={styles.table}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={{width: COL_ONE_WIDTH}}>
              <TextCustom
                size={TEXT_SIZE}
                text="Transfieres:"
                variation="p"
                weight="bold"
              />
            </View>
            <View style={{width: COL_TWO_WIDTH}}>
              <TextCustom
                size={TEXT_SIZE}
                text="Llega:"
                variation="p"
                weight="bold"
              />
            </View>
          </View>

          {/* BODY */}
          <View style={styles.table_body}>
            <View style={styles.table_row}>
              <View style={styles.table_col_one}>
                <TextCustom
                  size={TEXT_SIZE}
                  variation="p"
                  text="00:01 a.m. a 12:00 p.m."
                />
              </View>
              <View style={styles.table_col_two}>
                <TextCustom
                  size={TEXT_SIZE}
                  variation="p"
                  text="Entre las 02:15 p.m. hasta las 02:45 p.m. del mismo día"
                />
              </View>
            </View>
            <View style={styles.table_row}>
              <View style={styles.table_col_one}>
                <TextCustom
                  size={TEXT_SIZE}
                  variation="p"
                  text="12:01 p.m. a 02:30 p.m."
                />
              </View>
              <View style={styles.table_col_two}>
                <TextCustom
                  size={TEXT_SIZE}
                  variation="p"
                  text="Entre las 04:15 p.m. hasta las 04:45 p.m. del mismo día"
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.table_col_one}>
                <TextCustom
                  size={TEXT_SIZE}
                  variation="p"
                  text="02:31 p.m. a 12:00 a.m."
                />
              </View>
              <View style={styles.table_col_two}>
                <TextCustom
                  size={TEXT_SIZE}
                  variation="p"
                  text="Entre 9:00 a.m. hasta 09:30 a.m. del siguiente día útil"
                />
              </View>
            </View>
          </View>
        </View>

        <TextCustom
          size={TEXT_SIZE}
          variation="p"
          align="center"
          style={{marginBottom: 24}}
          text="Sábados, domingos y feriados la transferencia se realiza al siguiente día hábil."
        />

        <Button
          type="primary"
          text="Ir a transferir"
          orientation="horizontal"
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

export default ModalInfoOtherBanks;

const styles = StyleSheet.create({
  wrapper: {
    width: MODAL_WIDTH,
    alignSelf: 'center',
    paddingTop: 26,
    paddingBottom: PADDING_EXTERNO,
    paddingHorizontal: PADDING_EXTERNO,
    backgroundColor: Colors.White,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  btn_close: {
    width: '100%',
    marginBottom: 6,
    alignItems: 'flex-end',
  },
  table: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    overflow: 'hidden',
    marginBottom: 20,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    paddingHorizontal: PADDING_INTERNO,
    backgroundColor: '#F0F0F0',
  },
  table_body: {padding: 8},
  table_row: {
    flexDirection: 'row',
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 1,
  },
  table_col_one: {
    width: COL_ONE_WIDTH,
    paddingHorizontal: PADDING_INTERNO,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: '#EFEFEF',
  },
  table_col_two: {
    paddingVertical: 8,
    width: COL_TWO_WIDTH,
    paddingHorizontal: PADDING_INTERNO,
  },
});
