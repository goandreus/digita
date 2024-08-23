import React, {useEffect, useMemo, useState} from 'react';
import TextCustom from '../TextCustom';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {FONTS, FONTS_LINE_HEIGHTS_FACTOR, FONT_SIZES} from '@theme/fonts';
import Separator from '../Separator';
import Icon from '@atoms/Icon';
import Modal from 'react-native-modal';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

interface DataItem {
  id: string;
  [key: string]: any;
}

interface Props {
  modalTitle?: string;
  placeholder?: string;
  defaultId?: string;
  data?: DataItem[];
  onSelectItem?: (item: DataItem) => void;
  errorMessage?: string;
  closeOnSelect?: boolean;
  onRenderItem?: (item: DataItem) => React.ReactNode;
  onRenderItemSelected?: (item: DataItem) => React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

const PickerSimple = ({
  data,
  defaultId,
  errorMessage,
  modalTitle,
  onSelectItem,
  placeholder,
  closeOnSelect = true,
  onRenderItem,
  onRenderItemSelected,
  style = {},
  disabled,
}: Props) => {
  const insets = useSafeAreaInsets();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentItemId, setCurrentItemId] = useState<string | undefined>(
    undefined,
  );

  const currentItem = useMemo(() => {
    if (data === undefined || data.length === 0) return null;
    let item = data.find(item => item.id === currentItemId);
    return item || null;
  }, [currentItemId]);

  const styles = useMemo(() => {
    return getStyles(errorMessage !== undefined, insets);
  }, [errorMessage, insets]);

  const canSelect = useMemo(() => {
    if (data === undefined) return false;
    if (data.length === 0) return false;
    if (currentItemId === undefined) return true;

    const others = data.filter(item => item.id !== currentItemId);
    if (others.length > 0) return true;
  }, [data, currentItemId]);

  useEffect(() => {
    setCurrentItemId(defaultId);
  }, [defaultId]);

  return (
    <>
      <View>
        <TouchableOpacity
          disabled={!canSelect || disabled}
          style={{...styles.box, ...style}}
          onPress={() => setOpenModal(true)}>
          {currentItem === null && (
            <TextCustom
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{...styles.label, color: COLORS.Neutral.Dark}}>
              {placeholder}
            </TextCustom>
          )}
          {currentItem !== null && (
            <>
              {onRenderItemSelected === undefined && (
                <TextCustom
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.label}>
                  {typeof currentItem.label === 'string'
                    ? currentItem.label.toLocaleUpperCase()
                    : currentItem.id}
                </TextCustom>
              )}
              {onRenderItemSelected !== undefined &&
                onRenderItemSelected(currentItem)}
            </>
          )}

          <View style={styles.iconWrapper}>
            <Icon
              iconName="icon_chevron_down"
              size={32}
              color={canSelect ? COLORS.Neutral.Darkest : COLORS.Neutral.Medium}
            />
          </View>
        </TouchableOpacity>
        {errorMessage !== undefined && (
          <>
            <Separator size={SIZES.XS} />
            <View style={styles.messageContainer}>
              <TextCustom
                variation="p5"
                color="error-medium"
                lineHeight="tight">
                {errorMessage}
              </TextCustom>
            </View>
          </>
        )}
      </View>
      <Modal
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setOpenModal(false)}
        animationInTiming={500}
        animationOutTiming={500}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        statusBarTranslucent={true}
        backdropColor={COLORS.Neutral.Dark}
        backdropOpacity={0.78}
        isVisible={openModal}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          {modalTitle !== undefined && (
            <>
              <View style={styles.modalTitle}>
                <TextCustom
                  color="primary-medium"
                  lineHeight="fair"
                  variation="h0"
                  size={24}
                  align="center">
                  {modalTitle}
                </TextCustom>
              </View>
              <Separator size={SIZES.XL} />
            </>
          )}
          {data !== undefined && onRenderItem !== undefined && (
            <ScrollView>
              {data.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    onPress={() => {
                      if (onSelectItem !== undefined) onSelectItem(item);
                      setCurrentItemId(item.id);
                      if (closeOnSelect === true) setOpenModal(false);
                    }}>
                    {onRenderItem(item)}
                  </TouchableOpacity>
                  {index < data.length - 1 && (
                    <Separator
                      type="xx-small"
                      showLine
                      color="#EFEFEF"
                      width={1.5}
                    />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
};

const getStyles = (haveError: boolean, insets: EdgeInsets) => {
  let borderColor: string = COLORS.Neutral.Medium;

  if (haveError) borderColor = COLORS.Error.Medium;

  const stylesBase = StyleSheet.create({
    box: {
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: borderColor,
      paddingHorizontal: SIZES.MD,
    },
    label: {
      flexShrink: 1,
      fontSize: FONT_SIZES.MD,
      lineHeight: FONT_SIZES.MD * FONTS_LINE_HEIGHTS_FACTOR.TIGHT,
      color: COLORS.Neutral.Darkest,
      fontFamily: FONTS.AmorSansPro,
      paddingVertical: SIZES.XS + 4,
    },
    iconWrapper: {
      flexShrink: 0,
      paddingVertical: SIZES.XS + 4,
    },
    messageContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    modal: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalContainer: {
      borderTopStartRadius: 24,
      borderTopEndRadius: 24,
      backgroundColor: COLORS.Background.Lightest,
      borderTopLeftRadius: SIZES.XS,
      borderTopRightRadius: SIZES.XS,
      paddingHorizontal: SIZES.XS * 3,
      paddingTop: SIZES.XS * 5,
      paddingBottom: SIZES.XS * 2 + insets.bottom,
      maxHeight: 360,
    },
    modalTitle: {
      alignItems: 'flex-start',
    },
  });

  return stylesBase;
};

export {PickerSimple};
