import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import { update } from '@features/activity';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useSessionExpiredHandler } from '@hooks/useSessionExpiredHandler';
import { ModalInactivityScreenProps } from '@navigations/types';
import { Colors } from '@theme/colors';
import { SEPARATOR_BASE } from '@theme/metrics';
import React from 'react'
import { Pressable, StyleSheet, View } from "react-native";
import * as Animatable from 'react-native-animatable';

const ModalInactivity = (props: ModalInactivityScreenProps) => {
    const dispatch = useAppDispatch();
    const {handleCloseSession} = useSessionExpiredHandler();

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: SEPARATOR_BASE * 4.5,
            }}
        >
            <Pressable
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                ]}
            />

            <Animatable.View
                animation='zoomIn'
                duration={300}
                style={{
                    backgroundColor: 'white',
                    padding: SEPARATOR_BASE * 4.5,
                    borderRadius: 10,
                }}>
                <TextCustom
                    variation="h2"
                    align="center"
                    weight="normal"
                    color={Colors.Paragraph}>
                    Tu sesión ha expirado
                </TextCustom>
                <Separator type="medium" />
                <TextCustom
                    variation="p"
                    align="center">
                    Tu sesión ha finalizado por inactividad. Para ingresar, vuelve a iniciar sesión.
                </TextCustom>
                <Separator type="medium" />
                <Button
                    type="primary"
                    text="Entiendo"
                    orientation="vertical"
                    onPress={() => { 
                        handleCloseSession();
                        dispatch(update({ isTokenExpired: false }));
                     }}
                />

            </Animatable.View>
        </View>
    );
}


export default ModalInactivity;