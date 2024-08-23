import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import BoxView from '@atoms/BoxView';
import Modal from 'react-native-modal';
import Icon from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ItemProps, PickerItemProps, PickerProps} from './types';
import {getStyles} from './styles';

const hideText = (text: string, n: number) => {
  if (n >= text.length) {
    return text;
  } else {
    const asteriscos = '⁕'.repeat(text.length - n);
    return asteriscos + text.substring(text.length - n);
  }
};

const PickerItem = ({
  label,
  genericText,
  title,
  subtitle,
  value,
  border,
  bottom = 0,
  icon,
  hideSubtitle,
  error,
}: PickerItemProps) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  return (
    <View style={{marginBottom: bottom}}>
      {label ? (
        <BoxView
          p={2}
          mb={4}
          style={styles.label}
          align="center"
          background="secondary-lightest">
          <TextCustom
            text={label}
            weight="normal"
            variation="h6"
            color="warning-darkest"
          />
        </BoxView>
      ) : null}
      <View style={styles.itemContainer}>
        {genericText ? (
          <>
            <TextCustom
              text={genericText}
              weight="normal"
              variation="p0"
              color="neutral-dark"
            />
            <View style={styles.itemValue}>
              <Icon
                name="chevron-down-v2"
                size={24}
                fill={COLORS.Neutral.Darkest}
              />
            </View>
          </>
        ) : (
          <>
            <View>
              <TextCustom
                text={title?.length >= 19 ? `${title?.slice(0, 20)}...` : title}
                weight="normal"
                variation="h5"
                color="neutral-darkest"
              />
              {subtitle ? (
                <>
                  <Separator type="xx-small" />
                  <TextCustom
                    text={hideSubtitle ? hideText(subtitle, 4) : subtitle}
                    weight="normal"
                    variation="h6"
                    color="neutral-dark"
                  />
                </>
              ) : null}
            </View>
            <View style={styles.itemValue}>
              <TextCustom
                text={value}
                variation="h4"
                color={error ? 'error-medium' : 'neutral-darkest'}
                weight="normal"
              />
              {icon ? (
                <Icon
                  name="chevron-down-v2"
                  size={24}
                  fill={error ? COLORS.Error.Medium : COLORS.Neutral.Dark}
                />
              ) : null}
            </View>
          </>
        )}
      </View>
      {border && (
        <Separator
          styleLine={styles.itemBorder}
          type="xx-small"
          showLine
          color="#EFEFEF"
          width={1.5}
        />
      )}
    </View>
  );
};

const Picker = ({
  genericText,
  enabled,
  long,
  data,
  onSelect,
  text,
  error,
  errorText,
  dataPosition,
  statusBarTranslucent,
  hideSubtitle,
  defaultParams,
  isNativeDriver,
}: PickerProps) => {
  const insets = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<PickerItemProps>({
    genericText: genericText,
    title: '',
    subtitle: '',
    value: '',
  });
  const userAccountNumber = `**********${selectedValue?.subtitle?.substring(
    selectedValue?.subtitle.length - 4,
  )}`;

  useEffect(() => {
    let timer: any;
    if (defaultParams?.open) {
      timer = setTimeout(() => {
        setIsOpen(defaultParams.open);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [defaultParams?.open]);

  useEffect(() => {
    if (!genericText) {
      if (defaultParams?.value) {
        setSelectedValue({
          genericText,
          ...data.find(item => item.operationUId === defaultParams.value),
        });
      } else {
        dataPosition
          ? setSelectedValue({genericText, ...data[dataPosition]})
          : setSelectedValue({genericText, ...data[0]});
      }
    }
  }, [data, dataPosition, defaultParams?.value, genericText]);

  const handleOnSelect = (e: ItemProps) => {
    onSelect(e);
    setSelectedValue({genericText: '', ...e});
    setIsOpen(false);
    defaultParams && defaultParams.onChange();
  };

  const styles = getStyles(insets, data, error, long);
  const hasData = data.length > 0;
  const hasMany = data.length > 1;
  /* const hasMany = false; */

  useEffect(() => {
    if (genericText && !hasData) {
      setSelectedValue({genericText: genericText, ...data[0]});
    }
  }, [data, genericText, hasData]);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.modalContainer,
          hasMany && !enabled ? undefined : {paddingRight: SIZES.MD},
        ]}
        onPress={() => {
          if ((hasMany && !enabled) || enabled) {
            setIsOpen(true);
          }
        }}>
        <PickerItem
          genericText={selectedValue.genericText}
          title={selectedValue.title}
          subtitle={selectedValue.subtitle ? userAccountNumber : ''}
          value={selectedValue.value}
          error={error}
          icon={hasMany}
          hideSubtitle={hideSubtitle}
        />
      </TouchableOpacity>
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
        animationInTiming={500}
        animationOutTiming={500}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver={isNativeDriver}
        useNativeDriverForBackdrop={isNativeDriver}
        statusBarTranslucent={statusBarTranslucent}
        backdropColor={COLORS.Neutral.Dark}
        backdropOpacity={0.78}
        isVisible={isOpen}
        style={styles.modal}>
        <View style={styles.container}>
          {text ? (
            <>
              <View style={styles.modalTitle}>
                <TextCustom
                  color="primary-medium"
                  lineHeight="fair"
                  variation="h0"
                  size={24}
                  align="center">
                  {text}
                </TextCustom>
              </View>
              <Separator size={SIZES.XL} />
            </>
          ) : null}
          <ScrollView>
            {data
              .filter(item =>
                defaultParams?.omitValue
                  ? item.operationUId !== defaultParams?.value
                  : item,
              )
              .map((e, index) => (
                <TouchableOpacity key={index} onPress={() => handleOnSelect(e)}>
                  <PickerItem
                    label={e.label}
                    title={e.title}
                    subtitle={e.subtitle}
                    value={e.value}
                    border={index !== data.length - 1}
                    bottom={20}
                    hideSubtitle={hideSubtitle}
                  />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default Picker;
