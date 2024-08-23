import React from 'react';
import {Dimensions, View} from 'react-native';
import Modal from 'react-native-modal';
import {getStyles} from './styles';
import TextCustom from '@atoms/extra/TextCustom';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@theme/colors';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ScheduleModal = ({open, onClose}: Props) => {
  const styles = getStyles();
  const insets = useSafeAreaInsets();

  const FIGMA_WIDTH = 360;
  const WIDTH = Dimensions.get('screen').width;

  const normalize = (y: number) => (y / FIGMA_WIDTH) * WIDTH;

  const TEXT_SIZE = normalize(14);
  const COL_ONE_WIDTH = normalize(100);
  const COL_TWO_WIDTH = normalize(144);

  return (
    <Modal
      backdropTransitionOutTiming={0}
      onBackdropPress={onClose}
      animationInTiming={1000}
      animationOutTiming={500}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor={COLORS.Neutral.Dark}
      backdropOpacity={0.78}
      isVisible={open}
      useNativeDriver
      style={styles.modal}>
      <View
        style={{
          ...styles.view,
          paddingBottom: insets.bottom + SIZES.XL,
          paddingTop: SIZES.XL,
        }}>
        <TextCustom
          variation="h0"
          color="primary-medium"
          align="center"
          text={
            'Recuerda las transferencias \ndiferidas se realizan de \nLunes a Viernes en los horarios:'
          }
          style={{marginBottom: SIZES.LG}}
        />

        {/* TABLE */}
        <View style={styles.table}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={{width: COL_ONE_WIDTH}}>
              <TextCustom
                size={TEXT_SIZE}
                text="Transfieres:"
                variation="h6"
                weight="normal"
                color="neutral-darkest"
              />
            </View>
            <View style={{width: COL_TWO_WIDTH}}>
              <TextCustom
                size={TEXT_SIZE}
                text="Llega entre:"
                variation="h6"
                weight="normal"
                color="neutral-darkest"
              />
            </View>
          </View>

          {/* BODY */}
          <View>
            <View style={styles.table_row}>
              <View style={styles.table_col_one}>
                <TextCustom
                  style={styles.txt}
                  variation="p4"
                  text="00:01 a 12:00"
                  color="neutral-darkest"
                />
              </View>
              <View style={styles.table_col_two}>
                <TextCustom
                  style={styles.txt}
                  variation="p4"
                  text="Las 14:15 hasta las 14:45"
                  color="neutral-darkest"
                />
              </View>
            </View>
            <View style={styles.table_row}>
              <View style={styles.table_col_one}>
                <TextCustom
                  style={styles.txt}
                  variation="p4"
                  text="12:01 a 14:30"
                  color="neutral-darkest"
                />
              </View>
              <View style={styles.table_col_two}>
                <TextCustom
                  style={styles.txt}
                  variation="p4"
                  text="Las 14:45 hasta 16:15 "
                  color="neutral-darkest"
                />
              </View>
            </View>
            <View style={styles.table_row}>
              <View style={styles.table_col_one}>
                <TextCustom
                  style={styles.txt}
                  variation="p4"
                  text="14:31 a 00:00"
                  color="neutral-darkest"
                />
              </View>
              <View style={styles.table_col_two}>
                <TextCustom
                  style={styles.txt}
                  variation="p4"
                  text="Las 9:00 hasta 09:30 del siguiente día hábil."
                  color="neutral-darkest"
                />
              </View>
            </View>
          </View>
        </View>

        <TextCustom
          variation="p4"
          align="center"
          color="neutral-darkest"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginBottom: 24}}
          text="Sábados, Domingos y feriados las transferencias llegarán al día siguiente hábil."
        />

        <Button
          type="primary"
          text="Entiendo"
          orientation="horizontal"
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

export default ScheduleModal;
