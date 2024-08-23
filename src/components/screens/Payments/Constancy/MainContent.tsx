
import React, { useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg, Symbol } from 'react-native-svg';
import AnimatedLottieView from 'lottie-react-native';
import TextCustom from '@atoms/extra/TextCustom';
import { COLORS } from '@theme/colors';
import { SIZES } from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import Button from '@atoms/extra/Button';
import { convertToCurrency, convertToCurrencyWithoutRounding } from '@utils/convertCurrency';
import { capitalizeFull } from '@helpers/StringHelper';
import _ from 'lodash';
import {useWindowDimensions} from 'react-native';
import { shareScreenshot } from '@utils/screenshot';
import { useNavigation } from '@react-navigation/native';


export interface PayConstancyPayloadProps {
    amountTotal: number;
    operationDate: string;
    operationNumber: string;
    operationIdentifier: string;
    companyName: string;
    serviceType: string;
    serviceName: string;
    serviceCodeValue: string;
    serviceReceiptNumber: string;
    userFullName: string;
    userEmail: string;
    amountTotalWithoutFees: number;
    amountComissions: number;
    amountArrears: number;
    accountTitle: string;
    accountNumber: string;
    hasGlosa: boolean;
    glosaText: string;
}

export interface MainContentProps {
    stage: 'RECHARGE_PHONE' | 'PAY_SERVICES_TOTAL' | 'PAY_SERVICES_ABIERTO' | 'PAY_SERVICES_PARCIAL';
    mode: 'NORMAL' | 'SCREENSHOT';
    showFireworks?: boolean;
    payload: PayConstancyPayloadProps;
    forwardedRef?: React.ForwardedRef<View>;
    screenshotRef?: React.MutableRefObject<View | null>;
}

