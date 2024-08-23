import {
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {ItemProps, PickerItemProps, Props} from './types';
import {getStyles, getItemStyles} from './styles';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import Separator from '@atoms/extra/Separator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import Checkbox from '@atoms/extra/Checkbox';

const PickerItem = ({title, border, selected}: PickerItemProps) => {
  const styles = getItemStyles(border);
  return (
    <BoxView style={styles.itemContainer}>
      <Checkbox
        circular
        disabled
        type="primary"
        size="small"
        value={selected}
        style={styles.checkbox}
        onChange={() => {}}
      />
      <TextCustom
        text={title?.length >= 19 ? `${title?.slice(0, 20)}...` : title}
        weight="normal"
        variation="h4"
        color={selected ? 'primary-dark' : 'neutral-darkest'}
        lineHeight="tight"
      />
    </BoxView>
  );
};

const PickerCheck = ({
  data,
  seletedItem,
  title,
  subtitle,
  error,
  errorText,
  onSelect,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  const [isOpen, setIsOpen] = useState(false);

  const handleOnSelect = (e: ItemProps) => {
    onSelect(e);
    setIsOpen(false);
  };
  return (
    <>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnSubContainer}
          onPress={() => {
            Keyboard.dismiss();
            setIsOpen(true);
          }}>
          <TextCustom
            text={seletedItem ? seletedItem.title : title}
            weight="normal"
            variation={seletedItem ? 'h4' : 'p4'}
            color={seletedItem ? 'neutral-darkest' : 'neutral-dark'}
            lineHeight="tight"
          />
          <Icon
            name="chevron-down-v2"
            size={24}
            fill={error ? COLORS.Error.Medium : COLORS.Neutral.Dark}
          />
        </TouchableOpacity>
      </View>
      {error && (
        <TextCustom
          text={errorText}
          variation="p5"
          weight="normal"
          color="error-medium"
        />
      )}

      <Modal
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setIsOpen(false)}
        animationInTiming={600}
        animationOutTiming={600}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        statusBarTranslucent
        useNativeDriver
        useNativeDriverForBackdrop
        backdropColor={COLORS.Neutral.Dark}
        backdropOpacity={0.78}
        isVisible={isOpen}
        style={styles.modalContainer}>
        <View style={styles.container}>
          <>
            <TextCustom
              color="primary-medium"
              lineHeight="fair"
              variation="h3"
              align="left">
              {title}
            </TextCustom>
            <Separator type="x-small" />
            <TextCustom
              color="neutral-darkest"
              lineHeight="comfy"
              variation="h6"
              align="left">
              {subtitle}
            </TextCustom>
            <Separator size={SIZES.MD} />
          </>

          <ScrollView>
            {data?.map((e, index) => (
              <TouchableOpacity key={index} onPress={() => handleOnSelect(e)}>
                <PickerItem
                  title={e.title}
                  value={e.value}
                  border={index !== data.length - 1}
                  selected={seletedItem?.value === e.value}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default PickerCheck;
