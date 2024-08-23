import BoxView from '@atoms/BoxView';
import Button from '@atoms/extra/Button';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS, Colors} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import React, {useEffect, useRef, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Icon from '@atoms/Icon';
import AnimatedLottieView from 'lottie-react-native';
import {shareScreenshot} from '@utils/screenshot';
import {GroupCollectionConstancyScreenProps} from '@navigations/types';
import {capitalizeFull} from '@helpers/StringHelper';

export default function Constancy({
  navigation,
  route,
}: GroupCollectionConstancyScreenProps) {
  const animationRef = useRef<AnimatedLottieView>(null);
  useEffect(() => {
    animationRef.current?.play();
  }, []);

  const shareRef = useRef<View | null>(null);
  const {quotaTitle, groupName, creditNumber} = route.params;

  const [isShowShare, setIsShowShare] = useState(true);

  const handleShare = async () => {
    setIsShowShare(false);
    await shareScreenshot(shareRef);
    setIsShowShare(true);
  };
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <View style={styles.container} ref={shareRef}>
        <BoxView align="center" justify="center">
          <Icon
            name="success-banner"
            size={190}
            color={COLORS.Success.Medium}
          />
        </BoxView>
        <BoxView align="center" justify="center" style={styles.woman_container}>
          <Svg
            width="100%"
            height={88}
            viewBox="0 0 360 88"
            fill="none"
            preserveAspectRatio="none">
            <Path
              d="M0 23.5955C0 23.5955 89.5 35.9716 212.5 25.916C335.5 15.8604 360 0.003479 360 0.003479V88.0035H0V23.5955Z"
              fill="white"
            />
          </Svg>
          <View style={styles.woman}>
            <Icon
              iconName="icon_woman_congrats"
              size={100}
              color={COLORS.Neutral.Darkest}
            />
            <AnimatedLottieView
              ref={animationRef}
              source={require('@assets/images/Confetti.json')}
              loop={true}
            />
          </View>
        </BoxView>
        <BoxView background="background-lightest" style={styles.content}>
          <BoxView direction="column" align="center">
            <TextCustom
              text="¡Felicidades!"
              variation="h2"
              color="primary-dark"
            />
            <TextCustom
              text="Lograron pagar la cuota completa"
              variation="h4"
              color="primary-dark"
            />
          </BoxView>
          <BoxView direction="column" align="center" my={16}>
            <TextCustom
              text="Cuota pagada"
              variation="h4"
              color="neutral-darkest"
            />
            <TextCustom
              text={quotaTitle}
              variation="h1"
              color="neutral-darkest"
            />
          </BoxView>
          {isShowShare && (
            <BoxView direction="row" justify="center" align="center" my={8}>
              <BoxView mx={8}>
                <Icon
                  iconName="icon_share-outline"
                  size={16}
                  color={COLORS.Neutral.Dark}
                />
              </BoxView>
              <TouchableWithoutFeedback onPress={handleShare}>
                <View>
                  <TextCustom
                    text="Compartir constancia"
                    variation="h4"
                    color="primary-darkest"
                  />
                </View>
              </TouchableWithoutFeedback>
            </BoxView>
          )}
          <BoxView
            direction="row"
            justify="space-between"
            mx={32}
            py={16}
            style={styles.separator}>
            <TextCustom
              text="Nombre de grupo"
              variation="h4"
              color="neutral-dark"
            />
            <TextCustom
              text={capitalizeFull(groupName.toLowerCase())}
              variation="h4"
              color="neutral-darkest"
            />
          </BoxView>
          <BoxView
            direction="row"
            justify="space-between"
            mx={32}
            py={16}
            style={styles.separator}>
            <TextCustom
              text="Nº de crédito"
              variation="h4"
              color="neutral-dark"
            />
            <TextCustom
              text={creditNumber}
              variation="h4"
              color="neutral-darkest"
            />
          </BoxView>
          <BoxView direction="column">
            <View style={styles.info}>
              <BoxView mr={8}>
                <Icon
                  iconName="icon_info_bell"
                  size={24}
                  color={COLORS.Neutral.Darkest}
                />
              </BoxView>
              <View style={{flex: 1}}>
                <TextCustom
                  variation="h6"
                  color="informative-dark"
                  numberOfLines={2}>
                  Recuerda que enviando tu cuota antes de la fecha de
                  vencimiento evitas pagar moras.
                </TextCustom>
              </View>
            </View>
          </BoxView>
          {isShowShare && (
            <BoxView direction="column" mx={64}>
              <Button
                text="Regresar"
                onPress={() => {
                  navigation.goBack();
                }}
                type="primary"
              />
            </BoxView>
          )}
        </BoxView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.Primary.Medium,
    height: '100%',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
  info: {
    flexDirection: 'row',
    backgroundColor: COLORS.Informative.Lightest,
    padding: SIZES.MD,
    borderRadius: SIZES.XS,
    marginHorizontal: SIZES.LG,
    marginVertical: SIZES.LG,
  },
  content: {
    height: '100%',
  },
  woman_container: {
    position: 'relative',
  },
  woman: {
    position: 'absolute',
    top: -20,
  },
});