const MainContent = (props: MainContentProps) => {
    const navigation = useNavigation();
    const {height, width} = useWindowDimensions();
    const [isSharing, setIsSharing] = useState<boolean>(false);

    const insets = useSafeAreaInsets();
    const animationRef = useRef<AnimatedLottieView>(null);
    const styles = getStyles();

    useEffect(() => {
        if (props.showFireworks) animationRef.current?.play();
    }, [props.showFireworks]);

    return (<>
        <ScrollView
            bounces={false}
            contentContainerStyle={{
                backgroundColor: 'white',
                paddingBottom: insets.bottom,
                ...(props.mode === 'SCREENSHOT' && {
                    position: 'absolute',
                    bottom: height * 10,
                    left: width * 10
                })
            }}>
            <View
                collapsable={false}
                ref={props.forwardedRef}
                style={{
                    backgroundColor: 'white',
                    paddingBottom: SIZES.LG,
                }}>
                <View style={{
                    position: 'relative'
                }}>
                    <Svg
                        width="100%"
                        height="100"
                        viewBox="0 0 360 112"
                        preserveAspectRatio='none'
                        fill="none">
                        <Path
                            d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
                            fill="#CA005D"
                        />
                    </Svg>
                    <Image
                        source={require('@assets/images/successMan.png')}
                        style={{
                            alignSelf: 'center',
                            marginTop: -50,
                        }}
                    />
                    {props.mode === 'NORMAL' && (
                        <>
                            {props.showFireworks &&
                                <View
                                    style={{
                                        zIndex: 99,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        bottom: -30,
                                        left: 0,
                                        right: 0,
                                    }}>
                                    <AnimatedLottieView
                                        ref={animationRef}
                                        style={{ width: 175 }}
                                        source={require('@assets/images/Confetti.json')}
                                        loop={false}
                                    />
                                </View>}
                        </>
                    )}
                </View>
                <View style={{
                    marginHorizontal: SIZES.LG
                }}>
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',

                    }}>
                        <TextCustom
                            variation='h2'
                            color='primary-medium'
                            lineHeight='tight'>
                            ¡Pago exitoso!
                        </TextCustom>
                        <Separator size={24} />
                        <TextCustom
                            variation='h4'
                            color='neutral-darkest'
                            lineHeight='tight'>
                            Total pagado
                        </TextCustom>
                        <Separator size={4} />
                        <TextCustom
                            variation='h1'
                            color='neutral-darkest'
                            lineHeight='tight'>
                            S/ {convertToCurrency(props.payload.amountTotal)}
                        </TextCustom>
                        <Separator size={8} />
                        <TextCustom
                            variation='h5'
                            color='neutral-dark'
                            lineHeight='tight'>
                            {props.payload.operationDate}
                        </TextCustom>
                        {props.mode === 'NORMAL' && (
                            <>
                                <Separator size={8} />
                                <TouchableOpacity
                                    disabled={isSharing}
                                    onPress={async (e) => {
                                        if (
                                            props.screenshotRef !== undefined &&
                                            props.screenshotRef !== null
                                        ) {
                                            setIsSharing(true);
                                            await shareScreenshot(props.screenshotRef);
                                            setIsSharing(false);
                                        }
                                    }}
                                    style={{
                                        padding: SIZES.MD,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icon
                                        iconName="icon_share-outline"
                                        size={18}
                                        color={'#000'}
                                        style={{ marginHorizontal: 8 }}
                                    />
                                    <TextCustom
                                        text="Compartir constancia"
                                        color="primary-darkest"
                                        variation="h5"
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                        {props.mode === 'SCREENSHOT' && <Separator size={16} />}
                    </View>
                    <View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Nº operación
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                {props.payload.operationNumber}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Identificador
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                {props.payload.operationIdentifier}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Pagar a
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                {_.capitalize(props.payload.companyName)}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Servicio de
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                {_.capitalize(props.payload.serviceType)}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                {_.capitalize(props.payload.serviceName)}
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                {props.payload.serviceCodeValue}
                            </TextCustom>
                        </View>
                        {(
                            props.stage === 'PAY_SERVICES_TOTAL' ||
                            props.stage === 'PAY_SERVICES_ABIERTO' ||
                            props.stage === 'PAY_SERVICES_PARCIAL' ||
                            props.stage === 'RECHARGE_PHONE'
                        ) && (
                                <View style={styles.row}>
                                    <TextCustom
                                        variation='h5'
                                        color='neutral-dark'
                                        lineHeight='tight'
                                        style={styles.rowKey}>
                                        Nro de Recibo
                                    </TextCustom>
                                    <TextCustom
                                        variation='h5'
                                        color='neutral-darkest'
                                        lineHeight='tight'
                                        ellipsizeMode='tail'
                                        numberOfLines={1}
                                        style={styles.rowValue}>
                                        {props.payload.serviceReceiptNumber}
                                    </TextCustom>
                                </View>
                            )}
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Titular
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                {capitalizeFull(_.toLower(props.payload.userFullName))}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Monto de servicio a pagar
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                S/ {convertToCurrencyWithoutRounding(props.payload.amountTotalWithoutFees)}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Comisión
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                S/ {convertToCurrencyWithoutRounding(props.payload.amountComissions)}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Mora
                            </TextCustom>
                            <TextCustom
                                variation='h5'
                                color='neutral-darkest'
                                lineHeight='tight'
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.rowValue}>
                                S/ {convertToCurrencyWithoutRounding(props.payload.amountArrears)}
                            </TextCustom>
                        </View>
                        <View style={styles.row}>
                            <TextCustom
                                variation='h5'
                                color='neutral-dark'
                                lineHeight='tight'
                                style={styles.rowKey}>
                                Pagado con
                            </TextCustom>
                            <View style={{
                                maxWidth: "60%",
                                alignItems: 'flex-end',
                            }}>
                                <TextCustom
                                    variation='h5'
                                    color='neutral-darkest'
                                    lineHeight='tight'
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                    style={{
                                        textAlign: 'right'
                                    }}>
                                    {props.payload.accountTitle}
                                </TextCustom>
                                <Separator size={4} />
                                <TextCustom
                                    variation='h5'
                                    color='neutral-dark'
                                    lineHeight='tight'
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                    style={{
                                        textAlign: 'right'
                                    }}>
                                    ●●●●●●●●●●●{props.payload.accountNumber.slice(-3)}
                                </TextCustom>
                            </View>

                        </View>
                    </View>
                    {props.payload.hasGlosa &&
                        <>
                            <Separator size={SIZES.LG} />
                            <View style={{
                                paddingVertical: SIZES.LG,
                                paddingHorizontal: SIZES.MD,
                                backgroundColor: COLORS.Background.Light,
                                borderRadius: 8,
                                shadowColor: '#222D42',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.15,
                                shadowRadius: 2.62,
                                elevation: 12,
                            }}>
                                <TextCustom
                                    variation='h4'
                                    color='primary-medium'
                                    weight='normal'
                                    lineHeight='tight'>
                                    {_.capitalize(props.payload.companyName)}
                                </TextCustom>
                                <Separator size={4} />
                                <TextCustom
                                    variation='h6'
                                    color='neutral-darkest'
                                    weight='normal'
                                    lineHeight='fair'>
                                    {props.payload.glosaText}
                                </TextCustom>
                            </View>
                        </>}
                    <Separator size={SIZES.LG} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: SIZES.MD,
                        paddingHorizontal: SIZES.MD,
                        backgroundColor: COLORS.Informative.Lightest,
                        borderRadius: 8,
                    }}>
                        <Icon
                            iconName='icon_correo'
                            size={32}
                            color={COLORS.Informative.Medium}
                            style={{
                                marginRight: SIZES.XS,
                                flexShrink: 0,
                            }}
                        />
                        <TextCustom
                            style={{
                                flexShrink: 1
                            }}
                            color="informative-dark"
                            variation="h6"
                            lineHeight="fair"
                            weight="normal"
                            text={`Enviamos la constancia de tu pago de servicio al correo ${_.toLower(props.payload.userEmail)}`}
                        />
                    </View>
                    {props.mode === 'NORMAL' && (
                        <>
                            <Separator size={SIZES.LG} />
                            <View
                                style={{
                                    marginHorizontal: SIZES.LG
                                }}>
                                <Button
                                    orientation="horizontal"
                                    type="primary"
                                    text="Realizar otro pago"
                                    onPress={() => {
                                        navigation.reset({
                                            index: 1,
                                            routes: [
                                                { name: 'MainTab' },
                                                { name: 'PayServicesRootStack' }
                                            ],
                                        });
                                    }}
                                />
                                <Separator size={SIZES.LG} />
                                <Button
                                    orientation="horizontal"
                                    type="primary-inverted"
                                    haveBorder={true}
                                    text="Ir al inicio"
                                    onPress={() => {
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'MainTab' }],
                                        });
                                    }}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </ScrollView>
    </>);
}

export default React.forwardRef<View, MainContentProps>((props, ref) => (
    <MainContent {...props} forwardedRef={ref} />
  ));


const getStyles = () => {

    return StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: '#E3E8EF'
        },
        rowKey: {
            flexGrow: 1,
            maxWidth: "40%",
            textAlign: 'left'
        },
        rowValue: {
            flexGrow: 1,
            maxWidth: "60%",
            textAlign: 'right'
        }
    });
};